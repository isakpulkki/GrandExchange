const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  passwordHash: String,

  admin: {
    type: Boolean,
    default: false,
  },
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
