import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const branch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
const mode = option('--profile') || (branch === 'codex/job-market' ? 'seeking' : 'employed');
const profiles = JSON.parse(readFileSync(resolve(root, 'src/profiles.json'), 'utf8'));
if (!Object.hasOwn(profiles, mode)) throw new Error(`Unknown profile: ${mode}`);
const profile = { ...profiles[mode], mode };
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const html = readFileSync(resolve(root, 'src/index.html'), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === 'resumeLink') return mode === 'seeking' ? '<a class="contact-link" href="mailto:karinablanchette1@gmail.com?subject=Resume%20request%20-%20Karina%20Blanchette">Request résumé <span aria-hidden="true">↗</span></a>' : '';
    if (!Object.hasOwn(profile, key)) throw new Error(`Missing profile value: ${key}`);
    return escape(profile[key]);
}).replace(/^[\t ]+$/gm, '');
const output = resolve(root, option('--output') || 'dist');
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, 'index.html'), html);
if (output !== root) {
    for (const file of ['style.css', 'script.js', 'portrait-karina.jpg', 'logo-mark.svg', 'logo-lockup.svg', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'og-karina-blanchette-v2.jpg', '.nojekyll', 'robots.txt', 'sitemap.xml', '404.html']) {
        copyFileSync(resolve(root, file), resolve(output, file));
    }
}
console.log(`Built ${mode} profile in ${output}`);
