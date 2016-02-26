/**
 * DebtDemandController
 *
 * @description :: Server-side logic for managing Debtdemands
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  customPost: function(req, res) {
    var access_token = req.header('Authorization')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtDemand
          .create({ 
            borrower_id: user.user_id,
            total_debt: req.param('total_debt'),
            notes: req.param('notes'),
          })
      })
      .then(function (debt_demand) {
        return res.send(debt_demand)
      })
  },

  getDebtDemandsByUser : function(req, res) {
    var access_token = req.header('Authorization')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtDemand
          .find({borrower_id: user.user_id})
      })
      .then(function (debtdemands) {
        return res.send(debtdemands)
      })
  },

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

  request: function(req, res) {
    var access_token = req.header('Authorization')
    var debtDemandId = req.param('id')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtDemand
          .findOne({id: debtDemandId})
          .then(function (debtdemand) {
            debtdemand.lender_ids.push(user.user_id)
            return debtdemand.save(function (err, s) { res.json(s) }) 
          })
      })
  },
}

