/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface BasicDutchAuctionInterface extends utils.Interface {
  functions: {
    "bid()": FunctionFragment;
    "blockStart()": FunctionFragment;
    "currentPrice()": FunctionFragment;
    "finalize(uint256)": FunctionFragment;
    "getStatus()": FunctionFragment;
    "getWinner()": FunctionFragment;
    "initialPrice()": FunctionFragment;
    "numBlocksAuctionOpen()": FunctionFragment;
    "offerPriceDecrement()": FunctionFragment;
    "reservePrice()": FunctionFragment;
    "seller()": FunctionFragment;
    "stopped()": FunctionFragment;
    "winner()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "bid"
      | "blockStart"
      | "currentPrice"
      | "finalize"
      | "getStatus"
      | "getWinner"
      | "initialPrice"
      | "numBlocksAuctionOpen"
      | "offerPriceDecrement"
      | "reservePrice"
      | "seller"
      | "stopped"
      | "winner"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "bid", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "blockStart",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "currentPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "finalize",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "getStatus", values?: undefined): string;
  encodeFunctionData(functionFragment: "getWinner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numBlocksAuctionOpen",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "offerPriceDecrement",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reservePrice",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "seller", values?: undefined): string;
  encodeFunctionData(functionFragment: "stopped", values?: undefined): string;
  encodeFunctionData(functionFragment: "winner", values?: undefined): string;

  decodeFunctionResult(functionFragment: "bid", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "blockStart", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "currentPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "finalize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getStatus", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getWinner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initialPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numBlocksAuctionOpen",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "offerPriceDecrement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reservePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "seller", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stopped", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "winner", data: BytesLike): Result;

  events: {};
}

export interface BasicDutchAuction extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BasicDutchAuctionInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    bid(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    blockStart(overrides?: CallOverrides): Promise<[BigNumber]>;

    currentPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    finalize(
      bidAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getStatus(overrides?: CallOverrides): Promise<[boolean]>;

    getWinner(overrides?: CallOverrides): Promise<[string]>;

    initialPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    numBlocksAuctionOpen(overrides?: CallOverrides): Promise<[BigNumber]>;

    offerPriceDecrement(overrides?: CallOverrides): Promise<[BigNumber]>;

    reservePrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    seller(overrides?: CallOverrides): Promise<[string]>;

    stopped(overrides?: CallOverrides): Promise<[boolean]>;

    winner(overrides?: CallOverrides): Promise<[string]>;
  };

  bid(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  blockStart(overrides?: CallOverrides): Promise<BigNumber>;

  currentPrice(overrides?: CallOverrides): Promise<BigNumber>;

  finalize(
    bidAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getStatus(overrides?: CallOverrides): Promise<boolean>;

  getWinner(overrides?: CallOverrides): Promise<string>;

  initialPrice(overrides?: CallOverrides): Promise<BigNumber>;

  numBlocksAuctionOpen(overrides?: CallOverrides): Promise<BigNumber>;

  offerPriceDecrement(overrides?: CallOverrides): Promise<BigNumber>;

  reservePrice(overrides?: CallOverrides): Promise<BigNumber>;

  seller(overrides?: CallOverrides): Promise<string>;

  stopped(overrides?: CallOverrides): Promise<boolean>;

  winner(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    bid(overrides?: CallOverrides): Promise<string>;

    blockStart(overrides?: CallOverrides): Promise<BigNumber>;

    currentPrice(overrides?: CallOverrides): Promise<BigNumber>;

    finalize(
      bidAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getStatus(overrides?: CallOverrides): Promise<boolean>;

    getWinner(overrides?: CallOverrides): Promise<string>;

    initialPrice(overrides?: CallOverrides): Promise<BigNumber>;

    numBlocksAuctionOpen(overrides?: CallOverrides): Promise<BigNumber>;

    offerPriceDecrement(overrides?: CallOverrides): Promise<BigNumber>;

    reservePrice(overrides?: CallOverrides): Promise<BigNumber>;

    seller(overrides?: CallOverrides): Promise<string>;

    stopped(overrides?: CallOverrides): Promise<boolean>;

    winner(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    bid(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    blockStart(overrides?: CallOverrides): Promise<BigNumber>;

    currentPrice(overrides?: CallOverrides): Promise<BigNumber>;

    finalize(
      bidAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getStatus(overrides?: CallOverrides): Promise<BigNumber>;

    getWinner(overrides?: CallOverrides): Promise<BigNumber>;

    initialPrice(overrides?: CallOverrides): Promise<BigNumber>;

    numBlocksAuctionOpen(overrides?: CallOverrides): Promise<BigNumber>;

    offerPriceDecrement(overrides?: CallOverrides): Promise<BigNumber>;

    reservePrice(overrides?: CallOverrides): Promise<BigNumber>;

    seller(overrides?: CallOverrides): Promise<BigNumber>;

    stopped(overrides?: CallOverrides): Promise<BigNumber>;

    winner(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    bid(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    blockStart(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    finalize(
      bidAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getStatus(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getWinner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    numBlocksAuctionOpen(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    offerPriceDecrement(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    reservePrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    seller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stopped(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    winner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
