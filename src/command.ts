import { addTag, Injectable, ScopeEnum } from "@artus/core";

export enum MetadataEnum {
  COMMAND = 'COMMAND_METADATA',
  OPTION = 'OPTION_METADATA',
}

export interface CommandProps {
  command?: string;
  description?: string;
  alias?: string | string[];
  // arguments?: Record<string, OptionProp>;
  parent?: typeof Command;
}

export interface OptionProps {
  type?: string;
  description?: string;
  alias?: string | string[];
  default?: any;
  required?: boolean;
}

export abstract class Command {
  argv?: any;
  run(): Promise<any> {
    throw new Error('run() method is not implemented.');
  };
}

export function DefineCommand(meta: CommandProps = {}) {
  return (target: any) => {
    Reflect.defineMetadata(MetadataEnum.COMMAND, meta, target);
    addTag(MetadataEnum.COMMAND, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
    return target;
  };
}

export function DefineOption(meta: Record<string, OptionProps> = {}) {
  return (target: any, key: string | symbol) => {
    // TODO: merge metadata from parent class

    Reflect.defineMetadata(MetadataEnum.OPTION, meta, target);
    // Reflect.def
    // get option metadata by class type
    // const optionClz = Reflect.getMetadata('design:type', target, key);
    // Inject('argv')(target, HOLDER);
    // return Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}
