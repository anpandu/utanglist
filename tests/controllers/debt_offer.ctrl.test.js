describe('DebtOfferController', function() {

  var endpoint = '/debtoffer'

  describe('/debtoffer/feed', function() {

    it('should return debtoffers except mine', function (done) {
      var _debt_offer
      var _debt_offer2
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
          return DebtOffer.create({
              total_debt: '5000',
              lender_id: _user.user_id,
              notes: 'havin fun'
            })
            .then(function (debt_offer) { _debt_offer = debt_offer; return debt_offer })
        })
        .then(function () {
          return DebtOffer.create({
              total_debt: '6666',
              lender_id: _user2.user_id,
              notes: 'satan havin fun'
            })
            .then(function (debt_offer) { _debt_offer2 = debt_offer; return debt_offer })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/feed')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user2.getToken())
            .expect(function(res) {
              var debt_offers = res.body
              assert(_.isArray(debt_offers))
              assert(_.isEqual(debt_offers.length, 1))
              debt_offer = debt_offers[0]
              assert(_.isEqual(debt_offer.lender_id, _debt_offer.lender_id))
              assert(_.isEqual(debt_offer.borrower_id, _debt_offer.borrower_id))
              assert(_.isEqual(debt_offer.total_debt, _debt_offer.total_debt))
              assert(_.isEqual(debt_offer.notes, _debt_offer.notes))
            })
        })
        .then(function () { return Debt.destroy({id:_debt_offer.id}) })
        .then(function () { return Debt.destroy({id:_debt_offer2.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })
  })

  describe('/debtoffer/:id/request', function() {

    it('should add my id to debtoffer\'s borrower_ids', function (done) {
      var _debt_offer
      var _debt_offer2
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
          return DebtOffer.create({
              total_debt: '5000',
              lender_id: _user.user_id,
              notes: 'havin fun'
            })
            .then(function (debt_offer) { _debt_offer = debt_offer; return debt_offer })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/'+_debt_offer.id+'/request')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user2.getToken())
            .expect(function(res) {
              var debt_offer = res.body
              assert(_.isObject(debt_offer))
              assert(_.isEqual(debt_offer.lender_id, _debt_offer.lender_id))
              assert(_.isEqual(debt_offer.total_debt, _debt_offer.total_debt))
              assert(_.isEqual(debt_offer.notes, _debt_offer.notes))
              assert(_.isArray(debt_offer.borrower_ids))
              assert(debt_offer.borrower_ids.length === 1)
            })
        })
        .then(function () { return Debt.destroy({id:_debt_offer.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })

  })

  describe('/debtoffer/:id/accept', function() {

    it('should accept debtOffer', function (done) {
      var _debt_offer
      var _debt_offer2
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
          return DebtOffer.create({
              total_debt: '5000',
              lender_id: _user.user_id,
              notes: 'havin fun'
            })
            .then(function (debt_offer) { _debt_offer = debt_offer; return debt_offer })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .patch(endpoint+'/'+_debt_offer.id+'/accept')
            .set('Content-Type', 'application/json')
            .set('Authorization', _user2.getToken())
            .expect(function(res) {
              var debt_offer = res.body
              assert(_.isObject(debt_offer))
              assert(_.isEqual(debt_offer.lender_id, _debt_offer.lender_id))
              assert(_.isEqual(debt_offer.total_debt, _debt_offer.total_debt))
              assert(_.isEqual(debt_offer.notes, _debt_offer.notes))
              assert(_.isEqual(debt_offer.is_accepted, true))
              assert(_.isArray(debt_offer.borrower_ids))
            })
        })
        .then(function () { return Debt.destroy({id:_debt_offer.id}) })
        .then(function () { return User.destroy({id:_user.id}) })
        .then(function () { return User.destroy({id:_user2.id}) })
        .then(function () { done() })
    })

  })

})
