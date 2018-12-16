import glob from 'glob';
import path from 'path';

export function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

export function waitEvent(context, event, times = 1) {
  let t = 0;

  return new Promise(resolve => {
    context.on(event, function eventHandler() {
      if (++t === times) {
        context.removeListener(event, eventHandler);
        resolve();
      }
    });
  });
}

export function cutArray(array, count) {
  if (count > array.length) count = array.length;
  const start = array.length - count;
  const r = array.slice(start);
  array.length = start;
  return r;
}

export function requireGlob(pattern, cwd) {
  glob.sync(pattern, {cwd})
  .map(filename => {
    return require(path.resolve(filename));
  });
}
