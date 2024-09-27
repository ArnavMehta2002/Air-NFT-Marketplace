import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";



actor class NFT(name: Text, owner: Principal, content: [Nat8])= this{
    // Debug.print("works");

    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content;


    public query func getName(): async Text{
        return itemName;
    };

    public query func getOwner(): async Principal{
        return nftOwner;
    };

    public query func getImage(): async [Nat8]{
        return imageBytes;
    };

    public query func getCanisterId(): async Principal{
        return Principal.fromActor(this);
    };

    public shared(msg) func transferOwnership(newOwner: Principal): async Text{

        if(Principal.equal(nftOwner, msg.caller)){
            nftOwner := newOwner;
            return "success";
        }
        else{
            return ("Error: invalid user to NFT");
        }
    };
}