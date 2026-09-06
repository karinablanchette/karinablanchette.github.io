import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");

const platformRule = css.match(/\.capability-platform\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
assert.match(
  platformRule,
  /grid-column:\s*1\s*\/\s*-1;/,
  "the Platform card must align to both edges of the capability grid on desktop",
);

const platformRules = [...css.matchAll(/\.capability-platform\s*\{([^}]*)\}/g)].map((match) => match[1]);
assert.ok(
  platformRules.every((rule) => !/grid-column:/.test(rule) || /grid-column:\s*1\s*\/\s*-1;/.test(rule)),
  "no responsive rule may reintroduce an inset Platform card",
);
