import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    server: {
        mimeTypes: {
            'application/wasm': ['wasm']
        }
    },
    esbuild: {
        supported: {
            'top-level-await': true
        }
    },
    build: {
        rollupOptions: {
            plugins: [
                copy({
                    targets: [
                        { src: 'public/assets/wasm/HavokPhysics.wasm', dest: 'dist/assets/wasm' }
                    ]
                })
            ]
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    }
});
