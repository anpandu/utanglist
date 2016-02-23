module.exports = {

  attributes: {

    // attributes
    total_debt: {
      type: 'integer',
      required: true,
    },
    current_debt: {
      type: 'integer',
      required: true,
    },
    lender_id: {
      type: 'string',
      required: true,
    },
    borrower_id: {
      type: 'string',
      required: true,
    },
    notes: {
      type: 'text',
      required: true,
    },
    payments: {
    	collection: 'payment',
    	via: 'debt'
    },

    // object functions
    decreaseDebt : function(amount) {
    	this.current_debt -= amount
    	this.save()
    },

  },

  // class functions
  getLendedDebtsByUser : function(user_id) {
    return Debt
      .find({ lender_id: user_id})
      .populate('payments')
      .then(function (debts) {
        var proms = debts
          .map(function (debt) {
            return User
              .findOne({user_id: debt.borrower_id})
              .then(function (user) {
                debt.user = user
                return debt
              })
          })
        return Promise.all(proms)
      })
  },

  getBorrowedDebtsByUser : function(user_id) {
    return Debt
      .find({ borrower_id: user_id})
      .populate('payments')
      .then(function (debts) {
        var proms = debts
          .map(function (debt) {
            return User
              .findOne({user_id: debt.lender_id})
              .then(function (user) {
                debt.user = user
                return debt
              })
          })
        return Promise.all(proms)
      })
  },

}
