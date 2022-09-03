import { Command, CommandOption, DefineOption, Option, Flag, Inject, Injectable } from '../../../../src/index';

@DefineOption()
export class DevOption {
  @Option({
    description: 'numbers of app workers, default to 1 at local mode',
    type: 'number',
    alias: ['c', 'cluster'],
    default: 1,
  })
  worker: number;

  @Flag({
    description: 'specify framework that can be absolute path or npm package',
    // type: 'string',
  })
  framework: string;
}

@DefineOption()
export class ExecArgvOption {
  @Flag({
    description: 'inject devtool',
  })
  debug: boolean;
}

@Command({
  command: 'dev [baseDir]',
  description: 'Run the development server',
  alias: ['d'],
})
export class DevCommand {
  @CommandOption()
  argv: DevOption;

  @CommandOption()
  execArgv: ExecArgvOption;

  async run(args: string[]) {
    console.info('> args:', args);
    console.info('> worker:', this.argv.worker);
    console.info('> debug:', this.execArgv.debug);
    console.info('>', this.argv);
  }
}
