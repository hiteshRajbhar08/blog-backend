const jwt = require('jsonwebtoken');

// verify token
const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (authToken) {
    const token = authToken.split(' ')[1];

    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'invalid token,access denied',
      });
    }
  } else {
    return res.status(401).json({
      message: 'no token provided,access denied',
    });
  }
};

//  verify token and admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: 'not allowed,only admin can access',
      });
    }
  });
};

//  verify token and only user himself
const verifyTokenAndOnlyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({
        message: 'not allowed,only logged in user can access',
      });
    }
  });
};

//  verify token and authorization
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: 'not allowed,only logged in user or admin can access',
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
};
