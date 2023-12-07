<div align="center">

# node-auth

> This project is describing that how to implementing an authentication system using Node.js.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Sunny-unik/node-auth)

</div>

## Key Features

- Encrypted Passwords
- Email verification via OTP
- Secure authentication tokens
- Session management

## Tech Stack

- Express as server
- MongoDB for store database
- Nodemailer for sending mails

## Setup Environment Variables

- Create a `.env` file.
- Copy ENVs from `.env.example` file and paste them in `.env` file.
- Replace `your_App_Password` to your actual [App_Password](https://support.google.com/mail/answer/185833?hl=en) in `.env` file.

### ENV for setup test (run once then look for test script)

- **bash**: `set NODE_OPTIONS=--experimental-vm-modules && npx jest`
- **powershell**: `$env:NODE_OPTIONS="--experimental-vm-modules"; npx jest`
- **cmd**: `set NODE_OPTIONS=--experimental-vm-modules && npx jest`

## ⚖️ LICENSE

MIT © [Sunny-unik/node-auth](LICENSE)
