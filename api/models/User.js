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
    user_name: {
      type: 'string'
    },
    display_name: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    },

    // FUNCTIONS
    getToken: function () {
      var payload = { 
        user_id: this.user_id,
        expired: moment().add(7,'d').valueOf(),
      }
      var token = jwt.encode(payload, sails.config.tokens.jwtKey)
      return token
    },
  },

  // CLASS FUNCTIONS
  getAutocomplete: function (user_name) {
    return User
      .find({ 
        where: { user_name: { 'like': user_name+'%' } },
        sort: 'user_name ASC',
        limit: 5,
      })
      .then(function(users) {
        return users.map(function (u) {
          return { 
            user_id: u.user_id,
            user_name: u.user_name,
          }
        })
      })
  },

}

