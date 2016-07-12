/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Apartment from '../models/apartment';
// import Renter from '../models/renter';
import bodyValidator from '../validators/apartments/body';
import paramsValidator from '../validators/apartments/params';

const router = module.exports = express.Router();

// create
router.post('/', bodyValidator, (req, res) => {
  Apartment.create(res.locals, (err, apartment) => {
    res.send({ apartment });
  });
});

router.get('/', (req, res) => {
  Apartment.find({}, (err, apartments) => {
    res.send({ apartments });
  });
});


// lease
router.put('/:id/lease', paramsValidator, (req, res) => {
  Apartment.findById(req.params.id, '_id rent collectedRent renter', { new: true }, (err, apartment) => {
    apartment.lease(req.body.renter_id, () => {
      res.send({});
    });
  });
});

// update
router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  Apartment.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, apartment) => {
    res.send({ apartment });
  });
});

// delete
router.delete('/:id', paramsValidator, (req, res) => {
  Apartment.findByIdAndRemove(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ id: apartment._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});
