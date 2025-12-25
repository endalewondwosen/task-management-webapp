import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/tasks/Tasks';
import { TaskDetail } from './pages/tasks/TaskDetail';
import { TaskFormPage } from './pages/tasks/TaskFormPage';
import { Projects } from './pages/projects/Projects';
import { ProjectDetail } from './pages/projects/ProjectDetail';
import { ProjectFormPage } from './pages/projects/ProjectFormPage';
import { Users } from './pages/users/Users';
import { UserDetail } from './pages/users/UserDetail';
import { UserFormPage } from './pages/users/UserFormPage';
import { UserActivityHistory } from './pages/users/UserActivityHistory';
import { Labels, LabelFormPage } from './pages/labels';
import { Comments } from './pages/comments';
import { Roles, RoleDetail, RoleFormPage } from './pages/roles';
import { Sessions } from './pages/sessions';
import { Settings } from './pages/settings/Settings';
import { AxiosError } from 'axios';

// Retry function with exponential backoff
const retryDelay = (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000);

// Determine if error should be retried
const shouldRetry = (failureCount: number, error: unknown) => {
  // Don't retry on 4xx errors (client errors)
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status && status >= 400 && status < 500) {
      return false;
    }
  }
  // Retry up to 3 times for network errors and 5xx errors
  return failureCount < 3;
};

// Create a client with improved error handling and retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: shouldRetry,
      retryDelay,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on client errors (4xx)
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry once for network/server errors
        return failureCount < 1;
      },
      retryDelay,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <ConfirmProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Protected routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Task routes */}
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Tasks />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TaskFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TaskDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TaskFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Project routes */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Projects />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* User routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/activity"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserActivityHistory />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Label routes */}
            <Route
              path="/labels"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Labels />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/labels/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LabelFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/labels/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LabelFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Comment routes */}
            <Route
              path="/comments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Comments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Role routes */}
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Roles />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RoleFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RoleDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RoleFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Sessions routes */}
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Sessions />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Settings routes */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        </ConfirmProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
