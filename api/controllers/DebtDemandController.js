/**
 * DebtDemandController
 *
 * @description :: Server-side logic for managing Debtdemands
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  approve: function(req, res) {
    var access_token = req.header('Authorization')
    var debtDemandId = req.param('id')
    DebtDemand
      .findOne(debtDemandId)
      .then(function (debtDemand) {
        return debtDemand.approve()
      })
      .then(function (debt) {
        return res.send(debt)
      })
  },
}

