import Card from "@mui/material/Card";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from "react"
import { IconButton } from '@mui/material';

export const MiscCard = ({miscs, value }) => {
    const [hidden, setHidden] = useState(false)

    const handleChangeButtonState = (e) => {
        e.preventDefault()
        setHidden(!hidden)
    }

    const displayMisc = (field, header) => {
        const miscsFiltered = miscs.filter((misc) => misc.tag.toUpperCase() === field)
        if (miscsFiltered.length) {
            return (
            <div className="mt-3 mb-5">
                <h1 className="text-xl font-bold mb-5">{header}</h1>
                {miscsFiltered.map((misc, index) => (
                    <li key={index} className="ml-2 text-lg"> 
                        {misc.value}
                    </li>
                ))}
            </div>
            )
        }
        return ("")
    }
    return (
        <>
        {(miscs && miscs.length > 0) ?
            <div>
                    <div className="flex flex-row justify-between mb-3">
                        <h1 className=" pl-3 pt-4 text-3xl font-bold pb-3">
                            Miscs:
                        </h1>
                        <IconButton aria-label="show" size="small" onClick={handleChangeButtonState} disableRipple>
                            {hidden ? 
                                <AddIcon fontSize="small" /> :
                                <RemoveIcon fontSize="small" />
                        }
                        </IconButton>

                    </div>
                    <div className={`${hidden?"hidden":""}`}>
                        <Card
                            variant="outlined"
                            sx={{ alignItems: "", mt: 1, p:3}}
                            style={{ width: "95%" }}
                            className="drop-shadow-md"
                        >
                            <div className="ml-2 p-2">
                                {displayMisc("TEXTBOOK", "Textbooks: ")}
                                {displayMisc("EMAIL", "Email: ")}
                                {displayMisc("URL", "Links: ")}
                                {displayMisc("OTHER", "Other: ")}
                            </div>
                        </Card>
                    </div>
                </div> : ""
        }
            
            
            
        </>
        
    );
};

export default MiscCard;
