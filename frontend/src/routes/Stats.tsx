import { Box } from "@mantine/core";
import Goals from "../components/Goals";
import Heatmap from "../components/Heatmap";



function Stats() {
  return (
    <div>
      <Box mt="lg">
        <Goals/>
      </Box>
      <Box mt={"lg"}>
        <Heatmap/>
      </Box>
    </div>
  )
}

export default Stats;