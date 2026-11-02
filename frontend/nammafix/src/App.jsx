import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ReportIssue from './pages/ReportIssue'
import MapView from './pages/MapView'
import IssueList from './pages/IssueList'
import IssueDetail from './pages/IssueDetail'
import MyReports from './pages/MyReports'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* pages with their own layout */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* pages inside the sidebar layout */}
      <Route element={<AppLayout />}>
        <Route path="/issues" element={<IssueList />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
        <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute staffOnly><AdminPanel /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}