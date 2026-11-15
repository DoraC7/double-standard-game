(async()=>{
  const $=id=>document.getElementById(id),D=TypeCompassData;
  const check=(ok,msg)=>{if(!ok)throw Error(msg);};
  const firstLeft=new Set([1,2,3,4,5,11,12,13,14,15]);
  const outcomes=[];
  for(const [mode,total] of [['quick',20],['standard',40],['full',80]]){
    for(const strength of [2,1,0,-1,-2,null]){
      $('restart').click();$(mode+'-start').click();
      const seen=new Set();
      for(let i=0;i<total;i++){
        check(!document.documentElement || document.documentElement.scrollWidth<=innerWidth,'question overflow');
        const q=D.questions.find(q=>q.prompt===$('prompt').textContent);
        check(q&&!seen.has(q.id),'unique question');seen.add(q.id);
        const value=strength===null?null:(firstLeft.has(Number(q.id.slice(2)))?-1:1)*strength;
        const options=$('response-options').querySelectorAll('button');
        check($('next').disabled,'must select first');
        options[value===null?5:value+2].click();
        check(options.length===6,'six answers');
        check($('response-options').querySelector('[aria-pressed=true]'),'selected state');
        $('next').click();
      }
      check(!$('result').hidden,'completed result');
      const expected=strength===null||strength===0?'????':strength>0?'ESTJ':'INFP';
      check($('result-title').textContent.startsWith(expected),'type '+expected);
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const cards=[...document.querySelectorAll('.tc-axis-card')];check(cards.length===4,'four axes');
      const positions=cards.map((card,i)=>{
        const a=D.axes[i],marker=card.querySelector('.tc-axis-marker'),track=card.querySelector('.tc-axis-track');
        const scale=card.querySelector('.tc-axis-scale');
        check(scale.firstElementChild.textContent.startsWith(a.first),'left label');
        check(scale.lastElementChild.textContent.startsWith(a.second),'right label');
        check(scale.firstElementChild.getBoundingClientRect().x<scale.lastElementChild.getBoundingClientRect().x,'label geometry');
        check(marker.hidden===(strength===null),'unknown hides marker');
        if(strength===null)return 'hidden';
        const percent=50-strength*25;check(parseFloat(marker.style.left)===percent,'CSS left');
        const m=marker.getBoundingClientRect(),t=track.getBoundingClientRect();
        const actual=(m.x+m.width/2-t.x)/t.width*100;
        check(Math.abs(actual-percent)<0.2,'rendered marker '+actual);
        check(card.querySelector('h4').textContent.includes(strength===0?'接近中線':strength>0?a.first+' ':a.second+' '),'heading matches direction');
        if(strength)check(card.querySelector('.tc-axis-copy').textContent===(strength>0?a.firstText:a.secondText),'interpretation matches');
        check(card.querySelector('.tc-axis-score').textContent.includes(strength===null?'0/':`${total/4}/`),'answer coverage');
        return Math.round(actual);
      });
      check(document.documentElement.scrollWidth<=innerWidth,'result overflow');
      $('edit').click();check(!$('play').hidden&&!$('next').disabled,'edit preserves answer');
      $('exit').click();check(!$('intro').hidden,'exit resets');
      outcomes.push({mode,strength,type:expected,positions});
    }
  }
  return {width:innerWidth,height:innerHeight,rounds:outcomes.length,outcomes};
})()
