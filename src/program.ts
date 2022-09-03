import { ArtusApplication, ArtusInjectEnum, Injectable, Scanner, ScopeEnum } from '@artus/core';
import { Context, Next } from '@artus/pipeline';
import yargs from 'yargs';
import { COMMAND_METADATA, ARGUMENT_METADATA, COMMAND_TAG } from './decorator';
import { ProcessTrigger } from './trigger';

interface ApplicationOptions {
  baseDir?: string;
}

@Injectable({
  id: ArtusInjectEnum.Application,
  scope: ScopeEnum.SINGLETON,
})
export class Program extends ArtusApplication {
  // @Inject(ArtusInjectEnum.Trigger)
  // trigger: ProcessTrigger;

  override get trigger(): ProcessTrigger {
    return this.container.get(ProcessTrigger);
  }

  instance: yargs.Argv;

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
      const optionMetadata = Reflect.getMetadata(ARGUMENT_METADATA, commandClz);

      this.instance = yargs();
      // registry command
      this.instance.command({
        command: commandMetadata.command.trim(),
        aliases: commandMetadata.alias,
        describe: commandMetadata.description,
        // TODO: Sub Command
        builder: optionMetadata,
        handler: async function(argv) {
          const ctx = argv.ctx as Context;
          delete argv.ctx;

          // get pipeline execution container
          const container = ctx.container;
          container.set({ id: 'argv', value: argv });

          // get command instance
          const command = container.get<typeof commandClz>(commandClz);

          // invoke command
          // TODO: remove cmd
          await command.run(argv._);
        }
      });

      // console.log(instance.ge
    }

    // process.argv -> parse argv -> fill global argv -> find command -> exec command handler
    this.trigger.use(async (ctx: Context, next: Next) => {
      await this.instance.parse(process.argv.slice(2), { ctx });
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
