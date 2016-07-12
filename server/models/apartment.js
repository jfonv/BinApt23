/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len, no-param-reassign */
/* eslint-disable func-names, consistent-return */

import mongoose from 'mongoose';
// const Renter = require('./renter');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  sqft: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter' },
  dateCreated: { type: Date, default: Date.now },
  collectedRent: { type: Number, default: 0 },
});

schema.methods.lease = function (renterId, cb) {
  this.model('Renter').findById(renterId, (err, renter) => {
    console.log('line 21:', renter);
    if (this.rent > renter.money) {
      return cb();
    }

    renter.apartment = this;  // this: apartment
    this.renter = renter._id;
    this.save(() => {
      renter.apartment = this;
      renter.payRent(cb);
    });
  });
};

module.exports = mongoose.model('Apartment', schema);
