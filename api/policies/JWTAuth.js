/**
 * JWTAuth
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function(req, res, next) {
  if (_.isUndefined(req.headers.token))
    return res.forbidden('Token doesn\'t exist.')
  try {
    var decoded = jwt.decode(req.headers.token, sails.config.tokens.jwtKey)
    if (decoded.expired < moment.now())
      return res.forbidden('Token expired.')
    return next()
  } catch (e) {
    return res.forbidden('Token invalid.')
  }
}
