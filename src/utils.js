// @ts-check
'use strict';

/**
 * @param {Array<*>|undefined} v
 * @returns {boolean}
 */
export function isNotSet(v) {
  return v === undefined || v === null;
}

/**
 * @param {Array<*>|undefined} v
 * @returns {boolean}
 */
export function isEmptyArray(v) {
  return Array.isArray(v) && v.length === 0;
}
