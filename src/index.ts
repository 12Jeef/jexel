export class ValueError extends Error {}

export class AssertionError extends Error {}

export function assert(thing: boolean): void {
  if (thing) return;
  throw new AssertionError();
}
