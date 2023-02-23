import { useEffect, useState } from "react"
import courseList from "../helper/course"
import Button from '@mui/material/Button';
import { removeJWTToken } from '../helper/jwt';
import LoadingButton from '@mui/lab/LoadingButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';



const UserPage = ({handleSetLogin}) => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setCourses(courseList)
    }, [])

    const handleLogOutLogic = (e) => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            e.preventDefault();
            removeJWTToken();
            handleSetLogin(false);
        }, 2500)
    }

    return (
        <div className=" flex flex-col align-middle mt-6 h-screen pl-3">
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
                    </Typography>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default UserPage