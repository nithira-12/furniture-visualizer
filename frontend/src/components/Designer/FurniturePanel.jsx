import React from 'react';

const FURNITURE_ITEMS = [
  // Seating
  { type: 'sofa', label: 'Sofa', width: 2, height: 0.9, colour: '#8B7355' },
  { type: 'armchair', label: 'Armchair', width: 0.8, height: 0.5, colour: '#A0856C' },
  { type: 'diningChair', label: 'Dining Chair', width: 0.5, height: 0.5, colour: '#9B8B7B' },
  { type: 'benchSeat', label: 'Bench', width: 1.2, height: 0.5, colour: '#8A7A6A' },
  { type: 'loveSeat', label: 'Love Seat', width: 1.5, height: 0.8, colour: '#9B8B7B' },
  
  // Tables
  { type: 'diningTable', label: 'Dining Table', width: 1.8, height: 1, colour: '#6B4F3A' },
  { type: 'coffeeTable', label: 'Coffee Table', width: 1.2, height: 0.7, colour: '#7A5C3E' },
  { type: 'sideTable', label: 'Side Table', width: 0.6, height: 0.6, colour: '#7D6347' },
  { type: 'deskTable', label: 'Work Table', width: 1.5, height: 0.8, colour: '#6B5344' },
  { type: 'consoleTable', label: 'Console Table', width: 1.2, height: 0.4, colour: '#704D39' },
  
  // Beds
  { type: 'bed', label: 'Bed (Double)', width: 1.6, height: 2, colour: '#9E8B7D' },
  { type: 'singleBed', label: 'Bed (Single)', width: 0.9, height: 1.9, colour: '#A89878' },
  { type: 'kingBed', label: 'Bed (King)', width: 1.8, height: 2.2, colour: '#A08878' },
  
  // Storage
  { type: 'wardrobe', label: 'Wardrobe', width: 1.2, height: 0.6, colour: '#5C4A3A' },
  { type: 'bookshelf', label: 'Bookshelf', width: 1, height: 0.3, colour: '#6B5744' },
  { type: 'dresser', label: 'Dresser', width: 1.3, height: 0.5, colour: '#704D39' },
  { type: 'cabinet', label: 'Cabinet', width: 0.8, height: 0.9, colour: '#6A5641' },
  { type: 'tvStand', label: 'TV Stand', width: 1.5, height: 0.4, colour: '#5C4A3A' },
  
  // Workspace
  { type: 'desk', label: 'Desk', width: 1.4, height: 0.7, colour: '#7B6B5A' },
  { type: 'computerDesk', label: 'Computer Desk', width: 1.2, height: 0.6, colour: '#6D5D4D' },
  
  // Decorations
  { type: 'lamp', label: 'Floor Lamp', width: 0.3, height: 0.3, colour: '#FFD700' },
  { type: 'tableLamp', label: 'Table Lamp', width: 0.25, height: 0.25, colour: '#FFC700' },
  { type: 'plant', label: 'Plant', width: 0.4, height: 0.4, colour: '#2D5016' },
  { type: 'painting', label: 'Wall Art', width: 1, height: 0.8, colour: '#CD853F' },
  { type: 'mirror', label: 'Mirror', width: 0.8, height: 1, colour: '#C0C0C0' },
  { type: 'shelf', label: 'Wall Shelf', width: 1.5, height: 0.2, colour: '#5C4A3A' },
  { type: 'rug', label: 'Rug', width: 1.5, height: 2, colour: '#A67C52' },
  { type: 'ottoman', label: 'Ottoman', width: 0.7, height: 0.7, colour: '#9B7A5F' },
  { type: 'bookcase', label: 'Bookcase', width: 0.9, height: 0.3, colour: '#6B5744' },
];

const styles = {
  panel: {
    width: '260px',
    minWidth: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  panelHeader: {
    padding: '20px 18px 16px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  panelTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  panelSubtitle: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  itemsList: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  item: {
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s',
  },
  itemHover: {
    backgroundColor: '#f3f4f6',
    borderColor: '#2563eb',
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.1)',
  },
  itemColour: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    flexShrink: 0,
    border: '1px solid rgba(0,0,0,0.1)',
  },
  itemInfo: {
    flex: 1,
    minWidth: '0',
  },
  itemLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
  },
  itemSize: {
    fontSize: '11px',
    color: '#9ca3af',
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
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.backgroundColor = '#f9fafb';
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