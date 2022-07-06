import { defineConfig } from 'redbud';

export default defineConfig({
  {{#isBothNodeBrowser}}esm: { input: 'src/client' },
  cjs: { input: 'src/server' },{{/isBothNodeBrowser}}{{#isNode}}cjs: {},{{/isNode}}{{#isBrowser}}esm: {},{{/isBrowser}}
  prebundle: {},
});
