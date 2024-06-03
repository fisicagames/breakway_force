import { defineConfig } from 'vite';

console.log("vite.config.js está sendo lido!");

export default defineConfig({
    server: {
        mimeTypes: {
            'application/wasm': ['wasm']
        }
    },
    esbuild: {
        supported: {
            'top-level-await': true //browsers can handle top-level-await features
        }
    },
  
});
