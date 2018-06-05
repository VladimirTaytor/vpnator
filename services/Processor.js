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
        return resolve({
          html: body,
          host: response.request.uri.href
        });
      });
    });
  }

  generateInternalLink(from, url) {
    return Processor.executeRequest(url)
      .then(({html, host}) => html
        //.replace(Processor.LINK_REGEXP(), Processor.linkReplacer)
        .replace(Processor.RELATIVE_PATH_REGEXP(), Processor.relativeReplacer(host))
      )
      .then(result => {
        const link = new Link(result, url);
        return this.DAO.saveLink(new User(from.username, from.chat), link)
          .then(_ => link.getInternalLink());
      });
  }

  static linkReplacer(match) {
    return `${process.env.SERVER_URL || config.server.hostname}/r?l=${match}`
  }

  static relativeReplacer(host){
    return function (match) {
      const attr = match.split('=')[0];
      match = match.split('=').slice(1).join('').slice(1, -1);
      return `${attr}="${process.env.SERVER_URL || config.server.hostname}/r?l=` + host + match + `"`;
    }
  }

  static LINK_REGEXP() {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
  }

  static RELATIVE_PATH_REGEXP() {
    return /(href|src)=(("([^"]*)")|('([^']*)'))/gi;
  }
}

module.exports = Processor;