'use strict';

const config = require('./config.json');

const location = { 9713: { x: 52232, y: 117318, z: 4500 } };
const ZONE_SANCTUARY = 9714;

module.exports = function RedirectGg(mod) {
	const cmd = mod.command || mod.require.command;

	// config
	let enable = config.enable;
	let notice = config.notice;

	let	myZone = 0;
	let resetMessage = mod.region === "kr" ? "던전이 초기화 되었습니다 !" : "Dungeon has been reset !";

	// command
	// toggle
	cmd.add('gg', {
		'$none': () => {
			enable = !enable;
			send(`${enable ? 'En' : 'Dis'}abled`);
		}
	});

	// mod.game
	mod.game.me.on('change_zone', (zone) => {
		myZone = zone;
	});

	// code
	mod.hook('S_SPAWN_ME', 3, (e) => {
		if (!enable)
			return;
		// Ghillieglade dungeon
		if (myZone in location) {
			Object.assign(e.loc, location[myZone]);
			return true;
		}
		// auto-reset at Velik's Sanctuary
		else if (myZone === ZONE_SANCTUARY) {
			if (notice) {
				mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
					type: 31, // normal orange text
					chat: 0,
					channel: 27,
					message: resetMessage
				});
			}
			mod.send('C_RESET_ALL_DUNGEON', 1, {});
			
		}
	});

	// helper
	function send(msg) { cmd.message(': ' + msg); }

}