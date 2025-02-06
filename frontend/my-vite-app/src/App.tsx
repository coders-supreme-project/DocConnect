import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from "./components/doctors/Dashboard"
import ProfileDoctor from "./components/doctors/ProfileDoctor"
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/profile" element={<ProfileDoctor/>}/>
    </Routes>
     </BrowserRouter>
  )
}

export default App





