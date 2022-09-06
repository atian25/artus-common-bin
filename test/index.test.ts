import { getFixturePath } from "./test-utils";
import { start } from "../src/index";

describe('test/index.test.ts', () => {
  it('should work', async () => {
    const baseDir = getFixturePath('example-bin');
    const app = await start({ baseDir });
    console.log('~', app);
  });
});
