import { barData, type DrillDataType } from "@/chartComponents/ChartData";
import { Button } from "@/components/ui/button";
import { cos } from "@amcharts/amcharts5/.internal/core/util/Math";
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
  const [chartData, setChartData] = useState<DrillDataType[]>([]);
  const mountRef = useRef<boolean>(false);
  const [prevCategory,setPrevCategory] = useState<string>("")
  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    axios
      .get("/jsonChartData.json")
      .then((res) => setChartData(res.data))
      .catch((err) => console.log(err));
  }, []);
  const navigate = useNavigate();

  const findMatchObj = (data:DrillDataType[],category:string):DrillDataType|null => {
    console.log(category,data)
    if(data.length === 0) return null;
    for(let item of data){
      if(item.category === category) return item;
      if(item.children){
        const obj : DrillDataType|null = findMatchObj(item.children,category)
        if(obj) return obj;
      }
    }
    return null
  }

  const handleClick = (data: any) => {
    console.log("data", data.children);
    console.log('data.category',data.category)
    setPrevCategory(data.category)
    axios
      .get("/jsonChartData.json")
      .then((res) => {
        const singleData = findMatchObj(res.data,data.category)
        if (singleData?.children) setChartData(singleData.children);
        else setChartData(res.data)
      })
      .catch((err) => console.log(err));

    // setChartData(data.children||[])
    // const singleData = chartData.filter(item=>item.category === data.category )  // here i am filtering selected field
    // console.log(singleData[0].children)
    // setChartData(singleData[0].children|| [])    // setting that selected field to chartdata
  };

  function handleBack(data: DrillDataType[]) {
    console.log(data)
    console.log('prevcategory',prevCategory)
    const previousData = findMatchObj(data,prevCategory)
    console.log('prevdata',previousData)
  }
  // console.log(chartData)
  return (
    <div className="w-full h-screen flex justify-around items-center flex-col">
      <div className="">
        <Button onClick={() => handleBack(chartData)}>Back</Button>
      </div>
      <div className="w-[25%] h-[300px] ">
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
    </div>
  );
};

export default BarChartPage;
