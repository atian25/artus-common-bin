import 'reflect-metadata';
import { ArtusApplication, Scanner } from '@artus/core';

export * from '@artus/core';
export * from './program';
export * from './application';
export * from './decorator';

interface ApplicationOptions {
  baseDir?: string;
}

export async function start(options ?: ApplicationOptions) {
  const baseDir = options.baseDir || process.cwd();

  // scan app files
  const scanner = new Scanner({
    needWriteFile: false,
    configDir: 'config',
    extensions: ['.ts'],
  });
  const manifest = await scanner.scan(baseDir);

  // start app
  const app = new ArtusApplication();
  await app.load(manifest.default, baseDir);
  await app.run();
  return app;
}
