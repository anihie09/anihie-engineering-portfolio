import { redirect } from '@sveltejs/kit';

// projects now opens as a side panel on the home page
export function load() {
	redirect(308, '/#projects');
}
