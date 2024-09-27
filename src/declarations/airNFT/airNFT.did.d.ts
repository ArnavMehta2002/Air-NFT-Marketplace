import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'ListItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'getListedNFT' : () => Promise<Array<Principal>>,
  'getListedNFTPrice' : (arg_0: Principal) => Promise<bigint>,
  'getOriginalOwnerId' : (arg_0: Principal) => Promise<Principal>,
  'getOwnedNFT' : (arg_0: Principal) => Promise<Array<Principal>>,
  'getairNFTCanisterId' : () => Promise<Principal>,
  'isLisited' : (arg_0: Principal) => Promise<boolean>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
  'transferNFT' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
    ) => Promise<string>,
}
