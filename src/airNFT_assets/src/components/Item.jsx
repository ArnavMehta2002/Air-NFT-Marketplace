import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import {HttpAgent, Actor} from "@dfinity/agent";
import {idlFactory }from "../../../declarations/nft";
import { idlFactory as tokenidlFactory } from "../../../declarations/token";
import { canisterId } from "../../../declarations/nft";
import {Principal} from "@dfinity/principal";
import Button from "./Button";
import {airNFT} from "../../../declarations/airNFT";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";




function Item(props) {

  const id = (props.id);
  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({host: localHost});

  agent.fetchRootKey();  //(error => failed to verify certificate)   // when deplying live this should be removed 

  const [name, setName] = React.useState();
  const [owner, setOwner] = React.useState();
  const [image, setImage] = React.useState();
  const [button , setButton] = React.useState();
  const [price, setPrice] = React.useState();
  const [hide, setHide] = React.useState(true);
  const [blur, setBlur] = React.useState();
  const [sellStatus, setSellStatus] = React.useState("");
  const [priceLabel, setPriceLabel] = React.useState();

  let NFTActor;
  let tokenActor;

  async function loadNFT(){
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const imgData = await NFTActor.getImage();
    const imgContent = new Uint8Array(imgData);

    const img = URL.createObjectURL(
      new Blob([imgContent.buffer], {type:"image/png"})
    );

    setName((await NFTActor.getName()));
    setOwner((await NFTActor.getOwner()).toText());
    setImage(img); 

    
    if(props.role=="collection"){
      const nftIsListed = await airNFT.isLisited(props.id);

      if(nftIsListed){
        setOwner("airNFT");
        setBlur({filter:"blur(4px)"});
        setSellStatus("Listed");
      }else{
        setButton(<Button handleClick={handleSell} text={"sell"}/>);
      }
    }else if(props.role=="discover"){
      const originalOwner = await airNFT.getOriginalOwnerId(props.id);
      console.log(originalOwner.toText());
      console.log(CURRENT_USER_ID.toText());
      if(originalOwner.toText() != CURRENT_USER_ID.toText()){
        setButton(<Button handleClick={handleBuy} text={"Buy"}/>);
      }
      
      const NFTPrice = await airNFT.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel NFTPrice={NFTPrice.toString()} />);
    }
  }

  let itemPrice;

  function handleSell(){
    console.log("clicked");
    setPrice(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={itemPrice}
        onChange={(e)=>itemPrice= e.target.value}
      />
    );
    setButton(<Button handleClick={sellItem} text={"confirm"}/>);
    
  }
  
  async function handleBuy(){
    // console.log("BUY");;

    tokenActor = await Actor.createActor(tokenidlFactory,{
      agent,
      canisterId: Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"),
    });
    
    const sellerId = await airNFT.getOriginalOwnerId(props.id);
    const nftprice = await airNFT.getListedNFTPrice(props.id);

    const transferResult = await tokenActor.transfer(sellerId, nftprice);

    if(transferResult == "success"){
      const NFTtransfer = await airNFT.transferNFT(sellerId, CURRENT_USER_ID, props.id);
      console.log("Transfer: "+NFTtransfer);
    }
    else{
      console.log("Transfer: failed");;
    }


  }

  async function sellItem(){
    setHide(false);
    console.log("sell");
    const listing = await airNFT.ListItem(props.id, Number(itemPrice));
    console.log("listng: "+listing);

    if(listing =="success"){
      const airNFTId = await airNFT.getairNFTCanisterId();
      const transferResult = await NFTActor.transferOwnership(airNFTId);
      console.log("transfer: "+transferResult);

      if(transferResult=="success"){
        setHide(true);
        setButton();
        setPrice();
        setOwner("airNFT");
        setBlur({filter:"blur(4px)"});
        setSellStatus("Listed");
      }
    }
    else{
      console.log("error");
    }

  }



  useEffect(()=>{ loadNFT(); }, []);
  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={hide}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {price}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
