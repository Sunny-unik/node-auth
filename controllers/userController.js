import SendMail from '../services/mailer.js';
import userSchema from '../models/userSchema.js';
import bcrypt from 'bcrypt';

const randomNum = Math.floor(Math.random() * 1000000).toString();
const otp =
  randomNum.length < 6
    ? randomNum + Math.floor(Math.random() * 10).toString()
    : randomNum;

export default class UserController {
  static async getUsers(req, res) {
    await userSchema
      .find()
      .select(req.body.query ? req.body.query : '_id name email password')
      .then((users) => res.send({ total: users.length, data: users }))
      .catch((err) =>
        res.send({
          error: err,
          TimeStamp: Date(),
          handlerLocation: 'UserController.getUser',
        })
      );
  }

  static verifyMailAddress(req, res) {
    const userData = req.body;
    console.log(otp);

    SendMail(
      process.env.APP_ID,
      process.env.APP_PASSWORD,
      userData.email,
      'Otp for verifying your email address',
      `<h1>Node-auth</h1><br>
      <h3> Your otp is ${otp} </h3><br>
      <h5>We hope you find our service cool.</h5><br>`
    )
      .then((info) =>
        res.send({
          ...info,
          message: 'Otp sent to your mail address, please check.',
        })
      )
      .catch((err) =>
        res.send({
          error: err,
          TimeStamp: Date(),
          handlerLocation: 'UserController.getUser',
        })
      );
  }

  static async createUser(req, res) {
    try {
      if (otp !== req.body.otp) return res.send({ message: 'Incorrect otp!' });

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await new userSchema({
        ...req.body,
        password: hashedPassword,
      });

      await user.save();
      res.send({ data: user });
    } catch (error) {
      res.send({
        error: error,
        TimeStamp: Date(),
        handlerLocation: 'UserController.createUser',
      });
    }
  }
}
