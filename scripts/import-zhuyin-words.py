#!/usr/bin/env python3
"""Reproduce selected MOE 20260929 rows/audio; cache official archives in the OS temp dir.
No audio samples are changed: playbackEnd selects the first utterance in the original file.
"""
import array, concurrent.futures, hashlib, io, json, math, pathlib, struct, tempfile, wave, zlib
import xml.etree.ElementTree as ET
import zipfile
import requests
ROOT = pathlib.Path(__file__).resolve().parents[1]
CACHE = pathlib.Path(tempfile.gettempdir()) / 'zhuyin-grade1'
CACHE.mkdir(exist_ok=True)
BASE = 'https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/'
ARCHIVE = BASE + 'download/dict_concised_music_word_2014_20260929.zip'
words = '棒八爸怕媽馬打他拿拉河哥花瓜火果國狗口貓毛米木白杯北幫包高考刀多朵兔土圖玉牛鳥年天田山三傘水書樹手球秋九星心清七氣雞加夾下雪學月圓床船穿窗光廣兩臉輪短電'

def download_range(start, end):
    r = requests.get(ARCHIVE, headers={'Range': f'bytes={start}-{end}'}, timeout=60)
    r.raise_for_status()
    assert r.status_code == 206, 'Server must support partial downloads'
    return r.content

def read_xlsx(path):
    z = zipfile.ZipFile(path)
    ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    strings = [''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si', ns)]
    result = []
    for r in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//s:row', ns):
        row = {}
        for c in r.findall('s:c', ns):
            v = c.find('s:v', ns)
            if v is not None:
                row[c.attrib['r'].rstrip('0123456789')] = strings[int(v.text)] if c.attrib.get('t') == 's' else v.text
        result.append(row)
    return result

# Use the official XLSX and ZIP directory, not guessed filenames or pinyin.
text_zip = CACHE / 'dict.zip'
if not text_zip.exists():
    r = requests.get(BASE + 'download/dict_concised_2014_20260929.zip', timeout=60)
    r.raise_for_status(); text_zip.write_bytes(r.content)
z = zipfile.ZipFile(text_zip)
rows = read_xlsx(io.BytesIO(z.read(z.namelist()[0])))
central = CACHE / 'central'
if not central.exists():
    r = requests.get(ARCHIVE, headers={'Range': 'bytes=-65536'}, timeout=60)
    r.raise_for_status(); assert r.status_code == 206
    i = r.content.rfind(b'PK\x05\x06')
    h = struct.unpack('<4s4H2LH', r.content[i:i+22]); size, offset = h[5:7]
    central.write_bytes(download_range(offset, offset + size - 1))
entries = []; data = central.read_bytes(); i = 0
while i < len(data):
    h = struct.unpack('<4s6H3L5H2L', data[i:i+46]); n, x, c = h[10:13]
    name = data[i+46:i+46+n].decode('utf-8')
    entries.append(dict(name=name, offset=h[-1], compressed=h[8], size=h[9], method=h[4], crc32=h[7]))
    i += 46 + n + x + c

def archive_entry(entry):
    path = CACHE / pathlib.Path(entry['name']).name
    if not path.exists():
        b = download_range(entry['offset'], entry['offset'] + entry['compressed'] + 1024)
        h = struct.unpack('<4s5H3L2H', b[:30]); start = 30 + h[-2] + h[-1]
        path.write_bytes(zlib.decompress(b[start:start+entry['compressed']], -15))
    b = path.read_bytes()
    assert len(b) == entry['size'] and zlib.crc32(b) == entry['crc32'], path
    return path

mapping = read_xlsx(archive_entry(entries[0]))
out = ROOT / 'assets/zhuyin-words'; out.mkdir(exist_ok=True)

def load(word):
    row = next(r for r in rows if r.get('A') == word and r.get('F') == '0')
    match = next(m for m in mapping if m.get('A') == row['B'] and m.get('B') == word)
    entry = next(e for e in entries if e['name'].endswith('/' + match['C']))
    path = archive_entry(entry)
    data = path.read_bytes()
    (out / path.name).write_bytes(data)
    with wave.open(io.BytesIO(data)) as recording:
        assert recording.getnchannels() == 1 and recording.getsampwidth() == 2
        rate = recording.getframerate(); samples = array.array('h', recording.readframes(recording.getnframes()))
    step = rate // 100
    rms = [math.sqrt(sum(v*v for v in samples[i:i+step])/len(samples[i:i+step])) for i in range(0,len(samples),step)]
    # First long quiet gap after the initial spoken headword. Keep a quiet tail.
    threshold = max(120, sorted(rms[:500])[min(100, len(rms)-1)] * 2.5)
    started = False; quiet = 0; end = None
    for i, energy in enumerate(rms):
        if energy > threshold: started = True; quiet = 0
        elif started:
            quiet += 1
            if quiet >= 30:
                end = round((i - quiet + 1) * .01 + .15, 2); break
    assert end and .25 <= end <= 1.8, (word, end)
    zhuyin = row['G']; base = ''.join(c for c in zhuyin if c not in 'ˊˇˋ˙')
    assert len(base) in (1, 2, 3)
    return dict(word=word, id=row['B'], zhuyin=zhuyin, base=base, parts=list(base),
                audio=f'assets/zhuyin-words/{path.name}', playbackEnd=end,
                sha256=hashlib.sha256(data).hexdigest(), dictionaryEntry=row, audioEntry=match)

by_word = {r['A']: r for r in rows if r.get('F') == '0'}
by_audio = {(m.get('A'), m.get('B')) for m in mapping}
words = ''.join(w for w in words if (by_word[w]['B'], w) in by_audio)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    result = list(pool.map(load, words))
(ROOT/'zhuyin-words.js').write_text('/* MOE 2014_20260929: complete selected entries and unmodified original recordings. */\nwindow.ZHUYIN_WORDS = '+json.dumps(result, ensure_ascii=False, indent=2)+';\n')
r=requests.get(BASE+'conciseddict_10312.odt');r.raise_for_status();(out/'MOE-TERMS.odt').write_bytes(r.content)
print('Imported', len(result), 'entries;', round(sum((out/(x['id']+'.wav')).stat().st_size for x in result)/1024/1024,1),'MiB')
print([(x['word'],x['zhuyin'],x['playbackEnd']) for x in result])
