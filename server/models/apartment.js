/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len, no-param-reassign */
/* eslint-disable func-names, consistent-return */

import mongoose from 'mongoose';
const Renter = require('./renter');
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
  Renter.findById(renterId, (err, renter) => {
    if (this.rent > renter.money) {
      cb();
    }
    renter.apartment = this._id;  // this: apartment
    this.renter = renter._id;
    this.save(() => {
      renter.payRent(cb);
    });
  });
};

module.exports = mongoose.model('Apartment', schema);
