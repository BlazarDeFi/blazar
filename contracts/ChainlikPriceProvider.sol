pragma solidity ^0.5.0;

import "./IAssetsPriceProvider.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./chainlink/IAggregatorInterface.sol";


/************
@title ChainlinkPriceProvider
@notice An assets price provider linked to chainlink oracle protocol
*/

contract ChainlinkPriceProvider is IAssetsPriceProvider, Ownable {

  mapping(address => AggregatorInterface) aggregators;

  function setChainlinkAggregator(address _asset, AggregatorInterface _aggregator) onlyOwner external {
    aggregators[_asset] = _aggregator;
  }

  /**
  * @dev Provides current price of an asset denominated in USD
  * @param _asset the address of an asset(token) contract
  **/
  function getAssetPrice(address _asset) external view returns(uint256) {
    AggregatorInterface aggregator = aggregators[_asset];
    require(address(aggregator) != address(0x0), 'There is no aggregator for a given asset');
    int256 price = aggregator.latestAnswer();
    require(price > 0, 'Invalid price from chainlink aggregator (negative value)');
    return uint256(price);
  }

}
