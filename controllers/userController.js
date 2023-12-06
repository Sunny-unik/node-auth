import SendMail from '../services/mailer.js';
import userSchema from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpHelper from '../helper/otpHelper.js';

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

  static async createUser(data) {
    try {
      const hashPassword = await bcrypt.hash(data.password, 10);
      const schema = await new userSchema({ ...data, password: hashPassword });
      return await schema.save();
    } catch (err) {
      throw {
        error: err,
        TimeStamp: Date(),
        handlerLocation: 'UserController.createUser',
      };
    }
  }

  static verifyMailAddress(req, res) {
    const otp = otpHelper.getOtp();
    const userData = { ...req.body, otp };
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
      .then(async (info) => {
        try {
          const user = await UserController.createUser(userData)._doc;
          res.send({
            ...info,
            ...(user ? user : {}),
            message: 'Otp sent to your mail address, please check.',
          });
        } catch (err) {
          const exactError = err.handlerLocation
            ? err
            : {
                error: err,
                TimeStamp: Date(),
                handlerLocation: 'UserController.verifyMailAddress',
              };
          res.send(exactError);
        }
      })
      .catch((error) => {
        console.log(error);
        res.send({
          error: error,
          TimeStamp: Date(),
          handlerLocation: 'UserController.verifyMailAddress.SendMail',
        });
      });
  }

  static async verifyUser(req, res) {
    try {
      const user = await userSchema.updateOne(
        { $and: [{ otp: req.body.otp }, { _id: req.body.id }] },
        { $unset: { otp: 1 } }
      );
      res.send({ data: user });
    } catch (err) {
      res.send({
        error: err,
        TimeStamp: Date(),
        handlerLocation: 'UserController.verifyUser',
      });
    }
  }

  static async loginUser(req, res) {
    const { email, name, password } = req.body;

    try {
      const payload = await userSchema.findOne({
        $or: [{ email: email }, { name: name }],
      });
      !payload && res.status(404).send('User not found');

      const match = await bcrypt.compare(password, payload.password);
      const accessToken = jwt.sign(
        JSON.parse(JSON.stringify(payload)),
        process.env.TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      if (match)
        res
          .cookie('authToken', accessToken, {
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          })
          .send({ data: payload, message: 'Login Success' });
      else res.send({ message: 'Wrong Password' });
    } catch (err) {
      res.send({ error: err });
    }
  }
}
