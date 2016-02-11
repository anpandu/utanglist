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
        var token = user.getToken()
        return res.send({ token: token })
      })
      .catch(function () {
        return res.notFound()
      })
  },

  autocomplete: function(req, res) {
    Promise.resolve()
      .then(function () {
        return req.param('user_name')
      })
      .then(function (user_name) {
        return (_.isUndefined(user_name)) ? res.notFound() : user_name
      })
      .then(User.getAutocomplete)
      .then(function(users) { return res.send(users) })
      .catch(function () { return res.notFound() })
  },

}

