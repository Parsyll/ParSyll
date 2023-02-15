import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';


const ButtonLoading = (props) => {

    return (
        <LoadingButton
        loading
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="outlined"
      >
        {props.text}
      </LoadingButton>
    )
}

export default ButtonLoading;