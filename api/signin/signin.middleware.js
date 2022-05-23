const jwt = require('jsonwebtoken');
const config = require('../../config');

// Generate test token

// console.log(jwt.sign(
//   {
//     roomId: 1,
//     userId: 1
//   },
//   config.jwtSecret,
//   {
//     expiresIn: '1d',
//     algorithm: 'HS256'
//   }
// ));

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No authorization' });

    req.user = jwt.verify(token, config.jwtSecret, { algorithm: 'HS256' });

    next();
  } catch (e) {
    res.status(401).json({ message: 'No authorization' });
  }
}