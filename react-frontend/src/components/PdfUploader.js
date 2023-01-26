import React, { useEffect, useState, useRef } from "react";
import Button from '@mui/material/Button';
import UploadPdfButton from './UploadPdfButton'

export const PdfUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileError, setPdfFileError] = useState("");
  const [openPdf, setOpenPdf] = useState(false);

  const fileType = ["application/pdf"];

  const handlePdfFileChange = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        setPdfFile(selectedFile);
        setOpenPdf(true);
        setPdfFileError("");
      } else {
        setPdfFile(null);
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  // const ref = useRef();

  return (
    <div>
      <form className="form-group">
        <input
          type="file"
          className="form-control"
          required
          // ref = {ref}
          onClick = {e => (e.target.value = null)}
          onChange={handlePdfFileChange}
        />
        {pdfFileError && <div className="error-msg">{pdfFileError}</div>}
        <br></br>
        {pdfFile? 
          <UploadPdfButton openPdf={openPdf} setOpenPdf={setOpenPdf} pdfFile={pdfFile} setPdfFile={setPdfFile}/>:

          <Button variant="contained" color="error" 
            size="large"
            disabled
          > UPLOAD PDF
          </Button> 
        }
      </form>
    </div>
  );
};

export default PdfUploader;
