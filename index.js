// Version 1.28 r:00
'use strict';

const config = require('./config.json');

const location = { 9713: { x: 52232, y: 117318, z: 4500 } };
const ZONE_SANCTUARY = 9714;

module.exports = function RedirectGg(m) {

	// config
	let enable = config.enable;
	let notice = config.notice;

	let	myZone = 0;
	let resetMessage = m.region == "kr" ? "던전이 초기화 되었습니다 !" : "Dungeon has been reset !";

	// command
	// toggle
	m.command.add('gg', {
		$none() {
			enable = !enable;
			send(`${enable ? 'En' : 'Dis'}abled`);
		}
	});

	// mod.game
	m.game.me.on('change_zone', (zone, quick) => { myZone = zone; });

	// code
	m.hook('S_SPAWN_ME', 3, (e) => {
		if (!enable) return
		// Ghillieglade dungeon
		if (myZone in location) {
			Object.assign(e.loc, location[myZone]);
			return true
		}
		// auto-reset at Velik's Sanctuary
		else if (myZone === ZONE_SANCTUARY) {
			if (notice) {
				m.send('S_DUNGEON_EVENT_MESSAGE', 2, {
					type: 31, // normal orange text
					chat: 0,
					channel: 27,
					message: resetMessage
				});
			}
			m.send('C_RESET_ALL_DUNGEON', 1, {});
			
		}
	});

	// helper
	function send(msg) { m.command.message(`: ` + msg); }

}