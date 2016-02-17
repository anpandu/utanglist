/**
 * JWTAuth
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function(req, res, next) {
  if (_.isUndefined(req.headers.authorization))
    return res.forbidden('Token doesn\'t exist.')
  try {
    var auth = req.headers.authorization.split(' ')
    if (auth[0] !== 'Bearer' || auth.length !== 2)
      throw 'error'
    var token = auth[1]
    var decoded = jwt.decode(token, sails.config.tokens.jwtKey)
    if (decoded.expired < moment.now())
      return res.forbidden('Token expired.')
    return next()
  } catch (e) {
    return res.forbidden('Token invalid.')
  }
}
