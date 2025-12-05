const esbuild = require('esbuild');

// Build webview bundle: bundles Three.js + OrbitControls + loaders into a single ESM file
esbuild.buildSync({
    entryPoints: ['src/webview.ts'],
    bundle: true,
    outfile: 'media/webview-bundle.js',
    format: 'esm',
    external: [], // Bundle everything
    platform: 'browser',
    target: 'es2020',
});

console.log('✓ Webview bundle built: media/webview-bundle.js');
