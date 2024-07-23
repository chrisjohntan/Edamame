import { useEffect, useState } from "react";
import axios from "../axiosConfig"
import HeatMap from "@uiw/react-heat-map"
import { dateToIso } from "./utils";
import { Box, LoadingOverlay, NumberInput, Paper, Stack, Title, Tooltip, rem } from "@mantine/core";
import { format } from "date-fns"

const mapper = () => {
  
}

type HeatMapData = {
  date: string,
  count: number
}


function Heatmap() {
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState<HeatMapData[]>([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(currentYear);
  const changeYear = (year: number | string) => {
    year = Number(year);
    if (year <= currentYear) {
      setYear(year);
    } else {
      setYear(currentYear);
    }
  }

  useEffect(()=> {
    const getReviewHistory = async () => {
      setLoading(true);
      try {
        const now = new Date()
        // const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
        const today = dateToIso(now);
        console.log(today)
        const start = `${now.getFullYear()}-01-01`;
        console.log(today);
        const response = await axios.get(`/get_review_counts?start_date=${start}&end_date=${today}`);

        console.log(response);
        const raw: {date: string, review_count: number, user_id: number}[] = response.data.review_counts;
        const parsed: HeatMapData[] = raw.map(obj => ({date: obj.date, count: obj.review_count}));
        setData(parsed);
        console.log(data)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getReviewHistory();
  }, [year])

  return (
    <>
      <Title order={3}>Review history</Title>
      <HeatMap
        style={{backgroundColor:""}}
        value={data}
        width={950}
        height={170}
        rectSize={15}
        endDate={new Date(`${year}/12/31`)}
        startDate={new Date(`${year - 1}/12/31`)}
        
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
              openDelay={500}
              label={`${msg} on ${format(date, "MMMM do yyyy")}`}>
              <rect {...props} />
            </Tooltip>
          )
        }}
        
        />
        <NumberInput 
        value={year} 
        onChange={changeYear}
        max={currentYear}
        min={currentYear-3}
        allowDecimal={false}
        style={{width: "5rem"}}
        size="sm"
        mb="md"
      />
    </>
  )
}

export default Heatmap;