import {  DefineCommand, DefineOption } from '../../../../../src/index';
import { BaseCommand, BaseOption } from './command';

export interface DevOption extends BaseOption {
  worker?: number;
  framework?: string;
}

@DefineCommand({
  command: 'dev [baseDir]',
  description: 'start a development server',
  alias: ['d'],
})
export class DevCommand extends BaseCommand {
  @DefineOption({
    worker: { type: 'number', description: 'worker count', default: 1 },
    framework: { type: 'string', description: 'special framework', required: false },
  })
  argv: DevOption;

  // 具体执行逻辑
  async run() {
    // this.argv.
    console.log('argv:', this.argv.worker, this.argv.framework, this.argv.debug);
  }
};

