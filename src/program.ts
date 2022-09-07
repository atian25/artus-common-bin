import { Container, Inject, Injectable, ScopeEnum } from '@artus/injection';
import yargs from 'yargs';
import { CommandProps, MetadataEnum } from './command';
import { CommandTrigger } from './trigger';

interface Command {
  command: string;
  description: string;
  aliases?: string[];
  options?: Record<string, any>;
  subCommands?: Command[];
}

@Injectable({ scope: ScopeEnum.SINGLETON })
export class Program {
  @Inject()
  readonly container: Container;

  @Inject()
  trigger: CommandTrigger;

  private provider: yargs.Argv;
  // private commandMapping: Map<string, Command> = new Map();

  // async registryCommand(commandClz: Command) {
  //   this.commandMapping.set(commandClz.name, commandClz);
  // }

  // private async mountCommand() {
  //   for (const cmd of this.commandMapping.values()) {
  //     this.provider.command({
  //       command: cmd.command,
  //       aliases: cmd.aliases,
  //       describe: cmd.description,
  //       handler: async function (argv) {
  //         console.log(argv);
  //       },
  //     });
  //   }
  // }

  async init() {
    // TODO: lazy load command

    // find main command class
    const commandList = this.container.getInjectableByTag(MetadataEnum.COMMAND);
    const metadataList = commandList.map(clz => Reflect.getMetadata(MetadataEnum.COMMAND, clz));

    const mainCommandList = commandList.filter(clz => {
      const meta: CommandProps = Reflect.getMetadata(MetadataEnum.COMMAND, clz);
      return !meta.parent;
    });

    // TODO: inject provider
    this.provider = yargs();
    for (const commandClz of commandList) {
      const commandMetadata = Reflect.getMetadata(MetadataEnum.COMMAND, commandClz);
      if (commandMetadata.parent) continue;
      const subCommands = metadataList.filter(meta => meta.parent === commandClz);
      console.log('Commands:', commandMetadata, subCommands);
      this.provider.command({
        command: commandMetadata.command.trim(),
        aliases: commandMetadata.alias,
        describe: commandMetadata.description,
        builder: yargs => {
          yargs.options({});

          for (const subCommand of subCommands) {
            yargs.command({
              command: subCommand.command.trim(),
              aliases: subCommand.alias,
              describe: subCommand.description,
              handler: async function (argv) {
                console.log(argv);
              },
            });
          }
          return yargs;
        },
        handler: async argv => {
          console.log(argv);
          const input = {
            commandClz,
            argv,
          };
          await this.trigger.run(input);
        },
      });
    }
  }

  async use(mw) {
    this.trigger.collectMiddleware(mw);
    return this;
  }

  async start() {
    this.trigger.registryMiddleware();
    // TODO: process.argv -> yargs
    this.trigger.listen(originArgv => {
      console.log('@@@', originArgv)
      // mv slice to provider
      this.provider.parse(originArgv.slice(2));
    });
  }
}

// trigger.listen -> trigger at nextTick or ws -> provider.parse and exec -> trigger pre pipeline -> exec command.run() -> trigger post pipeline
