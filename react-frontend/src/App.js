import "./App.css";
import React, {useState, useEffect} from "react";
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

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const token = getJWTToken();

    // axios.interceptors.request.use(config => {
    //   const token = getJWTToken();
    //   config.headers["Authorization"] = `Bearer ${token}`;
    //   return config;
    // });

    // try{
    //   if(token) {
    //     axios.get('http://localhost:8000/users/token/verify').then((res) => {
    //         const data = res;
    //         if (data.status == 200) {
    //           setLoggedIn(true);
    //         }
    //     })
    //   }
    // } catch {
    //   removeJWTToken();
    // }
  }, [])

  return (
    <div className="w-full">
        <BrowserRouter>
          <AuthProvider>
            <DashboardAppBar profilePic={profilePic}/>
            <Routes>
              <Route path='/' element={ 
                <HomePage />
              } />
              <Route path='/login' element={ 
                <LoginPage handleSetLogin={setLoggedIn} 
                setProfilePic={setProfilePic} setUserName={setUserName}/>
              } />
              <Route path='/signup' element={ 
                <SignUpPage handleSetLogin={setLoggedIn} 
                setProfilePic={setProfilePic} setUserName={setUserName}/>
              } />
              <Route path="/dashboard" element={<ProtectedLayout />}>
                <Route path='courses' element={ <CoursePage /> } />
                <Route path='profile' element={ <UserPage />} />
                <Route path='upload_pdf' element={ <PdfUploader/> } />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
    </div>
  );
}

export default App;
