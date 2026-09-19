# Karina Blanchette — Portfolio

Portfolio website for Karina Blanchette, a NYC-based QA Engineer who joined Evos in September 2026.

Live site: [karinablanchette.github.io](https://karinablanchette.github.io/)

## Local preview

Both branches share `src/index.html`, `src/profiles.json`, styles, scripts and assets. Only the generated root `index.html` differs. It is plain HTML, so status, social previews and experience remain correct without JavaScript.

- `codex/employed`: hired / currently at Evos, networking contact copy.
- `codex/job-market`: open to remote and hybrid roles, recruiting contact copy and résumé request.

Switch branches and serve the root to preview that version. To rebuild after edits (Node 22+; no dependencies):

```sh
node scripts/build.mjs --output .
node --test tests/*.test.mjs
```

The branch selects the profile automatically. An explicit `--profile employed` or `--profile seeking` overrides it. Without `--output .`, the build writes a deployable `dist/` directory.

Make shared improvements on `codex/employed`, rebuild its root page, commit and push. The sync workflow merges shared updates into `codex/job-market` and regenerates its seeking page. It stops for shared-source conflicts instead of discarding work. Both profiles retain the same employment history; seeking does not invent an Evos end date.

GitHub Pages currently publishes `main` at `/`. Merging the employed PR publishes the hired page. To switch directly between the two maintained versions, select the corresponding branch at `/` in Settings → Pages. A branch push alone does not change which branch Pages publishes.

Do not edit the generated root `index.html` manually; edit the shared template or profiles and rebuild. Evos responsibilities should be added only when confirmed; the current title is QA Engineer.

Serve the repository root with any static file server, for example:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Privacy

The résumé is intentionally request-only and is not included in the public deployment.
