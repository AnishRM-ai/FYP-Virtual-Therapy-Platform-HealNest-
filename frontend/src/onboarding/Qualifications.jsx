import React, { useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { CloudUpload, CheckCircle, Delete } from "@mui/icons-material";

const Qualifications = ({ onNext, onBack }) => {
  const [files, setFiles] = useState({
    idFile: null,
    licenseFile: null,
    certificationFile: null,
  });

  const handleFileChange = (event, fieldName) => {
    setFiles({ ...files, [fieldName]: event.target.files[0] });
  };

  const handleRemoveFile = (fieldName) => {
    setFiles({ ...files, [fieldName]: null });
  };

  const renderFileUploader = (label, fieldName) => (
    <Box
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 2,
        p: 2,
        textAlign: "center",
        position: "relative",
        transition: "all 0.3s ease-in-out",
        "&:hover": { borderColor: "#3f51b5", bgcolor: "#f4f6ff" },
      }}
    >
      <input
        type="file"
        accept=".pdf,.jpg,.png"
        style={{ display: "none" }}
        id={fieldName}
        onChange={(e) => handleFileChange(e, fieldName)}
      />
      <label htmlFor={fieldName} style={{ cursor: "pointer" }}>
        <CloudUpload fontSize="large" color="primary" />
        <Typography variant="body1">{files[fieldName] ? files[fieldName].name : `Upload ${label}`}</Typography>
      </label>
      {files[fieldName] && (
        <IconButton
          sx={{ position: "absolute", top: 5, right: 5 }}
          onClick={() => handleRemoveFile(fieldName)}
        >
          <Delete color="error" />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Qualifications
      </Typography>

      <Box mt={2}>{renderFileUploader("ID", "idFile")}</Box>
      <Box mt={2}>{renderFileUploader("License", "licenseFile")}</Box>
      <Box mt={2}>{renderFileUploader("Certifications", "certificationFile")}</Box>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={() => onNext(files)}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Qualifications;
