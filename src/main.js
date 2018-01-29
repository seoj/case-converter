const angular = require('angular');
const templates = require('../dist/templates');

/** @typedef {'AUTO'|'NORMAL'|'CAMEL_CASE'|'SNAKE_CASE'|'KEBAB_CASE'} Case */

class IndexCtrl {
  constructor() {
    /** @type {string} */
    this.input = '';
    /** @type {Case} */
    this.sourceCase = 'AUTO';
    /** @type {boolean} */
    this.upperCase = false;
    /** @type {Case} */
    this.targetCase = 'CAMEL_CASE';
    /** @type {string} */
    this.output = '';
  }

  onChange() {
    const lines = this.input.split('\n').map(line => line.trim()).filter(line => !!line);
    const outputLines = [];
    for (const line of lines) {
      /** @type {string[]} */
      let words;
      switch (this.sourceCase) {
        case 'AUTO':
          words = line.split(/[\W_]+/).map(word => word.trim()).filter(word => !!word)
          const camelCaseSplit = [];
          for (const word of words) {
            Array.prototype.push.apply(camelCaseSplit, splitCamelCase(word));
          }
          words = camelCaseSplit;
          break;
        case 'CAMEL_CASE':
          words = splitCamelCase(line);
          break;
        case 'KEBAB_CASE':
          words = line.split('-');
          break;
        case 'NORMAL':
          words = line.split(/\s+/);
          break;
        case 'SNAKE_CASE':
          words = line.split('_');
          break;
      }
      words = words.map(word => word.trim()).filter(word => !!word).map(word => word.toLowerCase());

      if (words.length > 0) {
        switch (this.targetCase) {
          case 'CAMEL_CASE':
            words = words.map(word => word[0].toUpperCase() + word.substring(1));
            if (!this.upperCase) {
              words[0] = words[0][0].toLowerCase() + words[0].substring(1);
            }
            outputLines.push(words.join(''));
            break;
          case 'KEBAB_CASE':
            if (this.upperCase) {
              words = words.map(word => word.toUpperCase());
            }
            outputLines.push(words.join('-'));
            break;
          case 'NORMAL':
            if (this.upperCase) {
              words = words.map(word => word[0].toUpperCase() + word.substring(1));
            }
            outputLines.push(words.join(' '));
            break;
          case 'SNAKE_CASE':
            if (this.upperCase) {
              words = words.map(word => word.toUpperCase());
            }
            outputLines.push(words.join('_'));
            break;
        }
      }
    }

    this.output = outputLines.join('\n');
  }
}

angular.module('cc', [templates.name])
  .controller('IndexCtrl', IndexCtrl);

/**
 * @param {string} value 
 * @return {string[]}
 */
function splitCamelCase(value) {
  const words = [];
  let buffer = [];
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (/[A-Z\W]/.test(c)) {
      words.push(buffer.join(''));
      buffer = [c];
    }
    else {
      buffer.push(c);
    }
  }
  if (buffer.length > 0) {
    words.push(buffer.join(''));
  }
  return words;
}
