module.exports = {

  attributes: {
    amount: {
      type: 'integer',
      required: true,
    },
    status: {
      type: 'string',
      required: true,
    },
    debt: {
    	model: 'debt'
    }
  }

};
