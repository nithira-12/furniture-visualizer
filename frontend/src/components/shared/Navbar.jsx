import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    padding: '0 32px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: '0',
    zIndex: '100',
    borderBottom: '1px solid #e5e7eb',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  brand: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563eb',
    letterSpacing: '-0.3px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandIcon: {
    fontSize: '24px',
  },
  dashboardButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    color: '#374151',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

function Navbar() {
  const navigate = useNavigate();
  
  // Safely parse user data
  let user = { name: 'User' };
  try {
    const userJson = localStorage.getItem('user');
    if (userJson && userJson !== 'undefined') {
      user = JSON.parse(userJson);
    }
  } catch (e) {
    console.error('Failed to parse user:', e);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <div style={styles.brand} onClick={() => navigate('/dashboard')} title="Go to Dashboard">
          <span style={styles.brandIcon}>🏗️</span>
          ArchDesign
        </div>
        <button style={styles.dashboardButton} onClick={() => navigate('/dashboard')}>
          📐 My Designs
        </button>
      </div>
      <div style={styles.right}>
        <span style={styles.userName}>👤 {user.name}</span>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;