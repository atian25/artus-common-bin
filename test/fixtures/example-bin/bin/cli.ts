#!/usr/bin/env node

import path from 'path';
import { Program } from '../../../../src/index';

async function run() {
  const baseDir = path.join(__dirname, '..');
  const app = await Program.start({ baseDir });
}

run().catch(console.error);

