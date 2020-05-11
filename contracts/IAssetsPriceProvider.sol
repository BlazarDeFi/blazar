pragma solidity ^0.5.0;


/************
@title IAssetsPriceProvider interface
@notice An interface that specifies function used to query current assets price
*/

interface IAssetsPriceProvider {

  /**
  * @dev Provides current price of an asset denominated in USD
  * @param _asset the address of an asset(token) contract
  **/
  function getAssetPrice(address _asset) external view returns(uint256);

}
