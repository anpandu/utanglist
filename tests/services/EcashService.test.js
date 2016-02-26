describe('EcashService', function() {

  it('should login', function (done) {
    EcashService
      .getToken("081808511006", "142536", "E64BA4E2AD9BA568")
      .then(function (result) {
        assert(_.isObject(result))
        done()
      })
  })

})
