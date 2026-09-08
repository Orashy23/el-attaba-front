import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AdminDataProvider } from './context/AdminDataContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ListingPage from './pages/ListingPage'
import AccountPage from './pages/AccountPage'
import OrdersPage from './pages/OrdersPage'
import AssistantPage from './pages/AssistantPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminDiscountsPage from './pages/admin/AdminDiscountsPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import AdminAuditLogPage from './pages/admin/AdminAuditLogPage'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminDataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/category/:slug" element={<ListingPage />} />
                <Route path="/search" element={<ListingPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/discounts" element={<AdminDiscountsPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/admin/audit-log" element={<AdminAuditLogPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AdminDataProvider>
      </CartProvider>
    </AuthProvider>
  )
}
