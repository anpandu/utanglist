/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  login: function(req, res) {
    var id = req.param('user_id')
    User
      .findOne({ user_id: id })
      .then(function(user) {
        var token = user.user_id
        return res.send({
          token: token
        })
      })
      .catch(function () {
        return res.notFound()
      })
  },

  autocomplete: function(req, res) {
    var user_name = req.param('user_name')
    User
      .find({ 
        where: { user_name: { 'like': user_name+'%' } },
        sort: 'user_name ASC',
        limit: 5,
      })
      .then(function(users) {
        return users.map(function (u) {
          return { 
            user_id: u.user_id,
            user_name: u.user_name,
          }
        })
      })
      .then(function(users) { return res.send(users) })
      .catch(function () { return res.notFound() })
  },

}

