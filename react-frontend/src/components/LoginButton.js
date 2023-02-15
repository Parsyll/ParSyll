import Button from '@mui/material/Button';


const LoginButton = (props) => {

    return (
        <Button
            type={props.type}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={props.handleOnClick}
        >
            {props.text}
        </Button>
    )
}

export default LoginButton;