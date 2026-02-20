const { verifyAccessToken } = require('../services/tokenService');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: missing token.' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: invalid token.' });
  }
}

module.exports = {
  requireAuth,
};
