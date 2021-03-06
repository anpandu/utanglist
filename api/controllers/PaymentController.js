module.exports = {

	create: function(req, res) {
	    var debtId = req.param('debt')
	    var amount = req.param('amount')

      Payment
        .findOne({debt:debtId, status:"pending"})
        .exec(function (err, payment) {
            if (payment === undefined) {
              Debt
                .findOne({id: debtId})
                .exec(function (err, debt) {
                  if (debt !== undefined) {
                    if(debt.current_debt !== 0 && debt.current_debt >= amount) {
                      Payment
                        .create({
                          amount: amount,
                          status: "pending",
                          debt: debtId,
                        })
                        .then(function (payment) {
                          // console.log("payment created: id " + payment.id)
                          return res.json(payment)
                        })
                    }
                    else {
                      return res.json({
                        error:"debt is already settled or amount too big"
                      })
                    }
                  }
                  else {
                    return res.notFound()
                  }
                })
            }
            else {
              return res.notFound()
            }
        })
	},

  ecashPay: function(req, res) {
    var debtId = req.param('debt')
    var amount = req.param('amount')
    var ecashId = req.param('ecash_id')
    var ecashPin = req.param('ecash_pin')
    var deviceId = req.param('device_id')
    var destination = req.param('destination')
    var description = req.param('description')

    Payment
      .findOne({debt:debtId, status:"pending"})
      .exec(function (err, payment) {
        if (payment === undefined) {
          Debt
            .findOne({id: debtId})
            .exec(function (err, debt) {
              if (debt !== undefined) {
                if(debt.current_debt !== 0 && debt.current_debt >= amount) {
                  EcashService
                    .getToken(ecashId, ecashPin, deviceId)
                    .then(function (result) {
                      EcashService
                        .transfer(ecashId, destination, amount, ecashPin, description, result.token)
                        .then(function (result) {
                          if(!_.isUndefined(result)){
                            Payment
                              .create({
                                amount: amount,
                                status: "pending",
                                debt: debtId,
                              })
                              .then(function (payment) {
                                // console.log("payment created: id " + payment.id)
                                return res.json(payment)
                              })
                          }

                        })
                    })
                }
                else {
                  return res.json({
                    error:"debt is already settled or amount too big"
                  })
                }
              }
              else {
                return res.notFound()
              }
            })
        }
        else {
          return res.notFound()
        }
      })
  },

  approve: function(req, res) {
    var paymentId = req.param('id')

    Payment
      .findOne({id:paymentId, status:"pending"})
      .exec(function (err, payment) {
        if (payment !== undefined) {
          payment.setStatus("approved")
          Debt
            .findOne({id: payment.debt})
            .exec(function (err, debt) {
              if (debt !== undefined) {
                debt.decreaseDebt(payment.amount)
                // console.log("Payment approved: " + debt.borrower_id + " paid " + payment.amount + " to " + debt.lender_id)
                return res.json(payment)
              }
            })
        }
        else {
          return res.notFound()
        }
      })
  },

  reject: function(req, res) {
    var paymentId = req.param('id')

    Payment
      .findOne({id:paymentId, status:"pending"})
      .exec(function (err, payment) {
        if (payment !== undefined) {
          payment.setStatus("rejected")
          // console.log("Payment rejected: id " + payment.id)
          return res.json(payment)
        }
        else {
          return res.notFound()
        }
      })
  },

  ecashBalanceInquiry: function (req, res) {
    var ecashId = req.param('ecash_id')
    var ecashPin = req.param('ecash_pin')
    var deviceId = req.param('device_id')

    EcashService
      .getToken(ecashId, ecashPin, deviceId)
      .then(function (result) {
        EcashService
          .balanceInquiry(ecashId, ecashPin, result.token)
          .then(function (result) {
            assert(!_.isUndefined(result))
            done()
          })
      })
  }

}
