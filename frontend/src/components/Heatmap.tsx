import { useEffect, useState } from "react";
import axios from "../axiosConfig"
import HeatMap from "@uiw/react-heat-map"
import { dateToIso } from "./utils";
import { Tooltip, rem } from "@mantine/core";
import { format } from "date-fns"

const mapper = () => {
  
}


function Heatmap() {

  const [data, setData] = useState<{date: string, count: number}[]>([])

  useEffect(()=> {
    const getReviewHistory = async () => {
      try {
        const now = new Date()
        // const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
        const today = dateToIso(now);
        const start = `${now.getFullYear()}-01-01`
        console.log(today)
        const response = await axios.get(`/get_review_counts?start_date=${start}&end_date=${today}`)

        console.log(response);
      } catch (err) {

      }
    }
    getReviewHistory();
  })

  

  return (
    <HeatMap 
      style={{border: "black"}}
      value={[{date: "2024/02/02", count: 2}, ]}
      width={850}
      height={300}
      rectSize={15}

      endDate={new Date('2024/12/31')}
      startDate={new Date('2023/12/31')}
      rectRender={(props, data) => {
        const msg = data.count
          ? data.count === 1
            ? "1 review"
            : `${data.count} reviews`
          : "No reviews"
        const date = new Date(data.date)
        return (
          <Tooltip 
            arrowOffset={50} 
            arrowSize={8}
            withArrow
            label={`${msg} on ${format(date, "MMMM do")}`}>
            <rect {...props} />
          </Tooltip>
        )
      }}
      />
  )
}

export default Heatmap;