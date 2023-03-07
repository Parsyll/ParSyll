import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';


export const TaCard = ({instructor, index}) => {

    return (
        <Card variant="outlined" sx={{ alignItems: 'center', mt:2}} style={{width: '95%'}}>
            <h1 key={index} className="text-center mt-5  font-bold">{instructor}</h1>
            <Typography sx={{ mb: 1.5, textAlign:"center"}} color="text.secondary">
                This instructor is cool
            </Typography>
        </Card>  
    )
}

export default TaCard;