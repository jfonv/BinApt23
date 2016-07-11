/* eslint-disable func-names, no-console */

import mongoose from 'mongoose';
const Apartment = require('./apartment');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, required: true },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment' },
  dateCreated: { type: Date, default: Date.now },
});

schema.methods.payRent = function (cb) {
  console.log('apartment: ', Apartment);
  console.log('look here mom:', this);

  Apartment.findById(this.apartment, (err, apartment) => {
    console.log('apartment: ', apartment);
    cb();
  });
          //  .exec((err, apartment) => {
          //    if (this.money > this.apartment.rent) return cb();
          //    this.money -= apartment.rent;
          //    apartment.collectedRent += apartment.rent;
           //
          //    apartment.save(() => {
          //      this.save(() => {
          //        cb();
          //      });
          //    });
          //  });
};


module.exports = mongoose.model('Renter', schema);
