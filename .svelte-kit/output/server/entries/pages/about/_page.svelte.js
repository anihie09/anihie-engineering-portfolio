import "../../../chunks/index-server.js";
import { i as head, r as ensure_array_like, t as attr_class, v as attr, y as escape_html } from "../../../chunks/server.js";
//#region src/lib/InteractiveAscii.svelte
function InteractiveAscii($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { src, alt = "", characters = " .:-=+*#%@", color = "#ff0080", background = "transparent", cellSize = 7, cursorRadius = 150, zoom = 1.06, noiseInterval = 100, opacity = .95 } = $$props;
		$$renderer.push(`<div class="ascii-container svelte-xe11po"><canvas${attr("aria-label", alt)} class="svelte-xe11po"></canvas> <div class="ascii-vignette svelte-xe11po"></div></div>`);
	});
}
//#endregion
//#region src/routes/about/+page.svelte
function _page($$renderer) {
	const attributes = [
		{
			label: "808",
			fill: 9
		},
		{
			label: "BOUNCE",
			fill: 8
		},
		{
			label: "CREATIVITY",
			fill: 8
		},
		{
			label: "BASS",
			fill: 7
		},
		{
			label: "MELODY",
			fill: 5
		}
	];
	head("cwls5q", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>ANI — About</title>`);
		});
		$$renderer.push(`<meta name="description" content="ANI — Mechanical Engineering portfolio profile" class="svelte-cwls5q"/>`);
	});
	$$renderer.push(`<div class="about-page svelte-cwls5q"><main class="namecard svelte-cwls5q"><header class="card-header svelte-cwls5q"><div class="header-left svelte-cwls5q"><span class="prefix svelte-cwls5q">></span> <span class="svelte-cwls5q">ANIHIE_PROFILE</span></div> <div class="system-status svelte-cwls5q"><span class="svelte-cwls5q">SYS / ACTIVE</span> <div class="battery svelte-cwls5q" aria-hidden="true"><span class="svelte-cwls5q"></span> <span class="svelte-cwls5q"></span> <span class="svelte-cwls5q"></span> <span class="svelte-cwls5q"></span></div></div></header> <section class="profile svelte-cwls5q"><div class="portrait-column svelte-cwls5q"><div class="micro-heading svelte-cwls5q">SUBJECT / 01</div> <div class="portrait-frame svelte-cwls5q">`);
	InteractiveAscii($$renderer, {
		src: "/about-photo.png",
		alt: "ANI profile",
		characters: " .:-=+*#%@",
		color: "#ff0080",
		background: "#000000",
		cellSize: 6,
		cursorRadius: 145,
		zoom: 1.12,
		noiseInterval: 100,
		opacity: .92
	});
	$$renderer.push(`<!----> <div class="portrait-corner tl svelte-cwls5q" aria-hidden="true"></div> <div class="portrait-corner tr svelte-cwls5q" aria-hidden="true"></div> <div class="portrait-corner bl svelte-cwls5q" aria-hidden="true"></div> <div class="portrait-corner br svelte-cwls5q" aria-hidden="true"></div> <div class="portrait-data svelte-cwls5q" aria-hidden="true"><span class="svelte-cwls5q">01</span> <span class="svelte-cwls5q">08</span> <span class="svelte-cwls5q">17</span> <span class="svelte-cwls5q">24</span> <span class="svelte-cwls5q">33</span> <span class="svelte-cwls5q">42</span></div></div> <div class="portrait-footer svelte-cwls5q"><span class="svelte-cwls5q">PROFILE / VERIFIED</span> <span class="svelte-cwls5q">01 / ACTIVE</span></div></div> <div class="data-column svelte-cwls5q"><section class="identity reactive svelte-cwls5q"><div class="micro-heading svelte-cwls5q">MECHANICAL ENGINEERING</div> <h1 class="svelte-cwls5q">LE, ANI</h1> <div class="student-tag svelte-cwls5q">STUDENT</div> <div class="access svelte-cwls5q"><span class="svelte-cwls5q">ACCESS</span> <strong class="svelte-cwls5q">*****</strong></div></section> <section class="information svelte-cwls5q"><div class="info-card reactive svelte-cwls5q"><span class="svelte-cwls5q">ID</span> <strong class="svelte-cwls5q">STD.1442</strong></div> <div class="info-card reactive svelte-cwls5q"><span class="svelte-cwls5q">STATUS</span> <strong class="svelte-cwls5q">ACTIVE</strong></div> <div class="info-card reactive svelte-cwls5q"><span class="svelte-cwls5q">UNIVERSITY</span> <strong class="svelte-cwls5q">USC</strong></div> <div class="info-card reactive svelte-cwls5q"><span class="svelte-cwls5q">SCHOOL</span> <strong class="svelte-cwls5q">VITERBI</strong></div> <div class="info-card reactive svelte-cwls5q"><span class="svelte-cwls5q">MAJOR</span> <strong class="svelte-cwls5q">MECHANICAL ENGINEERING</strong></div> <div class="info-card reactive svelte-cwls5q"><span class="svelte-cwls5q">LOCATION</span> <strong class="svelte-cwls5q">LOS ANGELES / CA</strong></div></section> <section class="attributes svelte-cwls5q"><div class="section-title reactive svelte-cwls5q">ATTRIBUTES</div> <!--[-->`);
	const each_array = ensure_array_like(attributes);
	for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
		let attribute = each_array[$$index_1];
		$$renderer.push(`<div class="attribute-row reactive svelte-cwls5q"><div class="attribute-name svelte-cwls5q">${escape_html(attribute.label)}</div> <div class="meter svelte-cwls5q"><!--[-->`);
		const each_array_1 = ensure_array_like(Array(10));
		for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
			each_array_1[index];
			$$renderer.push(`<span${attr_class("svelte-cwls5q", void 0, { "filled": index < attribute.fill })}></span>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	}
	$$renderer.push(`<!--]--></section></div></section> <section class="bio reactive svelte-cwls5q"><div class="section-title svelte-cwls5q">> BIO</div> <div class="bio-content svelte-cwls5q"><p class="svelte-cwls5q">Mechanical engineering student interested
					in design, prototyping, manufacturing, and
					the intersection between engineering and
					visual creativity.</p> <div class="bio-data svelte-cwls5q"><div class="svelte-cwls5q"><span class="svelte-cwls5q">PROGRAM</span> <strong class="svelte-cwls5q">MECHANICAL ENGINEERING</strong></div> <div class="svelte-cwls5q"><span class="svelte-cwls5q">INSTITUTION</span> <strong class="svelte-cwls5q">UNIVERSITY OF SOUTHERN CALIFORNIA</strong></div> <div class="svelte-cwls5q"><span class="svelte-cwls5q">MODE</span> <strong class="svelte-cwls5q">01 / ONLINE</strong></div></div></div></section> <footer class="card-footer reactive svelte-cwls5q"><span class="svelte-cwls5q">VITERBI / SCHOOL OF ENGINEERING</span> <div class="stream svelte-cwls5q"><i class="svelte-cwls5q"></i> <i class="svelte-cwls5q"></i> <i class="svelte-cwls5q"></i> <i class="svelte-cwls5q"></i> <i class="svelte-cwls5q"></i></div> <span class="svelte-cwls5q">PROFILE / VERIFIED</span></footer></main></div>`);
}
//#endregion
export { _page as default };
