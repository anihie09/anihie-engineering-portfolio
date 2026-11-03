/*
 * Projects shown in the Projects panel.
 * Each one appears as a folder; clicking it opens its page.
 *
 * Fill in any of the fields below when you're ready:
 *   subtitle  - one short line under the title (role, team, year...)
 *   summary   - a paragraph about the project
 *   details   - quick facts, shown as label / value rows
 *   sections  - longer write-ups, each with a heading and body text
 *   images    - photos in static/, e.g. '/projects/nemesis-1.jpg'
 *
 * Anything left empty is simply not shown. A project with no
 * content yet shows a "coming soon" note instead.
 */

export type Project = {
	slug: string; // used in the link: /#projects/<slug>
	title: string;
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
		subtitle: '',
		summary: '',
		details: [],
		sections: [],
		images: []
	},
	{
		slug: 'manta-ray-drone',
		title: 'Underwater Manta Ray Drone',
		subtitle: '',
		summary: '',
		details: [],
		sections: [],
		images: []
	},
	{
		slug: 'openarm-v1-casing',
		title: 'OPENARM V1 Casing',
		subtitle: '',
		summary: '',
		details: [],
		sections: [],
		images: []
	},
	{
		slug: 'ev-battery-jig',
		title: 'Transportable EV Battery Jig',
		subtitle: '',
		summary: '',
		details: [],
		sections: [],
		images: []
	}
];
