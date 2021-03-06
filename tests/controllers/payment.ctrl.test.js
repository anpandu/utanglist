describe('PaymentController', function() {

  var endpoint = '/payment'

  describe('/payment/create', function() {

    it('create payment', function (done) {
      var _debt
      var _payment
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
            .post(endpoint+'/create')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .send({
              debt: _debt.id,
              amount: '2000'
            })
            .expect(function(res) {
              _payment = res.body
              assert.equal(_payment.amount, "2000")
              assert.equal(_payment.status, "pending")
            })
        })
        .then(function () { return Debt.destroy({id:_debt.id}) })
        .then(function () { return Payment.destroy({id:_payment.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })
  })

  describe('/payment/ecash_pay', function() {

    it('create payment with ecash', function (done) {
      var _debt
      var _payment
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
            .post(endpoint+'/ecash_pay')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .send({
              debt: _debt.id,
              amount: '1',
              ecash_id: '081808511006',
              ecash_pin: '142536',
              device_id: 'E64BA4E2AD9BA568',
              destination: '08112199003',
              description: 'cobagan'
            })
            .expect(function(res) {
              _payment = res.body
              assert.equal(_payment.amount, "1")
              assert.equal(_payment.status, "pending")
            })
        })
        .then(function () { return Debt.destroy({id:_debt.id}) })
        .then(function () { return Payment.destroy({id:_payment.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })
  })

  describe('/payment/approve', function() {

    it('approve payment', function (done) {
      var _debt
      var _payment
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
          return Payment.create({
              debt: _debt.id,
              amount: '2000',
              status: 'pending'
            })
            .then(function (payment) { _payment = payment; return payment})
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint + "/" + _payment.id + '/approve')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .expect(function(res) {
              _payment = res.body
              assert.equal(_payment.status, "approved")

              Debt.findOne({id:_debt.id})
                .exec(function (err,debt) {
                  assert.equal(debt.current_debt, "3000")
                })
            })
        })
        .then(function () { return Debt.destroy({id:_debt.id}) })
        .then(function () { return Payment.destroy({id:_payment.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })
  })

  describe('/payment/reject', function() {

    it('reject payment', function (done) {
      var _debt
      var _payment
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
          return Payment.create({
              debt: _debt.id,
              amount: '2000',
              status: 'pending'
            })
            .then(function (payment) { _payment = payment; return payment})
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint + "/" + _payment.id + '/reject')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user.getToken())
            .expect(function(res) {
              _payment = res.body
              assert.equal(_payment.status, "rejected")

              Debt.findOne({id:_debt.id})
                .exec(function (err,debt) {
                  assert.equal(debt.current_debt, "5000")
                })
            })
        })
        .then(function () { return Debt.destroy({id:_debt.id}) })
        .then(function () { return Payment.destroy({id:_payment.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })
  })

})
