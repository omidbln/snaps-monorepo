import type { SnapConfig } from '@metamask/snaps-cli';

const config: SnapConfig = {
  bundler: 'webpack',
  input: './src/index.ts',
  server: {
    port: 8023,
  },
  stats: {
    buffer: false,
  },
};

export default config;
