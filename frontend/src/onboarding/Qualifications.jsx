import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Chip } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";

const Qualifications = ({ onNext, onBack }) => {
  const [files, setFiles] = useState([null, null, null]);

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const updatedFiles = [...files];
      updatedFiles[index] = file;
      setFiles(updatedFiles);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = null;
    setFiles(updatedFiles);
  };

  const renderFileUploader = (label, index) => (
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
        id={`qualificationProof${index}`}
        onChange={(e) => handleFileChange(e, index)}
      />
      <label htmlFor={`qualificationProof${index}`} style={{ cursor: "pointer" }}>
        <CloudUpload fontSize="large" color="primary" />
        <Typography variant="body1">{files[index] ? files[index].name : `Upload ${label}`}</Typography>
      </label>
      {files[index] && (
        <IconButton
          sx={{ position: "absolute", top: 5, right: 5 }}
          onClick={() => handleRemoveFile(index)}
        >
          <Delete color="error" />
        </IconButton>
      )}
    </Box>
  );

  const handleNext = () => {
    // Convert files to an array of file names
    const fileNames = files.filter(file => file !== null).map(file => file.name);

    // Create a JSON string for qualificationProof
    const qualificationProof = JSON.stringify(fileNames);

    // Pass the data to the parent component
    onNext({ qualificationProof });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Qualifications
      </Typography>

      <Box mt={2}>{renderFileUploader("Proof 1", 0)}</Box>
      <Box mt={2}>{renderFileUploader("Proof 2", 1)}</Box>
      <Box mt={2}>{renderFileUploader("Proof 3", 2)}</Box>

      {files.some(file => file !== null) && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Qualification Proofs:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {files.map((file, index) => (
              file && (
                <Chip
                  key={index}
                  label={file.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )
            ))}
          </Box>
        </Box>
      )}

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Qualifications;
