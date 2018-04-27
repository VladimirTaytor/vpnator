/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */

const AbstractEntity = require('./AbstractEntity');

class User extends AbstractEntity{
  constructor(objOrUsername, chatId) {
    super(objOrUsername, chatId);
  }

  create(username, chatId) {
    this.username = username;
    this.chatId = chatId;
    this.createdAt = new Date();
  }

  setSettings(id) {
    this.settings = id;
  }

  setId(id) {
    this.id = id;
  }

  toSQLReady(){
    return {
      CHAT_ID: this.chatId,
      USERNAME: this.username,
      SETTINGS_ID: this.settings,
      CREATION_DATE: this.createdAt
    }
  }
}

module.exports = User;