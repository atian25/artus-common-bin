#!/usr/bin/env node

import path from 'path';
import { start } from '../../../../../src/index';

async function run() {
  const baseDir = path.join(__dirname, '..');
  const app = await start({ baseDir });
}

run().catch(console.error);

