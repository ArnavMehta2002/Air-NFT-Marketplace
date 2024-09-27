import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import NFTActor "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

actor airNFT {

    private type Listing = {
        itemOwner: Principal;
        itemPrice: Nat;
    };

    var nftMap = HashMap.HashMap<Principal, NFTActor.NFT>(1, Principal.equal, Principal.hash);
    var ownershipMap = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var listingNFT = HashMap.HashMap<Principal, Listing> (1, Principal.equal, Principal.hash);

    public shared(msg) func transferNFT(seller: Principal, buyer: Principal, id: Principal): async Text{


        var purchasedNFT: NFTActor.NFT = switch(nftMap.get(id)){
            case null return "NFT does not exist";
            case (?result) result;
        };

        let purchaseResult = await purchasedNFT.transferOwnership(buyer);

        if(purchaseResult =="success"){

            listingNFT.delete(id);
            var listingChange : List.List<Principal> = switch(ownershipMap.get(seller)){
                case null List.nil<Principal>();
                case(?result) result;
            };
            listingChange := List.filter(listingChange, func(element: Principal): Bool{
                return element != id;
            });
            addToownershipMap(buyer, id);
            return "success";
        }
        else{
            return "error";
        }
    };

    public shared(msg) func mint(imageData: [Nat8], name: Text): async Principal{
        let owner = msg.caller;

        Cycles.add(100_500_000_000);
        let newNFT = await NFTActor.NFT(name, owner, imageData);
        let newNFTPrincipal = await newNFT.getCanisterId();
        nftMap.put(newNFTPrincipal, newNFT);
        addToownershipMap(owner , newNFTPrincipal);
        return newNFTPrincipal;
    };

    private func addToownershipMap(owner: Principal, nftid: Principal){
        var newList : List.List<Principal> = switch(ownershipMap.get(owner)){
            case null List.nil<Principal>();
            case(?result) result;
        };

        newList := List.push(nftid, newList);
        ownershipMap.put(owner, newList);
    };

    public query func getOwnedNFT(user: Principal): async [Principal]{
        var listOfNFT :List.List<Principal> = switch(ownershipMap.get(user)){
            case null List.nil<Principal>();
            case (?result) result;
        };

        return List.toArray(listOfNFT);
    };

    public query func getListedNFT(): async [Principal]{

        let ids = Iter.toArray(listingNFT.keys());
        return ids;
    };

    public shared(msg) func ListItem(id: Principal, price: Nat): async Text{

        var item : NFTActor.NFT = switch(nftMap.get(id)){
            case null return "NFT doesnot exist";
            case(?result) result;
        };

        let owner = await item.getOwner();

        if(Principal.equal(owner, msg.caller)){

            let listing: Listing = {
                itemOwner = owner;
                itemPrice = price;
            };

            listingNFT.put(id, listing);
            return "success";
        }
        else{
            return "you don't own this NFT.";
        }
    };

    public query func getairNFTCanisterId():async Principal{
        return Principal.fromActor(airNFT);
    };

    public query func isLisited(id: Principal): async Bool{
        if(listingNFT.get(id)==null){
            return false;
        }
        else{
            return true;
        }
    };

    public query func getOriginalOwnerId(id: Principal): async Principal{
        let originalOwner:Listing = switch(listingNFT.get(id)){
            case null return Principal.fromText("");
            case(?result) result;
        };
        return originalOwner.itemOwner;
    };

    
    public query func getListedNFTPrice(id: Principal): async Nat{
        let originalOwner:Listing = switch(listingNFT.get(id)){
            case null return 0;
            case(?result) result;
        };
        return originalOwner.itemPrice;
    };

};
