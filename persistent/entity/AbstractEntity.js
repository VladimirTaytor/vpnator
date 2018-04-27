/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */

const debug = require('debug')('app:entities');

class AbstractEntity {

  constructor(param1, param2, ...others) {
    return param1 instanceof Object ? this.clone(param1) : this.create(param1, param2, ...others);
  }

  create(param1, param2) {
    return this;
  }

  clone(data) {
    for (var prop in data) {
      if (data.hasOwnProperty(prop))
        this[prop] = data[prop];
    }
    return this;
  }

}

module.exports = AbstractEntity;
