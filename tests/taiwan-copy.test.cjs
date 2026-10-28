const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const disallowed=["\u4e0a\u4e0b\u6587","\u751f\u6210","\u6578\u64da","\u9ede\u64ca", "\u5237\u65b0", "\u81ea\u52d5\u88dc\u5168", "\u63d0\u793a\u7b26", "\u5217\u8868", "\u5bc6\u9470", "\u5009\u5eab", "\u672c\u5730", "\u7a7a\u683c", "\u91cd\u7f6e", "\u7e41\u4e2d", "\u56de\u9078\u8ab2"];
test('Chinese product copy uses the agreed Taiwan vocabulary, including metadata and exports',()=>{
 const failures=[];
 for(const file of fs.readdirSync(root)){
  if(!/\.(html|js|md)$/.test(file)||file==='zhuyin-words.js')continue;
  const lines=fs.readFileSync(path.join(root,file),'utf8').split('\n');
  lines.forEach((line,i)=>disallowed.forEach(term=>{if(line.replaceAll('返回選課畫面','').includes(term))failures.push(`${file}:${i+1}: ${term}`);}));
 }
 assert.deepEqual(failures,[]);
});
