import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Main from './pages/Main';



function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Main/>
                }
              />
        </Routes>
          </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App;
