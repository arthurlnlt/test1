import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { HomePage } from './components/home/HomePage';
import { PostPage } from './components/home/post/PostPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { Navbar } from './components/layout/Navbar';
import { AuthProvider } from './lib/auth-context';
import { lazy, Suspense } from 'react';

// Lazy load less critical components
const YourPagesPage = lazy(() => import('./components/pages/YourPagesPage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-pulse text-primary-400">Loading...</div>
            </div>
          }>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/topic/:topicId" element={<HomePage />} />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="/your-pages" element={<YourPagesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}