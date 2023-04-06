import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import BasicDutchAuctionArtifact from '../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';

const StyledDeployContractButton = styled.button`
width: 180px;
height: 2rem;
border-radius: 1rem;
border-color: blue;
cursor: pointer;
place-self: center;
`;

const StyledContractInfo = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
grid-template-rows: 1fr 1fr;
grid-gap: 1rem;
`;

const StyledLabel = styled.label`
font-weight: bold;
`;

const StyledInput = styled.input`
padding: 0.4rem 0.6rem;
line-height: 2fr;
`;

const StyledButton = styled.button`
width: 150px;
height: 2rem;
border-radius: 1rem;
border-color: blue;
cursor: pointer;
place-self: center;
`;

export function DutchAuction(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [auctionContract, setAuctionContract] = useState<Contract>();
  const [reservePrice, setReservePrice] = useState<string>('');
  const [numBlocksAuctionOpen, setNumBlocksAuctionOpen] = useState<string>('');
  const [offerPriceDecrement, setOfferPriceDecrement] = useState<string>('');
  const [bidValue, setBidValue] = useState<string>('');
  const [contractAddr, setContractAddr] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [initialPrice, setInitialPrice] = useState<string>('');
  const [winner, setWinner] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (auctionContract || !signer) {
      return;
    }

    async function deployAuctionContract(signer: Signer): Promise<void> {
      const Auction = new ethers.ContractFactory(
        BasicDutchAuctionArtifact.abi,
        BasicDutchAuctionArtifact.bytecode,
        signer
      );

      try {
        const reservePriceNum = parseInt(reservePrice);
        const numBlocksAuctionOpenNum = parseInt(numBlocksAuctionOpen);
        const offerPriceDecrementNum = parseInt(offerPriceDecrement);

        const auction = await Auction.deploy(
          reservePriceNum,
          numBlocksAuctionOpenNum,
          offerPriceDecrementNum
        );

        await auction.deployed();

        const auctionAddress = auction.address;

        setAuctionContract(auction);
        window.alert(`Auction deployed to: ${auction.address}`);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployAuctionContract(signer);
  }

  function handleBidSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!auctionContract) {
      window.alert('Undefined auctionContract');
      return;
    }

    if (!bidValue) {
      window.alert('Bid value cannot be empty');
      return;
    }

    async function submitBid(auctionContract: Contract): Promise<void> {
      event.preventDefault();

      if (!signer) {
        window.alert('Signer is not available');
        return;
      }

      try {
        const value = ethers.utils.parseEther(bidValue);

        const _auctionContract = new Contract(
          auctionContract.address,
          BasicDutchAuctionArtifact.abi,
          signer
        );

        const tx = await _auctionContract.connect(signer).bid({ value, gasLimit: ethers.BigNumber.from("1000000") });
        await tx.wait();

        setWinner(await _auctionContract.winner());

        window.alert('Bid submitted successfully!');
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }
    submitBid(auctionContract);
  }

  async function handleShowInfo(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();

    const _auctionContract = new Contract(
      contractAddr,
      BasicDutchAuctionArtifact.abi,
      signer
    );

    if (auctionContract) {
      setContractAddr(auctionContract.address);

      try {
        const initialPrice = await auctionContract.initialPrice();
        const owner = await auctionContract.seller();

        setInitialPrice(initialPrice.toString());
        setOwner(owner);
      } catch (error) {
        console.error("Error fetching initialPrice and seller:", error);
      }
    }
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void {
    event.preventDefault();
    setter(event.target.value);
  }

  return (
    <>
      <StyledContractInfo>
        <StyledLabel htmlFor="reservePrice">Reserve Price:</StyledLabel>
        <StyledInput
          id="reservePrice"
          type="text"
          placeholder="Reserve Price"
          onChange={(event) => handleInputChange(event, setReservePrice)}
        ></StyledInput>
        <StyledLabel htmlFor="numBlocksAuctionOpen">
          Number of Blocks Auction Open:
        </StyledLabel>
        <StyledInput
          id="numBlocksAuctionOpen"
          type="text"
          placeholder="Number of Blocks Auction Open"
          onChange={(event) =>
            handleInputChange(event, setNumBlocksAuctionOpen)
          }
        ></StyledInput>
        <StyledLabel htmlFor="offerPriceDecrement">
          Offer Price Decrement:
        </StyledLabel>
        <StyledInput
          id="offerPriceDecrement"
          type="text"
          placeholder="Offer Price Decrement"
          onChange={(event) =>
            handleInputChange(event, setOfferPriceDecrement)
          }
        ></StyledInput>
      </StyledContractInfo>
      <StyledDeployContractButton
        disabled={!active}
        style={{
          cursor: !active ? 'not-allowed' : 'pointer',
          borderColor: !active ? 'unset' : 'blue'
        }}
        onClick={handleDeployContract}
      >
        Deploy Auction Contract
      </StyledDeployContractButton>
      <SectionDivider />
      <StyledContractInfo>
        <StyledLabel htmlFor="contractAddr">Contract Address:</StyledLabel>
        <StyledInput
          id="contractAddr"
          type="text"
          placeholder="Contract Address"
          value={contractAddr}
          readOnly
        />
        <StyledLabel htmlFor="initialPrice">Initial Price:</StyledLabel>
        <StyledInput
          id="initialPrice"
          type="text"
          placeholder="Initial Price"
          value={initialPrice}
          readOnly
        />
        <StyledLabel htmlFor="owner">Owner Address:</StyledLabel>
        <StyledInput
          id="owner"
          type="text"
          placeholder="Owner Address"
          value={owner}
          readOnly
        />
      </StyledContractInfo>
      <StyledButton
        disabled={!active || !auctionContract ? true : false}
        style={{
          cursor: !active || !auctionContract ? 'not-allowed' : 'pointer',
          borderColor: !active || !auctionContract ? 'unset' : 'blue'
        }}
        onClick={handleShowInfo}
      >
        Show Info
      </StyledButton>
      <SectionDivider />
      <StyledContractInfo>
        <StyledLabel htmlFor="bidValue">Bid Value:</StyledLabel>
        <StyledInput
          id="bidValue"
          type="text"
          placeholder="Bid Value"
          onChange={(event) => handleInputChange(event, setBidValue)}
        ></StyledInput>
      </StyledContractInfo>
      <StyledButton
        disabled={!active || !auctionContract ? true : false}
        style={{
          cursor: !active || !auctionContract ? 'not-allowed' : 'pointer',
          borderColor: !active || !auctionContract ? 'unset' : 'blue'
        }}
        onClick={handleBidSubmit}
      >
        Submit Bid:
      </StyledButton>
      <StyledContractInfo>
      <StyledLabel htmlFor="winner">
        Winner:
      </StyledLabel>
      <StyledInput
        id="bidValue"
        type="text"
        placeholder="Winner address"
        value={winner}
        readOnly
      ></StyledInput>
      </StyledContractInfo>
    </>
  );
}