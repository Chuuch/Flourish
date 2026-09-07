/// <reference types="vitest/config" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const release = process.env['VITE_APP_RELEASE'];
const sentryAuthToken = process.env['SENTRY_AUTH_TOKEN'];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sentryAuthToken
      ? sentryVitePlugin({
          org: process.env['SENTRY_ORG'],
          project: process.env['SENTRY_PROJECT'],
          authToken: sentryAuthToken,
          release: { name: release },
          sourcemaps: {
            filesToDeleteAfterUpload: ['./dist/**/*.map'],
          },
        })
      : undefined,
  ],
  build: {
    sourcemap: Boolean(sentryAuthToken),
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
