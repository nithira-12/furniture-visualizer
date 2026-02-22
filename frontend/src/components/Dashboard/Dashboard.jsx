import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F5F0EB',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  header: {
    marginBottom: '32px',
  },
  welcome: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2C1810',
  },
  subtitle: {
    fontSize: '15px',
    color: '#8B6E5A',
    marginTop: '6px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
  newCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px dashed #D4C5B5',
    minHeight: '180px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  newCardIcon: {
    fontSize: '36px',
    color: '#5C3D2E',
    marginBottom: '12px',
    fontWeight: '300',
  },
  newCardText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#5C3D2E',
  },
  designCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(92, 61, 46, 0.08)',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  designName: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: '8px',
  },
  designDate: {
    fontSize: '13px',
    color: '#8B6E5A',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  editButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#5C3D2E',
    color: '#FFFFFF',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'transparent',
    border: '1.5px solid #DC2626',
    color: '#DC2626',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#8B6E5A',
  },
  emptyText: {
    fontSize: '16px',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2C1810',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#8B6E5A',
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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [designs, setDesigns] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('designs') || '[]');
    setDesigns(saved);
  }, []);

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
              e.currentTarget.style.borderColor = '#5C3D2E';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(92, 61, 46, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D4C5B5';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.newCardIcon}>+</div>
            <div style={styles.newCardText}>New Design</div>
          </div>

          {designs.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyText}>No designs yet</div>
              <div style={styles.emptySubtext}>
                Click "New Design" to get started
              </div>
            </div>
          ) : (
            designs.map((design) => (
              <div key={design.id} style={styles.designCard}>
                <div>
                  <div style={styles.designName}>{design.name}</div>
                  <div style={styles.designDate}>
                    {new Date(design.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEdit(design)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteConfirm(design.id)}
                  >
                    Delete
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