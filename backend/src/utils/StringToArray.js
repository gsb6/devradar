module.exports = function stringToArray(str) {
  return str.split(',').map((elem) => elem.trim());
}