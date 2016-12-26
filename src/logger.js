class Logger {
  constructor() {
    this.logs = [];
  }

  log(user, action) {
    this.logs.push({user, action});
  }
}

export default Logger;
