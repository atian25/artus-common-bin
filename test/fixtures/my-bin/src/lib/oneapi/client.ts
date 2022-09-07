import { DefineCommand, DefineOption } from '../../../../../../src/index';
import { BaseCommand, BaseOption } from '../command';
import { OneAPICommand } from './oneapi';

export interface OneAPIClientOption extends BaseOption {
  foo?: string;
}

@DefineCommand({
  command: 'client [baseDir]',
  description: 'build oneapi client',
  parent: OneAPICommand,
})
export class OneAPIClientCommand extends BaseCommand {
  @DefineOption({
    foo: { type: 'string', description: 'bar' },
  })
  argv: OneAPIClientOption;

  // 具体执行逻辑
  async run() {
    console.log('argv:', this.argv.foo);
  }
};


