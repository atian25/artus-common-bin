import { ArtusApplication, Scanner } from '@artus/core';
import { ProcessTrigger } from './trigger';

interface ApplicationOptions {
  baseDir?: string;
}

export class Program extends ArtusApplication {
  // @Inject()
  get trigger() {
    return new ProcessTrigger();
  }

  constructor(private readonly options?: ApplicationOptions) {
    super();
  }

  async init() {
    const baseDir = this.options.baseDir || process.cwd();
    const scanner = new Scanner({
      needWriteFile: false,
      configDir: 'config',
      extensions: ['.ts'],
    });
    const manifest = await scanner.scan(baseDir);
    await this.load(manifest.default, baseDir);
    // this.trigger.
  }

  async registry() {
    // registry command
    console.log('@@@', this.container.getInjectableByTag('COMMAND_TAG'))
  }

  public static async start(options?: ApplicationOptions) {
    const app = new Program(options);
    await app.init();
    await app.run();
    return app;
  }
}
