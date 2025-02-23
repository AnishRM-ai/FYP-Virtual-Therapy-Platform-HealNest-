import React, { useState } from "react";
import { Box, TextField, Button, Typography, Chip } from "@mui/material";

const BasicInfo = ({ onNext }) => {
  const [data, setData] = useState({
    degree: "",
    institution: "",
    year: "",
    languages: [],
    specializations: [],
  });

  const specializations = ["Depression", "Anxiety", "Trauma", "Relationship"];

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSpecializationClick = (spec) => {
    setData((prevData) => ({
      ...prevData,
      specializations: prevData.specializations.includes(spec)
        ? prevData.specializations.filter((s) => s !== spec)
        : [...prevData.specializations, spec],
    }));
  };

  const handleLanguageKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const newLang = e.target.value.trim();
      if (!data.languages.includes(newLang)) {
        setData((prevData) => ({
          ...prevData,
          languages: [...prevData.languages, newLang],
        }));
      }
      e.target.value = "";
    }
  };

  const handleLanguageDelete = (langToDelete) => {
    setData((prevData) => ({
      ...prevData,
      languages: prevData.languages.filter((lang) => lang !== langToDelete),
    }));
  };

  return (
    <Box>
      <Typography variant="h6">Education</Typography>
      <TextField
        name="degree"
        fullWidth
        margin="normal"
        label="Degree"
        onChange={handleChange}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
      />
      <TextField
        name="institution"
        fullWidth
        margin="normal"
        label="Institution"
        onChange={handleChange}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
      />
      <TextField
        name="year"
        fullWidth
        margin="normal"
        label="Year"
        type="number"
        onChange={handleChange}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
      />

      <Typography variant="h6" mt={2}>Languages</Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Enter a language and press Enter"
        onKeyDown={handleLanguageKeyDown}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
      />
      <Box display="flex" gap={1} mt={1} flexWrap="wrap">
        {data.languages.map((lang) => (
          <Chip key={lang} label={lang} onDelete={() => handleLanguageDelete(lang)} color="primary" />
        ))}
      </Box>

      <Typography variant="h6" mt={2}>Specialization</Typography>
      <Box display="flex" gap={1} mt={1} flexWrap="wrap">
        {specializations.map((spec) => (
          <Chip
            key={spec}
            label={spec}
            clickable
            color={data.specializations.includes(spec) ? "primary" : "default"}
            onClick={() => handleSpecializationClick(spec)}
          />
        ))}
      </Box>

      <Button variant="contained" sx={{ mt: 3 }} onClick={() => onNext(data)}>Next</Button>
    </Box>
  );
};

export default BasicInfo;
