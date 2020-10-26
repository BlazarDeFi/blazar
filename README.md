# Overview

Blazar is the interest rate stability protocol for decentralized financial applications. Deposit and borrow instantly at a fixed rate and a fixed term. Built on Ethereum.


- Read about Blazar's [minimum viable model](https://medium.com/blazar-defi/defis-fixed-rate-lending-primitive-83428d550d8e)
- Blazar was one of the winners of the ETHLondon hackathon. Read the <a href="https://devpost.com/software/daj-get-your-future-interest-right-now" target="_blank">Devpost write-up</a> and watch the [winner's presentation](https://www.youtube.com/watch?v=6BD6vqvY5RQ&list=PLXzKMXK2aHh6pUla8qIW6_9gPSZOXyeIS&index=4&t=0s) 
- <a href="https://blazar.now.sh" target="_blank">Live demo</a> (requires metamask connected to the Kovan Ethereum testnet)

<br/>
<img src="https://blazar.xyz/img/section-2/deposit-ipad.png" width=500/>


# Building

To build the application please install first all of the dependencies by running:

    npm install

All of the smart-contracts tests are executed on the buidler-evm environment and can be started by typing:

    npm run test

Make sure that all of the smart-contracts are compiled before trying to deploy the dApp:

    npx truffle compile

To deploy the front-end on your local machine please type in your command line:

    npm run dev


# Protocol description

Blazar is a decentralised lending pool powered by an automated market-maker that gives depositors a fixed returns, and allows borrowers to take out instant fixed-rate loans.

Blazar uses fixed terms. Unlike variable rate protocols that are perpetual by nature, every user Blazar user must choose a maturity date. Depositors lock their deposit until their chosen date, and borrowers pay back loans at theirs.

Blazar therefore meets two imperatives: unfailingly repaying depositors at maturity and providing instant loans to borrowers. It achieves this by addressing any short-term mismatch between deposits and loans by putting unproductive deposits to work in variable pools at the best available rate, and drawing liquidity from variable pools to provide loans when its own pool is insufficient.

Here is an illustration of these actions:

<img src="https://miro.medium.com/max/1540/1*z2EubbVT7NreJKGP58tpuQ.png" width=600/>
