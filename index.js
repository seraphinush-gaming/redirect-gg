// OPCODE REQUIRED :
// C_RESET_ALL_DUNGEON
// S_LOAD_TOPO
// S_SPAWN_ME

// Version 1.23 r:03

const GHILLIEGLADE = { x: 52232.98046875, y: 117318.875, z: 4382.390625 }

module.exports = function RedirectGg(d) {

	let enable = true,
		myZone = -1

	// code
	d.hook('S_LOAD_TOPO', (e) => {
		myZone = e.zone
	})

	d.hook('S_SPAWN_ME', (e) => {
		if (!enable) return
		// Ghillieglade dungeon
		if (myZone === 9713) {
			Object.assign(e, GHILLIEGLADE)
			return true
		} 
		// auto-reset at Velik's Sanctuary
		else if (myZone === 9714) {
			d.toServer('C_RESET_ALL_DUNGEON', {})
		}
	})

	// command
	try {
		const Command = require('command')
		const command = Command(d)
		// toggle
		command.add(['gg', 'ㄱㄹ'], () => {
			enable = !enable
			send(`${enable ? 'enabled'.clr('56B4E9') : 'disabled'.clr('E69F00')}` + `.`.clr('FFFFFF'))
		})
		function send(msg) { command.message(`[redirect-gg] : ` + [...arguments].join('\n\t - ')) }
	} catch (e) { console.log(`[ERROR] -- redirect-gg module --`) }

}

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }
