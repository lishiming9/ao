import Kefir from 'kefir'
import config from '../../configuration'
import cryptoUtils from '../crypto'
import _ from 'lodash'
// import s from './bs'

import dbengine from  'better-sqlite3'

const preparedStmts = {};

var conn, eventEmitter, shadowEmitter

const changeFeed = Kefir.stream(e => {
  eventEmitter = e
})

const shadowFeed = Kefir.stream(e => {
  shadowEmitter = e
})

function triggerShadow(x){
    shadowEmitter.emit(x)
}

function initializeSqlite(cb) {
  console.log('initializing new sqlite3');
  var err = null;
  try {
    var initDb = conn.prepare("CREATE TABLE `events` ( `document` BLOB NOT NULL, `timestamp` INTEGER UNIQUE, PRIMARY KEY(`timestamp`) )");
    var initBackups = conn.prepare("CREATE TABLE `backups` ( `document` BLOB NOT NULL, `timestamp` INTEGER UNIQUE, PRIMARY KEY(`timestamp`) )");
    initDb.run();
    initBackups.run();
    createStatements()
  } catch(actualErr) {
    console.log(actualErr);
    err = actualErr;
  }
  if (err) {
    cb(err, conn);
  } else {
    insertEvent({
      type: 'member-created',
      name: 'dctrl',
      fob: '0000000000',
      secret: cryptoUtils.createHash('1235'), // password for dctrl init user is 1235
      memberId: '0',
      address: '2Mz6BQSTkmK4WHCntwNfvdSfWHddTqQX4vu',
      active: 1,
      balance: 0,
      badges: [],
      info: {},
    });
    startFeed();
    cb(null, conn);
  }
}

function createStatements() {
    conn.function('eventFeed', (doc) => {
        eventEmitter.emit(JSON.parse(doc))
    })
    preparedStmts.getAll = conn.prepare('SELECT document FROM events WHERE (timestamp > ?) ORDER BY timestamp') // WHERE (timestamp > ?)
    preparedStmts.insertEvent = conn.prepare("INSERT INTO events VALUES (?, ?)")
    preparedStmts.insertBackup = conn.prepare("INSERT INTO backups VALUES (?, ?)")
    preparedStmts.recover  = conn.prepare("SELECT document from backups ORDER BY timestamp DESC LIMIT 1")
}

function recover(callback){
    try {
      let all = [];

      for (const ev of preparedStmts.recover.iterate()) {
          console.log
          all.push(JSON.parse(ev.document))
      }
      callback(null, all)
    } catch(err){
      console.log('err caught recover ' + err)
    }
}


function getAll(timestamp, callback) {
    try {
      let all = [];

      for (const ev of preparedStmts.getAll.iterate(timestamp)) {
          all.push(JSON.parse(ev.document))
      }
      callback(null, all)
    } catch(err) {
      console.log('err caught getAll ' + err)
    }
}

function startFeed() {
  conn.function('eventFeed', (doc) => {
      eventEmitter.emit(JSON.parse(doc))
  })
  conn.prepare('CREATE TRIGGER updateHook AFTER INSERT ON events BEGIN SELECT eventFeed(NEW.document); END').run()
}

function insertEvent(ev, callback) {
    if (!conn) return callback("No db connection")
    if (!ev.timestamp) {
        ev.timestamp = Date.now()
    }
    var err = null;
    var result = null;
    try{
      result = preparedStmts.insertEvent.run(JSON.stringify(ev), ev.timestamp);
    } catch(actualErr) {
      err = actualErr
    }
    if (callback) {
        callback(err, result);
    }
}

function insertBackup(state, callback) {
    if (!conn) return callback("No db connection")

    state.timestamp = Date.now()

    var err = null;
    var result = null;
    try{
        result = preparedStmts.insertBackup.run(JSON.stringify(state), state.timestamp);
    } catch(actualErr) {
        err = actualErr;
    }
    if (callback) return callback(err, result);
}

//
// setTimeout( () => {
//   let members = []
//   let ids = []
//   let names = []
//   let tasks = []
//   let memberTasks = []
//   s.members.forEach( m => {
//     if ( ids.indexOf(m.memberId) > -1 || names.indexOf(m.name) > -1 ) {
//       return false
//     }
//     ids.push(m.memberId)
//     names.push(m.name)
//     m.fob = ''
//     m.email = ''
//     members.push(m)
//     if (m.balance < 0) m.balance = 0
//   })
//
//   s.tasks.forEach( t => {
//       if (ids.indexOf(t.name) > -1){
//           if (memberTasks.indexOf(t.name) > -1){
//               return false
//           }
//           memberTasks.push(t.name)
//       }
//       tasks.push(t)
//   })
//
//   s.members = members
//   s.tasks = tasks
//
//   console.log('trying to migrate s', s.members.length, " members, ", s.tasks.length, " tasks")
//   names.forEach((n, i) => {
//     console.log(i, '. ', n)
//   })
//
//   insertBackup(s, console.log)
// }, 10000)

function startDb(callback){
    conn = dbengine(config.sqlite3.file, { });
    var checkTable = conn.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='events'");

    if(checkTable.all().length == 0){
       initializeSqlite(callback);
    } else {
       createStatements();
       callback(null, conn);
    }
}

function getConn(){
    return conn
}

module.exports = {
  conn:conn,
  startDb,
  getAll,
  changeFeed,
  shadowFeed,
  triggerShadow,
  insertEvent,
  insertBackup,
  getConn,
  recover,
}
