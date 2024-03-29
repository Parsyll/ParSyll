import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export const TaCard = ({ instructor, index }) => {
    return (
        <Card
            variant="outlined"
            sx={{ alignItems: "center", mt: 2 }}
            style={{ width: "95%" }}
            className="drop-shadow-md"
        >
            <h1 key={index} className="text-center mt-5  font-bold text-red-700">
                TA: {instructor.name}
            </h1>
            <Typography
                sx={{ mb: 1.5, textAlign: "center" }}
                // className="text-red-700"
            >
                email: {instructor.email}
            </Typography>
        </Card>
    );
};

export default TaCard;
