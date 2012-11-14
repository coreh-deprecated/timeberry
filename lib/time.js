var timefile = require('./timefile')

function initData(data) {
  if (!data.state.timers) {
    data.state.timers = {}
  }
  if (!data.state.acc) {
    data.state.acc = {}
  }
}

exports.start = function(data, timer) {
  initData(data);
  if (typeof timer == 'undefined') {
    timer = 'main'
  }
  if (data.state.timers[timer]) {
    console.error('Cannot start timer `' + timer + '`! Timer already running.')
    return 1;
  }
  data.state.timers[timer] = (new Date()).valueOf()
  console.log('Timer `' + timer + '` started.')
  return 0;
}

exports.pause = function(data, timer) {
  initData(data);
  if (typeof timer == 'undefined') {
    timer = 'main'
  }
  if (!data.state.timers[timer]) {
    console.error('Cannot pause timer `' + timer + '`! Timer is not running.')
    return 1;
  }
  if (!data.state.acc[timer]) {
    data.state.acc[timer] = 0;
  }
  data.state.acc[timer] += ((new Date()).valueOf() - data.state.timers[timer]) / 1000;
  delete data.state.timers[timer]
  console.log('Timer `' + timer + '` paused.')
  return 0;
}

exports.commit = function(data, timer, message) {
  initData(data);
  if (typeof message == 'undefined') {
    if (typeof timer != 'undefined') {
      message = timer;
      timer = 'main';
    } else {
      console.error('Please supply a message.')
      return 1;
    }
  }
  if (/\-\-\-/.test(message)) {
    console.error('Invalid message. Messages cannot contain `---`.')
    return 1;
  }
  if (data.state.timers[timer]) {
    exports.pause(data, timer)
  }
  if (!data.state.acc[timer]) {
    console.error('There\'s no time to commit on timer `' + timer + '`.')
    return 1;
  }
  data.entries.push({
    task: message,
    time: Math.round(data.state.acc[timer])
  })
  delete data.state.acc[timer]
  console.log('Commited time on `' + timer + '` as "' + message + '"')
  return 0;
}

exports.discard = function(data, timer) {
  initData(data);
  if (typeof timer == 'undefined') {
    timer = 'main'
  }
  if ((!data.state.timers[timer]) && (!data.state.acc[timer])) {
    console.error('Cannot discard timer `' + timer + '`. Timer does not exist.')
    return 1;
  }
  if (data.state.timers[timer]) {
    delete data.state.timers[timer]
  }
  if (data.state.acc[timer]) {
    delete data.state.acc[timer]
  }
  console.log('Timer `' + timer + '` discarded.')
  return 0;
}

exports.list = function(data) {
  console.log(timefile.stringify(data.entries))
  return 0;
}

exports.status = function(data) {
  initData(data)
  for (var timer in data.state.timers) {
    var t = (new Date().valueOf() - data.state.timers[timer]) / 1000
    if (data.state.acc[timer]) {
      t += data.state.acc[timer]
    }
    console.log(timer + ': ' + timefile.stringifyTime(Math.round(t)))
  }
  for (var timer in data.state.acc) {
    if (!data.state.timers[timer]) {
      console.log(timer + ' (paused): ' + timefile.stringifyTime(Math.round(data.state.acc[timer])))
    }
  }
  return 0;
}
