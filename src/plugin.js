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
const FALLBACK_MODE = 'production';

/**
 * @param {Object} options
 * @param {boolean} [options.ignoreNodeModules] (deprecated since v2.1.0)
 * @param {boolean} [options.skipNodeModules]
 * @param {Array<string>|undefined} [options.skipModes]
 * @param {Array<string|BlockWithName|BlockWithStartEnd>|undefined} [options.blocks]
 * @return {{name: string, transform: (code: string, id: string) => (undefined|string|{code: string, map: Object})}}
 *
 * @throws {Error} It throws an Error when options do not match the schema.
 */
export default function ViteStripCode(options = {}) {
  /** @type {string|undefined} */
  let currentMode;

  return {
    name: PLUGIN_NAME,

    /**
     * @param {Object} config
     * @param {string} [config.mode]
     */
    configResolved(config) {
      currentMode = config?.mode;
    },

    transform: {
      // @ts-ignore
      filter: {
        id: /.*/,
      },

      /**
       * @param {string} code
       * @param {string} id
       * @return {undefined|string|{code: string, map: Object}}
       */
      handler(code, id) {
        processDeprecatedIgnoreNodeNodules(options);

        if (
          shouldSkipNodeModules(options, id)
          || shouldSkipModes(options, currentMode)
        ) {
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
      }
    },
  };
}

/**
 * @param {Object} options
 * @param {boolean} [options.ignoreNodeModules] (deprecated since v2.1.0)
 * @param {boolean} [options.skipNodeModules]
 */
function processDeprecatedIgnoreNodeNodules(options) {
  if (options?.ignoreNodeModules !== undefined) {
    console.warn('Warning: ignoreNodeModules is deprecated. Please use skipNodeModules instead.');

    if (options?.skipNodeModules === undefined) {
      options.skipNodeModules = options.ignoreNodeModules;
    }
  }
}

/**
 * @param {Object} options
 * @param {Array<string>} [options.skipModes]
 * @param {string|undefined} currentMode
 * @returns {boolean}
 */
function shouldSkipModes(options, currentMode) {
  const eventualMode = currentMode ?? import.meta.env?.MODE ?? FALLBACK_MODE;
  const modesFromOptions = options.skipModes ?? [];
  const ignoreModes = [...EXCLUDE_MODES, ...modesFromOptions];

  return ignoreModes.includes(eventualMode);
}

/**
 * @param {Object} options
 * @param {boolean} [options.ignoreNodeModules] (deprecated since v2.1.0)
 * @param {boolean} [options.skipNodeModules]
 * @param {string} id
 *
 * @returns {boolean}
 */
function shouldSkipNodeModules(options, id) {
  return options.skipNodeModules !== false && id.includes('/node_modules/');
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
  const populatedOptions = (shouldUseDefaults(options)) ? {...options, blocks: [mapDefaults()]} : options;

  return StripCode(content, populatedOptions);
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
