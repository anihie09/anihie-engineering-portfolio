import { redirect } from '@sveltejs/kit';

// about now opens as a side panel on the home page
export function load() {
	redirect(308, '/#about');
}
