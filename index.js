'use strict';

console.log(`
  WARNING :
  Module "redirect-gg" is unethical. module provider and developer, seraphinush-gaming
  will not be responsible or liable in any way for use of this module. no liability or
  responsibility is accepted by the module provider. user discretion is advised.
`
);

const ZONE_GHILLIEGLADE = 9713;
const LOCA_GHILLIEGLADE = { x: 52232, y: 117318, z: 4400 };
const ZONE_SANCTUARY = 9714;

const { get_message } = require('./language');

class redirect_gg {

  constructor(mod) {

    this.m = mod;
    this.c = mod.command;
    this.g = mod.game;
    this.s = mod.settings;
    this.hook = null;

    this.zone = 0;

    // command
    this.c.add('gg', {
      '$none': () => {
        this.s.enable = !this.s.enable;
        this.send(`${this.s.enable ? 'En' : 'Dis'}abled`);
      }
    });

    // game state
    this.g.me.on('change_zone', (zone) => {
      this.zone = zone;

      if (this.s.enable && this.zone === ZONE_SANCTUARY) {
        if (!this.hook) {
          this.hook = this.m.hook('S_SPAWN_ME', 3, { order: -1000 }, (e) => {
            if (this.zone === ZONE_GHILLIEGLADE) {
              Object.assign(e.loc, LOCA_GHILLIEGLADE);
              return true;
            }
          });
        }
        this.m.send('C_RESET_ALL_DUNGEON', 1, {});
        if (this.s.notice) {
          this.m.send('S_DUNGEON_EVENT_MESSAGE', 2, {
            type: 65,
            chat: 0,
            channel: 27,
            message: get_message(mod.region)
          });
        }
      }

      else if (this.zone === ZONE_GHILLIEGLADE)
        return null;

      else {
        if (this.hook) {
          this.m.unhook(this.hook);
          this.hook = null;
        }
      }
    });

  }

  destructor() {
    this.c.remove('gg');
  }

  // helper
  send() { this.c.message(': ' + [...arguments].join('\n\t - ')); }

}

module.exports = redirect_gg;