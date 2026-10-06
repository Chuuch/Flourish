#!/usr/bin/env node

const required = 24;
const major = Number(process.versions.node.split('.')[0]);

if (major !== required) {
  console.error(
    `Flourish requires Node ${required} (see .nvmrc). Current: ${process.version}.\n` +
      `Run: nvm use`,
  );
  process.exit(1);
}
