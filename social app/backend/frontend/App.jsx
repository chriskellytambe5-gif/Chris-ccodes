import react from 'react';
import { route,route, navigate } from 'react-router-dom';
import login from "./components/Auth/login";
import signup from "./components/Auth/signup";
import chat from "./components/Chat/chatpage";
import profile from "./components/Profile/profilepage";
import friendspage from "./components/Friends/friendspage";
import Adminpage from "./components/Admin/adminpage";
import Navbar from "./components/Navbar/navbar";
import { get Token } from "./service/auth";

Function protected({ children}) {
    const token = getToken();
    return token ? children : navigate("/login");
}

export default function App() {
    return (
        <>
          <Navbar />
          <div className="app-container">
            <routes>
                <route path="/" element={<navigate to="/chat" />} />
                <route path="/login" element={<login />} />
                <route path="/signup" element={<signup />} />
                <route path="/chat" element={<protected><chat /></protected>} />
                <route path="/profile" element={<protected><profile /></protected>} />
                <route path="/friends" element={<protected><friendspage /></protected>} />
                <route path="/admin" element={<protected><Adminpage /></protected>} />
            </routes>
          </div>
        </>
    );
}

            
    


