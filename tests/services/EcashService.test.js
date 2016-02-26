describe('EcashService', function() {

  it('return token', function (done) {
    EcashService
      .getToken("081808511006", "142536", "E64BA4E2AD9BA568")
      .then(function (result) {
        //console.log(result)
        assert(!_.isUndefined(result))
        done()
      })
  })

  it('return balance inquiry', function (done) {
    EcashService
      .getToken("081808511006", "142536", "E64BA4E2AD9BA568")
      .then(function (result) {
        EcashService
          .balanceInquiry("081808511006", "142536", result.token)
          .then(function (result) {
            //console.log(result)
            assert(!_.isUndefined(result))
            done()
          })
      })
  })

  it('transfer using ecash', function (done) {
    EcashService
      .getToken("081808511006", "142536", "E64BA4E2AD9BA568")
      .then(function (result) {
        EcashService
          .transfer("081808511006", "08112199003", "0.1", "142536", "tes gan", result.token)
          .then(function (result) {
            //console.log(result)
            assert(!_.isUndefined(result))
            done()
          })
      })
  })

  it('transfer inquiry', function (done) {
    EcashService
      .getToken("081808511006", "142536", "E64BA4E2AD9BA568")
      .then(function (result) {
        EcashService
          .transferInquiry("081808511006", "08112199003", "0.1", result.token)
          .then(function (result) {
            //console.log(result)
            assert(!_.isUndefined(result))
            done()
          })
      })
  })

})
