import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.{test,spec}.js'],
    coverage: {
      include: ['src/**/*.js'],
      provider: 'v8',
      reporter: ['json', 'lcov', 'text', 'html'],
    }
  },
});
