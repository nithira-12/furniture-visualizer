import React, { useState } from 'react';

const styles = {
  toolbar: {
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E8DDD5',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  button: {
    padding: '9px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: '1.5px solid #E8DDD5',
    backgroundColor: '#FDFAF7',
    color: '#2C1810',
    transition: 'all 0.2s',
  },
  activeButton: {
    backgroundColor: '#5C3D2E',
    color: '#FFFFFF',
    border: '1.5px solid #5C3D2E',
  },
  dangerButton: {
    border: '1.5px solid #DC2626',
    color: '#DC2626',
    backgroundColor: '#FDFAF7',
  },
  saveButton: {
    backgroundColor: '#5C3D2E',
    color: '#FFFFFF',
    border: '1.5px solid #5C3D2E',
    padding: '9px 24px',
  },
  divider: {
    width: '1px',
    height: '28px',
    backgroundColor: '#E8DDD5',
    margin: '0 4px',
  },
  colourPickerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  colourLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2C1810',
  },
  colourInput: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1.5px solid #E8DDD5',
    cursor: 'pointer',
    padding: '2px',
    backgroundColor: 'transparent',
  },
  scaleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  scaleLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2C1810',
  },
  scaleInput: {
    width: '70px',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1.5px solid #E8DDD5',
    fontSize: '13px',
    color: '#2C1810',
    backgroundColor: '#FDFAF7',
    outline: 'none',
  },
  toast: {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#2C1810',
    color: '#FFFFFF',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: 500,
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
};

function Toolbar({
  view,
  onToggleView,
  onUndo,
  onSave,
  onDeleteSelected,
  selectedFurniture,
  onColourChange,
  onScaleChange,
  onShadeChange,
}) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showFeedback = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSave = () => {
    onSave();
    showFeedback('Design saved successfully!');
  };

  const handleUndo = () => {
    onUndo();
    showFeedback('Last action undone');
  };

  const handleDelete = () => {
    onDeleteSelected();
    showFeedback('Furniture removed');
  };

  return (
    <>
      <div style={styles.toolbar}>
        <div style={styles.leftGroup}>

          {/* 2D / 3D Toggle */}
          <button
            style={{
              ...styles.button,
              ...(view === '2D' ? styles.activeButton : {}),
            }}
            onClick={() => onToggleView('2D')}
          >
            2D View
          </button>
          <button
            style={{
              ...styles.button,
              ...(view === '3D' ? styles.activeButton : {}),
            }}
            onClick={() => onToggleView('3D')}
          >
            3D View
          </button>

          <div style={styles.divider} />

          {/* Undo */}
          <button style={styles.button} onClick={handleUndo}>
            Undo
          </button>

          {/* Delete Selected */}
          {selectedFurniture && (
            <button
              style={{ ...styles.button, ...styles.dangerButton }}
              onClick={handleDelete}
            >
              Remove Selected
            </button>
          )}

          <div style={styles.divider} />

          {/* Colour Picker - only when furniture selected */}
          {selectedFurniture && (
            <div style={styles.colourPickerWrapper}>
              <span style={styles.colourLabel}>Colour</span>
              <input
                type="color"
                style={styles.colourInput}
                value={selectedFurniture.colour || '#8B7355'}
                onChange={(e) => onColourChange(e.target.value)}
                title="Change furniture colour"
              />
            </div>
          )}

          {/* Scale - only when furniture selected */}
          {selectedFurniture && (
            <div style={styles.scaleWrapper}>
              <span style={styles.scaleLabel}>Scale</span>
              <input
                type="number"
                style={styles.scaleInput}
                value={selectedFurniture.scale || 1}
                min="0.5"
                max="3"
                step="0.1"
                onChange={(e) => onScaleChange(Number(e.target.value))}
              />
            </div>
          )}

          {/* Shade - only when furniture selected */}
          {selectedFurniture && (
            <div style={styles.scaleWrapper}>
              <span style={styles.scaleLabel}>Shade</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedFurniture.shade || 0.5}
                onChange={(e) => onShadeChange(Number(e.target.value))}
                style={{ width: '80px' }}
              />
            </div>
          )}

          {!selectedFurniture && (
            <span style={{ fontSize: '13px', color: '#8B6E5A' }}>
              Click a furniture item in the room to select it
            </span>
          )}
        </div>

        <div style={styles.rightGroup}>
          <button style={{ ...styles.button, ...styles.saveButton }} onClick={handleSave}>
            Save Design
          </button>
        </div>
      </div>

      {showToast && (
        <div style={styles.toast}>{toastMessage}</div>
      )}
    </>
  );
}

export default Toolbar;