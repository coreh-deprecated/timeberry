var timefile = require('./timefile')
  , fs = require('fs')
  , path = require('path')

var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
  , statePath = path.join(homeDir, '.tb-state')
  , entriesPath = path.join(homeDir, '.tb-entries')

function init() {
  if (!fs.existsSync(statePath)) fs.writeFileSync(statePath, '{}\n', 'utf-8');
  if (!fs.existsSync(entriesPath)) fs.writeFileSync(entriesPath, '', 'utf-8');
}

exports.read = function() {
  init()
  return {
    state: JSON.parse(fs.readFileSync(statePath, 'utf-8')),
    entries: timefile.parse(fs.readFileSync(entriesPath, 'utf-8'))
  }  
}

exports.write = function(data) {
  fs.writeFileSync(statePath, JSON.stringify(data.state) + '\n', 'utf-8')
  fs.writeFileSync(entriesPath, timefile.stringify(data.entries) + (data.entries.length ? '\n': ''), 'utf-8')
}
