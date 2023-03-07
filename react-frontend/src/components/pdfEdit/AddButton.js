import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

export const AddButton = ({setValue, originalValue, insertValue}) => {

    const handleOnClick = () => {
        let copiedOriginal = JSON.parse(JSON.stringify(originalValue));
        copiedOriginal.push(insertValue);
        setValue(copiedOriginal)
    }
    return (
        <IconButton aria-label="delete" onClick={handleOnClick}>
            <AddIcon />
        </IconButton>
    )
}

export default AddButton