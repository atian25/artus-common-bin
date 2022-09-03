import { Command, DefineArgument, Argument, Flag  } from '../../../../src/index';
import { DevCommand, ExecArgvArgument } from './dev';

@DefineArgument()
export class DebugArgument extends ExecArgvArgument {
  @Flag({
    description: 'inject devtool',
    default: true,
  })
  debug: boolean;
}

@Command({
  command: 'debug [baseDir]',
  description: 'Run the development server at debug mode',
})
export class DebugCommand extends DevCommand {
  @Argument()
  execArgv: DebugArgument;

  async run(args: string[]) {
    console.info('> args:', args);
    console.info('> worker:', this.argv.worker);
    console.info('> debug:', this.execArgv.debug);
    console.info('>', this.argv);
  }
}
