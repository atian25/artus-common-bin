import { DefineCommand } from '../../../../../../src/index';
import { BaseCommand } from '../command';

@DefineCommand({
  command: 'oneapi',
  description: 'works with oneapi',
})
export class OneAPICommand extends BaseCommand {
};

