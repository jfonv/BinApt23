/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  name: joi.string().required(),
  sqft: joi.number().greater(400).required(),
  bedrooms: joi.number().min(1).required(),
  floor: joi.number().min(0).max(99)
         .required(),
  rent: joi.number().min(400).max(20000)
        .required(),
  sort: joi.object(),
  collectedRent: joi.number().default(0),
  renter: joi.object(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);
  console.log(req.body);
  if (result.error) {
    console.log('this is error: ', result.error.message);
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    console.log('no error!');
    next();
  }
};
