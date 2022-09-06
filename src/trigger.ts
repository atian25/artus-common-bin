import { Trigger, Injectable, ScopeEnum, DefineTrigger } from '@artus/core';
import { Input, Output } from '@artus/pipeline';

export enum HookEventEnum {
  INIT = 'init',
  PRERUN = 'prerun',
  POSTRUN = 'postrun',
  ERROR = 'error',
  END = 'end',
}

export type HookFunction = (opts?: Record<string, any>) => Promise<void>;

@Injectable({ scope: ScopeEnum.SINGLETON })
export class CommandTrigger extends Trigger {

  constructor() {
    super();
  }

  async run() {
    try {
      const ctx = await this.initContext();

      // TODO: could pass argv for unittest
      // TODO: mv to ProcessTrigger
      const argv = process.argv.slice(2);

      // TODO: mv to Input
      ctx.container.set({ id: 'origin_argv', value: argv });

      await this.startPipeline(ctx);
    } catch (err) {
      console.error(err);
    }
  }

  async start() {
    process.nextTick(this.run);
  }
}
