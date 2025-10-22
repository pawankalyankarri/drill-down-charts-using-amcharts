import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SecondLevelBarChart from './rechartsComponents/SecondLevelBarChart.tsx'
import BarChartCom from './chartComponents/BarChartCom.tsx'
import BarChartPage from './rechartsComponents/BarChartPage.tsx'
import SampleChart from './rechartsComponents/SampleChart.tsx'

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
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
