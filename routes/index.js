const express = require('express');
const router = express.Router();

/**
 *
 * @param {DAO} DAO
 * @return {Router}
 */
module.exports = function (DAO, config) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'VPNator' });
  });

  router.get('/o/:token', function(req, res) {
    return DAO.getLinkByToken(req.params.token)
      .then(link => {
        const buffer = link.HTML.toString('utf8');
        res.send(buffer);
      });
  });

  return router;
};
