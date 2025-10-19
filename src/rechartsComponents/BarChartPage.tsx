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
  const [prevData, setPrevData] = useState<DrillDataType[][]>([]);
  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    axios
      .get("/jsonChartData.json")
      .then((res) => setChartData(res.data))
      .catch((err) => console.log(err));
  }, []);
  const navigate = useNavigate();

  const findMatchObj = (
    data: DrillDataType[],
    category: string
  ): DrillDataType | null => {
    console.log(category, data);
    if (data.length === 0) return null;
    for (let item of data) {
      if (item.category === category) return item;
      if (item.children) {
        const obj: DrillDataType | null = findMatchObj(item.children, category);
        if (obj) return obj;
      }
    }
    return null;
  };

  const handleClick = (data: any) => {
    console.log("data", data.children);
    console.log("data.category", data.category);
    axios
      .get("/jsonChartData.json")
      .then((res) => {
        const singleData = findMatchObj(res.data, data.category);
        if (singleData?.children) {
          setPrevData((prev) => [...prev, chartData]);
          setChartData(singleData.children);
        } else setChartData(res.data);
      })
      .catch((err) => console.log(err));

    // setChartData(data.children||[])
    // const singleData = chartData.filter(item=>item.category === data.category )  // here i am filtering selected field
    // console.log(singleData[0].children)
    // setChartData(singleData[0].children|| [])    // setting that selected field to chartdata
  };

  function handleBack() {
    if(prevData.length === 0) return;
    console.log("prevcategory", prevData);
    setChartData(prevData[prevData.length - 1]);

    setPrevData(prevData.slice(0, -1));
  }
  // console.log(chartData)
  return (
    <div className="w-full h-screen flex justify-around items-center flex-col">
      <div className="">
        <Button onClick={handleBack}>Back</Button>
      </div>
      <div className="w-[35%] h-[300px] ">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="category" fontSize={12} />
            <YAxis />
            <Tooltip  />
            <Bar
              dataKey="value"
              fill="#8884d8"
              isAnimationActive = {false}
              onClick={handleClick}
              className="cursor-pointer"
              maxBarSize={40}
              radius={[6, 6, 0, 0]}
              
              

            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartPage;
