const jwt = require('jsonwebtoken');

const auth = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new Error('Authentication token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = auth; 