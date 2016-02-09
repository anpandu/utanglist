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
  }

}

