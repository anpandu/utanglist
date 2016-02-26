/**
 * DebtDemandController
 *
 * @description :: Server-side logic for managing Debtdemands
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  feed: function(req, res) {
    var access_token = req.header('Authorization')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtDemand
          .find({borrower_id:{'!':[user.user_id]}})
      })
      .then(function (debt_demands) {
        return res.send(debt_demands)
      })
  },
}

