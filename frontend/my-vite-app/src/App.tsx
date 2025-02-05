import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './components/Main';
import Login from './components/Login';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main/>} />
      <Route path='/login' element={<Login/>} />
    </Routes>
     </BrowserRouter>
  )
}

export default App





