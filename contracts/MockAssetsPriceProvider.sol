pragma solidity ^0.5.0;

import "./IAssetsPriceProvider.sol";


/************
@title IAssetsPriceProvider interface
@notice A mock implementation of an assets price provider
*/

contract MockAssetsPriceProvider is IAssetsPriceProvider {

  mapping(address => uint256) prices;

  function setAssetPrice(address _asset, uint256 _price) external {
    prices[_asset] = _price;
  }

  /**
  * @dev Provides current price of an asset denominated in USD
  * @param _asset the address of an asset(token) contract
  **/
  function getAssetPrice(address _asset) external view returns(uint256) {
    return prices[_asset];
  }

}
