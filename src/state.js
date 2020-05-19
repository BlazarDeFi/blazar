/* eslint-disable */
let state = {
  currencies: {
    "eth": {
      icon: 'https://testnet.aave.com/static/media/eth.1a64eee6.svg',
      title: 'ETH',
      rate: 0,
      step: 0.01,
      precision: 3,
      balance: 0
    },
    "dai": {
      icon: 'https://testnet.aave.com/static/media/dai.59d423e0.svg',
      code: 'dai',
      title: 'DAI',
      rate: 0,
      step: 0.1,
      precision: 2,
      balance: 0,
      borrowingRate: 0
    }
  },
  myActions: []
};

export default state;
