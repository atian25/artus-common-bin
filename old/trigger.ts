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
export class ProcessTrigger extends Trigger {
  private hookMap: Map<string, Set<HookFunction>> = new Map();

  constructor() {
    super();
    // this.initContext()
  }

  async registryHook(type: string, ...middlwares: HookFunction[]) {
    if (!this.hookMap.has(type)) {
      this.hookMap.set(type, new Set());
    }
    const hookSet = this.hookMap.get(type);
    for (const middleware of middlwares) {
      hookSet.add(middleware);
    }
  }

  async runHook(type: string, opts: Record<string, any> = {}) {
    const hookSet = this.hookMap.get(type);
    if (!hookSet) return;
    for (const hook of hookSet) {
      await hook(opts);
    }
  }

  async start() {
    this.use(async (ctx, next) => {
      try {
        // run hook 'parse'

        // run hook 'prerun'
        await this.runHook(HookEventEnum.PRERUN);

        // run command

        // run hook 'postrun'
        await this.runHook(HookEventEnum.POSTRUN);
        await next();
      } catch (error) {
        // run hook 'error'
        console.error(error);
        await this.runHook(HookEventEnum.ERROR, { error });
        // TODO: rethrow error due to hooks
      } finally {
        // run hook 'end'
        await this.runHook(HookEventEnum.END);
      }
    });
  }
}
