const DEFAULT_NAME = 'dev';
const DEFAULT_SEPARATOR = '-';
const DEFAULT_TAG_PREFIX = '/*';
const DEFAULT_TAG_SUFFIX = '*/';

/**
 * @param {string} [name=DEFAULT_NAME]
 * @return {{start: string, end: string, prefix: string, suffix: string}}
 */
export function mapDefaults(name = DEFAULT_NAME) {
  return {
    start: `${name}${DEFAULT_SEPARATOR}start`,
    end: `${name}${DEFAULT_SEPARATOR}end`,
    prefix: DEFAULT_TAG_PREFIX,
    suffix: DEFAULT_TAG_SUFFIX,
  };
}
