// @ts-check
'use strict';

// @ts-expect-error - strip-code lacks definitions
import StripCode from 'strip-code';
import {mapDefaults} from './mapper.js';

/**
 * @typedef {Object} BlockWithName
 * @property {string} name - a name for the pair of tags.
 * @property {string} [separator] - a separator between name and position.
 * @property {string} [prefix] - a beginning of a tag.
 * @property {string} [suffix] - an end of a tag.
 * @property {string} [replacement] - a substitution text.
 *
 * @typedef {Object} BlockWithStartEnd
 * @property {string} start - a unique name for the start tag.
 * @property {string} end - a unique name for the end tag.
 * @property {string} [prefix] - a beginning of a tag.
 * @property {string} [suffix] - a end of a tag.
 * @property {string} [replacement] - a substitution text.
 */

const PLUGIN_NAME = 'vite-plugin-remove-blocks';
const EXCLUDE_MODES = ['development'];

/**
 * @param {Object} options
 * @param {boolean} [options.ignoreNodeModules]
 * @param {Array<string|BlockWithName|BlockWithStartEnd>|undefined} [options.blocks]
 * @return {{name: string, transform: (code: string, id: string) => (undefined|string|{code: string, map: Object})}}
 *
 * @throws {Error} It throws an Error when options do not match the schema.
 */
export default function ViteStripCode(options = {}) {
  return {
    name: PLUGIN_NAME,

    /**
     * @param {string} code
     * @param {string} id
     * @return {undefined|string|{code: string, map: Object}}
     */
    transform(code, id) {
      if (options.ignoreNodeModules !== false && id.includes('/node_modules/')) {
        return;
      }

      let modified = '';

      try {
        modified = strip(code, options);
      } catch (e) {
        throw e;
      }

      return {
        code: modified,
        map: {mappings: ''}
      };
    },
  };
}

/**
 * @param {string} content
 * @param {Object} options
 * @param {boolean} [options.ignoreNodeModules]
 * @param {Array<string|BlockWithName|BlockWithStartEnd>|undefined} [options.blocks]
 * @return {string}
 *
 * @throws Error
 */
function strip(content, options = {}) {
  if (shouldSkipProcessing(import.meta.env?.MODE ?? process.env.NODE_ENV)) {
    return content;
  }

  const populatedOptions = (shouldUseDefaults(options))
    ? {...options, blocks: [mapDefaults()]}
    : options;

  return StripCode(content, populatedOptions);
}

/**
 * @param {string} mode
 * @return {boolean}
 */
function shouldSkipProcessing(mode) {
  return EXCLUDE_MODES.includes(mode);
}

/**
 * @param {Object} options
 * @param {Array<*>|undefined} [options.blocks]
 */
function shouldUseDefaults(options) {
  return isNotSet(options?.blocks) || isEmptyArray(options?.blocks);
}

/**
 * @param {Array<*>|undefined} v
 * @return {boolean}
 */
function isNotSet(v) {
  return v === undefined || v === null;
}

/**
 * @param {Array<*>|undefined} v
 * @return {boolean}
 */
function isEmptyArray(v) {
  return Array.isArray(v) && v.length === 0;
}
