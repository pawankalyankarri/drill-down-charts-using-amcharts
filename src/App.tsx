import { Outlet } from "react-router-dom";
import "./App.css";
import BarChartCom from "./chartComponents/BarChartCom";
import { barData, type DrillDataType } from "./chartComponents/ChartData";
import BarChartPage from "./rechartsComponents/BarChartPage";
import { Toaster } from "sonner";

function App() {
  const data = barData as DrillDataType[]
  return <div className="w-full h-full grid">
    <Toaster position="top-right"  />
    {/* <div className="w-full h-full"><BarChartPage/></div> */}
    <div className="w-full h-full"><Outlet/></div>
    {/* <div className="w-[300px] h-[400px]"><BarChartCom bardata = {data}/></div> */}
  </div>;
}

export default App;
