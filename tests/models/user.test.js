describe('UserModel', function() {

  describe('basic', function() {

    it('should has default original field', function (done) {
      User
        .create({ 
          user_id:'123',  
          user_name:'123',  
          display_name:'123',  
          password:'123',  
          email:'123',  
          avatar:'123',  
        })
        .then(function (user) {
          assert('user_id' in user, 'user_id field doesn\'t exist' )
          assert('user_name' in user, 'user_name field doesn\'t exist' )
          assert('display_name' in user, 'display_name field doesn\'t exist' )
          assert('password' in user, 'password field doesn\'t exist' )
          assert('email' in user, 'email field doesn\'t exist' )
          assert('avatar' in user, 'avatar field doesn\'t exist' )
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
            return User.create({ user_id:'user_3_'+idx, user_name: n }) 
          })
          return Promise.all(proms)
        })
        .then(function () { return User.getAutocomplete('a') })
        .then(function (users) {
          var answer = ['ana', 'andy', 'ann', 'anna', 'anni']
          assert(users.length === answer.length)
          users.forEach(function (user, idx) {
            assert('user_id' in user, 'user_id field doesn\'t exist' )
            assert('user_name' in user, 'user_name field doesn\'t exist' )
            assert(user.user_name === answer[idx], 'user_name doesn\'t match' )
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
            assert('user_name' in user, 'user_name field doesn\'t exist' )
            assert(user.user_name === answer[idx], 'user_name doesn\'t match' )
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
            assert('user_name' in user, 'user_name field doesn\'t exist' )
            assert(user.user_name === answer[idx], 'user_name doesn\'t match' )
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
        .then(function () { return User.create({ user_id:'user_4', user_name: 'user_4' })})
        .then(function (user) { 
          var token = user.getToken()
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