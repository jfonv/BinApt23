/* eslint-disable func-names, no-console,
   consistent-return, arrow-body-style, no-underscore-dangle */

import mongoose from 'mongoose';
// const Apartment = require('./apartment');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, required: true },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment' },
  dateCreated: { type: Date, default: Date.now },
});

schema.methods.payRent = function (cb) {
  // console.log('this line 15:', this);
  // console.log('apartment:', this.apartment);

  if (this.money < this.apartment.rent) {
    return cb();
  }

  this.money -= this.apartment.rent;
  this.apartment.collectedRent += this.apartment.rent;

  const apt = this.apartment;
  const renter = this;
  // console.log('this:', this);
  // console.log('apartment:', this.apartment);
  // apartment.save(() => {
  apt.save(() => {
    // console.log('this is (ln29):', this);
    console.log('this (apt ln 33):', this);
    renter.apartment = apt._id;
    console.log('renter (apt ln 35):', renter);
    renter.save((err, renter2) => {
    // console.log('this is (ln31):', this);
      console.log('renter (apt ln 38):', err.message);
      console.log('renter (apt ln 39):', renter2);
      return cb();
    });
  });
  // });
};


module.exports = mongoose.model('Renter', schema);
