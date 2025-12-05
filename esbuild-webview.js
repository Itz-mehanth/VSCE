const esbuild = require('esbuild');
const path = require('path');

// Plugin to redirect fflate import path
const redirectPlugin = {
    name: 'redirect-fflate',
    setup(build) {
        build.onResolve({ filter: /^\.\.\/libs\/fflate\.module\.js$/ }, args => {
            return {
                path: path.resolve(__dirname, 'media/fflate.module.js'),
            };
        });
    },
};

// Build webview bundle: bundles Three.js + OrbitControls + loaders into a single IIFE file
esbuild.build({
    entryPoints: ['src/webview.ts'],
    bundle: true,
    outfile: 'media/webview-bundle.js',
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    plugins: [redirectPlugin],
}).then(() => {
    console.log('✓ Webview bundle built: media/webview-bundle.js');
}).catch(() => process.exit(1));
