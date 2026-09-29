import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const template = readFileSync('template.html', 'utf8');
const bundle = readFileSync('app.bundle.js', 'utf8');
if (!template.includes('{{APP_JS}}')) throw new Error('template.html is missing {{APP_JS}}');

const html = template.replace('{{APP_JS}}', bundle);
mkdirSync('dist', { recursive: true });
writeFileSync('index.html', html, 'utf8');
writeFileSync('dist/index.html', html, 'utf8');
console.log('Built index.html and dist/index.html');
