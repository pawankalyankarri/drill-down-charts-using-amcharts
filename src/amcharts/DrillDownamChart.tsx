import { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";

export interface DrillDataType {
  category: string;
  ACTUAL_TMT_SALES: number;
  TARGET_TMT_SALES: number;
  ACTUAL_HISTORY_TMT_SALES: number;
  children?: DrillDataType[];
}

const DrillDownamChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const mountRef = useRef<boolean>(false);
  const [chartData, setChartData] = useState<DrillDataType[]>([]);

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    axios
      .get("./DrillDownData.json")
      .then((res) => setChartData(res.data))
      .catch((err) => console.log(err));
  }, []);

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
      rotation: 0,
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

    const yRenderer = am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 });
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, { renderer: yRenderer })
    );

    function creatingSeries(value:string) {
        
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Values",
          xAxis,
          yAxis,
          valueYField: value,
          categoryXField: "category",
          tooltip: am5.Tooltip.new(root, {
            labelText: `${value}: {valueY}`,
          }),
        })
      );
      series.columns.template.setAll({
        cornerRadiusTL: 6,
        cornerRadiusTR: 6,
        strokeOpacity: 0,
        cursorOverStyle: "pointer",
        width: 25,
      });

      series.columns.template.adapters.add("fill", (fill, target) => {
        return chart.get("colors")!.getIndex(series.columns.indexOf(target)); // each grid will get different color
      });

      series.columns.template.events.on("click", (ev) => {
        console.log("ev", ev);
      });
      series.data.setAll(chartData);

      series.appear(1000);
    }

    chartData.forEach((item) =>Object.keys(item).forEach(key=>key!=="category" && key!== "children" ? creatingSeries(key):"")); 

    xAxis.data.setAll(chartData);

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [chartData]);
  return (
    <div className=" flex justify-center items-center">
      <div ref={chartRef} className="w-[50%] h-[400px]"></div>
    </div>
  );
};
export default DrillDownamChart;
