import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/widget/index.tsx'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  outfile: 'public/widget/bugsy-widget.js',
  jsx: 'automatic',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  logLevel: 'info',
});

console.log('Widget built successfully: public/widget/bugsy-widget.js');
