import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageOrders from './pages/Admin/ManageOrders';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Cart from './components/Cart';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/login" element={<Login />} />

            {/* Protected User Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/orders" element={<MyOrders />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route path="orders" element={<ManageOrders />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </main>
        <Footer />
        <Cart />
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;
