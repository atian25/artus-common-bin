import { ArtusApplication, ArtusInjectEnum, Injectable, Scanner, ScopeEnum } from '@artus/core';
import { Context, Next } from '@artus/pipeline';
import yargs from 'yargs';
import { COMMAND_METADATA, OPTION_METADATA, COMMAND_TAG } from './decorator';
import { ProcessTrigger } from './trigger';

interface ApplicationOptions {
  baseDir?: string;
}

@Injectable({
  scope: ScopeEnum.SINGLETON,
})
export class Program extends ArtusApplication {
  // @Inject(ArtusInjectEnum.Trigger)
  // trigger: ProcessTrigger;

  get trigger() {
    return this.container.get(ProcessTrigger);
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
    await this.registry();
  }

  async registry() {
    // find all command class
    const commandList = this.container.getInjectableByTag(COMMAND_TAG);

    for (const commandClz of commandList) {
      const commandMetadata = Reflect.getMetadata(COMMAND_METADATA, commandClz);
      const optionMetadata = Reflect.getMetadata(OPTION_METADATA, commandClz);

      // registry command
      yargs.command({
        command: commandMetadata.command,
        aliases: commandMetadata.alias,
        describe: commandMetadata.description,
        // TODO: Sub Command
        builder: optionMetadata,
        handler: async argv => {
          const ctx = argv.ctx as Context;
          delete argv.ctx;

          // get pipeline execution container
          const container = ctx.container;
          container.set({ id: 'argv', value: argv });

          // get command instance
          const command = container.get<typeof commandClz>(commandClz);

          // invoke command
          await command.run(...argv._);

          console.log(argv);
        }
      });
    }

    // process.argv -> parse argv -> fill global argv -> find command -> exec command handler
    this.trigger.use(async (ctx: Context, next: Next) => {
      await yargs.parse(process.argv.slice(2), { ctx });
      await next();
    });

    // start
    // TODO: mv to program.ts
    // const ctx = await this.trigger.initContext();
    // await this.trigger.startPipeline(ctx);
  }

  public static async start(options?: ApplicationOptions) {
    const app = new Program(options);
    await app.init();
    await app.run();
    return app;
  }
}
