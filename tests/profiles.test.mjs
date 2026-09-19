import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

for (const mode of ['employed', 'seeking']) {
    test(`${mode} produces complete, consistent static content`, () => {
        const output = mkdtempSync(join(tmpdir(), 'karina-profile-test-'));
        try {
            execFileSync(process.execPath, ['scripts/build.mjs', '--profile', mode, '--output', output]);
            const html = readFileSync(join(output, 'index.html'), 'utf8');
            assert.ok(!html.includes('{{'), 'all template values are rendered');
            assert.ok(html.includes('Sep 2026') && html.includes('<h3>Evos</h3>'));
            assert.ok(!html.includes('CVS Health'));
            assert.ok(html.includes('2020 — 2023'));
            assert.ok(!html.includes('cdnjs.cloudflare.com'), 'reading must not depend on animation libraries');
            assert.match(html, /https:\/\/www\.linkedin\.com\/in\/karina-blanchette/);
            assert.match(html, /https:\/\/github\.com\/karinablanchette/);
            assert.match(html, /mailto:karinablanchette1@gmail\.com/);
            const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
            assert.equal(schema.worksFor.name, 'Evos');
            const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
            assert.equal(new Set(ids).size, ids.length, 'IDs are unique');
            for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `anchor ${target} exists`);
            const descriptions = [...html.matchAll(/<meta (?:name|property)="(?:description|og:description|twitter:description)" content="([^"]+)"/g)].map(match => match[1]);
            assert.equal(new Set(descriptions).size, 1, 'social descriptions agree with the page');
            if (mode === 'employed') {
                assert.match(html, /Hired · Now at Evos/);
                assert.ok(!/open to remote|exploring Senior QA|Request résumé/i.test(html));
                assert.match(html, /not currently looking for a new role/);
            } else {
                assert.match(html, /Open to remote &amp; hybrid positions/);
                assert.match(html, /Request résumé/);
                assert.ok(!html.includes('not currently looking'));
            }
        } finally { rmSync(output, { recursive: true, force: true }); }
    });
}
