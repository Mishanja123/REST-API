const { model, Schema } = require('mongoose');
const { genSalt, hash, compare } = require('bcrypt');
const crypto = require('crypto');
const uuid = require('uuid').v4;


const {userSubEnum} = require('../constants');


const userSchema = new Schema ({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  subscription: {
    type: String,
    enum: Object.values(userSubEnum),
    default: userSubEnum.STARTER,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  token: String,
  avatarURL: String,
}, {
    versionKey: false,
});

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
    this.verificationToken = uuid();
    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=retro`;
  }

  if (!this.isModified('password')) return next();

  const salt = await genSalt(10);
  this.password = await hash(this. password, salt); 

  next();
});

userSchema.methods.checkPassword = (candidate, passwordHash) => compare(candidate, passwordHash);

const User = model('User', userSchema);

module.exports = User;