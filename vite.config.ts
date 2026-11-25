import { defineConfig } from 'vitest/config';

// base './': relative asset paths, so the build works both on
// https://<user>.github.io/snow-game/ and locally without changes.
export default defineConfig({
  base: './',
  build: { target: 'es2022', chunkSizeWarningLimit: 3000 },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
