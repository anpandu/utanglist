describe('UserController', function() {

  var endpoint = '/user'

  describe('/post', function() {

    it('should created new', function (done) {
      var _user
      Promise.resolve()
        .then(function () {
          return request(sails.hooks.http.app)
            .post(endpoint)
            .set('Content-Type', 'application/json')
            .send({ 
              user_id:'user_1',  
              full_name:'123',  
              avatar:'123',  
            })
            .expect(function(res) {
              var user = res.body
              assert('user_id' in user, 'user_id field doesn\'t exist' )
              assert('full_name' in user, 'full_name field doesn\'t exist' )
              assert('avatar' in user, 'avatar field doesn\'t exist' )
            })
        })
        .then(function (res) { return User.destroy(res.body) })
        .then(function () { done() })
    })

  })

  describe('/login', function() {

    it('should return token if user exist', function (done) {
      var _user
      Promise.resolve()
        .then(function () { 
          return User.create({
            user_id: '10205506227205118',
            full_name: 'Ananta Pandu Wicaksana',
            avatar: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xtf1/v/t1.0-1/p50x50/12009766_10204777873876740_7137133415851209308_n.jpg?oh=39eda445992c332b67a549879e30cb2a&oe=575B1F80&__gda__=1465709557_17ef1287175c9ba406a59631a0557c93',
            first_name: 'Ananta Pandu',
            last_name: 'Wicaksana'
          }) 
        })
        .then(function (user) {
          _user = user
          return request(sails.hooks.http.app)
            .post(endpoint+'/login')
            .set('Content-Type', 'application/json')
            .send({ 
              access_token: 'CAAIQjqcgR8oBABUFsYgOLMW53wYXnvSIuHyTHrEP2QZCISJYV4zYxGTkUT0v2EhtVpU7KyYvUd2m8qEHo9yvq2PYLIKAdRjfIG7NBx9Hmn3itBZCSmbAxXgRCqbnmwhDAW4Jn6vbsvPIrpLnAoNEPQIu7oItUoMqZBFowFOaR4oeMFLjIfdEzibZBZBBJlT1ZBqDZB3HH0luaYdgwucRAkMsVDSmkFHv6pSV8zw4ehOZAAZDZD'
            })
            .expect(function(res) {
              var result = res.body
              assert('token' in result, 'token field doesn\'t exist' )
              var token = result.token.split(' ')[1]
              var decoded = jwt.decode(token, sails.config.tokens.jwtKey)
              assert(user.user_id == decoded.user_id, 'wrong user' )
            })
        })
        .then(function (res) { return User.destroy(_user) })
        .then(function () { done() })
    })

    it('should return 404 if error', function (done) {
      Promise.resolve()
        .then(function () {
          request(sails.hooks.http.app)
            .post(endpoint+'/login')
            .set('Content-Type', 'application/json')
            .send({ 
              access_token: 'asdasdasd'
            })
            .expect(function(res) {
              assert(res.status == '404', 'not 404' )
            })
            .end(done)
        })
    })

    it('should create new user if user requested doesn\'t exist', function (done) {
      var _user
      Promise.resolve()
        .then(function () {
          return request(sails.hooks.http.app)
            .post(endpoint+'/login')
            .set('Content-Type', 'application/json')
            .send({ 
              access_token: 'CAAIQjqcgR8oBABUFsYgOLMW53wYXnvSIuHyTHrEP2QZCISJYV4zYxGTkUT0v2EhtVpU7KyYvUd2m8qEHo9yvq2PYLIKAdRjfIG7NBx9Hmn3itBZCSmbAxXgRCqbnmwhDAW4Jn6vbsvPIrpLnAoNEPQIu7oItUoMqZBFowFOaR4oeMFLjIfdEzibZBZBBJlT1ZBqDZB3HH0luaYdgwucRAkMsVDSmkFHv6pSV8zw4ehOZAAZDZD'
            })
            .expect(function(res) {
              assert(res.status == '200', 'not 200' )
              var result = res.body
              assert('token' in result, 'token field doesn\'t exist' )
            })
        })
        .then(function (res) { return User.destroy(_user) })
        .then(function () { done() })
    })

  })

  describe('/autocomplete', function() {

    it('should return users (array)', function (done) {
      var _user
      Promise.resolve()
        .then(function () { 
          return User.create({ 
            user_id:'user_2_autocomplete',  
            full_name:'asd',
          }) 
        })
        .then(function (user) { 
          _user = user
          return user.getToken()
        })
        .then(function (token) {
          return request(sails.hooks.http.app)
            .post(endpoint+'/autocomplete')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({ full_name:'a' })
            .expect(function(res) {
              var users = res.body
              assert(res.status == '200', 'not 200' )
              assert(_.isArray(users))
            })
        })
        .then(function (res) { return User.destroy(_user) })
        .then(function () { done() })
    })

    it('should 404 if no full_name param', function (done) {
      var _user
      Promise.resolve()
        .then(function () { 
          return User.create({ 
            user_id:'user_2_autocomplete_2',  
            full_name:'asd',
          }) 
        })
        .then(function (user) { 
          _user = user
          return user.getToken()
        })
        .then(function (token) {
          return request(sails.hooks.http.app)
            .post(endpoint+'/autocomplete')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({})
            .expect(function(res) {
              assert(res.status == '404', 'not 404' )
            })
        })
        .then(function (res) { return User.destroy(_user) })
        .then(function () { done() })
    })

    it('should 403 if no token in header', function (done) {
      Promise.resolve()
        .then(function () {
          request(sails.hooks.http.app)
            .post(endpoint+'/autocomplete')
            .set('Content-Type', 'application/json')
            .send({})
            .expect(function(res) {
              assert(res.status == '403', 'not 403' )
              assert(res.text == 'Token doesn\'t exist.')
            })
            .end(done)
        })
    })

    it('should 403 if token is invalid', function (done) {
      Promise.resolve()
        .then(function () {
          request(sails.hooks.http.app)
            .post(endpoint+'/autocomplete')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'xxx')
            .send({})
            .expect(function(res) {
              assert(res.status == '403', 'not 403' )
              assert(res.text == 'Token invalid.')
            })
            .end(done)
        })
    })

  })

  describe('/me', function() {

    it('should return user from token', function (done) {
      var _user
      Promise.resolve()
        .then(function () { 
          return User.create({ 
            user_id:'user_3_me',  
            full_name:'user_3_me',  
            avatar:'user_3_me',  
          }) 
        })
        .then(function (user) { 
          _user = user
          return user.getToken()
        })
        .then(function (token) {
          return request(sails.hooks.http.app)
            .get(endpoint+'/me')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(function(res) {
              var user = res.body
              assert(res.status == '200', 'not 200' )
              assert(user.user_id == _user.user_id, 'wrong user' )
            })
        })
        .then(function (res) { return User.destroy(_user) })
        .then(function () { done() })
    })

  })

})