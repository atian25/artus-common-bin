import { describe, it } from "vitest";
import { getFixturePath } from "./test-utils";
import { startApp } from "../src/index";

describe('test/index.test.ts', () => {
  it('should work', async () => {
    const baseDir = getFixturePath('example-bin');
    const app = await startApp({ baseDir });
    console.log('~', app);
  });
});
