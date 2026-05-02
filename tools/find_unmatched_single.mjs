import fs from 'fs';
const s = fs.readFileSync('src/pages/SettingsPage.jsx','utf8');
let inSq=false,inDq=false,inBt=false,inLine=false,inBlock=false,inTag=false;
let lastPos = -1;
for(let i=0;i<s.length;i++){
  const ch=s[i];
  const nxt=s[i+1]||'';
  const prev=s[i-1]||'';
  if(inLine){ if(ch==='\n') inLine=false; continue; }
  if(inBlock){ if(ch==='*' && nxt==='/' ){ inBlock=false; i++; continue;} else continue; }
  // toggle tag
  if(!inSq && !inDq && !inBt){ if(ch==='<' && nxt && /[A-Za-z\/=!]/.test(nxt)) inTag=true; }
  if(inTag){ if(ch==='>') inTag=false; }
  // toggle quotes
  if(!inTag && !inDq && !inBt && ch==="'" && prev!=='\\') { inSq=!inSq; if(inSq) lastPos=i; else lastPos=-1; }
  if(!inTag && !inSq && !inBt && ch==='"' && prev!=='\\') inDq=!inDq;
  if(!inTag && !inSq && !inDq && ch==='`' && prev!=='\\') inBt=!inBt;
  if(!inSq && !inDq && !inBt){ if(ch==='/' && nxt==='/' ) inLine=true; if(ch==='/' && nxt==='*'){ inBlock=true; i++; } }
}
if(inSq) {
  const line = s.slice(0,lastPos).split('\n').length;
  const lines = s.split('\n');
  const start = Math.max(0,line-3); const end = Math.min(lines.length,line+3);
  console.log('Unclosed single quote starting at line',line);
  console.log(lines.slice(start,end).map((l,i)=> (start+i+1)+': '+l).join('\n'));
} else console.log('No unclosed single quotes found');
