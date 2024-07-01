import { useEffect } from "react";
import axios from "../axiosConfig"
import HeatMap from "@uiw/react-heat-map"

function Heatmap() {

  useEffect(()=> {
    const getReviewHistory = async () => {
      try {
        const now = new Date()
        const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
        console.log(today)
        const response = await axios.get("/get_review_counts")
      } catch (err) {

      }
    }
  })
}