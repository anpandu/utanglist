module.exports = {

  attributes: {  	
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
    decreaseDebt : function(amount) {
    	this.current_debt -= amount;
    	this.save(
	      function(err,s){
	        console.log('debt decreased');
	      }
	    );
    }

  }
};