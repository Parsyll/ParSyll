import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export const ProfessorCard = ({ professor, index }) => {
    return (
        <Card
            variant="outlined"
            sx={{ alignItems: "center", mt: 2 }}
            style={{ width: "95%" }}
            className="drop-shadow-md"
        >
            <h1
                key={index}
                className="text-center mt-5  font-bold text-xl text-blue-600"
            >
                Professor: {professor.name}
            </h1>
            <Typography
                sx={{ mb: 1.5, textAlign: "center" }}
                // color="text.secondary"
                className="text-blue-500"
            >
                email: {professor.email}
            </Typography>
        </Card>
    );
};

export default ProfessorCard;
