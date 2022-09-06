import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, Container, ArtusInjectEnum, ArtusApplication } from '@artus/core';
import { Program } from './program';

@LifecycleHookUnit()
export default class Lifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly application: ArtusApplication;

  @Inject()
  private readonly program: Program;

  @Inject()
  private readonly container: Container;

  @LifecycleHook()
  async willReady() {
    await this.program.init();
  }

  @LifecycleHook()
  async didReady() {
    await this.program.start();
  }
}
