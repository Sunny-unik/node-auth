import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send('Session not found');
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    req.decoded = { email: decode.email, name: decode.name, _id: decode._id };
    next();
  } catch (error) /* istanbul ignore next */ {
    res.clearCookie('authToken').status(401).send(error);
    return;
  }
}
