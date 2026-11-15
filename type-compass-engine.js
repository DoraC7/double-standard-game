(function(root){
  'use strict';
  const ANSWER_VALUES=[-2,-1,0,1,2];
  const VERSION='2026-11-15.4';
  const MIN_COVERAGE=0.8; // 暫定產品門檻，不是統計信賴程度。
  function shuffle(items,random=Math.random){
    const out=items.slice();
    for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
    return out;
  }
  function interleaveAxes(data,questions,random){
    const buckets=shuffle(data.axes,random).map(axis=>shuffle(questions.filter(q=>q.axis===axis.id),random));
    const out=[];
    for(let i=0;i<Math.max(...buckets.map(items=>items.length));i++)for(const bucket of buckets)if(bucket[i])out.push(bucket[i]);
    return out;
  }
  function createSet(data,mode='full',random=Math.random){
    const ids=data.forms[mode];
    const questions=ids?data.questions.filter(q=>ids.includes(q.id)):data.questions.slice();
    return interleaveAxes(data,questions,random);
  }

  function calculate(data,questions,answers){
    const axisResults=data.axes.map(axis=>{
      const items=questions.filter(q=>q.axis===axis.id);
      const answered=items.filter(q=>Number.isInteger(answers[q.id])&&ANSWER_VALUES.includes(answers[q.id]));
      const firstCount=answered.filter(q=>-answers[q.id]*q.direction>0).length;
      const secondCount=answered.filter(q=>-answers[q.id]*q.direction<0).length;
      const neutralCount=answered.length-firstCount-secondCount;
      const coveredFacets=new Set(answered.map(q=>q.facet)).size;
      const facetTotal=new Set(items.map(q=>q.facet)).size;
      const score=answered.reduce((total,q)=>total-answers[q.id]*q.direction,0);
      const maxScore=answered.length*2;
      const coverage=items.length?answered.length/items.length:0;
      const sufficient=answered.length>0&&coverage>=MIN_COVERAGE;
      const position=maxScore?score/maxScore:0;
      const abs=Math.abs(position);
      const letter=score>=0?axis.first:axis.second;
      const level=!sufficient?'有效作答不足':abs<=0.15?'接近中線':abs<=0.4?'微幅偏向':abs<=0.7?'這輪較常偏向':'這輪多數回答偏向';
      return {id:axis.id,name:axis.name,first:axis.first,second:axis.second,firstName:axis.firstName,secondName:axis.secondName,firstText:axis.firstText,secondText:axis.secondText,middleText:axis.middleText,firstCount,secondCount,neutralCount,coveredFacets,facetTotal,score,maxScore,position,barPercent:50+position*50,letter,coverage,sufficient,displayLetter:!sufficient||abs<=0.15?'?':letter,decisive:sufficient&&abs>0.15,level,answered:answered.length,total:items.length};
    });
    const type=axisResults.map(axis=>axis.displayLetter).join('');
    return {version:VERSION,type,name:type.includes('?')?'部分向度未分類':'本輪偏好方向',axes:axisResults,answered:axisResults.reduce((n,a)=>n+a.answered,0),total:questions.length};
  }
  function exportText(result,questions,answers){
    const lines=['16 型偏好探索｜本機自我反思紀錄','非官方 MBTI 評量、非經驗驗證的心理量表；結果不是診斷、準確率或能力評分。',`版本：${VERSION}`,`題組：${questions.length} 題（不同長度未經等值驗證）`,`本輪：有效作答 ${result.answered}/${result.total} 題`,`本輪方向索引：${result.type}｜${result.name}`,'「?」表示接近中線或有效作答不足，不硬分側。每軸至少 80% 有效作答才呈現方向；此門檻及中線範圍均為暫定介面規則，不是統計信賴區間。','','四向度（只代表這輪回答方向）：'];
    for(const axis of result.axes)lines.push(`${axis.name}：${axis.first} ${axis.score>=0?'+':''}${axis.score}/${axis.maxScore} → ${axis.displayLetter}（${axis.level}；有效 ${axis.answered}/${axis.total} 題；情境涵蓋 ${axis.coveredFacets}/${axis.facetTotal} 類；${axis.first}側 ${axis.firstCount}／${axis.second}側 ${axis.secondCount}／居中 ${axis.neutralCount}）`);
    lines.push('','平均接近中線可能是兩側相近，也可能是不同題目的方向抵銷；不表示每個情境都居中。情境分類是編輯標籤，不是經驗證子量表。','作答明細：');
    for(const q of questions){const value=answers[q.id];const chosen=!ANSWER_VALUES.includes(value)?'無法判斷／不適用（不計分）':value<0?`${value===-2?'很像':'比較像'}左側（${q.left}）`:value>0?`${value===2?'很像':'比較像'}右側（${q.right}）`:`兩側相近／依情境切換（${q.left}｜${q.right}）`;lines.push(`${q.id}｜${q.facet}｜${q.prompt}：${chosen}`);}
    lines.push('','分數只整理本次自我描述；換個時期、角色或情境，答案可能改變。');
    return lines.join('\n');
  }
  const api={VERSION,MIN_COVERAGE,ANSWER_VALUES,shuffle,interleaveAxes,createSet,calculate,exportText};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TypeCompassEngine=api;
})(globalThis);
