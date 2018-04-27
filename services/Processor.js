/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const request = require('request');
const config = require('../config/config.json');

const User = require('../persistent/entity/Users');
const Link = require('../persistent/entity/Links');

class Processor {
  /**
   *
   * @param {DAO} DAO - data access object
   */
  constructor(DAO) {
    this.DAO = DAO;
  }

  static executeRequest(url, params = {}, headers = {}, data = {}) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (error)
          return reject(new Error(error));
        return resolve(body);
      });
    });
  }

  generateInternalLink(from, url) {
    return Processor.executeRequest(url)
      .then(html => html.replace(Processor.LINK_REGEXP(), Processor.linkReplacer))
      .then(result => {
        const link = new Link(result, url);
        return this.DAO.saveLink(new User(from.username, from.chat), link)
          .then(_ => link.getInternalLink());
      });
  }

  static linkReplacer(match) {
    return `${process.env.SERVER_URL || config.server.hostname}/r?l=${match}`
  }

  static LINK_REGEXP() {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
  }
}

module.exports = Processor;