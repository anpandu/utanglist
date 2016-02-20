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

    // objec functions
    decreaseDebt : function(amount) {
    	this.current_debt -= amount
    	this.save(
	      function(err,s){
	        console.log('debt decreased')
	      }
	    )
    }

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
  }


}