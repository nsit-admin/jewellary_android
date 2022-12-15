import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./pages/Login/Login"
import ExistingScheme from "./pages/ExistingScheme/ExistingScheme"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/existing-scheme",
    element: <ExistingScheme />
  }
])

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
