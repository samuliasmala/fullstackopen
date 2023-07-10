const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: [
      {
        validator: (number) => /^[\d-]+$/.test(number),
        message: 'phone number must contain only numbers and a dash',
      },
      {
        validator: (number) => number.split('-').length === 2,
        message: 'phone number must contain exactly one dash (-)',
      },
      {
        validator: (number) => {
          const areaCodeNumbers = number.split('-')[0].length;
          return areaCodeNumbers === 2 || areaCodeNumbers === 3;
        },
        message: 'area code must contain 2 or 3 numbers',
      },
      {
        validator: (number) => number.length >= 8 + 1,
        message: 'phone number must contain at least 8 numbers',
      },
    ],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
