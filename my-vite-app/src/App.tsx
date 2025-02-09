import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './components/Home/Main';
// import AppointmentList from './components/appoitment/appointmentList'; // Correct path for 'appointment'
// // import AppointmentForm from './components/appoitment/appointment'; // Correct path for 'appointment'
// import AppointmentDetail from './components/appoitment/appointmentDetail'; // Correct path for 'appointment'
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from "./components/doctors/Dashboard"
import ProfileDoctor from "./components/doctors/ProfileDoctor"
import Service from "./components/Home/service"
import ServiceDetails from "./components/Home/servicedetail"
  function App() {
    return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileDoctor />} />
        {/* <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/appointments/create" element={<AppointmentForm />} />
        <Route path="/appointments/:id" element={<AppointmentDetail />} /> */}
        <Route path="/service" element={<Service/>}/>
        <Route path="/service-details" element={<ServiceDetails />} />
      {/* <Route path='/' element={<Main/>} /> */}
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
   
    </Routes>
     </BrowserRouter>
  )
}

export default App;
