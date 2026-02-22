import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  navbar: {
    backgroundColor: '#FFFFFF',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 12px rgba(92, 61, 46, 0.08)',
    position: 'sticky',
    top: '0',
    zIndex: '100',
  },
  brand: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#5C3D2E',
    letterSpacing: '-0.5px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2C1810',
  },
  logoutButton: {
    padding: '8px 18px',
    backgroundColor: 'transparent',
    border: '1.5px solid #5C3D2E',
    color: '#5C3D2E',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
};

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>FurnishSpace</div>
      <div style={styles.right}>
        <span style={styles.userName}>{user.name}</span>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;