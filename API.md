# API Design

## Usage

### Dirctory

```bash
├── bin
│   └── cli.ts
├── config
│   ├── framework.ts
│   └── plugin.ts
├── lib
│   ├── debug.ts
│   └── dev.ts
└── package.json
```

### Command

```ts
import { Command, ComandOption } from 'artus-common-bin';

@Command({
  command: 'dev [baseDir]',
  description: 'Run the development server',
  alias: ['d'],
})
export class DevCommand {
  @CommandOption()
  argv: DevOption;

  @CommandOption()
  execArgv: ExecArgvOption;

  async run(...args: string[]) {
    console.info('> args:', args);
    console.info('> worker:', this.argv.worker);
    console.info('> debug:', this.execArgv.debug);
    console.info('>', this.argv);
  }
}
```


```ts
import { Command, ComandOption } from 'artus-common-bin';

@Command({
  command: 'dev [baseDir]',
  description: 'Run the development server',
  alias: ['d'],
})
export class DevCommand {
  @Flag({
    description: 'worker number',
    default: 1,
  })
  worker: number;

  @Flag({
    description: 'specify framework that can be absolute path or npm package',
    // type: 'string',
  })
  framework: string;


  @CommandOption()
  execArgv: ExecArgvOption;

  async run(...args: string[]) {
    console.info('> args:', args);
    console.info('> worker:', this.argv.worker);
    console.info('> debug:', this.execArgv.debug);
    console.info('>', this.argv);
  }
}
```
