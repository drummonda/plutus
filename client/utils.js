export const handleSignMessage = (web3, user) => {
  const { publicAddress, nonce } = user;
  return new Promise((resolve, reject) =>
    web3.eth.personal.sign(
      web3.utils.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
      publicAddress,
      (err, signature) => {
        if (err) return reject(err);
        return resolve({ publicAddress, signature });
      }
    )
  );
}
