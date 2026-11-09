/*
 * Projects shown in the Projects panel.
 *
 * Hovering (or selecting) a project in the list shows its preview:
 * pictures / video, a short description, highlights, role, year and tags.
 *
 * media: the first item is shown first. Each item is one of
 *   { type: 'image', src, thumb, alt }
 *   { type: 'video', src, poster, alt }         - an .mp4 in static/ (an optional
 *                                                 .webm with the same name is used first)
 *   { type: 'youtube', id, poster, alt }        - id from the YouTube link
 * Images live in static/projects/<project>/ (full size + -thumb versions).
 */

export type Media =
	| { type: 'image'; src: string; thumb: string; alt: string }
	| { type: 'video'; src: string; poster: string; alt: string }
	| { type: 'youtube'; id: string; poster: string; alt: string };

export type Project = {
	slug: string; // used in the link: /#projects/<slug>
	title: string;
	tagline?: string;
	role?: string;
	year?: string;
	description?: string;
	highlights?: string[];
	tags?: string[];
	media?: Media[];
};

const img = (project: string, name: string, alt: string): Media => ({
	type: 'image',
	src: `/projects/${project}/${name}.jpg`,
	thumb: `/projects/${project}/${name}-thumb.jpg`,
	alt
});

export const projects: Project[] = [
	{
		slug: 'nemesis',
		title: 'NEMESIS',
		tagline: "USC ARC's flagship autonomous heavyweight combat robot.",
		role: 'Drivetrain Co-Lead · USC ARC',
		year: '2026',
		description:
			"ARC's flagship, fully autonomous heavyweight: a 249 lb hammersaw with a 1-inch AR500 steel weapon and 3 neural networks driving its autonomy. Nemesis is the first collegiate robot to compete professionally in BattleBots and win by judges' decision. As drivetrain co-lead, I own the drivetrain from motor and gearbox selection through machining, assembly and testing.",
		highlights: [
			"Secured ARC's first official BattleBots victory: a judges' decision over 325 lb superheavyweight Witch Doctor at BattleBots: Proving Grounds 2026",
			'Co-led drivetrain design for the 249 lb robot, integrating 2 TP Power 5680 brushless motors with gearboxes and testing wheel materials for speed, torque and impact durability',
			"Delivered a full drivetrain and electronics redesign within weeks of the team's Pro League debut",
			'Coordinated integration across 3 subteams (weapon, armor, electronics) to meet weight-class and competition requirements',
			'Coordinate the PLANTS program, training 50 new members in CAD, soldering and engineering design'
		],
		tags: [
			'Drivetrain Design',
			'Motor & Gearbox Selection',
			'SolidWorks',
			'CAD Design',
			'Part Drawings',
			'Design for Excellence (DFX)',
			'CNC Machining',
			'Hydraulic Press Broaching',
			'Waterjet Cutting',
			'Lathe',
			'Mill',
			'Bandsaw',
			'Hand Drill',
			'VytaFlex Casting',
			'Manufacturing Processes',
			'Combat Robotics',
			'Technical Training',
			'Team Leadership'
		],
		media: [
			img('nemesis', 'hero', 'Nemesis, a black and red hammersaw combat robot'),
			{
				type: 'youtube',
				id: 'Quz0lhr2ee4',
				poster: '/projects/nemesis/hero-thumb.jpg',
				alt: 'Nemesis trailer'
			},
			img('nemesis', 'hubs', 'Machined aluminum drivetrain hubs'),
			img('nemesis', 'printed-parts', '3D-printed parts for Nemesis'),
			img('nemesis', 'chassis', 'Nemesis chassis opened up during the build'),
			img('nemesis', 'plants-1', 'ARC members working at tables outdoors'),
			img('nemesis', 'plants-2', 'Group photo of ARC members')
		]
	},
	{
		slug: 'manta-ray-drone',
		title: 'Underwater Manta Ray Drone',
		tagline: 'Biomimetic manta-ray robot for underwater search and rescue.',
		role: 'Mechanical Engineering Intern · Bedrock Ocean Exploration',
		year: '2025',
		description:
			'A manta ray–inspired robot built to locate disaster survivors in aquatic and debris-filled environments. I developed and tested its biomimetic propulsion, with compliant fins cast from silicone, and integrated its sensing hardware into the prototypes.',
		highlights: [
			'Developed and tested biomimetic fin propulsion for a manta ray–inspired search-and-rescue robot, casting compliant fins in silicone',
			'Integrated 2 sensing modalities, thermal imaging and sonar, into robotic prototypes for real-time survivor identification in simulated disaster response',
			'Supported autonomous navigation development for locating survivors in aquatic and debris-filled environments',
			'Iterated on soft-robotics designs with cross-functional engineering teams, documenting performance metrics and improvements to agility and efficiency'
		],
		tags: [
			'Biomimetic Design',
			'Soft Robotics',
			'Silicone Casting',
			'CAD Design',
			'Sensor Integration',
			'Thermal Imaging',
			'Sonar',
			'Prototyping & Testing',
			'Performance Documentation',
			'Cross-functional Collaboration'
		],
		media: [
			img('manta-ray', 'cad-full', 'CAD render of the manta ray drone with the body opened up'),
			img('manta-ray', 'cad-fin', 'CAD render of a fin with internal ribs'),
			img('manta-ray', 'cad-body', 'CAD section view of the body and its electronics'),
			img('manta-ray', 'tank-test', 'Prototype being prepared for a water test'),
			img('manta-ray', 'silicone-pour', 'Pouring silicone into a fin mold')
		]
	},
	{
		slug: 'openarm-v1-casing',
		title: 'OPENARM V1 Casing',
		tagline: 'Bimanual robotic arms with real-time AI teleoperation.',
		role: 'Hardware Engineering Intern · DeepAware AI',
		year: '2026',
		description:
			'At Robotics Center of Silicon Valley, I assembled, calibrated and deployed OpenArm V1 and V2 bimanual robotic arms for enterprise customers, and developed teleoperation between leader and follower arms with AI-driven control.',
		highlights: [
			'Assembled, calibrated and deployed 2 generations of OpenArm (V1 and V2) bimanual robotic arms for enterprise customers',
			'Developed leader–follower teleoperation integrating AI-driven control for precise, real-time operation',
			'Served as technical liaison between vendors and customers, translating requirements into final builds and resolving design constraints',
			"Presented OpenArm's AI-powered teleoperation architecture to robotics and AI startups at a Bay Area data summit"
		],
		tags: [
			'Robotic Arm Assembly',
			'Calibration',
			'Teleoperation',
			'AI-Integrated Controls',
			'CAD Review',
			'Troubleshooting',
			'Requirements Gathering',
			'Vendor & Customer Liaison',
			'Technical Presentation'
		],
		media: [
			{
				type: 'video',
				src: '/projects/openarm/demo.mp4',
				poster: '/projects/openarm/demo-poster.jpg',
				alt: 'OpenArm bimanual arms moving on a stand'
			},
			img('openarm', 'cad', 'OpenArm CAD model open in a viewer'),
			img('openarm', 'teleop-camera', 'Teleoperation camera view on a laptop')
		]
	},
	{
		slug: 'ev-battery-jig',
		title: 'Transportable EV Battery Jig',
		tagline: 'Portable test jig and enclosure for semi-automated testing.',
		role: 'Hardware Engineer Intern · Liminal Insights',
		year: '2024',
		description:
			'Mechanical design, rapid prototyping and simulation for components and subassemblies used in semi-automated processes, followed by build, assembly and testing for system validation.',
		highlights: [
			'Performed mechanical design, rapid prototyping and simulation for components and subassemblies in semi-automated processes',
			'Built, assembled and tested the system, applying measurement variation analysis (ANOVA) and root cause analysis (RCA) to validate performance and drive process improvements',
			'Applied Design for Excellence (DFX) and manufacturing best practices, supported by complete engineering documentation and file management'
		],
		tags: [
			'Mechanical Design',
			'CAD Design',
			'Design for Excellence (DFX)',
			'Rapid Prototyping',
			'Simulation',
			'Build & Assembly',
			'Testing & Validation',
			'ANOVA',
			'Root Cause Analysis (RCA)',
			'Manufacturing Processes',
			'Engineering Documentation'
		],
		media: [
			img('ev-battery-jig', 'enclosure', 'Transportable enclosure with two sensor panels and cabling'),
			img('ev-battery-jig', 'test-rig', 'Aluminum manufacturing test rig'),
			img('ev-battery-jig', 'test-rig-top', 'Test rig seen from above'),
			img('ev-battery-jig', 'wiring', 'Cable routing inside the enclosure'),
			img('ev-battery-jig', 'sensor-panel', 'Sensor panel with connectors attached')
		]
	},
	{
		slug: 'taiyaki-lamp',
		title: 'Taiyaki Lamp',
		tagline: 'My first 3D modeling project: a fish-shaped light.',
		role: '3D Modeling',
		year: '',
		description:
			'A taiyaki-shaped lamp, modeled in CAD and built into working lights.',
		highlights: [
			'Modeled the complete lamp form in CAD, including the body, fin and surface detailing',
			'Took the design from CAD model to working, illuminated prototypes'
		],
		tags: [
			'3D Modeling',
			'CAD Design',
			'Product Design',
			'Prototyping'
		],
		media: [
			img('taiyaki', 'lamps', 'Two lit taiyaki-shaped lamps'),
			img('taiyaki', 'cad', 'CAD model of the taiyaki lamp')
		]
	}
];
