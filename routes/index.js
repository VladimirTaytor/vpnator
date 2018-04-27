const express = require('express');
const router = express.Router();
const request = require('request');

/**
 *
 * @param {DAO} DAO
 * @return {Router}
 */
module.exports = function (DAO, config) {

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('index', {title: 'VPNator'});
  });

  router.get('/o/:token', function (req, res) {
    return DAO.getLinkByToken(req.params.token)
      .then(link => {
        if(!link)
          return res.end();
        const buffer = link.HTML.toString('utf8');
        res.send(buffer);
      });
  });

  router.get('/r', function (req, res) {
    return request(req.query.l, function (error, response, body) {
      res.send(body);
    })
  });

  return router;
};
