import React, { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import Container from '@mui/material/Container';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import CopyAllIcon from '@mui/icons-material/CopyAll';

export const PdfViewer = ({pdfFile, handleSendPdf, loading}) => {  
  useEffect(() => { pdfjs.GlobalWorkerOptions.workerSrc =`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;});
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages);
  }

  const handlePageLeft = () => {
    setPageNumber(pageNumber - 1)
  }
  
  const handlePageRight = () => {
    setPageNumber(pageNumber + 1)
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center">
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}
        pageLayout="oneColumn">
            <Page pageNumber={pageNumber} 
            renderAnnotationLayer={false}
            renderTextLayer={false}/>
        </Document>
        <div className="flex flex-row">
          <KeyboardDoubleArrowLeftIcon onClick={pageNumber==1?null:handlePageLeft}/>
          <p>
              Page {pageNumber} of {numPages}
          </p>
          <KeyboardDoubleArrowRightIcon onClick={pageNumber==numPages?null: handlePageRight}/>
        </div>
        <LoadingButton
          loading={loading}
          loadingPosition="end"
          endIcon={<CopyAllIcon />}
          variant="contained"
          sx={{ mt: 4, p:3}}
          onClick={handleSendPdf}
        >
          PARSE PDF
        </LoadingButton> 
    </div>
  );
};

export default PdfViewer;
