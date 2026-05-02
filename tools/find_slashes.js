import fs from 'fs';
const s = fs.readFileSync('src/pages/SettingsPage.jsx','utf8');
let inSq=false,inDq=false,inBt=false,inLine=false,inBlock=false,inTag=false;
const bad=[];
for(let i=0;i<s.length;i++){
  const ch=s[i];
  const nxt=s[i+1]||'';
  if(inLine){ if(ch==='\n') inLine=false; continue; }
  if(inBlock){ if(ch==='*' && nxt==='/' ){ inBlock=false; i++; continue;} else continue; }
  if(!inSq && !inDq && !inBt){ if(ch==='<' && s[i+1] && /[A-Za-z\/=!]/.test(s[i+1])) inTag=true; }
  if(inTag){ if(ch==='>') inTag=false; }
  if(!inTag && !inSq && !inDq && !inBt && ch==='/' && nxt!=='/' && nxt!=='*') bad.push({i,line:s.slice(0,i).split('\n').length,context:s.slice(Math.max(0,i-20),i+20)});
  if(!inLine && !inBlock && !inTag){ if(ch==="'") inSq=!inSq; else if(ch==='"') inDq=!inDq; else if(ch==='`') inBt=!inBt; }
  if(!inSq && !inDq && !inBt && !inLine && !inBlock){ if(ch==='/' && nxt==='/' ) inLine=true; if(ch==='/' && nxt==='*'){ inBlock=true; i++; } }
}
console.log('Found',bad.length,'slashes outside quotes/tags/comments (first 20):');
console.log(bad.slice(0,20));

// print context for each
for(const b of bad.slice(0,20)){
  const lines = s.split('\n');
  const lineNo = b.line;
  const start = Math.max(0,lineNo-3);
  const end = Math.min(lines.length,lineNo+3);
  console.log('--- at line',lineNo,'---');
  console.log(lines.slice(start,end).map((l,i)=> (start+i+1)+': '+l).join('\n'));
}
