import type { DrillDataType } from "@/amcharts/DrillDownamChart";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DrilldownRecharts = () => {
  const mountRef = useRef<boolean>(false);
  const [chartData, setChartData] = useState<DrillDataType[]>([]);
  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    axios
      .get("/DrillDownData.json")
      .then((res) => setChartData(res.data))
      .catch((err) => console.log(err));
  }, []);

  function findMatchObj(data:any,category:any){
    console.log(data,category)
  }

  function handleClick(d:any){
    axios.get("/DrillDownData.json").then(res=>{
        let resobj = findMatchObj(res.data,d.category)
        console.log(resobj)
    }).catch(err=>console.log(err))
    console.log(d)
  }
  return (
    <div className="flex justify-center items-center">
        <div className="w-[40%] h-[300px] ">
      <ResponsiveContainer className="w-full h-full">
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip cursor={false} />
          <Bar dataKey="ACTUAL_TMT_SALES" fill="#8884d8" radius={[6,6,0,0]} onClick={(d)=>handleClick(d)} />
          <Bar dataKey="TARGET_TMT_SALES" fill="#82ca9d" radius={[6,6,0,0]} onClick={(d)=>handleClick(d)} />
          <Bar dataKey="ACTUAL_HISTORY_TMT_SALES" fill="#ffc658" radius={[6,6,0,0]} onClick={(d)=>handleClick(d)}  />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
};
export default DrilldownRecharts;
