import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Layout from "./Layout.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Landing from "./components/Landing.jsx";
import ShowCourses from "./components/ShowCourses.jsx";
import ShowPurchasedCourses from "./components/ShowPurchasedCourses.jsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Landing />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "courses",
                element: <ShowCourses />,

            },
            {
                path: "courses/purchased",
                element: <ShowPurchasedCourses />
            }
        ]
    },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
