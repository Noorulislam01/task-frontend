import { Routes,Route } from "react-router";
import Landing from "./component/Landing";
import Login from "./component/Auth/Login";
import Project from "./component/project/Projects";
import ProjectDetails from "./component/project/ProjectDetails";
import Profile from "./component/Profile";
import Signup from "./component/Auth/Signup";

export default function App() {
  return (
   <Routes>
    {/* <Route path="/" element={<Landing/>}></Route> */}
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/' element={<Project/>}/>
    <Route  path='/project/:projectId' element={<ProjectDetails/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path='/signup' element={<Signup/>}></Route>


   </Routes>
  )
}