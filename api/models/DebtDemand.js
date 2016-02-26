/**
* DebtDemand.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // attributes
    total_debt: {
      type: 'integer',
      required: true,
    },
    lender_ids: {
      type: 'array',
      required: false,
      defaultsTo : [],
    },
    borrower_id: {
      type: 'string',
    },
    notes: {
      type: 'text',
      required: false,
    },
    is_accepted: {
      type: 'boolean',
      defaultsTo: false
    },

    accept: function () {
      this.is_accepted = true
      this.save()
    },
  },
}

