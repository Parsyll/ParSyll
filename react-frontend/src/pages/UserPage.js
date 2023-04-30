import { useEffect, useState, useMemo, useContext } from "react"
import courseList from "../helper/course"
import Button from '@mui/material/Button';
import { removeJWTToken } from '../helper/jwt';
import LoadingButton from '@mui/lab/LoadingButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useAuth } from "../hooks/useAuth";
import parseApp from "../api/Axios";


const UserPage = () => {
    const [courses, setCourses] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const [email, setEmail] = useState("")
    const [uid, setUid] = useState("")
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")

    useEffect( () => {
        setCourses(courseList)
        getUserInformation()
    }, [])

    const {logout} = useAuth()
    console.log(courses)

    const getUserInformation = async () => {
        let res = await parseApp
        .get("/users/get_current_user")
        .then(res => {
            let userData = res.data
            setUserInfo(userData)
            setCourses(userData.courses)
            setEmail(userData.email)
            setUid(userData.uid)
            setUsername(userData.username)
        })
        return res
    }

    const handleLogOutLogic = (e) => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            e.preventDefault();
            removeJWTToken();
            logout();
        }, 2500)
    }

    return (
        <div className=" flex flex-col align-middle mt-6 h-screen pl-3">
            <h1 className=" text-5xl text-center font-bold">{username}</h1>
            <h1 className=" pl-3 pt-4 text-3xl font-bold text-center">email: {email}</h1>
            <LoadingButton
                loading={loading}
                loadingPosition="end"
                endIcon={<ExitToAppIcon />}
                variant="outlined"
                onClick={handleLogOutLogic}
            >
                Logout
            </LoadingButton>
            <div className={`grid grid-cols-${Math.min(courses.length, 3)} p-4 mt-6 h-5/6"`}>
                {courses.map((course, index) => (
                    <Card variant="outlined" key={index} sx={{ alignItems: 'center', mt:1, 
                    justifyContent:"center", alignContent:"center", justifyItems:"center"}} 
                    style={{width: '95%', height: '400px'}}>
                    <h1 key={index} className="text-center">{course.courseName}</h1>
                    <Typography sx={{ mb: 1.5, textAlign:"center"}} color="text.secondary">
                        {course.name}
                    </Typography>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default UserPage