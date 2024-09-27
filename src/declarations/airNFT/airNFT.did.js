export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'ListItem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'getListedNFT' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getListedNFTPrice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getOriginalOwnerId' : IDL.Func(
        [IDL.Principal],
        [IDL.Principal],
        ['query'],
      ),
    'getOwnedNFT' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getairNFTCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'isLisited' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'mint' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),
    'transferNFT' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
