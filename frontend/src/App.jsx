import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Vista temporal para el dashboard cuando inicia sesión con éxito */}
        <Route path="/dashboard" element={
          <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>Dashboard</h1>
            <p style={{ color: 'green', marginBottom: '1rem' }}>¡Has iniciado sesión correctamente!</p>
            <button 
              onClick={() => { 
                localStorage.removeItem('token'); 
                window.location.href = '/login'; 
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
