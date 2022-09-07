import { Trigger, Injectable, ScopeEnum, ExecutionContainer } from '@artus/core';
import { Input, Output, Middleware } from '@artus/pipeline';
import { string } from 'yargs';

export { Middleware } from '@artus/pipeline';

export enum HookEventEnum {
  INIT = 'init',
  PRERUN = 'prerun',
  POSTRUN = 'postrun',
  ERROR = 'error',
  END = 'end',
}

export type HookFunction = (opts?: Record<string, any>) => Promise<void>;

export interface CommandInput {
  commandClz: any;
  argv: Record<string, any>;
  env: Record<string, string>;
  cwd: string;
}


@Injectable({ scope: ScopeEnum.SINGLETON })
export class CommandTrigger extends Trigger {
  // TODO: pipeline middleware 无类型
  private middlewares: Middleware<any>[] = [];

  collectMiddleware(mw: Middleware) {
    this.middlewares.push(mw);
  }

  // containner: commandClz, argv, env, cwd, result
  registryMiddleware() {
    this.use(this.middlewares);

    this.use(async (ctx, next) => {
      await next();
      // get pipeline execution container
      const container: ExecutionContainer = ctx.container;

      // get command instance
      // ctx.input.get('commandClz');
      // ctx.input.get('argv');
      const commandClz = container.get('commandClz') as any;
      const command = container.get<typeof commandClz>(commandClz);

      // exec command
      command.argv = container.get('argv');
      const result = await command.run();
      // container.set({ id: 'result', value: result });
    });
  }

  async run({ commandClz, argv }) {
    try {
      const ctx = await this.initContext();

      // TODO: could pass argv for unittest

      // TODO: mv to Input
      ctx.container.set({ id: 'argv', value: argv });
      ctx.container.set({ id: 'commandClz', value: commandClz });
      ctx.container.set({ id: 'env', value: { ...process.env } });
      ctx.container.set({ id: 'cwd', value: process.cwd() });

      await this.startPipeline(ctx);
    } catch (err) {
      console.error(err);
    }
  }

  async listen(cb) {
    process.nextTick(() => {
      const originArgv = process.argv;
      cb(originArgv);
    });
  }
}
