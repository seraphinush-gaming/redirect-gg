'use strict';

console.log(`
  WARNING :
  Module "redirect-gg" is unethical. module provider and developer, seraphinush-gaming
  will not be responsible or liable in any way for use of this module. no liability or
  responsibility is accepted by the module provider. user discretion is advised.
`
);

const config = require('./config.json');

const ZONE_GHILLIEGLADE = 9713;
const LOC_GHILLIEGLADE = { x: 52232, y: 117318, z: 4400 };
const ZONE_SANCTUARY = 9714;

module.exports = function RedirectGg(mod) {
  const cmd = mod.command;

  // config
  let enable = config.enable;
  let notice = config.notice;

  let myZone = 0;
  let resetMessage = mod.region === "kr" ? "던전이 초기화 되었습니다 !" : "Dungeon has been reset !";

  // command
  cmd.add('gg', {
    '$none': () => {
      enable = !enable;
      send(`${enable ? 'En' : 'Dis'}abled`);
    }
  });

  // game state
  mod.hook('S_LOAD_TOPO', 3, { order: -1000 }, (e) => myZone = e.zone);

  // code
  mod.hook('S_SPAWN_ME', 3, { order: -1000 }, (e) => {
    if (enable) {
      if (myZone === ZONE_GHILLIEGLADE) {
        Object.assign(e.loc, LOC_GHILLIEGLADE);
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