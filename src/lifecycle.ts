import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, Container, ArtusInjectEnum } from '@artus/core';
import { Program } from './program';

@LifecycleHookUnit()
export default class Lifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly program: Program;

  @Inject()
  private readonly container: Container;

  @LifecycleHook()
  public async willReady() {
    // start
    const ctx = await this.program.trigger.initContext();
    await this.program.trigger.startPipeline(ctx);
  }
}
