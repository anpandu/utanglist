describe('FacebookService', function() {

  it('should hello', function (done) {
    var res = FacebookService.basic()
    assert(res === 'FacebookService')
    done()
  })
})