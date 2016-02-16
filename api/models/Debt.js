module.exports = {

  attributes: {
  	id: {
      type: 'string',
      required: true,
    },
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
    },

  }
};