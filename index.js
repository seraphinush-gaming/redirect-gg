// Version 1.26 r:00

const config = require('./config.json');

const LOC_BANKAYAS = { x: 52232, y: 117318, z: 4500 };
const ZONE_GHILLIEGLADE = 9713;
const ZONE_SANCTUARY = 9714;

module.exports = function RedirectGg(m) {

	// config
	let enable = config.enable;

	let	myZone = 0;

	// command
	// toggle
	m.command.add('gg', {
		$none() {
			enable = !enable;
			send(`${enable ? 'Enabled' : 'Disabled'}`);
		}
	});

	// mod.game
	m.game.on('change_zone', (zone, quick) => { myZone = zone; });

	// code
	m.hook('S_SPAWN_ME', 3, (e) => {
		if (!enable) return
		// Ghillieglade dungeon
		if (myZone === ZONE_GHILLIEGLADE) {
			Object.assign(e.loc, LOC_BANKAYAS);
			return true
		} 
		// auto-reset at Velik's Sanctuary
		else if (myZone === ZONE_SANCTUARY) {
			m.send('C_RESET_ALL_DUNGEON', 1, {});
		}
	});

	// helper
	function send(msg) { m.command.message(`: ` + msg); }

}