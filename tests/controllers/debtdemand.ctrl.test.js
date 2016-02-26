describe('DebtController', function() {

  var endpoint = '/debtdemand'

  describe('/debtdemand', function() {

    it('approve', function (done) {
      var _debt
      var _debt_demand
      var _user
      var _user2
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
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/'+_debt_demand.id+'/approve')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .expect(function(res) {
              var debt = res.body
              _debt = debt
              assert(_.isObject(debt))
              assert(_.isEqual(_debt.lender_id, _debt_demand.lender_id))
              assert(_.isEqual(_debt.borrower_id, _debt_demand.borrower_id))
              assert(_.isEqual(_debt.total_debt, _debt_demand.total_debt))
              assert(_.isEqual(_debt.notes, _debt_demand.notes))
            })
        })
        .then(function () { return Debt.destroy({id:_debt_demand.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })

    it('return 403 if token error', function (done) {
      var _debt
      var _user
      var _user2
      Promise.resolve()
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/123123123/approve')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'XXXXXXX')
            .expect(function(res) {
              assert(403 == res.status)
            })
        })
        .then(function () { done() })
    })
  })

})
