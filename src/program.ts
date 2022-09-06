import { Container, Inject, Injectable, ScopeEnum } from '@artus/injection';
import yargs from 'yargs';
import { CommandTrigger } from './trigger';

interface Command {
  name: string;
  command: string;
  description: string;
  aliases?: string[];
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
    // find main command class
    const commandList = this.container.getInjectableByTag('COMMAND_TAG');
    // find all command class
    // const commandList = this.container.getInjectableByTag('COMMAND_TAG');

    // registry to yargs

    // registry trigger
    // this.trigger.use();

  }

  async use(mw) {
    return this.trigger.use(mw);
  }

  async start() {
    this.trigger.start();
    // await this.mountCommand();

    // start artus

    // registry command
    // await this.registryCommand();

    // init trigger
  }


}
