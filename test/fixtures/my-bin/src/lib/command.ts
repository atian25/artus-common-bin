import { Command, DefineOption } from '../../../../../src/index';

export interface BaseOption {
  debug?: boolean;
}

export abstract class BaseCommand extends Command {
  @DefineOption({
    debug: { type: 'boolean', description: 'debug mode' },
  })
  argv: BaseOption;
};

