describe('FacebookService', function() {

  it('should hello', function (done) {
    var res = FacebookService.basic()
    assert(res === 'FacebookService')
    done()
  })

  it('getUserBio', function (done) {
    var token = 'CAAIQjqcgR8oBABUFsYgOLMW53wYXnvSIuHyTHrEP2QZCISJYV4zYxGTkUT0v2EhtVpU7KyYvUd2m8qEHo9yvq2PYLIKAdRjfIG7NBx9Hmn3itBZCSmbAxXgRCqbnmwhDAW4Jn6vbsvPIrpLnAoNEPQIu7oItUoMqZBFowFOaR4oeMFLjIfdEzibZBZBBJlT1ZBqDZB3HH0luaYdgwucRAkMsVDSmkFHv6pSV8zw4ehOZAAZDZD'
    FacebookService
      .getUserBio(token)
      .then(function (result) {
        var answer = { user_id: '10205506227205118', full_name: 'Ananta Pandu Wicaksana', avatar: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xtf1/v/t1.0-1/p200x200/12009766_10204777873876740_7137133415851209308_n.jpg?oh=157b9220e8adf7f56a8706fb40974964&oe=5759F75D&__gda__=1465851083_586aa6d39dd6ac6ec8fe5ec58d2552dd', first_name: 'Ananta Pandu', last_name: 'Wicaksana' }
        assert('user_id' in result)
        assert('full_name' in result)
        assert('avatar' in result)
        assert('first_name' in result)
        assert('last_name' in result)
        assert(_.isEqual(result, answer))
        done()
      })
  })
})