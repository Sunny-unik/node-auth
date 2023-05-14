import userSchema from '../models/userSchema';

export default class UserController {
  static async getUsers(req, res) {
    await userSchema
      .find()
      .select(req.body.query ? req.body.query : '_id name email password')
      .then(users => res.json({ total: users.length, data: users }))
      .catch(err => console.log(err));
  }

  static async createUser(req, res) {
    const user = await new userSchema(req.body);
    user
      .save()
      .then(user => res.status(200).json({ data: user }))
      .catch(err => console.log(err));
  }
}
