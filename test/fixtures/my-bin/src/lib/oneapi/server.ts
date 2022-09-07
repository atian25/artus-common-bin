import { DefineCommand, DefineOption } from '../../../../../../src/index';
import { BaseCommand, BaseOption } from '../command';
import { OneAPICommand } from './oneapi';

export interface OneAPIServerOption extends BaseOption {
  jar?: boolean;
}

@DefineCommand({
  command: 'server [baseDir]',
  description: 'build oneapi server',
  parent: OneAPICommand,
})
export class OneAPIServerCommand extends BaseCommand {
  @DefineOption({
    jar: { type: 'boolean', description: 'should generate jar' },
  })
  argv: OneAPIServerOption;

  // 具体执行逻辑
  async run() {
    console.log('argv:', this.argv.jar);
  }
};


