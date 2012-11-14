exports.parse = function(str) {
  var lines = str.split('\n')
  return lines.filter(function(line) {
    return !/^\s*$/.test(line)
  }).map(function(line) {
    var tmp = line.split(' --- ')
    return {
      task: tmp[0].replace(/^\s+|\s+$/, ''),
      time: exports.parseTime(tmp[1])
    }
  })
}

exports.parseTime = function(text) {
  var tmp = text.match(/\s*(?:([0-9]+)h)?\s*(?:([0-9]+)m)?\s*(?:([0-9]+)s)\s*/)
  return 3600 * (parseInt(tmp[1], 10) || 0) + 60 * (parseInt(tmp[2], 10) || 0) + (parseInt(tmp[3], 10) || 0);
}

exports.stringify = function(entries) {
  return entries.map(function(entry) {
    return entry.task + ' --- ' + exports.stringifyTime(entry.time)
  }).join('\n')
}

exports.stringifyTime = function(time) {
  return (time >= 3600 ? Math.floor(time / 3600) + 'h ' : '') +
         (time >= 60 ? Math.floor(time / 60) % 60 + 'm ' : '') +
         (time % 60 + 's')
}
