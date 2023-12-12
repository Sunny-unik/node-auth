import SendMail from '../utils/mailer.js';
import userSchema from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getOtp } from '../utils/helpers.js';

export default class UserController {
  static async getUsers(query) {
    let result = {};
    await userSchema
      .find()
      .select(query ? query : '_id name email password')
      .then((users) => {
        result = { total: users.length, data: users };
      })
      .catch((error) => {
        result = {
          error,
          TimeStamp: Date(),
          handlerLocation: 'UserController.getUser',
        };
      });
    return result;
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

  static async verifyMailAddress(body) {
    let result = {};
    const otp = getOtp();
    const userData = { ...body, otp };
    await SendMail(
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
          const user = await UserController.createUser(userData);
          result = {
            ...info,
            ...(user ? { id: user._id } : {}),
            message: 'Otp sent to your mail address, please check.',
          };
        } catch (err) {
          result = err.handlerLocation
            ? err
            : {
                error: err,
                TimeStamp: Date(),
                handlerLocation: 'UserController.verifyMailAddress',
              };
        }
      })
      .catch((error) => {
        console.log(error);
        result = {
          error: error,
          TimeStamp: Date(),
          handlerLocation: 'UserController.verifyMailAddress.SendMail',
        };
      });
    return result;
  }

  static async verifyUser(otp, id) {
    let result = {};
    try {
      const user = await userSchema.updateOne(
        { $and: [{ otp: otp }, { _id: id }] },
        { $unset: { otp: 1 } }
      );
      result = {
        data: user,
        error: user.modifiedCount
          ? undefined
          : { customMessage: 'Invalid OTP' },
      };
    } catch (err) {
      result = {
        error: err,
        TimeStamp: Date(),
        handlerLocation: 'UserController.verifyUser',
      };
    }
    return result;
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
      else res.send({ error: { customMessage: 'Wrong Password' } });
    } catch (err) {
      res.send({ error: err });
    }
  }
}
