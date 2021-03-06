describe('DebtController', function() {

  var endpoint = '/debtdemand'

  describe('/debtdemand', function() {

    it('GET populated', function (done) {
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
          .then(function (debt_demand) { _debt_demand = debt_demand; return debt_demand })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .get(endpoint+'/'+_debt_demand.id)
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .expect(function(res) {
              var debt_demand = res.body
              _debt_demand = debt_demand
              assert(_.isObject(debt_demand))
              assert(_.isEqual(debt_demand.borrower_id, _user.user_id))
              assert(_.isEqual(debt_demand.borrower_id, debt_demand.user.user_id))
              assert(_.isArray(debt_demand.lender_ids))
            })
        })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return DebtDemand.destroy({id:_debt_demand.id}) })
        .then(function () { done() })
    })

    it('POST with token', function (done) {
      var _user
      var _debt_demand
      Promise.resolve()
        .then(function () {
          return User
            .create({ user_id: '10205506227205118', full_name: 'Ananta Pandu Wicaksana', })
            .then(function (user) { _user = user; return user})
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .post(endpoint)
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .field('total_debt', '123456')
            .field('notes', 'nonononotes')
            .expect(function(res) {
              var debt_demand = res.body
              _debt_demand = debt_demand
              assert(_.isObject(debt_demand))
              assert(_.isEqual(debt_demand.borrower_id, _user.user_id))
              assert(_.isArray(debt_demand.lender_ids))
            })
        })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return DebtDemand.destroy({id:_debt_demand.id}) })
        .then(function () { done() })
    })

    it('getDebtDemandsByUser', function (done) {
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
          .then(function (debt_demand) { _debt_demand = debt_demand; return debt_demand })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .get(endpoint+'/me')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .expect(function(res) {
              var debt_demands = res.body
              _debt_demands = debt_demands
              assert(_.isArray(debt_demands))
              assert(debt_demands.length === 1)
              assert(_.isEqual(debt_demands[0].borrower_id, _user.user_id))
              assert(_.isArray(debt_demands[0].lender_ids))
            })
        })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return DebtDemand.destroy({id:_debt_demand.id}) })
        .then(function () { done() })
    })
  })

  describe('/debtdemand/feed', function() {

    it('should return debtdemands except mine', function (done) {
      var _debt_demand
      var _debt_demand2
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
            borrower_id: _user.user_id,
            notes: 'havin fun'
          })
          .then(function (debt_demand) { _debt_demand = debt_demand; return debt_demand })
        })
        .then(function () {
          return DebtDemand.create({
            total_debt: '6666',
            borrower_id: _user2.user_id,
            notes: 'satan havin fun'
          })
          .then(function (debt_demand) { _debt_demand2 = debt_demand; return debt_demand })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/feed')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user2.getToken())
            .expect(function(res) {
              var debt_demands = res.body
              assert(_.isArray(debt_demands))
              assert(_.isEqual(debt_demands.length, 1))
              debt_demand = debt_demands[0]
              assert(_.isEqual(debt_demand.lender_id, _debt_demand.lender_id))
              assert(_.isEqual(debt_demand.borrower_id, _debt_demand.borrower_id))
              assert(_.isEqual(debt_demand.total_debt, _debt_demand.total_debt))
              assert(_.isEqual(debt_demand.notes, _debt_demand.notes))
              assert(_.isObject(debt_demand.user))
              assert(_.isEqual(debt_demand.user.user_id, _user.user_id))
            })
        })
        .then(function () { return DebtDemand.destroy({id:_debt_demand.id}) })
        .then(function () { return DebtDemand.destroy({id:_debt_demand2.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })

    it('return 403 if token error', function (done) {
      Promise.resolve()
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/feed')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'XXXXXXX')
            .expect(function(res) {
              assert(403 == res.status)
            })
        })
        .then(function () { done() })
    })
  })

  describe('/debtdemand/request', function() {

    it('should add my id to debtdemand\'s lender_ids', function (done) {
      var _debt_demand
      var _debt_demand2
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
            borrower_id: _user.user_id,
            notes: 'havin fun'
          })
          .then(function (debt_demand) { _debt_demand = debt_demand; return debt_demand })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/'+_debt_demand.id+'/request')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user2.getToken())
            .expect(function(res) {
              var debt_demand = res.body
              assert(_.isObject(debt_demand))
              assert(_.isEqual(debt_demand.borrower_id, _debt_demand.borrower_id))
              assert(_.isEqual(debt_demand.total_debt, _debt_demand.total_debt))
              assert(_.isEqual(debt_demand.notes, _debt_demand.notes))
              assert(_.isArray(debt_demand.lender_ids))
              assert(debt_demand.lender_ids.length === 1)
            })
        })
        .then(function () { return DebtDemand.destroy({id:_debt_demand.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })

    it('return 403 if token error', function (done) {
      Promise.resolve()
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/request')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'XXXXXXX')
            .expect(function(res) {
              assert(403 == res.status)
            })
        })
        .then(function () { done() })
    })
  })

  describe('/debtdemand/:id/accept', function() {

    it('should accept debtDemand', function (done) {
      var _debt_demand
      var _debt_demand2
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
              borrower_id: _user.user_id,
              notes: 'havin fun'
            })
            .then(function (debt_demand) { _debt_demand = debt_demand; return debt_demand })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/'+_debt_demand.id+'/accept')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user2.getToken())
            .expect(function(res) {
              var debt_demand = res.body
              assert(_.isObject(debt_demand))
              assert(_.isEqual(debt_demand.borrower_id, _debt_demand.borrower_id))
              assert(_.isEqual(debt_demand.total_debt, _debt_demand.total_debt))
              assert(_.isEqual(debt_demand.notes, _debt_demand.notes))
              assert(_.isEqual(debt_demand.is_accepted, true))
              assert(_.isArray(debt_demand.lender_ids))
            })
        })
        .then(function () { return Debt.destroy({id:_debt_demand.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })

  })

})
