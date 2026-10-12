import type { NextConfig } from 'next';
const config: NextConfig = { turbopack: { rules: { '*.wgsl': { loaders: [{loader:'@vgpu/wgsl/loader-webpack',options:{minify:true}}], as: '*.js' } } } };
export default config;
