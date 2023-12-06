export default class otpHelper {
  static getOtp() {
    const otp = Math.floor(Math.random() * 1000000).toString();
    return +(otp.length < 6 ? otp + Math.floor(Math.random() * 10) : otp);
  }

  static async matchOtp() {}
}
