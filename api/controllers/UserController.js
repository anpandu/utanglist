/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  login: function(req, res) {
    var access_token = req.param('access_token')
    var _result = {}
    FacebookService
      .getUserBio(access_token)
      .then(function (result) {
        _result = result
        return User.findOne({ user_id: result.user_id })
      })
      .then(function (user) {
        if (!_.isUndefined(user)) {
          var token = user.getToken()
          return res.send({ token: token })
        } else
          return User
            .create(_result)
            .then(function (user) {
              var token = user.getToken()
              return res.send({ token: token })
            })
      })
      .catch(function (e) {
        return res.notFound(e)
      })
  },

  autocomplete: function(req, res) {
    Promise.resolve()
      .then(function () {
        return req.query.full_name
      })
      .then(function (full_name) {
        return (_.isUndefined(full_name)) ? res.notFound() : full_name
      })
      .then(User.getAutocomplete)
      .then(function(users) { 
        return User
          .getMe(req.header('Authorization'))
          .then(function (user) {
            var result = users.filter(function (u) { return u.user_id !== user.user_id})
            return res.send(result)
          })
      })
      .catch(function () { return res.notFound() })
  },

  me: function(req, res) {
    var access_token = req.header('Authorization')
    User
      .getMe(access_token)
      .then(function (user) {
        return res.send(user)
      })
  },

}

