const fs = require('fs');
const s = fs.readFileSync('src/pages/SettingsPage.jsx','utf8');
const re = /<(\/)?div\b[^>]*>/g;
let m;
const stack = [];
while((m = re.exec(s))){
  const isClose = !!m[1];
  const before = s.slice(0, m.index);
  const line = before.split('\n').length;
  if(!isClose){
    stack.push({line, idx: m.index});
  } else {
    if(stack.length === 0){
      console.log('Extra closing at', line);
    } else {
      stack.pop();
    }
  }
}
if(stack.length) console.log('Unmatched openings (last 5):', stack.slice(-5));
else console.log('No unmatched divs');
