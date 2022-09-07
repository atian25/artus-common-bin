import { Injectable, Inject, addTag, ScopeEnum } from "@artus/injection";
const HOLDER = Symbol('HOLDER');

export enum ArgumentEnum {
  OPTION = 'option',
  FLAG = 'flag',
  POSITIONAL = 'positional',
}

export interface ArgumentProps {
  alias?: string | string[];
  description?: string;
  default?: any;
  type?: string;
}

export function DefineArgument() {
  return (target: any) => {
    Inject('argv')(target, HOLDER);
    return Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

function DefineArgumentItem(type: ArgumentEnum, meta: ArgumentProps = {}) {
  return (target: any, key: string | symbol) => {
    // store item metadata → argument class metadata
    const argumentClz = target.constructor;
    Reflect.defineMetadata(`ARGUMENT_${String(key)}`, { type, key, meta }, argumentClz);

    // define getter
    Object.defineProperty(target, key, {
      enumerable: true,
      get: function () {
        return this[HOLDER][key];
      }
    });
  }
}

export function Positional(meta: ArgumentProps = {}) {
  return DefineArgumentItem(ArgumentEnum.POSITIONAL, meta);
}

export function Option(meta: ArgumentProps = {}) {
  return DefineArgumentItem(ArgumentEnum.OPTION, meta);
}

export function Flag(meta: ArgumentProps = {}) {
  return DefineArgumentItem(ArgumentEnum.FLAG, {
    ...meta,
    type: 'boolean',
  });
}
