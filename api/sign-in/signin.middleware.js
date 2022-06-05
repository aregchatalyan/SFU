const jwt = require('jsonwebtoken');
const config = require('../../config');

// Generate test token

// console.log(jwt.sign(
//   {
//     userId: 2
//   },
//   config.jwtSecret,
//   {
//     expiresIn: '30d',
//     algorithm: 'HS256'
//   }
// ));

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No authorization' });

    jwt.verify(token, config.jwtSecret, { algorithm: 'HS256' }, (e, t) => req.room = t);

    next();
  } catch (e) {
    res.status(401).json({ message: 'No authorization' });
  }
}