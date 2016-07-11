/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Renter from '../models/renter';
// import Apartment from '../models/apartment';
// import bodyValidator from '../validators/apartments/body';
import paramsValidator from '../validators/renters/params';
import bodyValidator from '../validators/renters/body';
// import queryValidator from '../validators/bookmarks/query';
// import paramsValidator from '../validators/bookmarks/params';
const router = module.exports = express.Router();

// // // index
// router.get('/', (req, res) => {
//   Apartment.find(res.locals.filter)
//           .sort(res.locals.sort)
//           .limit(res.locals.limit)
//           .skip(res.locals.skip)
//           .exec((err, bookmarks) => {
//             res.send({ bookmarks });
//           });
// });

//

// create
router.post('/', bodyValidator, (req, res) => {
  Renter.create(res.locals, (err, renter) => {
    res.send({ renter });
  });
});

// get
router.get('/:id', paramsValidator, (req, res) => {
  Renter.findById(req.params.id, (err, renter) => {
    res.send({ renter });
  });
});

router.get('/', (req, res) => {
  Renter.find({}, (err, renters) => {
    res.send({ renters });
  });
});

// update
router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  console.log('req.params.id: ', req.params.id);
  Renter.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, renter) => {
    res.send({ renter });
  });
});

// delete
router.delete('/:id', paramsValidator, (req, res) => {
  Renter.findByIdAndRemove(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ id: renter._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});
