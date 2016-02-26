describe('DebtDemandModel', function() {

  describe('basic', function() {

    it('should has default original field', function (done) {
      var _user
      var _user2
      var _debt_demand
      Promise.resolve()
        .then(function () {
          return User
            .create({ user_id: '10205506227205118', full_name: 'Ananta Pandu Wicaksana', })
            .then(function (user) { _user = user; return user})
        })
        .then(function () {
          return User
            .create({ user_id: '666', full_name: 'satan', })
            .then(function (user) { _user2 = user; return user})
        })
        .then(function () {
          return DebtDemand.create({
            total_debt: '5000',
            lender_id: '10205506227205118',
            borrower_id: '666',
            notes: 'demand to sell my soul'
          })
          .then(function (debt_demand) { _debt_demand = debt_demand; return debt_demand})
        })
        .then(function (debt_demand) {
          assert('total_debt' in debt_demand, 'total_debt field doesn\'t exist' )
          assert('lender_id' in debt_demand, 'lender_id field doesn\'t exist' )
          assert('borrower_id' in debt_demand, 'borrower_id field doesn\'t exist' )
          assert('notes' in debt_demand, 'notes field doesn\'t exist' )
          assert('is_approved' in debt_demand, 'is_approved field doesn\'t exist' )
          assert(_.isEqual(debt_demand.is_approved, false))
        })
        .then(function () { return DebtDemand.destroy({id:_debt_demand.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
        .catch(done)
    })

    it('should create Debt if approved', function (done) {
      var _user
      var _user2
      var _debt_demand
      var _debt
      Promise.resolve()
        .then(function () {
          return User
            .create({ user_id: '10205506227205118', full_name: 'Ananta Pandu Wicaksana', })
            .then(function (user) { _user = user; return user})
        })
        .then(function () {
          return User
            .create({ user_id: '666', full_name: 'satan', })
            .then(function (user) { _user2 = user; return user})
        })
        .then(function () {
          return DebtDemand.create({
            total_debt: '5000',
            lender_id: '10205506227205118',
            borrower_id: '666',
            notes: 'demand to sell my soul'
          })
          .then(function (debt_demand) { _debt_demand = debt_demand; return debt_demand })
        })
        .then(function (debt_demand) {
          return debt_demand
            .approve()
            .then(function (debt) { 
              _debt = debt
              assert(_.isObject(debt))
              assert(_.isEqual(debt.lender_id, debt_demand.lender_id))
              assert(_.isEqual(debt.borrower_id, debt_demand.borrower_id))
              assert(_.isEqual(debt.total_debt, debt_demand.total_debt))
              assert(_.isEqual(debt.notes, debt_demand.notes))
              return debt 
            })
            .then(function () {
              return DebtDemand
                .findOne(_debt_demand.id)
                .then(function (debt_demand) { 
                  assert(_.isEqual(debt_demand.is_approved, true))
                })
            })
        })
        .then(function () { return Debt.destroy({id:_debt.id}) })
        .then(function () { return DebtDemand.destroy({id:_debt_demand.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
        .catch(done)
    })
  })
})