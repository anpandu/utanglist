module.exports = {

  getAllDebtByToken : function(req,res) {
      var access_token = req.header('Authorization')
      User
        .getMe(access_token)
        .then(function (user) {
          Debt
            .getLendedDebtsByUser(user.user_id)
            .then(function (debt){
              return res.json(debt)
            })
        })
  },

  lendedDebtsByUser : function(req,res) {
      var access_token = req.header('Authorization')
      User
        .getMe(access_token)
        .then(function (user) {
          Debt
            .getLendedDebtsByUser(user.user_id)
            .then(function (debts){
              var proms = debts.map(function (dd) { return User.findOne({user_id: dd.borrower_id}) })
              return Promise
                .all(proms)
                .then(function (users) {
                  debts = debts.map(function (dd, idx) {
                    dd.user = users[idx]
                    return dd
                  })
                  return res.send(debts)
                })
            })
            
        })
  },

  borrowedDebtsByUser : function(req,res) {
      var access_token = req.header('Authorization')
      User
        .getMe(access_token)
        .then(function (user) {
          Debt
            .getBorrowedDebtsByUser(user.user_id)
            .then(function (debts){
              var proms = debts.map(function (dd) { return User.findOne({user_id: dd.lender_id}) })
              return Promise
                .all(proms)
                .then(function (users) {
                  debts = debts.map(function (dd, idx) {
                    dd.user = users[idx]
                    return dd
                  })
                  return res.send(debts)
                })
            })
            .catch(console.log)
        })
  },

  add : function(req,res) {
      var access_token = req.header('Authorization')
      User
        .getMe(access_token)
        .then(function (user) {
          var b_id = (_.isUndefined(req.param('borrower_id'))) ? user.user_id : req.param('borrower_id')
          var l_id = (_.isUndefined(req.param('lender_id'))) ? user.user_id : req.param('lender_id')
          Debt
            .create({
              borrower_id: b_id,
              lender_id: l_id,
              total_debt: req.param('amount'),
              current_debt: req.param('amount'),
              notes: req.param('notes'),
            })
            .then(function (debt){
              return res.json(debt)
            })
            .catch(console.log)
        })
  },

  pay_off : function(req,res) {
    var debtId = req.param('id')
    Debt
      .findOne({id:debtId})
      .exec(function (err, debt) {
        Payment
          .create({
            amount: debt.current_debt,
            status: "approved",
            debt: debt.id,
          })
          .exec(function (err, payment) {
            // console.log(payment)
          })
        debt.current_debt = 0
        debt.save()
        return res.json(debt)
      })
  },

  customGetDebt : function(req, res) {
    var access_token = req.header('Authorization')
    var debtId = req.param('id')
    User
      .getMe(access_token)
      .then(function (user) {
        return Debt
          .findOne({id:debtId})
          .then(function (debt) {
            debt.user = user
            return res.json(debt)
          })
      })
  },

}
