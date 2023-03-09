import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';


export const ClassHourCard = ({weekday, startTime, endTime, index}) => {
    return (
        <div className={` col-start-${(index + 1) % 4} col-span-1`}>
            <Card variant="outlined" sx={{ alignItems: '', mt:1}} style={{width: '95%'}}>
                <h1 className="text-center mt-5 font-bold">{weekday}</h1>
                <Typography sx={{ mb: 1.5, textAlign:"center"}} color="text.secondary">
                    {startTime} - {endTime}
                </Typography>
            </Card>  
        </div>
    )
}

export default ClassHourCard;