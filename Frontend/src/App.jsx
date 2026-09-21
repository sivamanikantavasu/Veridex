import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './routes/AuthContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { RequireAuth, RequireAdmin, RedirectIfAuth } from './routes/guards.jsx'

// Public pages
import LandingPage from './pages/public/LandingPage.jsx'
import LoginPage from './pages/public/LoginPage.jsx'
import CaptchaVerificationPage from './pages/public/CaptchaVerificationPage.jsx'
import SignUpPage from './pages/public/SignUpPage.jsx'
import ForgotPasswordPage from './pages/public/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/public/ResetPasswordPage.jsx'
import AboutPage from './pages/public/AboutPage.jsx'
import ContactPage from './pages/public/ContactPage.jsx'
import PlansPage from './pages/public/PlansPage.jsx'
import TermsPage from './pages/public/TermsPage.jsx'
import PrivacyPage from './pages/public/PrivacyPage.jsx'
import FaqPage from './pages/public/FaqPage.jsx'
import { Page403, Page404, Page401 } from './pages/public/ErrorPages.jsx'

// User pages
import UserHome from './pages/user/UserHome.jsx'
import LibraryPage from './pages/user/LibraryPage.jsx'
import ContentDetailPage from './pages/user/ContentDetailPage.jsx'
import ReaderPage from './pages/user/ReaderPage.jsx'
import HistoryPage from './pages/user/HistoryPage.jsx'
import CollectionsPage from './pages/user/CollectionsPage.jsx'
import CollectionDetailPage from './pages/user/CollectionDetailPage.jsx'
import SubscriptionPage from './pages/user/SubscriptionPage.jsx'
import ProfilePage from './pages/user/ProfilePage.jsx'
import SecurityPage from './pages/user/SecurityPage.jsx'
import UpgradePage from './pages/user/UpgradePage.jsx'

// Admin pages
import AdminHome from './pages/admin/AdminHome.jsx'
import ContentManagementPage from './pages/admin/ContentManagementPage.jsx'
import ContentNewPage from './pages/admin/ContentNewPage.jsx'
import UsersPage from './pages/admin/UsersPage.jsx'
import EntitlementsPage from './pages/admin/EntitlementsPage.jsx'
import UsagePage from './pages/admin/UsagePage.jsx'
import AuditLogPage from './pages/admin/AuditLogPage.jsx'
import AdminSecurityPage from './pages/admin/AdminSecurityPage.jsx'
import SystemHealthPage from './pages/admin/SystemHealthPage.jsx'
import AdminProfilePage from './pages/admin/AdminProfilePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/Veridex" replace />} />

            {/* Public */}
            <Route path="/Veridex" element={<LandingPage />} />
            <Route path="/Veridex/Log-In" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
            <Route path="/Veridex/Verification/Captcha" element={<CaptchaVerificationPage />} />
            <Route path="/Veridex/Sign-Up" element={<RedirectIfAuth><SignUpPage /></RedirectIfAuth>} />
            <Route path="/Veridex/Forgot-Password" element={<ForgotPasswordPage />} />
            <Route path="/Veridex/Reset-Password" element={<ResetPasswordPage />} />
            <Route path="/Veridex/About" element={<AboutPage />} />
            <Route path="/Veridex/Contact" element={<ContactPage />} />
            <Route path="/Veridex/Plans" element={<PlansPage />} />
            <Route path="/Veridex/Terms" element={<TermsPage />} />
            <Route path="/Veridex/Privacy" element={<PrivacyPage />} />
            <Route path="/Veridex/FAQ" element={<FaqPage />} />
            <Route path="/Veridex/403" element={<Page403 />} />
            <Route path="/Veridex/401" element={<Page401 />} />

            {/* User area */}
            <Route path="/Veridex/User/:name/:email">
              <Route path="Home" element={<RequireAuth><UserHome /></RequireAuth>} />
              <Route path="Library" element={<RequireAuth><LibraryPage /></RequireAuth>} />
              <Route path="Content/:contentId" element={<RequireAuth><ContentDetailPage /></RequireAuth>} />
              <Route path="Reader/:contentId" element={<RequireAuth><ReaderPage /></RequireAuth>} />
              <Route path="History" element={<RequireAuth><HistoryPage /></RequireAuth>} />
              <Route path="Collections" element={<RequireAuth><CollectionsPage /></RequireAuth>} />
              <Route path="Collection/:collectionId" element={<RequireAuth><CollectionDetailPage /></RequireAuth>} />
              <Route path="Subscription" element={<RequireAuth><SubscriptionPage /></RequireAuth>} />
              <Route path="Profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="Security" element={<RequireAuth><SecurityPage /></RequireAuth>} />
              <Route path="Upgrade" element={<RequireAuth><UpgradePage /></RequireAuth>} />
            </Route>

            {/* Admin area */}
            <Route path="/Veridex/Admin/:name/:email">
              <Route path="Home" element={<RequireAdmin><AdminHome /></RequireAdmin>} />
              <Route path="Content" element={<RequireAdmin><ContentManagementPage /></RequireAdmin>} />
              <Route path="Content/New" element={<RequireAdmin><ContentNewPage /></RequireAdmin>} />
              <Route path="Users" element={<RequireAdmin><UsersPage /></RequireAdmin>} />
              <Route path="Entitlements" element={<RequireAdmin><EntitlementsPage /></RequireAdmin>} />
              <Route path="Usage" element={<RequireAdmin><UsagePage /></RequireAdmin>} />
              <Route path="Audit-Log" element={<RequireAdmin><AuditLogPage /></RequireAdmin>} />
              <Route path="Security" element={<RequireAdmin><AdminSecurityPage /></RequireAdmin>} />
              <Route path="System-Health" element={<RequireAdmin><SystemHealthPage /></RequireAdmin>} />
              <Route path="Profile" element={<RequireAdmin><AdminProfilePage /></RequireAdmin>} />
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
