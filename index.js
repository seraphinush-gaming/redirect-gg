'use strict';

console.log(`

    WARNING :
    Module "redirect-gg" is unethical. module provider and developer, seraphinush-gaming
    will not be responsible or liable in any way for use of this module. no liability or
    responsibility is accepted by the module provider. user discretion is advised.
`
);

const config = require('./config.json');

const
	ZONE_GHILLIEGLADE = 9713,
	LOC_GHILLIEGLADE = { x: 52232, y: 117318, z: 4400 },
	ZONE_SANCTUARY = 9714;

module.exports = function RedirectGg(mod) {
	const cmd = mod.command || mod.require.command;

	// config
	let enable = config.enable,
		notice = config.notice;

	let myZone = 0,
		resetMessage = mod.region === "kr" ? "던전이 초기화 되었습니다 !" : "Dungeon has been reset !";

	// command
	// toggle
	cmd.add('gg', {
		'$none': () => {
			enable = !enable;
			send(`${enable ? 'En' : 'Dis'}abled`);
		}
	});

	// mod.game
	mod.game.me.on('change_zone', zone => myZone = zone);

	// code
	mod.hook('S_SPAWN_ME', 3, (e) => {
		if (!enable)
			return;
		if (myZone === ZONE_GHILLIEGLADE) {
			Object.assign(e.loc, LOC_GHILLIEGLADE);
			mod.send('C_PLAYER_LOCATION', 5, e);
			return true;
		}
		else if (myZone === ZONE_SANCTUARY) {
			mod.send('C_RESET_ALL_DUNGEON', 1, {});
			if (notice) {
				mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
					type: 65, // normal orange text
					chat: 0,
					channel: 27,
					message: resetMessage
				});
			}
		}
	});

	// helper
	function send(msg) { cmd.message(': ' + msg); }

	// reload
	this.saveState = () => {
		let state = {
			enable: enable,
			notice: notice
		};
		return state;
	}

	this.loadState = (state) => {
		enable = state.enable;
		notice = state.notice;
	}

	this.destructor = () => {
		cmd.remove('gg');
	}

}