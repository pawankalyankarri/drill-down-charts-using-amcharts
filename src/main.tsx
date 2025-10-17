import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BarChartPage from './rechartsComponents/BarChartPage.tsx'
import SecondLevelBarChart from './rechartsComponents/SecondLevelBarChart.tsx'

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
        path : "secondbarchart",
        element : <SecondLevelBarChart/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
