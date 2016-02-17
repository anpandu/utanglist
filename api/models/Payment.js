module.exports = {

  attributes: {  	    
    amount: {
      type: 'integer',
      required: true,
    },
    debt: {
    	model: 'debt'
    }
  }

};