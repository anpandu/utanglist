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

  describe('/debt/add', function() {

    it('create debt by token and lender_id', function (done) {
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
          return request(sails.hooks.http.app)
            .post(endpoint+'/add')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .send({
              lender_id: _user2.user_id,
              amount: '5000',
              notes: 'sold my soul'
            })
            .expect(function(res) {
              _debt = res.body
              assert('total_debt' in _debt, 'total_debt field doesn\'t exist' )
              assert('current_debt' in _debt, 'current_debt field doesn\'t exist' )
              assert('lender_id' in _debt, 'lender_id field doesn\'t exist' )
              assert('borrower_id' in _debt, 'borrower_id field doesn\'t exist' )
              assert('notes' in _debt, 'notes field doesn\'t exist' )
              assert(_user.user_id == _debt.borrower_id )
              assert(_user2.user_id == _debt.lender_id )
            })
        })
        .then(function (res) { return Debt.destroy({id:_debt.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })

    it('create debt by token and borrower_id', function (done) {
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
          return request(sails.hooks.http.app)
            .post(endpoint+'/add')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .send({
              borrower_id: _user2.user_id,
              amount: '5000',
              notes: 'they owe me'
            })
            .expect(function(res) {
              _debt = res.body
              assert('total_debt' in _debt, 'total_debt field doesn\'t exist' )
              assert('current_debt' in _debt, 'current_debt field doesn\'t exist' )
              assert('lender_id' in _debt, 'lender_id field doesn\'t exist' )
              assert('borrower_id' in _debt, 'borrower_id field doesn\'t exist' )
              assert('notes' in _debt, 'notes field doesn\'t exist' )
              assert(_user.user_id == _debt.lender_id )
              assert(_user2.user_id == _debt.borrower_id )
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
            .get(endpoint+'/add')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'XXXXXXX')
            .expect(function(res) {
              assert(403 == res.status)
            })
        })
        .then(function () { done() })
    })
  })

  describe(endpoint+'/pay_off', function() {

    it('pay off debt', function (done) {
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
            .post(endpoint+'/pay_off')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .send({
              debt_id: _debt.id
            })
            .expect(function(res) {
              var returnedDebt = res.body
              console.log(returnedDebt)
              assert.equal(returnedDebt.current_debt, 0)
              Payment
                .findOne({debt: returnedDebt.id})
                .exec(function (err, payment) {
                  assert.equal(payment.status, "approved");
                  assert.equal(payment.amount, 5000);
                })
            })
        })
        .then(function () { return Debt.destroy({id:_debt.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })
  })

})
