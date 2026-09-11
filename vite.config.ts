import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      /* 클래스 이름을 파일명과 함께 남겨야 devtools 에서 어느 컴포넌트인지 보인다. */
      generateScopedName: '[name]_[local]__[hash:base64:4]',
    },
  },
});
