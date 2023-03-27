import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [deployedContractAddress, setDeployedContractAddress] = useState('');
  const [auctionAddress, setAuctionAddress] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [bidResult, setBidResult] = useState('');

  const [constructorParams, setConstructorParams] = useState({
    param1: '',
    param2: '',
    param3: '',
    param4: '',
    param5: '',
  });

  const [AuctionId, setAuctionId] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConstructorParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const deployContract = async () => {
    // Implement contract deployment logic here
  };

  const showAuctionInfo = async () => {
    // Implement logic to show auction info here
  };

  const submitBid = async () => {
    // Implement logic to submit a bid here
  };

  return (
    <div className="App">
      <h1>Basic Dutch Auction</h1>

      <div>
        <h2>Deployment</h2>
        <div>NFT Contract Address:
          <input
            type="text"
            name="NFTContractAddress"
            value={constructorParams.param1}
            onChange={handleInputChange}
            placeholder="Please input"
          />
        </div>
        <div>NFT Id:
          <input
            type="text"
            name="NFTId"
            value={constructorParams.param2}
            onChange={handleInputChange}
            placeholder="Please input"
          />
        </div>
        <div>Reserve Price:
          <input
            type="text"
            name="ReservePrice"
            value={constructorParams.param3}
            onChange={handleInputChange}
            placeholder="Please input"
          />
        </div>
        <div>Num Blocks Auction Open:
          <input
            type="text"
            name="NumBlocksAuctionOpen"
            value={constructorParams.param4}
            onChange={handleInputChange}
            placeholder="Please input"
          />
        </div>
        <div>Offer Price Decrement:
          <input
            type="text"
            name="OfferPriceDecrement"
            value={constructorParams.param5}
            onChange={handleInputChange}
            placeholder="Please input"
          />
        </div>
        <button onClick={deployContract}>Deploy</button>
        {deployedContractAddress && (
          <p>Deployed contract address: {deployedContractAddress}</p>
        )}
      </div>

      <div>
        <h2>Look up info on an auction</h2>
        <div>
          Address
          <input
            type="text"
            name="AuctionContractInfo"
            placeholder="Please input"></input>
        </div>
        <button>Show Info</button>
      </div>

      <div>
        <h2>Submit a bid</h2>
        <div>Address:
          <input
            type="text"
            name="BidAddress"
            placeholder="Please input"
          >
          </input>
        </div>
        <div>Amount:
          <input
            type="text"
            name="BidAmount"
            placeholder="Please input"
          >
          </input>
        </div>
        <button>Bid</button>
      </div>
    </div>
  );
}

export default App;
