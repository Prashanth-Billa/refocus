

const ZERO = 0;

/**
 * Returns an array of resources with identical
 * isPublished property, with
 * fieldName field == index in loop
 *
 * @param {Integer} INT Make this many resources
 * @param {String} fieldName The field of each resource
 * @param {Boolean} isPublished All resources have
 * this value of isPublished
 * @returns {Array} Array with all published resources
 */
function getSubjects(INT, fieldName, isPublished) {
  let subjects = [];
  for (let i = INT; i > ZERO; i--) {
    const obj = {
      isPublished,
      absolutePath: i,
    };
    obj[fieldName] = i;
    subjects.push(obj);
  }
  return subjects;
}

module.exports = {
  getSubjects,
}