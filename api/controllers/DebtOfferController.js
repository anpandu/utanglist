module.exports = {

  customPost: function(req, res) {
    var access_token = req.header('Authorization')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtOffer
          .create({
            lender_id: user.user_id,
            total_debt: req.param('total_debt'),
            notes: req.param('notes'),
          })
      })
      .then(function (debt_offer) {
        return res.send(debt_offer)
      })
  },

  getDebtOffersByUser : function(req,res) {
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

  feed: function(req, res) {
    var access_token = req.header('Authorization')
    User
      .getMe(access_token)
      .then(function (user) {
        return DebtOffer
          .find({lender_id:{'!':[user.user_id]}})
      })
      .then(function (debt_offers) {
        var proms = debt_offers.map(function (dd) { return User.findOne({user_id: dd.lender_id}) })
        return Promise
          .all(proms)
          .then(function (users) {
            debt_offers = debt_offers.map(function (dd, idx) {
              dd.user = users[idx]
              return dd
            })
            return res.send(debt_offers)
          })
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
            debtoffer.borrower_ids.push(user.user_id)
            return debtoffer.save(function (err, s) { res.json(s) })
          })
      })
  },

  accept : function(req,res) {
    var id = req.param('id')
    var borrowerId = req.param('borrower_id')
    var notes = req.param('notes')
    DebtOffer
      .findOne({id: id})
      .then(function (debtOffer) {
        debtOffer.is_accepted = true
        Debt
          .create({
            total_debt: debtOffer.total_debt,
            current_debt: debtOffer.total_debt,
            lender_id: debtOffer.lender_id,
            borrower_id: borrowerId,
            notes: notes
          })
        return debtOffer.save(function (err, s) { res.json(s) })
      })
  }

};

