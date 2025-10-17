import { barData, type DrillDataType } from "@/chartComponents/ChartData";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SecondLevelBarChart = () => {
   const location = useLocation()
   const field = location.state.field;
   const [chartData,setChartData] = useState<DrillDataType[]>([])
   const mountRef = useRef<boolean>(false)
    // // console.log(location.state.field)
   
    // const data = barData as DrillDataType[];
    // const chartdata = data.filter(item=>item.category === field)
    // console.log(chartdata[0].children)

    useEffect(()=>{
        if(mountRef.current) return;
        mountRef.current = true;
        axios.get("/jsonChartData.json").then(res=>setChartData(res.data.filter((item:DrillDataType)=>item.category === field)?.[0]?.children)  
        ).catch(err=>console.log(err))
    },[])
    console.log(chartData)
    return(
        <div style={{ width: "30%", height: 300 }} className="">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    activeBar={false}
                  />
                </BarChart>
              </ResponsiveContainer>
        </div>
    )
}
export default SecondLevelBarChart;