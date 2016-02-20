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
  }

}