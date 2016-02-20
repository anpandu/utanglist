module.exports = {

  lendedDebtsByUser : function(req,res) {
      var access_token = req.header('Authorization')
      User
        .getMe(access_token)
        .then(function (user) {
          Debt
            .find({ lender_id: user.user_id})
            .populate('payments')
            .exec(function (err, debt){
              if (err) {
                return res.negotiate(err)
              }     
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
            .find({ borrower_id: user.user_id})
            .populate('payments')
            .exec(function (err, debt){
              if (err) {
                return res.negotiate(err)
              }     
              return res.json(debt)
            })
        })
  }

}