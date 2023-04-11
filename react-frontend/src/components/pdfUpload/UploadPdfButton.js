import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import PdfViewer from "./PdfViewer";
import { createTheme } from "@mui/material/styles";

import parseApp from "../../api/Axios";
import PdfEdit from "./PdfEdit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  overflow: "scroll",
  boxShadow: 24,
  p: 4,
};

const styles = createTheme({
  modalStyle1: {
    position: "absolute",
    top: "10%",
    left: "10%",
    overflow: "scroll",
    height: "100%",
    display: "block",
  },
});

export default function BasicModal({
  openPdf,
  setOpenPdf,
  pdfFile,
  setPdfFile,
  handleErrorMessage,
}) {
  const [loading, setLoading] = useState(false);
  const [parsesuccess, setParseSuccess] = useState(false);
  const [parseContent, setParseContent] = useState(null);
  const handleCloseModal = (e) => {
    e.preventDefault();
    setPdfFile(null);
    setOpenPdf(false);
  };

  const handleSendPdf = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (pdfFile) {
        var formData = new FormData();
        var headers = { "Content-Type": "multipart/form-data" };
        let course_id = "";
        let file_id = "";
        formData.append("file", pdfFile);
        await parseApp
          .post("/pdfs/submit", formData, headers)
          .then((res) => {
            console.log(res);
            course_id = res.data.course_id;
            file_id = res.data.file_id; // syllabus_id
          })
          .catch((err) => {
            console.error(err.response);
          });

        await parseApp
          .post(`pdfs/parse/${course_id}/${file_id}`, formData, headers)
          .then((res) => {
            console.log(res);
            setParseContent(res.data);
            setParseSuccess(true);
          });
      }
    } catch (e) {
      console.log(e);
      handleErrorMessage(
        "Something wrong has occured when parsing your pdf. Please Try Again."
      );
      setPdfFile(null);
    }
    setLoading(false);
  };

  return (
    <div>
      <Button hidden>UPLOAD PDF</Button>
      <Modal
        style={{ overflow: "scroll" }}
        disableEnforceFocus
        open={openPdf}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {parsesuccess ? (
          <Box>
            <PdfEdit course={parseContent} handleClose={handleCloseModal} />
          </Box>
        ) : (
          <Box sx={style}>
            <PdfViewer
              pdfFile={pdfFile}
              handleSendPdf={handleSendPdf}
              loading={loading}
            />
          </Box>
        )}
      </Modal>
    </div>
  );
}
