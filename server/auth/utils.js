const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');

const config = require('../api/config');
const { User } = require('../db/models');

const create = async (req, res, next) => {
  try {
    // Make sure all params are present
    const { signature, publicAddress } = req.body;
    if(!signature || !publicAddress) {
      res.status(400).send({
       error: 'Request requires signature and public address'
     });
    }
    // Grab the user, make sure one exists
    const user = await User.findOne({ where: { publicAddress } });
    if(!user) {
      res.status(401).send({
        error: `User with publicAddress ${publicAddress} not found in database`
      })
    };
    const msg = `I am signing my one-time nonce: ${user.nonce}`;
    // Verify the user signed the message
    const user = ellipticCurveVerification(signature, msg, user);
    // Generate a new nonce for the user, save
    const user = await generateNonce(user);
    // Create a jwt access token for the user
    const accessToken = await generateJwt(user);
    // Send back to the user
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

const ellipticCurveVerification = (signature, msg, user) => {
  // Hash the message
  const msgBuffer = ethUtil.toBuffer(msg);
  const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
  // Grab the signature parameters
  const signatureBuffer = ethUtil.toBuffer(signature);
  const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
  // Reverse engineer the public key
  const publicKey = ethUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  // Grab the address
  const addressBuffer = ethUtil.publicToAddress(publicKey);
  const address = ethUtil.bufferToHex(addressBuffer);
  // Signature verification is successful if address found matches publicAddress
  if(address.toLowerCase() === publicAddress.toLowerCase()) {
    return user;
  } else {
    res.status(401).send({
      error: 'Signature verification failed'
    })
  }
}

const generateNonce = async user => {
  user.nonce = Math.floor(Math.random() * 10000);
  return await user.save();
}

const generateJwt = user => {
  const promise = new Promise((resolve, reject) =>
    jwt.sign({
      payload: {
        id: user.id,
        publicAddress
      }
    },
    config.secret,
    null,
    (err, token) => {
      if(err) {
        return reject(err);
      }
      return resolve(token);
    })
  );
  return promise;
}

module.exports = create;
