import userSchema from '../models/userSchema.js';
import bcrypt from 'bcrypt';

export default class UserController {
  static async getUsers(req, res) {
    await userSchema
      .find()
      .select(req.body.query ? req.body.query : '_id name email password')
      .then(users => res.send({ total: users.length, data: users }))
      .catch(err => res.send({ ...err, TimeStamp: new Date(), handlerLocation: 'UserController.getUser' }));
  }

  static async createUser(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await new userSchema({ ...req.body, password: hashedPassword });
      await user.save();
      res.send({ data: user });
    } catch (err) {
      res.send({ ...err, TimeStamp: new Date(), handlerLocation: 'UserController.createUser' });
    }
  }
}
