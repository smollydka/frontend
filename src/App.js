import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './screens/LoginPage';
import Submission from './screens/Submission';
import ProtectedRoute from './ProtectedRoute';
import TeacherSubmission from './screens/TeacherSubmission';
import TeacherSubmissionDetail from './screens/TeacherSubmissionDetail';
import EditSubmission from './screens/EditSubmission'; // Importuj nový komponent
import SubmissionTests from './screens/SubmissionTests';
import ProfilePage from './screens/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/submission"
          element={
            <ProtectedRoute>
              <Submission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachersubmission"
          element={
            <ProtectedRoute>
              <TeacherSubmission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachersubmission/:triedaId"
          element={
            <ProtectedRoute>
              <TeacherSubmissionDetail />
            </ProtectedRoute>
          }
        />

<Route path="/profile" element={<ProfilePage />} />

<Route path="/zadania/:zadanieId/student/:studentId" element={<ProtectedRoute><SubmissionTests /></ProtectedRoute>} />

<Route
          path="/editzadanie/:id"
          element={
            <ProtectedRoute>
              <EditSubmission />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
