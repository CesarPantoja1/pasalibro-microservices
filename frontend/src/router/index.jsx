import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import SignIn from '../pages/auth/SignIn.jsx';
import SignUp from '../pages/auth/SignUp.jsx';
import BookDetail from '../pages/books/BookDetail.jsx';
import CreateBook from '../pages/books/CreateBook.jsx';
import EditBook from '../pages/books/EditBook.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import NotFound from '../pages/errors/NotFound.jsx';
import Profile from '../pages/profile/Profile.jsx';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/books/new" element={<CreateBook />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/books/:id" element={<BookDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
