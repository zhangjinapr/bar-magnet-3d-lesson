import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const template = readFileSync('template.html', 'utf8');
const bundle = readFileSync('app.bundle.js', 'utf8');
if (!template.includes('{{APP_JS}}')) throw new Error('template.html is missing {{APP_JS}}');
for (const token of ['{{DONATION_QR_DATA}}', '{{CONTACT_QR_DATA}}']) {
  if (!template.includes(token)) throw new Error(`template.html is missing ${token}`);
}

const donationQr = `data:image/png;base64,${readFileSync('assets/wechat-donate.png').toString('base64')}`;
const contactQr = `data:image/png;base64,${readFileSync('assets/wechat-contact.png').toString('base64')}`;
const html = template
  .replace('{{APP_JS}}', () => bundle)
  .replace('{{DONATION_QR_DATA}}', () => donationQr)
  .replace('{{CONTACT_QR_DATA}}', () => contactQr);
mkdirSync('dist', { recursive: true });
writeFileSync('index.html', html, 'utf8');
writeFileSync('dist/index.html', html, 'utf8');
console.log('Built index.html and dist/index.html');
