import { Routes,Route } from "react-router";
import Landing from "./component/Landing";
import Login from "./component/Auth/Login";

export default function App() {
  return (
   <Routes>
    <Route path="/" element={<Landing/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
   </Routes>
  )
}