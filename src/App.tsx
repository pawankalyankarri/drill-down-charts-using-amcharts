import "./App.css";
import BarChartCom from "./chartComponents/BarChartCom";
import { barData, type DrillDataType } from "./chartComponents/ChartData";

function App() {
  const data = barData as DrillDataType[]
  return <div>

    <BarChartCom bardata = {data}/>
  </div>;
}

export default App;
