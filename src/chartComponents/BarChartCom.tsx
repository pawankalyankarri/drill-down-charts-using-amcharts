import { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";
import type { DrillDataType } from "@/chartComponents/ChartData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faBackward } from "@fortawesome/free-solid-svg-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
const BarChartCom = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const [isloading,setIsloading] = useState<boolean>(false)
  const mountRef = useRef<boolean>(false);
  const [chartData, setChartData] = useState<DrillDataType[]>([]);
  const [prevData, setPrevData] = useState<DrillDataType[][]>([]);
  const [backCatArray, setBackCatArray] = useState<string[]>([]);

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
    for (let item of data) {
      if (item.category === category) return item;
      if (item.children) {
        const found = findMatchObj(item.children, category);
        if (found) return found;
      }
    }
    return null;
  };

  // back to previous data
  const handleBack = () => {
    if (prevData.length === 0) return;
    setChartData(prevData[prevData.length - 1]);
    setPrevData(prevData.slice(0, -1));
    setBackCatArray(backCatArray.slice(0, -1));
  };

  function handleRefresh() {
    axios
      .get("/jsonChartData.json")
      .then((res) => {
        setChartData(res.data);
        setBackCatArray([]);
        setPrevData([]);
      })
      .catch((err) => console.log(err));
  }

  function handleBreadCrumbChange(category: string) {
    // console.log(category)
    // console.log(chartData)
    // console.log(prevData)
    // console.log(backCatArray)

    axios
      .get("/jsonChartData.json")
      .then((res) => {
        const resobj = findMatchObj(res.data, category);
        console.log("resobj", resobj);
        // let matchedIdx = prevData.findIndex(item=>item.some(obj=>obj.category === category)) // finding matched object index
        let matchedIdx = backCatArray.findIndex((item) => item === category); // finding matched object index

        // console.log('matchedIdx',matchedIdx)
        if (resobj?.children) {
          setChartData(resobj.children);
          setPrevData(prevData.slice(0, matchedIdx + 1));
          setBackCatArray(backCatArray.slice(0, matchedIdx + 1));
        }
        return;
      })
      .catch((err) => console.log(err));
  }

  useLayoutEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    if (rootRef.current) {
      rootRef.current.dispose();
    }

    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose(); // for removing amcharts logo

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 1,
      })
    );

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);
    cursor.lineX.set("visible", false);

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      strokeOpacity: 0.1,
    });
    xRenderer.labels.template.setAll({
      rotation: -60,
      fontSize: 12,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: xRenderer,
      })
    );

    // xRenderer.grid.template.setAll({
    //   visible: false,
    // });

    const yRenderer = am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, { renderer: yRenderer })
    );

    // yRenderer.grid.template.setAll({
    //   visible: false,
    // });

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Values",
        xAxis,
        yAxis,
        valueYField: "value",
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, { labelText: "{categoryX}: {valueY}" }),
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      strokeOpacity: 0,
      cursorOverStyle: "pointer",
      width: 25,
    });

    series.columns.template.adapters.add("fill", (_,target) => {
      return chart.get("colors")!.getIndex(series.columns.indexOf(target)); // each grid will get different color
    });

    series.columns.template.events.on("click", (ev) => {
      // console.log('ev',ev)
      const dataItem = ev.target.dataItem;
      const dataContext = dataItem?.dataContext as {
        category?: string;
        value?: number;
      };
      const category = dataContext?.category;
      if (!category) return;

      axios.get("/jsonChartData.json").then((res) => {
        const matched = findMatchObj(res.data, category);
        if (matched?.children) {
          setPrevData((prev) => [...prev, chartData]);
          setChartData(matched.children);
          setBackCatArray((prev) => [...prev, category]);
        } else {
          toast.info("Chart is Refreshed");
          setChartData(res.data);
          setPrevData([]);
          setBackCatArray([]);
        }
      });
    });

    xAxis.data.setAll(chartData);
    series.data.setAll(chartData);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => root.dispose();
  }, [chartData]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center mb-4 gap-5">
        <div className="flex items-center justify-center gap-5">
          {backCatArray.length !== 0 && (
            <FontAwesomeIcon
              icon={faBackward}
              onClick={handleBack}
              className="cursor-pointer p-2"
            />
          )}
          {backCatArray.length > 0 && (
            <FontAwesomeIcon
              icon={faArrowsRotate}
              onClick={handleRefresh}
              className="cursor-pointer p-2"
            />
          )}
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            {backCatArray.map((item, idx) => {
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
                  {idx < backCatArray.length - 1 && <BreadcrumbSeparator />}
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
        
      <div ref={chartRef} className="w-[30%] h-[400px]" />
    </div>
  );
};

export default BarChartCom;
