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
    borrower_ids: {
      type: 'array',
      defaultsTo: [],
    },
    notes: {
      type: 'text',
    },
    is_accepted: {
      type: 'boolean',
      defaultsTo: false
    },

    request: function (borrowerId) {
      this.borrower_ids.push(borrowerId)
      this.save()
    },

    accept: function () {
      this.is_accepted = true
      this.save()
    },

  },

}
