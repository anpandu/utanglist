var Promise = require('bluebird')

describe('UserController', function() {

  var endpoint = '/user'

  describe('/post', function() {

    it('should created new', function (done) {
      var _user
      Promise.resolve()
        .then(function () { 
          return User.create({ 
            user_id:'user_1',  
            user_name:'123',  
            display_name:'123',  
            password:'123',  
            email:'123',  
            avatar:'123',  
          }) 
        })
        .then(function (user) {
          _user = user
          request(sails.hooks.http.app)
            .post(endpoint)
            .set('Content-Type', 'application/json')
            .send({ 
              user_id:'user_1',  
              user_name:'123',  
              display_name:'123',  
              password:'123',  
              email:'123',  
              avatar:'123',  
            })
            .expect(function(res) {
              var user = res.body
              assert('user_id' in user, 'user_id field doesn\'t exist' )
              assert('user_name' in user, 'user_name field doesn\'t exist' )
              assert('display_name' in user, 'display_name field doesn\'t exist' )
              assert('password' in user, 'password field doesn\'t exist' )
              assert('email' in user, 'email field doesn\'t exist' )
              assert('avatar' in user, 'avatar field doesn\'t exist' )
              assert(user.user_id == _user.user_id, 'wrong user' )
            })
            .end(done)
        })
    })

  })

  describe('/login', function() {

    it('should return token if user exist', function (done) {
      var _user
      Promise.resolve()
        .then(function () { 
          return User.create({ 
            user_id:'user_2',  
            user_name:'123',  
            display_name:'123',  
            password:'123',  
            email:'123',  
            avatar:'123',  
          }) 
        })
        .then(function (user) {
          _user = user
          request(sails.hooks.http.app)
            .post(endpoint+'/login')
            .set('Content-Type', 'application/json')
            .send({ 
              user_id: 'user_2'
            })
            .expect(function(res) {
              var result = res.body
              assert(user.user_id == result.token, 'wrong user' )
            })
            .end(done)
        })
    })

    it('should return 404 if user doesn\'t exist', function (done) {
      var _user
      Promise.resolve()
        .then(function () {
          request(sails.hooks.http.app)
            .post(endpoint+'/login')
            .set('Content-Type', 'application/json')
            .send({ 
              user_id: 'user_3'
            })
            .expect(function(res) {
              assert(res.status == '404', 'not 404' )
            })
            .end(done)
        })
    })

  })

  describe('/autocomplete', function() {

    it('should return users by startsWith char and max 5', function (done) {
      var _user
      Promise.resolve()
        .then(function () { 
          var names = ['ana', 'anna', 'anni', 'annie', 'andy', 'ann', 'bobo']
          var proms = names.map(function (n, idx) {
            return User.create({ 
              user_id:'user_3_'+idx,  
              user_name: n,  
              display_name: n,  
              password:'123',  
              email:'123',  
              avatar:'123',
            }) 
          })
          return Promise.all(proms)
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .post(endpoint+'/autocomplete')
            .set('Content-Type', 'application/json')
            .send({ user_name:'a' })
            .expect(function(res) {
              var users = res.body
              var answer = ['ana', 'andy', 'ann', 'anna', 'anni']
              assert(users.length === answer.length)
              users.forEach(function (user, idx) {
                assert('user_id' in user, 'user_id field doesn\'t exist' )
                assert('user_name' in user, 'user_name field doesn\'t exist' )
                assert(user.user_name === answer[idx], 'user_name doesn\'t match' )
              })
            })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .post(endpoint+'/autocomplete')
            .set('Content-Type', 'application/json')
            .send({ user_name:'ann' })
            .expect(function(res) {
              var users = res.body
              var answer = ['ann', 'anna', 'anni', 'annie']
              assert(users.length === answer.length)
              users.forEach(function (user, idx) {
                assert('user_id' in user, 'user_id field doesn\'t exist' )
                assert('user_name' in user, 'user_name field doesn\'t exist' )
                assert(user.user_name === answer[idx], 'user_name doesn\'t match' )
              })
            })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .post(endpoint+'/autocomplete')
            .set('Content-Type', 'application/json')
            .send({ user_name:'b' })
            .expect(function(res) {
              var users = res.body
              var answer = ['bobo']
              assert(users.length === answer.length)
              users.forEach(function (user, idx) {
                assert('user_id' in user, 'user_id field doesn\'t exist' )
                assert('user_name' in user, 'user_name field doesn\'t exist' )
                assert(user.user_name === answer[idx], 'user_name doesn\'t match' )
              })
            })
        })
        .then(function () {
          return request(sails.hooks.http.app)
            .post(endpoint+'/autocomplete')
            .set('Content-Type', 'application/json')
            .send({ user_name:'zxczxc' })
            .expect(function(res) { assert(res.body.length === 0) })
        })
        .then(function () { done() })
    })

  })

})