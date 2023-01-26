import React, { useEffect, useState, useRef } from "react";
// Import the main component
// Import the styles
// Worker
import { Document, Page, pdfjs } from 'react-pdf';
import Container from '@mui/material/Container';

export const PdfViewer = ({pdfFile}) => {  
  useEffect(() => { pdfjs.GlobalWorkerOptions.workerSrc =`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;});
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages);
  }
  return (
    <Container maxWidth="lg">
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}
        pageLayout="oneColumn">
            <Page pageNumber={1} 
            renderAnnotationLayer={false}
            renderTextLayer={false}/>
        </Document>
        <p>
            Page {pageNumber} of {numPages}
        </p>
    </Container>
  );
};

export default PdfViewer;
