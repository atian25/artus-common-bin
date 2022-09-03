import { Command, Argument, DefineArgument, Option, Flag, Positional, Inject, Injectable } from '../../../../src/index';

@DefineArgument()
export class DevArgument {
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

  @Positional()
  baseDir: string;
}

@DefineArgument()
export class ExecArgvArgument {
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
  @Argument()
  argv: DevArgument;

  @Argument()
  execArgv: ExecArgvArgument;

  async run(args: string[]) {
    console.info('> args:', args);
    console.info('> worker:', this.argv.worker);
    console.info('> debug:', this.execArgv.debug);
    console.info('> baseDir:', this.argv.baseDir);
    console.info('>', this.argv);
  }
}
