(function(root){
  'use strict';
  const ANSWER_VALUES=[-2,-1,0,1,2];
  function shuffle(items,random=Math.random){
    const out=items.slice();
    for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
    return out;
  }
  function createSet(data,mode='full',random=Math.random){
    const questions=mode==='quick'
      ? data.axes.flatMap(axis=>shuffle(data.questions.filter(q=>q.axis===axis.id),random).slice(0,5))
      : data.questions.slice();
    return shuffle(questions,random);
  }
  function calculate(data,questions,answers){
    const axisResults=data.axes.map(axis=>{
      const items=questions.filter(q=>q.axis===axis.id);
      const answered=items.filter(q=>Number.isInteger(answers[q.id])&&ANSWER_VALUES.includes(answers[q.id]));
      const score=answered.reduce((total,q)=>total-answers[q.id]*q.direction,0);
      const maxScore=items.length*2;
      const position=maxScore?score/maxScore:0;
      const letter=score>=0?axis.first:axis.second;
      const abs=Math.abs(position);
      const level=abs<=0.15?'接近中線':abs<=0.4?'微幅偏向':abs<=0.7?'這輪較常偏向':'這輪多數回答偏向';
      return {id:axis.id,name:axis.name,first:axis.first,second:axis.second,firstName:axis.firstName,secondName:axis.secondName,firstText:axis.firstText,secondText:axis.secondText,middleText:axis.middleText,score,maxScore,position,barPercent:50+position*50,letter,level,answered:answered.length,total:items.length};
    });
    const type=axisResults.map(axis=>axis.letter).join('');
    return {type,name:data.typeNames[type],axes:axisResults,answered:Object.keys(answers).filter(id=>Number.isInteger(answers[id])).length,total:questions.length};
  }
  function exportText(result,questions,answers){
    const lines=['16 型偏好探索｜本機自我反思紀錄','非官方 MBTI 測驗、非經驗證心理量表；結果不是診斷或能力評分。',`本輪：完成 ${result.answered}/${result.total} 題`,`暫定組合：${result.type}｜${result.name}`,'','四向度（只代表這輪回答方向）：'];
    for(const axis of result.axes)lines.push(`${axis.name}：${axis.first} ${axis.score>=0?'+':''}${axis.score}/${axis.maxScore} → ${axis.letter}（${axis.level}）`);
    lines.push('','作答明細：');
    for(const q of questions){const value=answers[q.id];const chosen=value<0?`較像左側（${q.left}）`:value>0?`較像右側（${q.right}）`:`兩側都像／看情況（${q.left}｜${q.right}）`;lines.push(`${q.prompt}：${chosen}`);}
    lines.push('','分數只整理本次自我描述；換個時期、角色或情境，答案可能改變。');
    return lines.join('\n');
  }
  const api={ANSWER_VALUES,shuffle,createSet,calculate,exportText};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TypeCompassEngine=api;
})(globalThis);
