module.exports = {

  attributes: {  	
    debt_id: {
      type: 'string',
      required: true,
    },
    amount: {
      type: 'integer',
      required: true,
    },
    debt: {
    	model: 'debt'
    }
  }

};