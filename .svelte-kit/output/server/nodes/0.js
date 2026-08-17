import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BN8W18m4.js","_app/immutable/chunks/CAUZrlFL.js","_app/immutable/chunks/or_njV1D.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DrKeCmIn.js"];
export const stylesheets = ["_app/immutable/assets/0.B4c5xTL3.css"];
export const fonts = [];
