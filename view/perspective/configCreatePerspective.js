/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
/**
 * view/perspective/configCreatePerspective.js
 *
 * JSON config for CreatePerspective.js
 * Includes all config for resources that need special treatment
 */
/**
 * Given array of objects, returns array of strings or primitives
 * of arrayOfObjects[i][field].
 *
 * @param {String} field The field of each value to return
 * @param {array} arrayOfObjects The array of objects to
 * get new array from
 * @returns {Array} The array of strings or primitives
 */
function getArray(field, arrayOfObjects) {
  let arr = [];
  if (!arrayOfObjects) {
    return arr;
  }
  for (let i = 0; i < arrayOfObjects.length; i++) {
    if (arrayOfObjects[i].isPublished) {
      arr.push(arrayOfObjects[i][field]);
    }
  }

  return arr;
}

/**
 *  Ie. 'thisStringIsGood' --> This String Is Good
 * @param {String} string The string to split
 * @returns {String} The converted string, includes spaces.
 */
function convertCamelCase(string) {
  return string
      // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str) {
      return str.toUpperCase();
    });
}

/**
 * Given array of objects, returns array without
 * the input elements
 *
 * @param {Array} arr The array to filter from
 * @param {String} removeThis The elem to remove from array.
 * Multiple elements may be removed
 * get new array from
 * @returns {Array} The array of strings or primitives
 */
function filteredArray(arr, removeThis) {
  return arr.filter((elem) => {
    return elem !== removeThis;
  });
}

/**
 * Return array of items that are from one array and
 * not in another
 *
 * @param {Array} options Return a subset of this
 * @param {Array} value Array of data to exclude
 * @returns {Array} Contains items from options
 */
function getOptions(options, value) {
  let leftovers = []; // populate from options
  if (Array.isArray(value)) {
    for (var i = options.length - 1; i >= 0; i--) {
      if (value.indexOf(options[i]) < 0) {
        leftovers.push(options[i]);
      }
    }
  }
  return leftovers;
}
/**
 * Returns config object for the key in values array.
 *
 * @param {Array} values Data to get resource config.
 * From props
 * @param {String} key The key of the resource, in values array
 * @param {Array} value Update state to this value
 * @returns {Object} The resource configuration object
 */
function getConfig(values, key, value) {
  const ZERO = 0;
  const options = getOptions(values[key] || [], value);
  const convertedText = convertCamelCase(key);
  let config = {
    title: key,
    defaultValue: value,
    options,
    showSearchIcon: false,
  };
  if (key === 'subjects') {
    let options = getArray('absolutePath', values[key], value);
    config.options = filteredArray(options, value);
    config.placeholderText = 'Select a Subject...';
    config.isArray = false;
  } else if (key === 'lenses') {
    config.placeholderText = 'Select a Lens...';
    let options = getArray('name', values[key], value);
    config.options = filteredArray(options, value);
    config.isArray = false;
  } else if (key.slice(-6) === 'Filter') {
    // if key ends with Filter
    config.defaultValue = ''; // should be pills, not text
    config.allOptionsLabel = 'All ' +
      convertedText.replace(' Filter', '') + 's';
    config.isArray = true;
    if (key === 'aspectFilter') {
      config.allOptionsLabel = 'All ' +
        convertedText.replace(' Filter', '') + ' Tags';
    } else if (key === 'statusFilter') {
      config.allOptionsLabel = 'All ' +
        convertedText.replace(' Filter', '') + 'es';
    }
    delete config.placeholderText;
    // remove value[i] if not in all appropriate values
    let notAllowedTags = [];

    for (let i = ZERO; i < value.length; i++) {
      if (!values[key] || values[key].indexOf(value[i]) < ZERO) {
        notAllowedTags.push(value[i]);
      }
    }
    if (notAllowedTags.length) {
      // remove from state
      const newVals = value.filter((item) => {
        return notAllowedTags.indexOf(item) < ZERO;
      });
      const errorMessage = ' ' + convertedText + ' ' +
        notAllowedTags.join(', ') + ' does not exist.';
      const stateRule = {
        error: errorMessage
      };
      stateRule[key] = newVals;
      this.setState(stateRule);
    }
  }

  return config;
}

export {
  getOptions, // for testing
  filteredArray,
  getConfig,
  getArray,
};
