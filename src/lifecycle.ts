import yargs from 'yargs';
import { Context, Next } from '@artus/pipeline';
import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, Container, ExecutionContainer } from '@artus/core';
import { COMMAND_METADATA, OPTION_METADATA, COMMAND_TAG } from './decorator';
import { ProcessTrigger } from './trigger';

@LifecycleHookUnit()
export default class Lifecycle implements ApplicationLifecycle {
  // @Inject()
  // private readonly app: Application;

  @Inject()
  trigger: ProcessTrigger;

  @Inject()
  private readonly globalContainer: Container;

  @LifecycleHook()
  public async willReady() {
    // TODO: mv to program.ts

    // find all command class
    const commandList = this.globalContainer.getInjectableByTag(COMMAND_TAG);

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
          const container = ctx.container;

          container.set({ id: 'argv', value: argv });
          // find command instance
          // TODO: WHY ctx.container
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

    const ctx = await this.trigger.initContext();
    await this.trigger.startPipeline(ctx);

  }
}
