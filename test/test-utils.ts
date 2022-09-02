import path from 'path';

export function getFixturePath(name: string) {
  return path.join(__dirname, 'fixtures', name);
}
