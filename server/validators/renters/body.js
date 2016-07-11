/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  name: joi.string().required().regex(/[a-zA-Z]+$/),
  money: joi.number().greater(1200).required(),
  collectedRent: joi.number().default(0),
  apartment: joi.object(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    next();
  }
};
