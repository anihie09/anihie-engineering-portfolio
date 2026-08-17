

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DMRjBtNz.js","_app/immutable/chunks/CAUZrlFL.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DrKeCmIn.js"];
export const stylesheets = ["_app/immutable/assets/3.C34itDD4.css"];
export const fonts = [];
