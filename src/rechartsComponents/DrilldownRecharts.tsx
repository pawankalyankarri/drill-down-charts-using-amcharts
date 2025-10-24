import type { DrillDataType } from "@/amcharts/DrillDownamChart";
import "../index.css"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { faArrowsRotate, faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const DrilldownRecharts = () => {
  const mountRef = useRef<boolean>(false);
  const [chartData, setChartData] = useState<DrillDataType[]>([]);
  const [backArray, setBackArray] = useState<DrillDataType[][]>([]);
  const [prevCats, setPrevCats] = useState<string[]>([]);
  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    axios
      .get("/DrillDownData.json")
      .then((res) => setChartData(res.data))
      .catch((err) => console.log(err));
  }, []);

  function findMatchObj(data: any, category: string): DrillDataType | null {
    if (data.length === 0) return null;
    for (let item of data) {
      if (item.category === category) return item;
      if (item.children) {
        const matched = findMatchObj(item.children, category);
        if (matched) return matched;
      }
    }
    return null;
  }

  const handleClick = useCallback((d: any) => {
    axios
      .get("/DrillDownData.json")
      .then((res) => {
        let resobj = findMatchObj(res.data, d.category);
        if (resobj?.children) {
          setPrevCats((prev) => [...prev, d.category]);
          setBackArray((prev) => [...prev, chartData]);
          setChartData(resobj.children);
        } else {
          toast.info("chart is refreshed");
          setChartData(res.data);
          setBackArray([]);
          setPrevCats([]);
        }
      })
      .catch((err) => console.log(err));
    // console.log(d)
  }, [chartData,backArray,prevCats]);

  const handleRefresh = () => {
    axios.get("/DrillDownData.json").then(res=>{
      setChartData(res.data)
      setBackArray([])
      setPrevCats([])
    }).catch(err=>console.log(err))
  }

  const handleBack = () => {
    setChartData(backArray[backArray.length-1])
    setBackArray(backArray.slice(0,-1))
    setPrevCats(prevCats.slice(0,-1))
  }

  const handleBreadCrumbChange = (category:string) =>{
    console.log(category)
  }


  return (
    <div className=" w-full min-h-screen flex flex-col gap-5 justify-around items-center overflow-hidden">
      <div className="w-full h-full">
        <div className="w-full h-full">
          <div className="flex items-center justify-end pr-40 gap-5">
            {backArray.length !== 0 && (
              <FontAwesomeIcon
                icon={faBackward}
                onClick={handleBack}
                className="cursor-pointer p-2"
              />
            )}
            {backArray.length > 0 && (
              <FontAwesomeIcon
                icon={faArrowsRotate}
                onClick={handleRefresh}
                className="cursor-pointer p-2"
              />
            )}
          </div>
        </div >
        <div className="flex justify-center items-center w-full">
          <Breadcrumb>
            <BreadcrumbList>
              {prevCats.map((item, idx) => {
                return (
                  <span
                    key={idx}
                    className="flex justify-center items-center gap-2"
                  >
                    <BreadcrumbItem
                      className="cursor-pointer"
                      onClick={() => handleBreadCrumbChange(item)}
                    >
                      {item}
                    </BreadcrumbItem>
                    {idx < prevCats.length - 1 && <BreadcrumbSeparator />}
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="w-[50%] h-[300px] p-2 focus:outline-none ">
        <ResponsiveContainer className="w-full h-full">
          <BarChart data={chartData} margin={{ top: 20 }} className="recharts-bar-rectangle">
            <XAxis dataKey="category" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip cursor={false} />
            {/* {chartData.map((item) => {
              const keys = Object.keys(item);
              let dataKeys = keys.filter(
                (item) => item !== "category" && item !== "children"
              );
              console.log(dataKeys);
            })} */}
            <Bar
              dataKey="ACTUAL_TMT_SALES"
              fill="#8884d8"
              radius={[6, 6, 0, 0]}
              onClick={(d) => handleClick(d)}
              maxBarSize={40}
              className="cursor-pointer"
            >
              <LabelList
                dataKey="ACTUAL_TMT_SALES"
                position="top"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="TARGET_TMT_SALES"
              fill="#82ca9d"
              radius={[6, 6, 0, 0]}
              onClick={(d) => handleClick(d)}
              maxBarSize={40}
              className="cursor-pointer"
            >
              <LabelList
                dataKey="TARGET_TMT_SALES"
                position="top"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="ACTUAL_HISTORY_TMT_SALES"
              fill="#ffc658"
              radius={[6, 6, 0, 0]}
              onClick={(d) => handleClick(d)}
              maxBarSize={40}
              className="cursor-pointer"
            >
              <LabelList
                dataKey="ACTUAL_HISTORY_TMT_SALES"
                position="top"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default DrilldownRecharts;
