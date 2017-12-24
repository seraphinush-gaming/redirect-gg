// OPCODE REQUIRED :
// C_RESET_ALL_DUNGEON
// S_LOAD_TOPO
// S_SPAWN_ME

// Version 1.22 r:00

const GHILLIEGLADE = { x: 52232.98046875, y: 117318.875, z: 4382.390625 }

module.exports = function RedirectGhillieglade(d) {

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
		// Velik's Sanctuary
		else if (myZone === 9714) d.toServer('C_RESET_ALL_DUNGEON', {})
	})

	// command
	try {
		const Command = require('command')
		const command = Command(d)
		command.add(['gg', 'ghillie','ㄱㄹ', '길랸', '길리안'], () => {
			enable = !enable
			send(`${enable ? '실행되었습니다'.clr('5AFF39') : '중지되었습니다'.clr('E69F00')}` + `.`.clr('FFFFFF'))
		})
		function send(msg) { command.message(`[redirect-ghillieglade] : ` + [...arguments].join('\n\t - ')) }
	} catch (e) { console.log(`[ERROR] -- redirect-ghillieglade module --`) }

}

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }
