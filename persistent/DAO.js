/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const mysql = require('mysql');
const debug = require('debug')('app:database');

const Link = require('./entity/Links');
const User = require('./entity/Users');

class DAO {
  constructor(options) {
    this.config = process.env.JAWSDB_URL || options.mysql;
    this.connection = this.createConnection();
  }

  getConnection() {
    return this.connection ? this.connection : this.createConnection();
  }

  getLinkByToken(token) {
    return new Promise(resolve => {
      this.getConnection()
        .query(
          'SELECT * FROM Links ' +
          'INNER JOIN Actions ON Links.ACTIONS_ID = Actions.ID AND Links.TOKEN = ?',
          [token], function (error, results) {
            if (error)
              return Promise.reject(new Error(error));
            return resolve(results[0]);
          });
    });
  }

  saveLink(user, link) {
    return this.getUser(user.chatId, user).then(User => {
      link.setUser(User.ID);
      return this.createActions().then(actions => {
        link.setAction(actions.insertId);
        const data = link.toSQLReady();
        console.log(data);
        return this.getConnection().query('INSERT INTO Links SET ?', data);
      })
    });
  }

  createUser(user) {
    return this.createSettings().then(settings => {
      user.setSettings(settings.insertId);
      return new Promise(resolve => {
        this.getConnection().query('INSERT INTO Users SET ?', user.toSQLReady(), function (error, results) {
          if (error)
            return Promise.reject(new Error(error));
          user.setId(results.insertId);
          return resolve(user);
        })
      });
    });
  }

  getUser(chatId, user = {}) {
    return new Promise(resolve => {
      return this.getConnection().query('SELECT * FROM Users WHERE CHAT_ID = ?', [chatId], (error, result) => {
        if (error) {
          return Promise.reject(new Error(error));
        }
        if (!result.length) {
          return this.createUser(user)
            .then(u => resolve(u.toSQLReady()));
        }
        return resolve(result[0]);
      });
    });
  }

  createSettings() {
    return new Promise(resolve => {
      return this.getConnection().query('INSERT INTO Settings VALUES (null, 0,"")', function (error, results, fields) {
        if (error) {
          console.log(error);
          return Promise.reject(new Error(error));
        }
        console.log(results);
        return resolve(results);
      });
    });
  }

  createActions() {
    return new Promise(resolve => {
      return this.getConnection().query('INSERT INTO Actions VALUES (null,0,0,0)', function (error, results, fields) {
        if (error)
          return Promise.reject(new Error(error));
        console.log(results);
        return resolve(results);
      });
    });
  }

  createConnection() {
    return mysql.createConnection(this.config);
  }
}

module.exports = DAO;