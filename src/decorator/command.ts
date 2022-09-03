import { Injectable, Inject, addTag, ScopeEnum } from "@artus/injection";
import { ArgumentProps } from "./argument";

export const COMMAND_TAG = 'COMMAND_TAG';

export const COMMAND_METADATA = Symbol('COMMAND_METADATA');
export const ARGUMENT_METADATA = Symbol('ARGUMENT_METADATA');


export interface CommandProps {
  command?: string;
  description?: string;
  alias?: string | string[];
  arguments?: Record<string, ArgumentProps>;
}


function getMetaData(key: string | symbol, target: any, defaultValue: any) {
  if (!Reflect.hasMetadata(key, target)) {
    Reflect.defineMetadata(key, defaultValue, target);
  }
  return Reflect.getMetadata(key, target);
}

export function Command(meta: CommandProps = {}) {
  return (target: any) => {
    Reflect.defineMetadata(COMMAND_METADATA, meta, target);
    addTag(COMMAND_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
    return target;
  };
}

export function Argument() {
  return (target: any, key: string | symbol) => {
    // get option metadata by class type
    const argumentClz = Reflect.getMetadata('design:type', target, key);

    // store option meta → command class metadata
    const commandClz = target.constructor;
    const store = getMetaData(ARGUMENT_METADATA, commandClz, {});

    // collect option metadata
    const keys = Reflect.getMetadataKeys(argumentClz);
    keys.forEach(k => {
      if (typeof k !== 'string' || !k.startsWith('ARGUMENT_')) return;
      const option = Reflect.getMetadata(k, argumentClz);
      store[option.key] = option.meta;
    });

    // mark as inject
    Inject(argumentClz)(commandClz, key);
  }
}
