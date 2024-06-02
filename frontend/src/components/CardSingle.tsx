// double sided card
import { useState } from "react";
import { Card } from "../types";
import CardPopUp from "./CardPopUp";

function CardSingle(props: {cardData: Card}) {
  const [popupTrigger, setPopupTrigger] = useState(true);

  const card = props.cardData;

  return (
    <>
      <div className="card " style={{width: "18rem"}} onClick={()=>setPopupTrigger(true)}>
        <div className="card-body">
          <h5 className="card-title">{card.header}</h5>
          <p className="card-text">{card.body}</p>
        </div>
      </div>
      <CardPopUp trigger={popupTrigger} cardData={card} setTrigger={setPopupTrigger}/>
    </>
  )
}

export default CardSingle;