import React from 'react';

const FURNITURE_ITEMS = [
  { type: 'sofa', label: 'Sofa', width: 2, height: 0.9, colour: '#8B7355' },
  { type: 'armchair', label: 'Armchair', width: 0.8, height: 0.5, colour: '#A0856C' },
  { type: 'diningTable', label: 'Dining Table', width: 1.8, height: 1, colour: '#6B4F3A' },
  { type: 'sideTable', label: 'Side Table', width: 0.6, height: 0.6, colour: '#7D6347' },
  { type: 'bed', label: 'Bed', width: 1.6, height: 2, colour: '#9E8B7D' },
  { type: 'desk', label: 'Desk', width: 1.4, height: 0.7, colour: '#7B6B5A' },
  { type: 'wardrobe', label: 'Wardrobe', width: 1.2, height: 0.6, colour: '#5C4A3A' },
  { type: 'bookshelf', label: 'Bookshelf', width: 1, height: 0.3, colour: '#6B5744' },
];

const styles = {
  panel: {
    width: '220px',
    minWidth: '220px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E8DDD5',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  panelHeader: {
    padding: '20px 16px 12px',
    borderBottom: '1px solid #E8DDD5',
  },
  panelTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2C1810',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  panelSubtitle: {
    fontSize: '12px',
    color: '#8B6E5A',
    marginTop: '4px',
  },
  itemsList: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  item: {
    padding: '12px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '1.5px solid #E8DDD5',
    backgroundColor: '#FDFAF7',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
  },
  itemColour: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2C1810',
  },
  itemSize: {
    fontSize: '11px',
    color: '#8B6E5A',
    marginTop: '2px',
  },
};

function FurniturePanel({ onAddFurniture }) {
  const handleAdd = (item) => {
    onAddFurniture({
      ...item,
      id: Date.now(),
      x: 1,
      y: 1,
    });
  };

  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <div style={styles.panelTitle}>Furniture</div>
        <div style={styles.panelSubtitle}>Click to add to room</div>
      </div>

      <div style={styles.itemsList}>
        {FURNITURE_ITEMS.map((item) => (
          <div
            key={item.type}
            style={styles.item}
            onClick={() => handleAdd(item)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#5C3D2E';
              e.currentTarget.style.backgroundColor = '#F5F0EB';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(92, 61, 46, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E8DDD5';
              e.currentTarget.style.backgroundColor = '#FDFAF7';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                ...styles.itemColour,
                backgroundColor: item.colour,
              }}
            />
            <div style={styles.itemInfo}>
              <div style={styles.itemLabel}>{item.label}</div>
              <div style={styles.itemSize}>
                {item.width}m x {item.height}m
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FurniturePanel;