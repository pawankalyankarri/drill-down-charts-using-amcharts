import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SecondLevelBarChart from './rechartsComponents/SecondLevelBarChart.tsx'
import BarChartCom from './chartComponents/BarChartCom.tsx'
import BarChartPage from './rechartsComponents/BarChartPage.tsx'
import SampleChart from './rechartsComponents/SampleChart.tsx'
import DrillDownamChart from './amcharts/DrillDownamChart.tsx'
import DrilldownRecharts from './rechartsComponents/DrilldownRecharts.tsx'

const router = createBrowserRouter([
  {
    path : "/",
    element : <App/>,
    children : [
      {
        path : "",
        element : <BarChartPage/>
      },
      {
        path : "am",
        element : <BarChartCom/>
      },
      {
        path : "secondbarchart",
        element : <SecondLevelBarChart/>
      },
      {
        path : "sample",
        element : <SampleChart/>
      },
      {
        path : "drill",
        element : <DrillDownamChart/>
      },
      {
        path : "rechart",
        element : <DrilldownRecharts/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
