/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // PROPERTIES
    user_id: {
      type: 'string',
      required: true,
    },
    full_name: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    },
    first_name: {
      type: 'string'
    },
    last_name: {
      type: 'string'
    },

    // FUNCTIONS
    getToken: function () {
      var payload = { 
        user_id: this.user_id,
        expired: moment().add(7,'d').valueOf(),
      }
      var token = jwt.encode(payload, sails.config.tokens.jwtKey)
      return 'Bearer ' + token
    },
  },

  // CLASS FUNCTIONS
  getAutocomplete: function (full_name) {
    return User
      .find({ 
        where: { full_name: { 'like': full_name+'%' } },
        sort: 'full_name ASC',
        limit: 5,
      })
      .then(function(users) {
        return users.map(function (u) {
          return { 
            user_id: u.user_id,
            full_name: u.full_name,
            avatar: u.avatar,
          }
        })
      })
  },

  getMe: function (access_token) {
    var decoded = jwt.decode(access_token.split(' ')[1], sails.config.tokens.jwtKey)
    return User.findOne({ user_id: decoded.user_id })
  },

}

