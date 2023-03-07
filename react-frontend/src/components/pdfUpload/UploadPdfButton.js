import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import PdfViewer from './PdfViewer';
import axios from 'axios';
import { getJWTToken } from '../../helper/jwt';

import parseApp from '../../api/Axios';

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
  const [loading, setLoading] = useState(false);
  const handleCloseModal = (e) => {
    e.preventDefault();
    setPdfFile(null);
    setOpenPdf(false);
  }

  const handleSendPdf = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      if(pdfFile) {
        var formData = new FormData();
        var headers = {'Content-Type': 'multipart/form-data'};
        let course_id = "";
        formData.append('file', pdfFile);
        await parseApp
          .post("/pdfs/submit", formData, headers)
          .then((res) => {
            console.log(res)
            course_id = res.data.course_id
          })
          .catch((err) => {
            console.error(err.response);
          });
        
        await parseApp.post(`pdfs/parse/${course_id}`, formData, headers)
          .then((res) => {
            console.log(res)
          })

          setPdfFile(null);
      }
    } catch (e) {
      console.log(e)
    }
    setLoading(false);
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
          <PdfViewer pdfFile={pdfFile} handleSendPdf={handleSendPdf} loading={loading}/>
        </Box>
      </Modal>
    </div>
  );
}