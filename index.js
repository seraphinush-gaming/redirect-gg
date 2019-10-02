'use strict';

console.log(`
  WARNING :
  Module "redirect-gg" is unethical. module provider and developer, seraphinush-gaming
  will not be responsible or liable in any way for use of this module. no liability or
  responsibility is accepted by the module provider. user discretion is advised.
`
);

const ZONE_GHILLIEGLADE = 9713;
const LOC_GHILLIEGLADE = { x: 52232, y: 117318, z: 4400 };
const ZONE_SANCTUARY = 9714;

class RedirectGg {

  constructor(mod) {

    this.mod = mod;
    this.cmd = mod.command;
    this.game = mod.game;
    this.settings = mod.settings;

    this.reset_message = mod.region === "kr" ? "던전이 초기화 되었습니다 !" : "Dungeon has been reset !";
    this.zone = 0;

    // command
    this.cmd.add('gg', {
      '$none': () => {
        this.settings.enable = !this.settings.enable;
        this.send(`${this.settings.enable ? 'En' : 'Dis'}abled`);
      }
    });

    // game state
    this.game.me.on('change_zone', (zone) => {
      this.zone = zone;
    });

    // code
    this.mod.hook('S_SPAWN_ME', 3, { order: -1000 }, (e) => {
      if (this.settings.enable) {
        if (this.zone === ZONE_GHILLIEGLADE) {
          Object.assign(e.loc, LOC_GHILLIEGLADE);
          return true;
        }
        if (this.zone === ZONE_SANCTUARY) {
          this.mod.send('C_RESET_ALL_DUNGEON', 1, {});
          if (this.settings.notice) {
            this.mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
              type: 65, // normal orange text
              chat: 0,
              channel: 27,
              message: this.reset_message
            });
          }
        }
      }
    });

  }

  destructor() {
    this.cmd.remove('gg');

    this.zone = undefined;
    this.reset_message = undefined;

    this.settings = undefined;
    this.game = undefined;
    this.cmd = undefined;
    this.mod = undefined;
  }

  // helper
  send() { this.cmd.message(': ' + [...arguments].join('\n\t - ')); }

}

module.exports = RedirectGg;