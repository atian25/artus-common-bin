import { Injectable, Inject, addTag, ScopeEnum } from "@artus/injection";

export const COMMAND_TAG = 'COMMAND_TAG';

export const COMMAND_METADATA = Symbol.for('COMMAND_METADATA');
export const OPTION_METADATA = Symbol.for('OPTION_METADATA');
const HOLDER = Symbol('HOLDER');

export interface CommandProps {
  command?: string;
  description?: string;
  alias?: string | string[];
}

export interface OptionProps {
  alias?: string | string[];
  description?: string;
  default?: any;
  type?: string;
}

function getMetaData(key: string|symbol, target: any, defaultValue: any) {
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
  };
}

export function CommandOption() {
  return (target: any, key: string | symbol) => {
    // get option metadata by class type
    const optionClz = Reflect.getMetadata('design:type', target, key);

    // store option meta → command class metadata
    const commandClz = target.constructor;
    const store = getMetaData(OPTION_METADATA, commandClz, {});

    // collect option metadata
    const keys = Reflect.getMetadataKeys(optionClz);
    keys.forEach(k => {
      if (typeof k !== 'string' || !k.startsWith('OPTION_')) return;
      const option = Reflect.getMetadata(k, optionClz);
      store[option.key] = option.meta;
    });

    // mark as inject
    Inject(optionClz)(commandClz, key);
  }
}


export function DefineOption() {
  return (target: any) => {
    Inject('globalOptions')(target, HOLDER);
    return Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function Option(meta: OptionProps = {}) {
  return (target: any, key: string | symbol) => {
    // store item metadata → option class metadata
    const optionClz = target.constructor;
    Reflect.defineMetadata(`OPTION_${String(key)}`, { key, meta }, optionClz);

    // define getter
    Object.defineProperty(target, key, {
      enumerable: true,
      get: function () {
        return this[HOLDER].argv[key];
      }
    })
  }
}

export function Flag(meta: OptionProps = {}) {
  return Option({
    ...meta,
    type: 'boolean',
  });
}
