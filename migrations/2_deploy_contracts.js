const PeerTokenCrowdsale = artifacts.require('./PeerTokenCrowdsale.sol')
const PeerToken = artifacts.require('./PeerToken.sol')
const BigNumber = web3.utils.BN;

module.exports = async (deployer, network, accounts) => {
  const openingTime = web3.eth.getBlock('latest').timeStamp + 2; // 2 secs in future
  const closingTime = openingTime + 86400 * 20; // 20 days
  const rate = new BigNumber(1000);
  const wallet = accounts[1];

  const PeerTokenDeployed = await deployer.deploy(PeerToken);
  const PeerTokenCrowdsaleDeployed = await deployer.deploy(
                                          PeerTokenCrowdsale,
                                          openingTime,
                                          closingTime,
                                          rate,
                                          wallet,
                                          PeerTokenDeployed.address
                                      );
}
