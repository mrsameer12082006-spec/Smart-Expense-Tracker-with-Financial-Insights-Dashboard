import fs from 'fs';
const s = fs.readFileSync('src/pages/SettingsPage.jsx','utf8');
console.log('single', (s.match(/'/g)||[]).length);
console.log('double', (s.match(/"/g)||[]).length);
console.log('backtick', (s.match(/`/g)||[]).length);
