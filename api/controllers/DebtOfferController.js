module.exports = {

  feed: function(req, res) {
    var access_token = req.header('Authorization')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtOffer
          .find({lender_id:{'!':[user.user_id]}})
      })
      .then(function (debt_offers) {
        return res.send(debt_offers)
      })
  },

  getDebtOffersByUser : function() {
    var access_token = req.header('Authorization')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtOffer
          .find({lender_id: user.user_id})
      })
      .then(function (debt_offers) {
        return res.send(debt_offers)
      })
  },

  request: function(req, res) {
    var access_token = req.header('Authorization')
    var id = req.param('id')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtOffer
          .findOne({id: id})
          .then(function (debtoffer) {
            debtoffer.borrower_ids += [user.user_id]
            return debtoffer.save(function (err, s) { res.json(s) })
          })
      })
  },

  accept : function() {
    var id = req.param('id')
    var borrowerId = req.param('borrower_id')
    var notes = req.param('notes')

    DebtOffer
      .findOne({id: id})
      .exec(function(debtOffer) {
        debtOffer.accept()
        Debt
          .create({
            total_debt: debtOffer.total_debt,
            current_debt: debtOffer.total_debt,
            lender_id: debtOffer.lender_id,
            borrower_id: borrowerId,
            notes: notes,
          })
          .then(function(){
            return debtOffer
          })
      })

  }



};

