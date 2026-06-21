import { Routes, Route } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import Home from './pages/Home';

function App() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Container>
  );
}

export default App;
