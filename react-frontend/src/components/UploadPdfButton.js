import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PdfViewer from './PdfViewer';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({openPdf, setOpenPdf, pdfFile, setPdfFile}) {
  const handleCloseModal = (e) => {
    e.preventDefault();
    setPdfFile(null);
    setOpenPdf(false);
  }

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
    // ref.current.value = "";
  }

  return (
    <div>
      <Button hidden>UPLOAD PDF</Button>
      <Modal
        open={openPdf}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PdfViewer pdfFile={pdfFile} handleSendPdf={handleSendPdf}/>
          {/* <Button onClick={handleSendPdf}>Parse PDF</Button> */}
        </Box>
      </Modal>
    </div>
  );
}