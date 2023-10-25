import './App.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { processFile, restoreFromVer2 } from './utils';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import { Filter } from './types';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getData } from './api';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const app = () => {
  const [allFilters, setAllFilters] = React.useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessFile = () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const allText = fileReader.result;
        if (typeof allText === 'string') {

          const processedText = processFile(allText,
            allFilters.filter(f => selectedFilters.includes(f.name)));

          const link = document.createElement('a');
          link.download = 'Processed ' + file.name;
          const blob = new Blob([processedText], { type: 'text/plain' });
          link.href = window.URL.createObjectURL(blob);
          link.click();
          link.remove();
        }
      };

      fileReader.readAsText(file);
    }
  };

  const handleRestore = () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const allText = fileReader.result;
        if (typeof allText === 'string') {

          const processedText = restoreFromVer2(allText);

          const link = document.createElement('a');
          link.download = 'Processed ' + file.name;
          const blob = new Blob([processedText], { type: 'text/plain' });
          link.href = window.URL.createObjectURL(blob);
          link.click();
          link.remove();
        }
      };

      fileReader.readAsText(file);
    }
  };

  const toggleChecked = (filterName: string) => {
    if (selectedFilters.includes(filterName)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filterName));
    } else {
      setSelectedFilters(selectedFilters.concat(filterName));
    }
  };

  React.useEffect(() => {
    getData().then((data) => {
      setAllFilters(data.filters);
      setSelectedFilters(data.filters.map(f => f.name));
    });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <Typography variant='h3'>
            {file?.name || 'Select a file...'}
          </Typography>
          <Stack spacing={3} direction="row">
            <Button variant="outlined" component="label">
              Upload file
              <input
                onChange={handleFileChange}
                type="file"
                hidden
              />
            </Button>
            <Button variant="contained" disabled={!file}
              onClick={handleProcessFile}>
              Process
            </Button>
            <Button variant="contained" disabled={!file}
              onClick={handleRestore}>
              Restore
            </Button>
          </Stack>
          <FormGroup row>
            {allFilters.map(f => <FormControlLabel control={
              <Checkbox checked={selectedFilters.includes(f.name)}
                onChange={() => toggleChecked(f.name)} />} label={f.name} />)}
          </FormGroup>
        </header>
      </div>
    </ThemeProvider>
  );
};

export default app;
