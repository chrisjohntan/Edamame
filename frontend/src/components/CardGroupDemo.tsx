import { useEffect, useState } from "react"
import axios from "../axiosConfig"
import { Card } from "../types"
import { getCookie } from "../auth"
import CardSingle from "./CardSingle"
// import CardCreate from "./CardCreate"
import "../App.css"
import { Form } from "react-bootstrap"
import { SubmitHandler, useForm } from "react-hook-form"

function CardGroupDemo() {
  const [cardList, setCardList] = useState<Card[]>([])

  // get cardList from backend
  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await axios.get("/get_cards", {withCredentials: true, headers: {'X-CSRF-TOKEN': getCookie('csrf_access_token')}})
        console.log(response)
        const cardsData = response.data.data
        console.log(cardsData)
        setCardList(cardsData) 
      } catch (err) {
        console.error(err)
      }
    }
    getCards();
  }, [])

  const {register, handleSubmit, reset, resetField, formState: {errors}} = useForm<Card>()
  const createCard: SubmitHandler<Card> = async (data: Card) => {
    try {
      console.log(data)
      const response = await axios.post("/create_card", data, {withCredentials: true});
      setCardList([...cardList, data])
      reset();
    } catch (err) {
      alert("Error when creating card");
      console.error(err);
    }
  }

  return (
  <>
  {/* Create card form */}
  {/* TODO: Change to modal */}
    <div className="mt-3 d-flex form me-auto ms-auto align-center justify-content-center">
      <form className="row">
        <div className="col me-3">
          <Form.Group className="row">            
            <Form.Control type="text"
              placeholder="Header Front"
              {...register("header", {required: true})}
            />
          </Form.Group><br/>
          <Form.Group className="row">          
            <Form.Control type="text" as="textarea"
              placeholder="Body Front (optional)"
              {...register("body", {required: false})}
              />
          </Form.Group><br/>
        </div>
        <div className="col ms-3">
          <Form.Group className="row">            
            <Form.Control type="text"
              placeholder="Header Back"
              {...register("header_flipped", {required: true})}
            />
          </Form.Group><br/>
          <Form.Group className="row">          
            <Form.Control type="text" as="textarea"
              placeholder="Body Back (optional)"
              {...register("body_flipped", {required: false})}
              />
          </Form.Group><br/>
        </div>
        <Form.Group className="col">
          <button type="button" className="btn btn-success width-5" onClick={handleSubmit(createCard)}>Create Card</button>
        </Form.Group>
      </form>
    </div>
    <hr className="mt-0"/>

    <div className="container d-flex">
      <div className="pt-3">
        {cardList.map(card => <div className="mb-2"><CardSingle cardData={card}/></div>)}
      </div>
      {/* <button type="button" className="btn btn-primary"
        style={{position:"fixed", bottom: "1rem", right: "1rem"}}>
        Create card
      </button> */}
    </div>
    {/* <CardCreate show={showCardForm} toggleShow={setCardForm}></CardCreate> */}
  </>
  )
}

export default CardGroupDemo;