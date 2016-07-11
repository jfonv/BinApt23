/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Apartment from '../models/apartment';
// import Renter from '../models/renter';
import bodyValidator from '../validators/apartments/body';
import paramsValidator from '../validators/apartments/params';
// import bodyValidator from '../validators/bookmarks/body';
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
// // show
// router.get('/:id', paramsValidator, (req, res) => {
//   Bookmark.findById(req.params.id, (err, bookmark) => {
//     res.send({ bookmark });
//   });
// });
//


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
  // Apartment.findById(req.params.id, '_id name rent collectedRent renter', { new: true }, (err, apartment) => {
  //   Renter.findById(req.body.id, '_id name money', { new: true })
  //         .populate('apartment')
  //         .exec((err2, renterO) => {
  //           apartment.lease(renterO, () => {
  //             Renter.findById(req.body.id, '_id name money apartment')
  //             .populate('apartment')
  //             .exec((err4, renter) => {
  //               res.send({ apartment, renter });
  //             });
  //           });
  //         });
  // });
  Apartment.findById(req.params.id, '_id name rent collectedRent renter', { new: true }, (err, apartment) => {
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
