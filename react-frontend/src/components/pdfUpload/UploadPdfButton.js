import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import PdfViewer from './PdfViewer';
import { createTheme } from '@mui/material/styles';

import parseApp from '../../api/Axios';
import PdfEdit from './PdfEdit';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  overflow:'scroll',
  boxShadow: 24,
  p: 4,
};

const styles = createTheme({
  modalStyle1:{
    position:'absolute',
    top:'10%',
    left:'10%',
    overflow:'scroll',
    height:'100%',
    display:'block'
  }
});


export default function BasicModal({openPdf, setOpenPdf, pdfFile, setPdfFile, handleErrorMessage}) {
  const [loading, setLoading] = useState(false);
  const [parsesuccess, setParseSuccess] = useState(false);
  const [parseContent, setParseContent] = useState(null)
  const [fileInfo, setFileInfo] = useState("")
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
        let file_info = "";
        let file_id = "";
        formData.append('file', pdfFile);
        await parseApp
          .post("/pdfs/submit", formData, headers)
          .then((res) => {
            console.log(res)
            course_id = res.data.course_id
            setFileInfo(res.data)
            file_id = res.data.file_id // syllabus_id
          })
          .catch((err) => {
            console.error(err.response);
          });
        
        await parseApp.post(`pdfs/parse/${course_id}/${file_id}`, formData, headers)
          .then((res) => {
            console.log(res)
            setParseContent(res.data)
            setParseSuccess(true);
          })
          // setPdfFile(null);
      }
    } catch (e) {
      console.log(e)
      handleErrorMessage("Something wrong has occured when parsing your pdf. Please Try Again.")
      setPdfFile(null);
    }
    setLoading(false);
  }

  return (
    <div>
      <Button hidden>UPLOAD PDF</Button>
      <Modal
        style={{overflow:"scroll"}}
        disableEnforceFocus
        open={openPdf}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {parsesuccess?
          <Box>
            <PdfEdit course={parseContent} fileInfo={fileInfo}/>
          </Box>:
          <Box sx={style}>
            <PdfViewer pdfFile={pdfFile} handleSendPdf={handleSendPdf} loading={loading} />
          </Box>
        }
      </Modal>
    </div>
  );
}

/*
<div className="mt-5">
  <label className="input-field inline-flex items-baseline border-2 border-black rounded  p-4">
      <span className="text-md font-semibold text-zinc-900 mr-4" htmlFor="name">
          ClassTime
      </span>
  <div className="flex-1 leading-none">
      <input id="handle" type="text" className="w-full mr-2 pl-1 bg-transparent focus:outline-none" name="handle" placeholder="start-time" value={classStart}/>
  </div>
  <div className="flex-1 leading-none">
      <input id="handle" type="text" className="w-full pl-1 bg-transparent focus:outline-none" name="handle" placeholder="end-time" value={classEnd}/>
  </div>
  </label>
</div> 
            */