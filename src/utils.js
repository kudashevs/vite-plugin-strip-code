// @ts-check
'use strict';

/**
 * @param {Array<*>|undefined} v
 * @return {boolean}
 */
export function isNotSet(v) {
  return v === undefined || v === null;
}

/**
 * @param {Array<*>|undefined} v
 * @return {boolean}
 */
export function isEmptyArray(v) {
  return Array.isArray(v) && v.length === 0;
}
