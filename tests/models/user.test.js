describe('UserModel', function() {

  describe('basic', function() {

    it('should has default original field', function (done) {
      User
        .create({ 
          user_id:'123',  
          full_name:'123',  
          avatar:'123',  
          first_name:'123',  
          last_name:'123',  
        })
        .then(function (user) {
          assert('user_id' in user, 'user_id field doesn\'t exist' )
          assert('full_name' in user, 'full_name field doesn\'t exist' )
          assert('avatar' in user, 'avatar field doesn\'t exist' )
          assert('first_name' in user, 'first_name field doesn\'t exist' )
          assert('last_name' in user, 'last_name field doesn\'t exist' )
          return User.destroy(user)
        })
        .then(function () { done() })
        .catch(done)
    })
  })

  describe('autocomplete', function() {

    it('should return max 5', function (done) {
      Promise.resolve()
        .then(function () { 
          var names = ['ana', 'anna', 'anni', 'annie', 'andy', 'ann', 'bobo']
          var proms = names.map(function (n, idx) {
            return User.create({ user_id:'user_3_'+idx, full_name: n }) 
          })
          return Promise.all(proms)
        })
        .then(function () { return User.getAutocomplete('a') })
        .then(function (users) {
          var answer = ['ana', 'andy', 'ann', 'anna', 'anni']
          assert(users.length === answer.length)
          users.forEach(function (user, idx) {
            assert('user_id' in user, 'user_id field doesn\'t exist' )
            assert('full_name' in user, 'full_name field doesn\'t exist' )
            assert(user.full_name === answer[idx], 'full_name doesn\'t match' )
          })
        })
        .then(function () { done() })
    })

    it('should return array of 4 if match 4, sorted ASC', function (done) {
      Promise.resolve()
        .then(function () { return User.getAutocomplete('ann') })
        .then(function (users) {
          var answer = ['ann', 'anna', 'anni', 'annie']
          assert(users.length === answer.length)
          users.forEach(function (user, idx) {
            assert('user_id' in user, 'user_id field doesn\'t exist' )
            assert('full_name' in user, 'full_name field doesn\'t exist' )
            assert(user.full_name === answer[idx], 'full_name doesn\'t match' )
          })
        })
        .then(function () { done() })
    })

    it('should return array of 1 if match 1', function (done) {
      Promise.resolve()
        .then(function () { return User.getAutocomplete('b') })
        .then(function (users) {
          var answer = ['bobo']
          assert(users.length === answer.length)
          users.forEach(function (user, idx) {
            assert('user_id' in user, 'user_id field doesn\'t exist' )
            assert('full_name' in user, 'full_name field doesn\'t exist' )
            assert(user.full_name === answer[idx], 'full_name doesn\'t match' )
          })
        })
        .then(function () { done() })
    })

    it('should return empty array if not found', function (done) {
      Promise.resolve()
        .then(function () { return User.getAutocomplete('zxczxc') })
        .then(function (users) { assert(users.length === 0) })
        .then(function () { 
          var names = ['', '', '', '', '', '', '']
          var proms = names.map(function (n, idx) { return User.destroy({ user_id:'user_3_'+idx })  })
          return Promise.all(proms)
        })
        .then(function () { done() })
    })
  })

  describe('token', function() {

    it('should return token', function (done) {
      Promise.resolve()
        .then(function () { return User.create({ user_id:'user_4', full_name: 'user_4' })})
        .then(function (user) { 
          var token = user.getToken()
          token = token.split(' ')[1]
          var decoded = jwt.decode(token, sails.config.tokens.jwtKey)
          assert('user_id' in decoded, 'user_id field doesn\'t exist' )
          assert('expired' in decoded, 'expired field doesn\'t exist' )
          assert(decoded.user_id == user.user_id, 'user_id doesn\'t match' )
          assert(decoded.expired <= moment().add(7,'d').valueOf(), 'expired doesn\'t match' )
          done()
        })
    })
  })
})