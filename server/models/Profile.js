const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const profileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  villagers: [ {
    type: Schema.Types.ObjectId,
    ref: 'Villager',
  },],
});

// set up pre-save middleware to create password
profileSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
profileSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `villagerCount` with the number of saved villagers we have
profileSchema.virtual('villagerCount').get(function () {
  return this.villagers.length;
});
const Profile = model('Profile', profileSchema);

module.exports = Profile;




