import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';

export const MinusButton = ({setValue, originalValue, index}) => {

    const handleOnClick = () => {
        let copiedOriginal = JSON.parse(JSON.stringify(originalValue));
        copiedOriginal.splice(index, 1);
        setValue(index, copiedOriginal)
    }
    return (
        <IconButton aria-label="delete" 
        onClick={handleOnClick}
        sx={{
            ml: 1,
            "&.MuiButtonBase-root:hover": {
              bgcolor: "transparent"
            }
          }}>
            <RemoveIcon />
        </IconButton>
    )
}

export default MinusButton