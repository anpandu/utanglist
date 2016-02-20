module.exports = {

	create: function(req, res) {
	    var debt_id = req.param('debt')
	    var amount = req.param('amount')

	    Debt.findOne({id:debt_id})
        .exec(function (err,debt) {
          if(err){
            return res.json({
              error:err
            })
          }
          if(debt !== undefined) {
          	if(debt.current_debt === 0){
          		return res.json({
	              error:"debt is already settled"
	            })
          	}
          	if(debt.current_debt >= amount) {
              debt.decreaseDebt(amount)
              Payment
                .create({
                  amount: amount,
                  status: "pending",
                  debt: debt_id,
                })
                .then(function (payment){
                  console.log(debt.borrower_id + " paid " + amount + " to " + debt.lender_id)
                  return res.json(payment)
                })
	        } else {
	        	return res.json({
	              error:"amount too big"
	            })
	        }
          } else {
            return res.notFound()
          }
        })
	},

}
