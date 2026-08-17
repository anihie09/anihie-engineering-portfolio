import "./index-server.js";
import { v as attr } from "./server.js";
//#region src/lib/InteractiveAscii.svelte
function InteractiveAscii($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { src, alt = "", characters = " .:-=+*#%@", color = "#ff0080", background = "transparent", cellSize = 7, cursorRadius = 150, zoom = 1.06, noiseInterval = 100, opacity = .95 } = $$props;
		$$renderer.push(`<div class="ascii-container svelte-xe11po"><canvas${attr("aria-label", alt)} class="svelte-xe11po"></canvas> <div class="ascii-vignette svelte-xe11po"></div></div>`);
	});
}
//#endregion
export { InteractiveAscii as t };
