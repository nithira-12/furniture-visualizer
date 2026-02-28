import React, { useState } from 'react';

const ROOM_TYPES = [
  { name: 'Living Room', value: 'living' },
  { name: 'Bedroom', value: 'bedroom' },
  { name: 'Dining Room', value: 'dining' },
  { name: 'Home Office', value: 'office' },
  { name: 'Kitchen', value: 'kitchen' },
  { name: 'Bathroom', value: 'bathroom' },
];

const LIGHTING_STYLES = [
  { name: 'Bright', value: 'bright' },
  { name: 'Warm', value: 'warm' },
  { name: 'Dim', value: 'dim' },
];

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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
    padding: '20px',
    backdropFilter: 'blur(2px)',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  hint: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '6px',
    fontStyle: 'italic',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  colourGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginTop: '12px',
  },
  colourOption: {
    height: '50px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  colourSelected: {
    border: '2px solid #2563eb',
    boxShadow: '0 0 0 1px #2563eb',
    transform: 'scale(1.05)',
  },
  startButton: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '8px',
    marginTop: '12px',
    letterSpacing: '0.3px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
    fontWeight: '500',
  },
};

function RoomSetup({ onStart }) {
  const [name, setName] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('3');
  const [roomType, setRoomType] = useState('living');
  const [lighting, setLighting] = useState('warm');
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
      height: Number(height),
      roomType,
      lighting,
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

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Room Width (m)</label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min="1"
              step="0.5"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Room Length (m)</label>
            <input
              type="number"
              placeholder="e.g. 6"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              min="1"
              step="0.5"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Room Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {ROOM_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setRoomType(type.value)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: roomType === type.value ? '2px solid #2563eb' : '1px solid #d1d5db',
                  backgroundColor: roomType === type.value ? '#dbeafe' : '#f9fafb',
                  color: roomType === type.value ? '#2563eb' : '#374151',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Ceiling Height (meters)</label>
          <input
            type="number"
            placeholder="e.g. 3"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="2"
            max="5"
            step="0.5"
          />
          <div style={styles.hint}>Standard height is 3m</div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Lighting Style</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {LIGHTING_STYLES.map((light) => (
              <button
                key={light.value}
                onClick={() => setLighting(light.value)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: lighting === light.value ? '2px solid #2563eb' : '1px solid #d1d5db',
                  backgroundColor: lighting === light.value ? '#dbeafe' : '#f9fafb',
                  color: lighting === light.value ? '#2563eb' : '#374151',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                {light.name}
              </button>
            ))}
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