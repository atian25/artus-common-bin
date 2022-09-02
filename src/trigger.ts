import { Trigger, Injectable, ScopeEnum } from '@artus/core';
import { Input, Output } from '@artus/pipeline';

@Injectable({ scope: ScopeEnum.SINGLETON })
export class ProcessTrigger extends Trigger {
  constructor() {
    super();
    // this.initContext()
  }
}
