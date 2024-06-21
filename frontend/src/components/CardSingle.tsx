// double sided card
import { useState } from "react";
import { Card } from "../types";
import CardPopUp from "./CardPopUp";

function CardSingle(props: {cardData: Card}) {
  const [popupTrigger, setPopupTrigger] = useState(false);

  const card = props.cardData;

  return (
    <div>
      <div className="card row p-2" style={{width: "18rem"}} onClick={()=>setPopupTrigger(true)}>
        <div className="card-body">
          <h5 className="card-title">{card.header}</h5>
          <p className="card-text">{card.body}</p>
        </div>
      </div>
      <CardPopUp trigger={popupTrigger} cardData={card} setTrigger={setPopupTrigger}/>
    </div>
  )
}

export default CardSingle;