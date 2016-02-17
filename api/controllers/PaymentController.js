module.exports = {

	create: function(req, res) {		
	    var debt_id = req.param('debt');
	    var amount = req.param('amount');

	    Debt.findOne({id:debt_id})
        .exec(function (err,debt) {
          if(err){
            return res.json({
              error:err
            });
          }
          if(debt !== undefined) {
          	if(debt.current_debt === 0){
          		return res.json({
	              error:"debt is already settled"
	            });
          	}
          	if(debt.current_debt >= amount) {
          		debt.decreaseDebt(amount);
          		console.log(debt.borrower_id + " paid " + amount + " to " + debt.lender_id);
	          	return res.json({
	              debt:debt
	            });
	        } else {
	        	return res.json({
	              error:"amount too big"
	            });
	        }
          } else {
            return res.notFound();
          }
        });	   
	},	

};