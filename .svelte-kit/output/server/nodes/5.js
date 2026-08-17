

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.LJwdaucA.js","_app/immutable/chunks/CAUZrlFL.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DrKeCmIn.js"];
export const stylesheets = [];
export const fonts = [];
