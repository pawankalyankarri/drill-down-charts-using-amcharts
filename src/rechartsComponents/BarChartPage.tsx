import { type DrillDataType } from "@/chartComponents/ChartData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faBackward } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

const BarChartPage = () => {
  // const chartData = barData as DrillDataType[];
  const [chartData, setChartData] = useState<DrillDataType[]>([]);
  const [backCatArray, setBackCatArray] = useState<string[]>([]);
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

  const findMatchObj = (
    data: DrillDataType[],
    category: string
  ): DrillDataType | null => {
    // console.log(category, data);
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
    // console.log("data", data.children);
    // console.log("data.category", data.category);
    axios
      .get("/jsonChartData.json")
      .then((res) => {
        const singleData = findMatchObj(res.data, data.category);
        if (singleData?.children) {
          setBackCatArray((prev) => [...prev, singleData.category]);
          setPrevData((prev) => [...prev, chartData]);
          setChartData(singleData.children);
        } else {
          setChartData(res.data);
          setBackCatArray([]);
          setPrevData([]);
        }
      })
      .catch((err) => console.log(err));
  };

  function handleBack() {
    if (prevData.length === 0) return;
    console.log("prevcategory", prevData);
    setChartData(prevData[prevData.length - 1]);
    setBackCatArray(backCatArray.slice(0, -1));
    setPrevData(prevData.slice(0, -1));
  }

  function handleBreadCrumbChange(category : string){
    console.log(category)
    console.log(chartData)
    console.log(prevData)
    console.log(backCatArray)
    // axios.get("/jsonChartData.json").then(res=>{
    //   const resobj = findMatchObj(res.data,category)
    //   console.log('resobj',resobj)
    //   if (resobj?.children)
    //     setChartData(resobj.children)
    // }).catch(err=>console.log(err))
    
  }
  function handleRefresh(){
    axios.get("/jsonChartData.json").then(res=>{
      setChartData(res.data)
      setBackCatArray([])
      setPrevData([])
    })
  }
  // console.log(chartData)
  return (
    <div className="w-full h-screen flex justify-around items-center flex-col">
      <div className=" w-full flex justify-center items-center flex-col gap-y-2">
        <div className="flex items-center justify-center gap-5">
        {backCatArray.length !== 0 && <FontAwesomeIcon icon={faBackward} onClick={handleBack} className="cursor-pointer"  />}
        {backCatArray.length>0 && <FontAwesomeIcon icon={faArrowsRotate} onClick={handleRefresh} className="cursor-pointer"  /> }
        </div>
        <span></span>
        <Breadcrumb>
          <BreadcrumbList>
            {backCatArray.map((item, idx) => {
              return (
                <span key={idx} className="flex justify-center items-center gap-2">
                <BreadcrumbItem  className="cursor-pointer" onClick={()=>handleBreadCrumbChange(item)}>
                  {item}
                  
                </BreadcrumbItem>
                {idx < backCatArray.length - 1 && <BreadcrumbSeparator />}
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="w-[50%] h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="category" fontSize={12} />
            <YAxis />
            <Tooltip cursor={false} />{" "}
            {/* removing hover effect use cursor false */}
            <Bar
              dataKey="value"
              fill="#8884d8"
              onClick={handleClick}
              className="cursor-pointer"
              maxBarSize={40}
              radius={[6, 6, 0, 0]}
            >
              <LabelList dataKey="value" position="top" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartPage;
