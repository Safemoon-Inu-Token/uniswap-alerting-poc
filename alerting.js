// Dependencies
const fetch = require("node-fetch");

// Config
const uniswap = `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`
const query = `
{
    pairs(orderBy: createdAtTimestamp, orderDirection: desc, first: 1) {
      id,
      token0 {
        id,
        name
      },
      token1 {
        id,
        name
      },
      token0Price,
      token1Price,
      reserveUSD
    }
}`;
const refreshFrequencySeconds = 5000;

// Program methods
var latestPair = null;

const getLatestPair = () => {
    console.log('Refreshing...');

    fetch(uniswap, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({query: query})
    })
    .then(r => r.json())
    .then(data => checkPair(data.data.pairs[0]));
};

const checkPair = (pair) => {
    const samePair = latestPair === pair.id;

    if (samePair)
        return;

    console.log('data returned:', JSON.stringify(pair, null, 2));
    console.log("\007");
    latestPair = pair.id;
};

const main = () => {
    setInterval(() => {
        getLatestPair();
    }, refreshFrequencySeconds);
};

// Entrypoint
main();