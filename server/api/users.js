const express = require('express');
const router = express.Router();
const config = require('./config');
const jwt = require('express-jwt');
const secret = jwt({ secret: config.secret });
const { User } = require('../db/models');
module.exports = router;

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    const whereClause = req.query
      && req.query.publicAddress
      && {
        where: { publicAddress: req.query.publicAddress }
      };
    const users = await User.findAll(whereClause);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:userId
router.get('/:userId', secret, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if(req.user.payload.id !== Number(userId)) {
      res.status(401).send({ error: 'You can only access yourself!' });
    }
    const user = await User.findById(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST /api/users
router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/:userId
router.patch('/:userId', secret, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if(req.user.payload.id !== Number(userId)) {
      res.status(401).send({ error: 'You can only access yourself' })
    }
    const user = await User.findById(userId);
    const updatedUser = await user.update({
      username: req.body.username,
    });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
})
