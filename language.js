'use strict';

function get_message(language) {
  let result = '';
  switch (language) {
    case 'kr':
      result = "던전이 초기화 되었습니다 !";
      break;
    case 'na':
    default:
      result = "Dungeon has been reset !";
      break;
  }

  return result;
}

module.exports = { get_message };