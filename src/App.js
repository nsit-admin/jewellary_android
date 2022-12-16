import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./pages/Login/Login"
import ExistingScheme from "./pages/ExistingScheme/ExistingScheme"
import AddScheme from "./pages/AddScheme/AddScheme"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/existing-scheme",
    element: <ExistingScheme />
  },
  {
    path: "/add-scheme",
    element: <AddScheme />
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
