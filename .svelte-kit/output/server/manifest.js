export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["about-photo.png","home-background.png","hud-border.png","images/ani-profile.jpg","namecard.png","robots.txt","signature.png"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.x-q_vr8b.js",app:"_app/immutable/entry/app.B0TzqNBI.js",imports:["_app/immutable/entry/start.x-q_vr8b.js","_app/immutable/chunks/or_njV1D.js","_app/immutable/chunks/CAUZrlFL.js","_app/immutable/entry/app.B0TzqNBI.js","_app/immutable/chunks/CAUZrlFL.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/about","/contact","/projects","/skills"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
