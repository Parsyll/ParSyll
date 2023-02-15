import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


const LoginButtonDisabled = (props) => {

    return (
        <Button
            fullWidth
            variant="contained"
            disabled
            sx={{ mt: 3, mb: 2 }}
        >
            {props.text} 
        </Button>
    )
}

export default LoginButtonDisabled;