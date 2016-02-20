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
    	return this.save(
	      function(err,s){
	        console.log('debt decreased to ' + this.current_debt)
	      }
	    )
    },

  },

  // class functions
  getLendedDebtsByUser : function(user_id) {
    return Debt
      .find({ lender_id: user_id})
      .populate('payments')
  },

  getBorrowedDebtsByUser : function(user_id) {
    return Debt
      .find({ borrower_id: user_id})
      .populate('payments')
  },

}
