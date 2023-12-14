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
      .select(query ? query : '_id name email')
      .then((users) => {
        result = { total: users.length, data: users };
      })
      .catch(
        /* istanbul ignore next */ (error) => {
          result = {
            error,
            TimeStamp: Date(),
            handlerLocation: 'UserController.getUsers',
          };
        }
      );
    return result;
  }

  static async getUser(query, id) {
    let result = {};
    await userSchema
      .findOne({ _id: id })
      .select(query ? query : '_id name email')
      .then((user) => (result = { data: user }))
      .catch(
        /* istanbul ignore next */ (error) => {
          result = {
            error,
            TimeStamp: Date(),
            handlerLocation: 'UserController.getUser',
          };
        }
      );
    return result;
  }

  static async createUser(data) {
    try {
      const hashPassword = await bcrypt.hash(data.password, 10);
      const schema = await new userSchema({ ...data, password: hashPassword });
      return await schema.save();
    } catch (err) /* istanbul ignore next */ {
      throw {
        error: err,
        TimeStamp: Date(),
        handlerLocation: 'UserController.createUser',
      };
    }
  }

  static async verifyMailAddress(body) {
    try {
      const isEmailExist = await userSchema.findOne({ email: body.email });
      if (isEmailExist)
        return { error: { customMessage: 'Email is already exists' } };
    } catch (error) /* istanbul ignore next */ {
      return {
        error,
        TimeStamp: Date(),
        handlerLocation: 'UserController.verifyMailAddress.findOne',
      };
    }
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
        } catch (err) /* istanbul ignore next */ {
          result = err.handlerLocation
            ? err
            : {
                error: err,
                TimeStamp: Date(),
                handlerLocation: 'UserController.verifyMailAddress',
              };
        }
      })
      .catch(
        /* istanbul ignore next */ (error) => {
          console.log(error);
          result = {
            error: error,
            TimeStamp: Date(),
            handlerLocation: 'UserController.verifyMailAddress.SendMail',
          };
        }
      );
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
    } catch (err) /* istanbul ignore next */ {
      result = {
        error: err,
        TimeStamp: Date(),
        handlerLocation: 'UserController.verifyUser',
      };
    }
    return result;
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) return res.status(400).send({ message: 'Invalid Email' });
      const payload = await userSchema.findOne({ email: email });
      if (!payload) return res.status(404).send({ message: 'User not found' });

      if (await bcrypt.compare(password, payload.password)) {
        const accessToken = jwt.sign(
          JSON.parse(JSON.stringify(payload)),
          process.env.TOKEN_SECRET,
          { expiresIn: '7d' }
        );
        const cookieOptions = {
          sameSite: 'strict',
          path: '/',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
        const data = { ...payload._doc, password: undefined };
        res
          .cookie('authToken', accessToken, cookieOptions)
          .send({ data, message: 'Login Success' });
      } else res.status(400).send({ message: 'Wrong Password' });
    } catch (err) /* istanbul ignore next */ {
      res.status(500).send({
        error: err,
        TimeStamp: Date(),
        handlerLocation: 'UserController.loginUser',
      });
    }
  }

  static logoutUser(_req, res) {
    try {
      res.clearCookie('authToken').send({ message: 'Logout Successful' });
    } catch (error) /* istanbul ignore next */ {
      console.log(error);
      res.status(500).send({ error: { message: 'Internal Server Error' } });
    }
  }

  static async deleteUser(userId) {
    if (!userId) return { error: { customMessage: "User's _id is required!" } };
    try {
      const result = await userSchema.deleteOne({ _id: userId });
      return result.deletedCount
        ? { data: result, message: 'User Deleted' }
        : { data: result, message: 'User not found' };
    } catch (error) /* istanbul ignore next */ {
      return {
        error,
        handlerLocation: 'UserController.deleteUser',
        TimeStamp: Date(),
      };
    }
  }
}
