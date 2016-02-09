describe('UserModel', function() {

  describe('#create', function() {

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
          done()
        })
        .catch(done)
    })

  })

})