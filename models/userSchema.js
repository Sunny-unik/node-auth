import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    minLength: [2, 'Name is too short!'],
    maxLength: 55,
    required: true,
  },
  password: { type: String, required: true },
  email: { type: String, minLength: 5, maxLength: 50, required: true },
});

export default mongoose.model('users', userSchema);
