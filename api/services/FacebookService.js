
module.exports = {

  basic: function () {
    return 'FacebookService'
  },

  getUserBio: function (token) {
    return new Promise (function (resolve, reject) {
      graph
        .setAccessToken(token)
        .get('/me?fields=id,name,picture,first_name,last_name', function(err, res) {
          if (err !== null)
            reject(err)
          else {
            var bio = {
              user_id: res.id,
              full_name: res.name,
              avatar: res.picture.data.url,
              first_name: res.first_name,
              last_name: res.last_name,
            }
            resolve(bio)
          }
        })
    })
  },

}

