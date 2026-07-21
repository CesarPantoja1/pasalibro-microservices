import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Login from '../pages/auth/Login.jsx';
import BookDetail from '../pages/books/BookDetail.jsx';
import NotFound from '../pages/errors/NotFound.jsx';
import Profile from '../pages/profile/Profile.jsx';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/books/:id" element={<BookDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
