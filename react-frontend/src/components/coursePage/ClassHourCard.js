import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';


export const ClassHourCard = ({time}) => {

    return (
        <Card variant="outlined" sx={{ alignItems: 'center', mt:1}} style={{width: '95%'}}>
            <h1 className="text-center mt-5 font-bold">{time.weekday}</h1>
            <Typography sx={{ mb: 1.5, textAlign:"center"}} color="text.secondary">
                {time.startTime} - {time.endTime}
            </Typography>
        </Card>  
    )
}

export default ClassHourCard;