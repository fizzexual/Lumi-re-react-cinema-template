import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Loader2 } from 'lucide-react'

// Code-split each route so the homepage ships a minimal bundle.
const HomePage = lazy(() => import('./pages/HomePage'))
const BrowsePage = lazy(() => import('./pages/BrowsePage'))
const FilmDetailPage = lazy(() => import('./pages/FilmDetailPage'))
const CinemasPage = lazy(() => import('./pages/CinemasPage'))
const OffersPage = lazy(() => import('./pages/OffersPage'))
const SeatSelectionPage = lazy(() => import('./pages/SeatSelectionPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Loader2 className="h-8 w-8 animate-spin text-gold-300" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/browse"
          element={
            <Suspense fallback={<PageLoader />}>
              <BrowsePage />
            </Suspense>
          }
        />
        <Route
          path="/film/:slug"
          element={
            <Suspense fallback={<PageLoader />}>
              <FilmDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/cinemas"
          element={
            <Suspense fallback={<PageLoader />}>
              <CinemasPage />
            </Suspense>
          }
        />
        <Route
          path="/offers"
          element={
            <Suspense fallback={<PageLoader />}>
              <OffersPage />
            </Suspense>
          }
        />
        <Route
          path="/seats/:showtimeId"
          element={
            <Suspense fallback={<PageLoader />}>
              <SeatSelectionPage />
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<PageLoader />}>
              <CheckoutPage />
            </Suspense>
          }
        />
        <Route
          path="/confirmation/:ref"
          element={
            <Suspense fallback={<PageLoader />}>
              <ConfirmationPage />
            </Suspense>
          }
        />
        <Route
          path="/account"
          element={
            <Suspense fallback={<PageLoader />}>
              <AccountPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
