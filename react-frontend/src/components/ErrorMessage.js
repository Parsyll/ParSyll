import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';

const ErrorMessage = (props) => {
    return (
        <Alert severity="error">
            <AlertTitle>
                <strong>
                    Error
                </strong>
            </AlertTitle>
            <strong>
                {props.text}
            </strong>
        </Alert>
    )
}

export default ErrorMessage