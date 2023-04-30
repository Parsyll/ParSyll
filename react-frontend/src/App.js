import "./App.css";
import React, {useState, useEffect, useContext} from "react";
import axios from 'axios'
import PdfUploader from "./pages/ParsePdfPage";
import DashboardAppBar from "./components/DashboardAppBar";
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { getJWTToken, removeJWTToken } from "./helper/jwt";
import CoursePage from "./pages/CoursePage";
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import { ProtectedRoute } from "./routing/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedLayout } from "./routing/ProtectedLayout";
import SignUpPage from "./pages/SignUpPage";
import { UserContext } from "./hooks/useUser";

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const {persistUser, authed } = useContext(UserContext)
  persistUser();


  return (
    <div className="w-full">
        <BrowserRouter>
          <AuthProvider>
            <DashboardAppBar profilePic={profilePic}/>
            <Routes>
              <Route path='/' element={ 
                authed ? <Navigate to="/dashboard/courses/0" /> : <HomePage /> 
              } />
              <Route path='/login' element={ 
                <LoginPage setLoggedIn={setLoggedIn} 
                setProfilePic={setProfilePic} setUserName={setUserName}/>
              } />
              <Route path='/signup' element={ 
                <SignUpPage setLoggedIn={setLoggedIn} 
                setProfilePic={setProfilePic} setUserName={setUserName}/>
              } />
              <Route path="/dashboard" element={<ProtectedLayout />}>
                <Route path='profile' element={ <UserPage />} />
                <Route path='upload_pdf' element={ <PdfUploader/> } />
                <Route path='courses/:course_id' element={ <CoursePage /> } />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
    </div>
  );
}

export default App;
