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
      required: false,
    },
    is_approved: {
      type: 'boolean',
      defaultsTo : false,
    },
    approve: function () {
      this.is_approved = true
      var that = this
      return new Promise(function (resolve, reject) {
          that.save(function (err, s) {
            resolve(s)
          })
        })
        .then(function (debt_demand) {
          return Debt.create({
            total_debt: debt_demand.total_debt,
            current_debt: debt_demand.total_debt,
            lender_id: debt_demand.lender_id,
            borrower_id: debt_demand.borrower_id,
            notes: debt_demand.notes,
          })
        })
    },
  },
}

