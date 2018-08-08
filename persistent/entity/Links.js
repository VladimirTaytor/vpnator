/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const crypto = require('crypto');
const config = require('../../config/config.json');
const DOMAIN_REGEXP = /([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;

const AbstractEntity = require('./AbstractEntity');

class Link extends AbstractEntity{
  constructor(objOrHtml, url) {
    super(objOrHtml, url);
  }

  create(html, url) {
    this.body = html;
    this.token = crypto.randomBytes(20).toString('hex');
    this.original = url;
    this.generated = `${process.env.SERVER_URL || config.server.hostname}/o/${this.token}`;
    const domain = url.match(DOMAIN_REGEXP);
    this.service = domain ? domain[0] : 'Not defined';
  }

  setAction(id) {
    this.actions = id;
  }

  setUser(id) {
    this.user = id;
  }

  getInternalLink() {
    return this.generated;
  }

  static createBlob(text){
    let buffer = Buffer.from(text, 'utf8');
    return buffer;
  }

  toSQLReady(){
    return {
      USER_ID: this.user,
      TOKEN: this.token,
      HTML: Link.createBlob(this.body),
      ORIGINAL_LINK: this.original,
      GENERATED_LINK: this.generated,
      ACTIONS_ID: this.actions,
      SERVICE_NAME: this.service
    }
  }
}

module.exports = Link;