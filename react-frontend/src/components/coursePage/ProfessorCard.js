import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export const ProfessorCard = ({ professor, index }) => {
    return (
        <Card
            variant="outlined"
            sx={{ alignItems: "center", mt: 2, boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)" }}
            style={{ width: "95%" }}
        >
            <h1 key={index} className="text-center mt-5  font-bold">
                TA: {professor.name}
            </h1>
            <Typography
                sx={{ mb: 1.5, textAlign: "center" }}
                color="text.secondary"
            >
                email: {professor.email}
            </Typography>
            <Typography
                sx={{ mb: 1.5, textAlign: "center" }}
                color="text.secondary"
            >
                This professor is cool
            </Typography>
        </Card>
    );
};

export default ProfessorCard;
