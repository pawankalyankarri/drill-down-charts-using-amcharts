import React, { useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ---------------- Type Definitions ----------------
type LocationItem = { name: string; value: number };

type DataType = {
  Country: LocationItem[];
  State: Record<string, LocationItem[]>;
  City: Record<string, LocationItem[]>;
};

type Filter = {
  key: keyof DataType;
  cond: "equals";
  value: string;
};

// ---------------- Fake Data ----------------
const DATA: DataType = {
  Country: [
    { name: "India", value: 100 },
    { name: "USA", value: 80 },
  ],
  State: {
    India: [
      { name: "Telangana", value: 50 },
      { name: "Maharashtra", value: 50 },
    ],
    USA: [
      { name: "California", value: 40 },
      { name: "Texas", value: 40 },
    ],
  },
  City: {
    Telangana: [
      { name: "Hyderabad", value: 25 },
      { name: "Warangal", value: 25 },
    ],
    California: [
      { name: "San Francisco", value: 20 },
      { name: "Los Angeles", value: 20 },
    ],
  },
};

// ---------------- Component ----------------
const DrillDownBarChart: React.FC = () => {
  const [drillLevel, setDrillLevel] = useState<number>(0);
  const [drillHistory, setDrillHistory] = useState<string[]>([]);
  const [crossFilters, setCrossFilters] = useState<Filter[]>([]);
  const [chartData, setChartData] = useState<LocationItem[]>(DATA.Country);

  const drillKeys: (keyof DataType)[] = ["Country", "State", "City"];

  // ---------------- Handle bar click ----------------
  const handleBarClick = useCallback(
    (entry: LocationItem) => {
      const currentLevel = drillKeys[drillLevel];
      const nextLevel = drillKeys[drillLevel + 1];

      if (!nextLevel) {
        alert("Reached last level");
        return;
      }

      const newCrossFilters: Filter[] = [
        ...crossFilters,
        { key: currentLevel, cond: "equals", value: entry.name },
      ];
      setCrossFilters(newCrossFilters);
      setDrillLevel(drillLevel + 1);
      setDrillHistory([...drillHistory, entry.name]);

      let nextData: LocationItem[] = [];
      if (nextLevel === "State") nextData = DATA.State[entry.name] ?? [];
      else if (nextLevel === "City") nextData = DATA.City[entry.name] ?? [];

      setChartData(nextData);
    },
    [drillLevel, crossFilters, drillHistory]
  );

  // ---------------- Handle Back click ----------------
  const handleBackClick = useCallback(() => {
    if (drillLevel === 0) return;

    const newLevel = drillLevel - 1;
    const lastFilter = crossFilters[drillLevel - 1];
    const updatedCrossFilters = crossFilters.filter(
      (f) => f.key !== lastFilter.key
    );

    setDrillLevel(newLevel);
    setCrossFilters(updatedCrossFilters);
    setDrillHistory(drillHistory.slice(0, -1));

    if (newLevel === 0) setChartData(DATA.Country);
    else {
      const previousLevelKey = drillKeys[newLevel];
      const previousValue = drillHistory[newLevel - 1];
      let prevData: LocationItem[] = [];
      if (previousLevelKey === "State") prevData = DATA.State[previousValue] ?? [];
      else if (previousLevelKey === "City") prevData = DATA.City[previousValue] ?? [];
      setChartData(prevData);
    }
  }, [drillLevel, crossFilters, drillHistory, drillKeys]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Sales Drill-Down Chart</h2>

      {/* Breadcrumb */}
      <div style={{ marginBottom: 10 }}>
        {["Home", ...drillHistory].join(" ➜ ")}
      </div>

      {/* Back button */}
      {drillLevel > 0 && (
        <button onClick={handleBackClick} style={{ marginBottom: 10 }}>
           Back
        </button>
      )}

      {/* Recharts Bar Chart */}
      <div className="w-[50%]">
        <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#00a495">
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                cursor="pointer"
                onClick={() => handleBarClick(entry)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>

    </div>
  );
};

export default DrillDownBarChart;
