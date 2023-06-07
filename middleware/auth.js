import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send('Session not found');
    const decode = jwt.verify(token, 'secretKey');
    req.decoded = decode;
    next();
  } catch (error) {
    res.clearCookie('authToken').status(401).send(error);
    return;
  }
}
