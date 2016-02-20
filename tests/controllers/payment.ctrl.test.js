describe('PaymentController', function() {

  var endpoint = '/payment'

  describe('/payment/create', function() {

    it('create a payment', function (done) {
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

})
