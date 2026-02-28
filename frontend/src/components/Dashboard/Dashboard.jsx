import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  header: {
    marginBottom: '48px',
  },
  welcome: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    marginTop: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  newCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px dashed #d1d5db',
    minHeight: '200px',
    transition: 'all 0.2s',
  },
  newCardHover: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f9ff',
  },
  newCardIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  newCardText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
  },
  designCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.2s',
  },
  designCardHover: {
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
    borderColor: '#2563eb',
  },
  designName: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  designDate: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  designInfo: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px',
  },
  cardActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  editButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#9ca3af',
  },
  emptyText: {
    fontSize: '18px',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: '0.5',
  },
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  confirmBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '360px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
  confirmTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: '8px',
  },
  confirmText: {
    fontSize: '14px',
    color: '#8B6E5A',
    marginBottom: '24px',
  },
  confirmActions: {
    display: 'flex',
    gap: '12px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'transparent',
    border: '1.5px solid #D4C5B5',
    color: '#2C1810',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
  confirmDeleteButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
};

function Dashboard() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  // Declare all hooks first, before any conditional logic
  useEffect(() => {
    // Protected route - redirect if not logged in
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (!token || !userJson) {
      navigate('/login');
      return;
    }

    try {
      JSON.parse(userJson);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    // Load designs
    const saved = JSON.parse(localStorage.getItem('designs') || '[]');
    setDesigns(saved);
  }, [navigate]);

  // Get user data safely
  const userJson = localStorage.getItem('user');
  let user = {};
  try {
    user = userJson ? JSON.parse(userJson) : {};
  } catch (e) {
    user = {};
  }

  const handleNewDesign = () => {
    navigate('/designer');
  };

  const handleEdit = (design) => {
    localStorage.setItem('currentDesign', JSON.stringify(design));
    navigate('/designer');
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
  };

  const handleDelete = () => {
    const updated = designs.filter((d) => d.id !== deleteId);
    setDesigns(updated);
    localStorage.setItem('designs', JSON.stringify(updated));
    setDeleteId(null);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.welcome}>Welcome back, {user.name}</div>
          <div style={styles.subtitle}>
            {designs.length === 0
              ? 'Start by creating your first design'
              : `You have ${designs.length} saved design${designs.length > 1 ? 's' : ''}`}
          </div>
        </div>

        <div style={styles.grid}>
          <div
            style={styles.newCard}
            onClick={handleNewDesign}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.newCardHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <div style={styles.newCardIcon}>🏗️</div>
            <div style={styles.newCardText}>New Design</div>
          </div>

          {designs.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📐</div>
              <div style={styles.emptyText}>No designs yet</div>
              <div style={styles.emptySubtext}>
                Create your first design to get started
              </div>
            </div>
          ) : (
            designs.map((design) => (
              <div 
                key={design.id} 
                style={styles.designCard}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.designCardHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div>
                  <div style={styles.designName}>{design.name}</div>
                  <div style={styles.designDate}>
                    📅 {new Date(design.createdAt).toLocaleDateString()}
                  </div>
                  <div style={styles.designInfo}>
                    📐 {design.width}m × {design.length}m
                  </div>
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEdit(design)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteConfirm(design.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteId && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmBox}>
            <div style={styles.confirmTitle}>Delete Design?</div>
            <div style={styles.confirmText}>
              This action cannot be undone. Are you sure?
            </div>
            <div style={styles.confirmActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmDeleteButton}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;