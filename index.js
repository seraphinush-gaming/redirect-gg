// Version 1.26 r:01

const config = require('./config.json');

const location = { 9713: { x: 52232, y: 117318, z: 4500 } };
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
			m.send('C_RESET_ALL_DUNGEON', 1, {});
		}
	});

	// helper
	function send(msg) { m.command.message(`: ` + msg); }

}