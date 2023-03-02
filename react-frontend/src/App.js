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

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = getJWTToken();

    axios.interceptors.request.use(config => {
      const token = getJWTToken();
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    try{
      if(token) {
        axios.get('http://localhost:8000/users/token/verify').then((res) => {
            const data = res;
            if (data.status == 200) {
              setLoggedIn(true);
            }
        })
      }
    } catch {
      removeJWTToken();
    }
  }, [])

  const handleSetLogin = (result) => {
    setLoggedIn(result);
  }

  return (
    <div className="w-full">
      <BrowserRouter>
        <DashboardAppBar loggedIn={loggedIn} handleSetLogin={handleSetLogin} profilePic={profilePic}/>
        <Routes>
          <Route path='/' element={
            loggedIn ? <PdfUploader/> 
                  : <LoginPage loggedin={loggedIn} handleSetLogin={setLoggedIn} setProfilePic={setProfilePic} setUserName={setUserName}/>
          } />
          <Route
            path='/login' element={
                loggedIn ? <Navigate to='/' />
                  : <LoginPage loggedin={loggedIn} handleSetLogin={setLoggedIn} setProfilePic={setProfilePic} setUserName={setUserName}/>
          } />
          <Route
            path='/courses' element={
                loggedIn ? <CoursePage />
                  : <Navigate to='/login' />
          } />
          <Route
            path='profile' element={
                loggedIn ? <UserPage  handleSetLogin={handleSetLogin}/>
                  : <Navigate to='/login' />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
