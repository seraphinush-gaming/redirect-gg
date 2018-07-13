// Version 1.25 r:00

const Command = require('command')
const GameState = require('tera-game-state')

const config = require('./config.json')

const LOC_BANKAYAS = { x: 52232, y: 117318, z: 4500 }
const ZONE_GHILLIEGLADE = 9713
const ZONE_SANCTUARY = 9714

module.exports = function RedirectGg(d) {
	const command = Command(d)
	const game = GameState(d)

	// config
	let enable = config.enable

	let	myZone = 0

	// command
	// toggle
	command.add(['gg', 'ㄱㄹ'], () => {
		enable = !enable
		send(`${enable ? 'Enabled' : 'Disabled'}`)
	})

	// code
	d.hook('S_LOAD_TOPO', 'raw', () => { myZone = game.me.zone })

	d.hook('S_SPAWN_ME', 2, (e) => {
		if (!enable) return
		// Ghillieglade dungeon
		if (myZone === ZONE_GHILLIEGLADE) {
			Object.assign(e.loc, LOC_BANKAYAS)
			return true
		} 
		// auto-reset at Velik's Sanctuary
		else if (myZone === ZONE_SANCTUARY) {
			d.send('C_RESET_ALL_DUNGEON', 1, {})
		}
	})

	// helper
	function send(msg) { command.message(`[redirect-gg] : ` + msg) }

}