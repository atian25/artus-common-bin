import { Trigger, Injectable, ScopeEnum, DefineTrigger } from '@artus/core';
import { Input, Output } from '@artus/pipeline';

@DefineTrigger()
@Injectable({ scope: ScopeEnum.SINGLETON })
export class ProcessTrigger extends Trigger {
  constructor() {
    super();
    // this.initContext()
  }
}
