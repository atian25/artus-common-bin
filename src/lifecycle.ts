import yargs from 'yargs';
import { Context, Next } from '@artus/pipeline';
import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, Container } from '@artus/core';
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
        builder: (yargs) => yargs.options(optionMetadata),
        handler: async argv => {
          const ctx = await this.trigger.initContext();
          ctx.container.set({ id: 'globalOptions', value: { argv, commandClz } });
          await this.trigger.startPipeline(ctx);
        }
      });

      // yargs.alias(commandMetadata.command, commandMetadata.alias);
    }

    // process.argv -> parse argv -> fill global argv -> find command -> exec command handler
    // this.trigger.use(async (ctx: Context, next: Next) => {
    //   const originArgv = process.argv.slice(2);
    //   ctx.container.set({ id: 'originArgv', value: originArgv });
    //   ctx.container.set(originArgv, originArgv);
    //   await next();
    // });

    // this.trigger.use(async (ctx: Context, next: Next) => {
    //   const { argv, commandClz } = ctx.container.get('globalOptions') as any;
    //   // const originArgv = process.argv.slice(2);
    //   // ctx.container.set({ id: 'originArgv', value: originArgv });
    //   await next();
    // });

    this.trigger.use(async (ctx: Context) => {
      const { argv, commandClz } = ctx.container.get('globalOptions') as any;
      console.log('origin argv: %j', argv);

      // find command instance
      const command = ctx.container.get<typeof commandClz>(commandClz);

      // invoke command
      await command.run(...argv._);
    });


    const a = await yargs.parse();
    console.log('@', a);

  }
}
