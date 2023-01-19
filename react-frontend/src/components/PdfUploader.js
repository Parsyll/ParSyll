import React, { useEffect, useState, useRef } from "react";
import PdfViewer from './PdfViewer'
import axios from "axios";
import Button from '@mui/material/Button';

export const PdfUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileError, setPdfFileError] = useState("");
  const fileType = ["application/pdf"];

  const handlePdfFileChange = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        setPdfFile(selectedFile);
        setPdfFileError("");
      } else {
        setPdfFile(null);
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  const ref = useRef();

  const handleSendPdf = (e) => {
    e.preventDefault();
    if(pdfFile) {
      var formData = new FormData();
      var headers = {'Content-Type': 'multipart/form-data'};
      formData.append('file', pdfFile);
      axios
        .post("http://127.0.0.1:8000/pdfsubmit", formData, headers)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err.response);
        });
        setPdfFile(null);
    }
    ref.current.value = "";
  }


  return (
    <div>
      <br></br>
      <form className="form-group">
        <input
          type="file"
          className="form-control"
          required
          ref = {ref}
          onClick = {e => (e.target.value = null)}
          onChange={handlePdfFileChange}
        />
        {pdfFileError && <div className="error-msg">{pdfFileError}</div>}
        <br></br>
        {pdfFile? 
          <Button variant="contained" color="success" 
            size="large" 
            onClick={handleSendPdf}> UPLOAD
          </Button> :

          <Button variant="contained" color="error" 
            size="large"
            disabled
          > UPLOAD
          </Button> 
        }
      </form>

      <br></br>

      {pdfFile? 
      <div>
        <h4>View PDF</h4>
        <PdfViewer pdfFile={pdfFile} /> 
      </div> : ""
      }

    </div>
  );
};

export default PdfUploader;
