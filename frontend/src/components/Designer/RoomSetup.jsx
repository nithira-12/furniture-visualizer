import React, { useState } from 'react';

const WALL_COLOURS = [
  { name: 'Cream White', value: '#F5F0EB' },
  { name: 'Soft Grey', value: '#E8E8E8' },
  { name: 'Warm Beige', value: '#E8D5B7' },
  { name: 'Sage Green', value: '#B2C9B2' },
  { name: 'Dusty Blue', value: '#B2BEC9' },
  { name: 'Terracotta', value: '#C9856A' },
  { name: 'Blush Pink', value: '#C9A8A8' },
  { name: 'Charcoal', value: '#4A4A4A' },
];

const FLOOR_COLOURS = [
  { name: 'Oak Wood', value: '#C8A97E' },
  { name: 'Dark Wood', value: '#6B4226' },
  { name: 'Light Wood', value: '#DEB887' },
  { name: 'Grey Tile', value: '#B0B0B0' },
  { name: 'White Marble', value: '#F0EDE8' },
  { name: 'Terracotta Tile', value: '#C4622D' },
  { name: 'Dark Tile', value: '#4A4A4A' },
  { name: 'Cream', value: '#E8DDD5' },
];

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8B6E5A',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: '8px',
  },
  hint: {
    fontSize: '12px',
    color: '#8B6E5A',
    marginTop: '4px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  colourGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginTop: '8px',
  },
  colourOption: {
    height: '48px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '3px solid transparent',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  colourSelected: {
    border: '3px solid #5C3D2E',
    transform: 'scale(1.08)',
  },
  startButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#5C3D2E',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '12px',
    marginTop: '8px',
    letterSpacing: '0.3px',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
  },
};

function RoomSetup({ onStart }) {
  const [name, setName] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [wallColour, setWallColour] = useState('#F5F0EB');
  const [floorColour, setFloorColour] = useState('#C8A97E');
  const [error, setError] = useState('');

  const handleStart = () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter a design name.');
      return;
    }
    if (!width || isNaN(width) || Number(width) <= 0) {
      setError('Please enter a valid room width.');
      return;
    }
    if (!length || isNaN(length) || Number(length) <= 0) {
      setError('Please enter a valid room length.');
      return;
    }

    onStart({
      name: name.trim(),
      width: Number(width),
      length: Number(length),
      wallColour,
      floorColour,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      furniture: [],
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={{
        ...styles.modal,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={styles.header}>
          <div style={styles.title}>Set Up Your Room</div>
          <div style={styles.subtitle}>
            Enter your room details to start designing
          </div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Design Name</label>
          <input
            type="text"
            placeholder="e.g. Living Room Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Room Dimensions (meters)</label>
          <div style={styles.row}>
            <div>
              <input
                type="number"
                placeholder="Width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="1"
                max="20"
              />
              <div style={styles.hint}>Width</div>
            </div>
            <div>
              <input
                type="number"
                placeholder="Length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                min="1"
                max="20"
              />
              <div style={styles.hint}>Length</div>
            </div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Wall Colour</label>
          <div style={styles.colourGrid}>
            {WALL_COLOURS.map((colour) => (
              <div
                key={colour.value}
                title={colour.name}
                style={{
                  ...styles.colourOption,
                  backgroundColor: colour.value,
                  ...(wallColour === colour.value ? styles.colourSelected : {}),
                }}
                onClick={() => setWallColour(colour.value)}
              />
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Floor Colour</label>
          <div style={styles.colourGrid}>
            {FLOOR_COLOURS.map((colour) => (
              <div
                key={colour.value}
                title={colour.name}
                style={{
                  ...styles.colourOption,
                  backgroundColor: colour.value,
                  ...(floorColour === colour.value ? styles.colourSelected : {}),
                }}
                onClick={() => setFloorColour(colour.value)}
              />
            ))}
          </div>
        </div>

        <button style={styles.startButton} onClick={handleStart}>
          Start Designing
        </button>
      </div>
    </div>
  );
}

export default RoomSetup;