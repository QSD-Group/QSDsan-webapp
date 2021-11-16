//require('dotenv').config()
const Web3 = require('web3');

// eslint-disable-next-line no-unused-expressions
(async () => {
  const url = 'http://141.142.222.46:80' // process.env.ALCHEMY_API
  //const url = 'http://99c9-140-238-156-148.ngrok.io/'
  const web3 = await new Web3(url)
  const latestBlockNumber = await web3.eth.getBlockNumber()
  web3.eth.getBlock(latestBlockNumber).then(console.log)
})()

/*
(async () => {
  const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://141.142.222.46'));

  const subscription = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) return console.error(error);

    console.log('Successfully subscribed!', blockHeader);
  }).on('data', (blockHeader) => {
    console.log('data: ', blockHeader);
  });

  // unsubscribes the subscription
  subscription.unsubscribe((error, success) => {
    if (error) return console.error(error);

    console.log('Successfully unsubscribed!');
  });
})()
*/
