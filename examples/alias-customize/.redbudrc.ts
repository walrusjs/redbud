const path = require('path');

export default {
  esm: {},
  umd: {},
  cjs: {},
  alias: {
    utils: path.resolve(__dirname, './src/utils')
  },
  platform: 'browser'
};