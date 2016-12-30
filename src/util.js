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
