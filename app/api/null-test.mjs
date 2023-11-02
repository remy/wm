async function test() {
  throw new Error('fail');
}

export const get = test;
