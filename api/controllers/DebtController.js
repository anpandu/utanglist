module.exports = {

	lendedDebtsByUser : function(req,res) {
		var userId = req.param('userId');
		Debt.find({lender_id:userId}).populate('payments').exec(function (err, debt){
		  if (err) {
		    return res.negotiate(err);
		  }		  
		  return res.json(debt);
		});	
	},

	borrowedDebtsByUser : function(req,res) {
		var userId = req.param('userId');
		Debt.find({borrower_id:userId}).populate('payments').exec(function (err, debt){
		  if (err) {
		    return res.negotiate(err);
		  }		  
		  return res.json(debt);
		});	
	}

};