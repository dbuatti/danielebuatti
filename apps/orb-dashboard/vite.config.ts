import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isServe = command === 'serve';
  const isBuild = mode === 'production';
  const isElectronElectron = !!isBuild;

  return {
    build: {
      outDir: 'dist-electron/renderer',
      emptyOutDir: false,
    },
    plugins: [
      react(),
      // Electron specific: watch/preload/main for dev, auto-build for prod
      electron({
        main: {
          // Main entry point
          entry: 'src/electron/main.ts',
          // Build main in watch mode for dev
          watch: isServe,
          // Build main for production
          build: isElectronElectron,
        },
        preload: {
          input: 'src/electron/preload.ts',
        },
        renderer:
          isServe || !isBuild
            ? // In dev: use Vite client. In prod: no externals
              [{ module: 'electron', transport: 'ts' }]
            : undefined,
      }),
    ],
  };
});