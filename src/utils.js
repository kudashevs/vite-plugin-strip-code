// @ts-check
'use strict';

/**
 * @param {Array<*>|undefined} v
 * @returns {boolean}
 */
function isNotSet(v) {
  return v === undefined || v === null;
}

/**
 * @param {Array<*>|undefined} v
 * @returns {boolean}
 */
function isEmptyArray(v) {
  return Array.isArray(v) && v.length === 0;
}

export {isNotSet, isEmptyArray};
