/*
 * Projects shown in the Projects panel.
 *
 * The panel lists every project on the left; selecting one shows its
 * preview on the right (cover, tagline, role, year, tags). "Open project"
 * shows the full page (summary, details, sections, images).
 *
 * Fill in any field when you're ready. Anything left empty is hidden,
 * and a project without a cover gets a styled placeholder instead.
 *
 *   cover     - preview image in static/, e.g. '/projects/nemesis-cover.jpg'
 *               (a wide image works best, around 16:10)
 *   tagline   - one short line describing the project
 *   role      - what you did, e.g. 'Drivetrain Lead'
 *   year      - e.g. '2026' or '2025 – 2026'
 *   tags      - a few keywords, e.g. ['SolidWorks', 'Machining']
 *
 *   subtitle  - one short line under the title on the full page
 *   summary   - a paragraph about the project
 *   details   - quick facts, shown as label / value rows
 *   sections  - longer write-ups, each with a heading and body text
 *   images    - photos in static/, e.g. '/projects/nemesis-1.jpg'
 */

export type Project = {
	slug: string; // used in the link: /#projects/<slug>
	title: string;

	// preview
	cover?: string;
	tagline?: string;
	role?: string;
	year?: string;
	tags?: string[];

	// full page
	subtitle?: string;
	summary?: string;
	details?: { label: string; value: string }[];
	sections?: { heading: string; body: string }[];
	images?: string[];
};

export const projects: Project[] = [
	{
		slug: 'nemesis',
		title: 'NEMESIS',
		cover: '',
		tagline: '',
		role: '',
		year: '',
		tags: [],
		subtitle: '',
		summary: '',
		details: [],
		sections: [],
		images: []
	},
	{
		slug: 'manta-ray-drone',
		title: 'Underwater Manta Ray Drone',
		cover: '',
		tagline: '',
		role: '',
		year: '',
		tags: [],
		subtitle: '',
		summary: '',
		details: [],
		sections: [],
		images: []
	},
	{
		slug: 'openarm-v1-casing',
		title: 'OPENARM V1 Casing',
		cover: '',
		tagline: '',
		role: '',
		year: '',
		tags: [],
		subtitle: '',
		summary: '',
		details: [],
		sections: [],
		images: []
	},
	{
		slug: 'ev-battery-jig',
		title: 'Transportable EV Battery Jig',
		cover: '',
		tagline: '',
		role: '',
		year: '',
		tags: [],
		subtitle: '',
		summary: '',
		details: [],
		sections: [],
		images: []
	}
];
