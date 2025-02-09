import React,{useState,useEffect} from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route,useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./store/authSlice"; // ✅ Import Redux action
import Main from './components/Home/Main';
// import AppointmentList from './components/appoitment/appointmentList'; // Correct path for 'appointment'
// // import AppointmentForm from './components/appoitment/appointment'; // Correct path for 'appointment'
// import AppointmentDetail from './components/appoitment/appointmentDetail'; // Correct path for 'appointment'
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from "./components/doctors/Dashboard"
import ProfileDoctor from "./components/doctors/ProfileDoctor"
import PatientVideoCall from "./components/PatientVedioCall";
import ChatroomList from "./components/ChatRoomList";
import Chatroom from "./components/ChatRoom";
import Service from "./components/Home/service";
import ServiceDetails from "./components/Home/servicedetail";
function App() {
  const [userId, setUserId] = useState(1); // Replace with actual user ID from authentication
  const [role, setRole] = useState("Patient");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserFromLocalStorage = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/api/users/session", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          dispatch(loginSuccess({ token })); // ✅ Store user data in Redux
          localStorage.setItem("userId", response.data.id); // ✅ Save user ID
          localStorage.setItem("role", response.data.role); // ✅ Save role
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };

    fetchUserFromLocalStorage();
  }, [dispatch]);
  return (
    <BrowserRouter>
      {/* <h1>Appointment Management</h1> Moved title outside of Routes */}
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
      <Route path="/profile" element={<ProfileDoctor/>}/>
      <Route path="/book" element={<PatientVideoCall/>}/>

      <Route
                    path="/chat"
                    element={<ChatroomList userId={userId} role={role} />}
                />
                <Route
                    path="/chatroom/:chatroomId"
                    element={<ChatroomWrapper userId={userId} />}
                />
    </Routes>
     </BrowserRouter>
  )
};
const ChatroomWrapper = ({ userId }: { userId: number }) => {
  const { chatroomId } = useParams<{ chatroomId?: string }>(); // ✅ Use optional chaining

  if (!chatroomId) {
    return <p>Error: Chatroom ID is missing.</p>; // ✅ Handle missing ID
  }

  return <Chatroom chatroomId={parseInt(chatroomId, 10)} userId={userId} />; // ✅ Convert safely to number
};


export default App;
