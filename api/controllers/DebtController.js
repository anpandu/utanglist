module.exports = {

  lendedDebtsByUser : function(req,res) {
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

  borrowedDebtsByUser : function(req,res) {
      var access_token = req.header('Authorization')
      User
        .getMe(access_token)
        .then(function (user) {
          Debt
            .getBorrowedDebtsByUser(user.user_id)
            .then(function (debt){
              return res.json(debt)
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
  }

}