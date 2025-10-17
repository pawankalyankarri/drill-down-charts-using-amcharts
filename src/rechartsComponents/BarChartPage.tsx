import { barData, type DrillDataType } from "@/chartComponents/ChartData";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const BarChartPage = () => {
  // const chartData = barData as DrillDataType[];
  const [chartData,setChartData] = useState<DrillDataType[]>([])
  const mountRef = useRef<boolean>(false)
  useEffect(()=>{
    if(mountRef.current) return;
    mountRef.current = true;
    axios.get("/jsonChartData.json").then(res=>setChartData(res.data)).catch(err=>console.log(err))
  },[])
  const navigate = useNavigate()

  const handleClick = (data: any) => {
    console.log('data',data)
    const singleData = chartData.filter(item=>item.category === data.category )  // here i am filtering selected field
    console.log(singleData[0].children) 
    setChartData(singleData[0].children|| [])    // setting that selected field to chartdata
  };
  // console.log(chartData)
  return (
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
            onClick={handleClick}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartPage;
