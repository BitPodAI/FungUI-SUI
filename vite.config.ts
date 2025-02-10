import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  define: {
    'process.env': process.env,
  },
  server: {
    host: 'localhost',
    cors: true,
    proxy: {
      '/dev': {
        target: 'http://23.106.133.215:3000',
        // target: "http://18.205.246.62:3000",
        // target: 'http://localhost:3000',
        secure: false,
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev/, ''),
      },
      '/api': {
        target: 'http://23.106.133.215:3000',
        // target: "http://18.205.246.62:3000",
        // target: 'http://localhost:3000',
        secure: false,
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // target: 'es2015',
    minify: 'terser',
    sourcemap: process.env.VITE_APP_ENV === 'develement',
    outDir: 'build',
    // polyfillModulePreload: true,
    
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    terserOptions: {
      compress: {
        drop_debugger: true, // 移除 debugger
      },
      output: {
        comments: false, // 去除注释
      },
    },
    rollupOptions: {
      // external: ['@walletconnect/jsonrpc-types', '@walletconnect/jsonrpc-utils'],
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  plugins: [react(), UnoCSS(), crx({ manifest })],
  assetsInclude: ['**/*.ttf'],
});
