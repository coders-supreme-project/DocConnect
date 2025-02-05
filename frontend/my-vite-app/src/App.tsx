import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>}/>
    </Routes>
     </BrowserRouter>
  )
}

export default App





