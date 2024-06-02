import { useState } from "react";
import { Card } from "../types";
import "./cardPopup.css"

function CardPopUp(props: {cardData: Card; trigger: boolean; setTrigger:(trigger: boolean)=>void}) {
  const card = props.cardData;
  const [viewFlip, setViewFlip] = useState(false);
  
  if (!viewFlip) {
    return (
      <div className="popup">
        <div className="popup-inner">
          <h3>Front</h3>
          <h4>{card.header}</h4>
          <p>{card.body}</p>
          <button className="btn" onClick={()=>setViewFlip(!viewFlip)}>Flip!</button>
          <button className="btn btn-danger" onClick={()=>props.setTrigger(false)}>Close</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="popup">
        <div className="popup-inner">
          <h3>Back</h3>
          <h4>{card.headerFlipped}</h4>
          <p>{card.bodyFlipped}</p>
          <button className="btn" onClick={()=>setViewFlip(!viewFlip)}>Flip!</button>
          <button className="btn btn-danger" onClick={()=>props.setTrigger(false)}>Close</button>
        </div>
      </div>
    );
  }
}

export default CardPopUp;