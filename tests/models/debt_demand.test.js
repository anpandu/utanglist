describe('DebtDemandModel', function() {

  describe('basic', function() {

    it('should has default original field', function (done) {
      var _user
      var _debt_demand
      Promise.resolve()
        .then(function () {
          return User
            .create({ user_id: '10205506227205118', full_name: 'Ananta Pandu Wicaksana', })
            .then(function (user) { _user = user; return user})
        })
        .then(function () {
          return DebtDemand.create({
            total_debt: '5000',
            borrower_id: _user.user_id,
            notes: 'havin fun'
          })
          .then(function (debt_demand) { _debt_demand = debt_demand; return debt_demand})
        })
        .then(function (debt_demand) {
          assert('total_debt' in debt_demand, 'total_debt field doesn\'t exist' )
          assert('borrower_id' in debt_demand, 'borrower_id field doesn\'t exist' )
          assert('lender_ids' in debt_demand, 'lender_ids field doesn\'t exist' )
          assert('notes' in debt_demand, 'notes field doesn\'t exist' )
          assert(_.isArray(debt_demand.lender_ids))
          assert(_.isEqual(debt_demand.lender_ids.length, 0))
        })
        .then(function () { return DebtDemand.destroy({id:_debt_demand.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { done() })
        .catch(done)
    })
  })
})