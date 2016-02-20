describe('DebtController', function() {

  var endpoint = '/debt'

  describe('/debt/lend', function() {

    it('return debt by lender_id', function (done) {
      var _debt
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
          return Debt.create({
            total_debt: '5000',
            current_debt: '5000',
            lender_id: '10205506227205118',
            borrower_id: '666',
            notes: 'sold my soul'
          }) 
          .then(function (debt) { _debt = debt; return debt})
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .get(endpoint+'/lend')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .expect(function(res) {
              var debts = res.body
              assert(_.isArray(debts))
              assert(debts.length == 1)
              assert(_.isEqual(debts[0].id, _debt.id))
            })
        })
        .then(function (res) { return Debt.destroy({id:_debt.id}) })
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
            .get(endpoint+'/lend')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'XXXXXXX')
            .expect(function(res) {
              assert(403 == res.status)
            })
        })
        .then(function () { done() })
    })
  })

  describe('/debt/borrow', function() {

    it('return debt by borrower_id', function (done) {
      var _debt
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
          return Debt.create({
            total_debt: '5000',
            current_debt: '5000',
            lender_id: '10205506227205118',
            borrower_id: '666',
            notes: 'sold my soul'
          }) 
          .then(function (debt) { _debt = debt; return debt})
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .get(endpoint+'/borrow')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user2.getToken())
            .expect(function(res) {
              var debts = res.body
              assert(_.isArray(debts))
              assert(debts.length == 1)
              assert(_.isEqual(debts[0].id, _debt.id))
            })
        })
        .then(function (res) { return Debt.destroy({id:_debt.id}) })
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
            .get(endpoint+'/lend')
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