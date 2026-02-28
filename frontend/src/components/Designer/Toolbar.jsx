import React, { useState } from 'react';

const styles = {
  toolbar: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap',
    boxShadow: '0 -1px 3px rgba(0,0,0,0.05)',
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: '300px',
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  viewToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    padding: '4px',
    borderRadius: '6px',
  },
  viewButton: {
    padding: '8px 14px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    transition: 'all 0.2s',
  },
  viewButtonActive: {
    backgroundColor: '#ffffff',
    color: '#2563eb',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  button: {
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    color: '#374151',
    transition: 'all 0.2s',
  },
  buttonHover: {
    backgroundColor: '#f3f4f6',
  },
  dangerButton: {
    border: '1px solid #fecaca',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: '#e5e7eb',
  },
  propertyGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  propertyLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    minWidth: '60px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  propertyControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  unitLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500',
  },
  valueDisplay: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
    minWidth: '30px',
    textAlign: 'center',
  },
  colourPickerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  colourInput: {
    width: '40px',
    height: '40px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    padding: '2px',
  },
  rangeInput: {
    width: '100px',
    height: '6px',
    cursor: 'pointer',
    accentColor: '#2563eb',
  },
  numberInput: {
    width: '70px',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#f9fafb',
  },
  toast: {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: '500',
    boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
  },
  emptyState: {
    fontSize: '13px',
    color: '#9ca3af',
    fontWeight: '500',
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
  onWidthChange,
  onHeightChange,
  onShadeChange,
  onRotate,
})  {
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
        {/* View Toggle Group */}
        <div style={styles.viewToggle}>
          <button
            style={{
              ...styles.viewButton,
              ...(view === '2D' ? styles.viewButtonActive : {}),
            }}
            onClick={() => onToggleView('2D')}
            title="2D Top-Down View"
          >
            ⊞ 2D
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(view === '3D' ? styles.viewButtonActive : {}),
            }}
            onClick={() => onToggleView('3D')}
            title="3D Perspective View"
          >
            ⬥ 3D
          </button>
        </div>

        <div style={styles.divider} />

        {/* Undo Button */}
        <button
          style={{ ...styles.button }}
          onClick={handleUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>

        {selectedFurniture ? (
          <>
            <div style={styles.divider} />

            {/* Furniture Color Control */}
            <div style={styles.propertyGroup}>
              <label style={styles.propertyLabel}>Color</label>
              <div style={styles.colourPickerWrapper}>
                <input
                  type="color"
                  style={styles.colourInput}
                  value={selectedFurniture.colour || '#8B7355'}
                  onChange={(e) => onColourChange(e.target.value)}
                  title="Change furniture color"
                />
              </div>
            </div>

            <div style={styles.divider} />

            {/* Size Scale Slider */}
            <div style={styles.propertyGroup}>
              <label style={styles.propertyLabel}>Scale</label>
              <div style={styles.propertyControl}>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={selectedFurniture.scale || 1}
                  onChange={(e) => onScaleChange(Number(e.target.value))}
                  style={styles.rangeInput}
                  title="Adjust furniture scale (0.5x - 3x)"
                />
                <span style={styles.valueDisplay}>
                  {(selectedFurniture.scale || 1).toFixed(1)}x
                </span>
              </div>
            </div>

            {/* Width Control */}
            <div style={styles.propertyGroup}>
              <label style={styles.propertyLabel}>Width</label>
              <div style={styles.propertyControl}>
                <input
                  type="number"
                  min="0.3"
                  max="5"
                  step="0.1"
                  value={(selectedFurniture.actualWidth || selectedFurniture.width || 1).toFixed(1)}
                  onChange={(e) => onWidthChange(Number(e.target.value))}
                  style={styles.numberInput}
                  title="Furniture width (meters)"
                />
                <span style={styles.unitLabel}>m</span>
              </div>
            </div>

            {/* Depth Control */}
            <div style={styles.propertyGroup}>
              <label style={styles.propertyLabel}>Depth</label>
              <div style={styles.propertyControl}>
                <input
                  type="number"
                  min="0.3"
                  max="5"
                  step="0.1"
                  value={(selectedFurniture.actualHeight || selectedFurniture.height || 1).toFixed(1)}
                  onChange={(e) => onHeightChange(Number(e.target.value))}
                  style={styles.numberInput}
                  title="Furniture depth (meters)"
                />
                <span style={styles.unitLabel}>m</span>
              </div>
            </div>

            <div style={styles.divider} />

            {/* Rotation Button */}
            <button
              style={{ ...styles.button }}
              onClick={onRotate}
              title="Rotate 90 degrees"
            >
              ⟳ Rotate
            </button>

            {/* Delete Button */}
            <button
              style={{ ...styles.button, ...styles.dangerButton }}
              onClick={handleDelete}
              title="Delete selected furniture"
            >
              🗑 Remove
            </button>
          </>
        ) : (
          <span style={styles.emptyState}>
            ↪ Select a furniture item to customize
          </span>
        )}

        {/* Right Group - Save Button */}
        <div style={styles.rightGroup}>
          <button
            style={{ ...styles.button, ...styles.saveButton }}
            onClick={handleSave}
            title="Save design to library"
          >
            💾 Save
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