const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide a name'] },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a confirmation password'],
    select: false,
    validate: {
      // this only works on SAVE/CREATE. NOT on the UPDATE functions !!!!
      validator: function (el) {
        // el contains this passwordConfirm field and this.password will contain the password field of the same document being created.
        return el === this.password;
      },
      message: "Passwords don't match",
    },
  },
  createdAt: {
    type: String,
    default: new Date(Date.now()).toISOString(),
  },
  image: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false },
  providers: [],
  loginAttempts: {
    type: Number,
    default: 1,
    minlength: [0, 'Number cannot be negative'],
    maxLength: [4, 'Cannot login more than 4 users'],
  },
  suppliers: [{ type: mongoose.Schema.ObjectId, ref: 'Supplier' }],
});

// creating a custom query middleware that will add a query to the find query to avoid filtering out the inactive users.
userSchema.query.bypassInactives = function () {
  this.bypassMiddleware = true;
  return this;
};

userSchema.pre(/^find/, function (next) {
  // check if the query is not bypassed. If bypassed then it will not filter out the inactive users.
  if (!this.bypassMiddleware) {
    console.log('Middleware is not bypassed');
    this.find({ active: { $ne: false } });
  }
  next();
});

userSchema.pre('save', async function (next) {
  // will only work if password has been modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // this works because requried field is only while passing the data to the function. Not necessary while saving in the Database.
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  // setting the time 1 sec before so that it is ensured that the token is generated before passwordChangedAt updates. This is done as safety as token generation may take some extra time.
  next();
});

//  This instance method will increment the user on every login attempt.
userSchema.methods.incLoginAttempts = function () {
  const maxLoginAttempts = 4;
  if (this.loginAttempts + 1 > maxLoginAttempts) {
    return Promise.reject(new Error('Max login attempts reached'));
  }
  return this.updateOne({ $inc: { loginAttempts: 1 } }).exec();
};

// These are the instance method that will be available to any document created.
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  // this.password will not work as select=false
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimeStamp;
    // changed the password after token generation. so jwt time is less (in milliseconds).
  }

  // false means not changed;
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  // 5 minutes = 10*60*1000 => time in milliseconds after generating token

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
