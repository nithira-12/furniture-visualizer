import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import RoomSetup from './RoomSetup';
import FurniturePanel from './FurniturePanel';
import Toolbar from './Toolbar';
import RoomCanvas2D from './RoomCanvas2D';
import RoomCanvas3D from './RoomCanvas3D';

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  canvasArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
  },
  roomInfo: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    color: '#374151',
    fontWeight: '600',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  viewBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '700',
    zIndex: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

function Designer() {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [furniture, setFurniture] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('2D');
  const [loaded, setLoaded] = useState(false);

  const selectedFurniture = furniture.find((f) => f.id === selectedId) || null;

  useEffect(() => {
    const existing = localStorage.getItem('currentDesign');
    if (existing) {
      const parsed = JSON.parse(existing);
      setRoom(parsed);
      setFurniture(parsed.furniture || []);
      localStorage.removeItem('currentDesign');
    }
    setLoaded(true);
  }, []);

  const handleRoomStart = (roomData) => {
    setRoom(roomData);
    setFurniture([]);
  };

  const saveHistory = (currentFurniture) => {
    setHistory((prev) => [...prev, currentFurniture]);
  };

  const handleAddFurniture = (item) => {
    saveHistory(furniture);
    setFurniture((prev) => [...prev, { ...item, id: Date.now(), rotation: 0 }]);
  };

  const handleRotate = () => {
    saveHistory(furniture);
    setFurniture((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, rotation: ((f.rotation || 0) + 90) % 360 } : f))
    );
  };

  const handleMoveFurniture = (id, x, y) => {
    setFurniture((prev) =>
      prev.map((f) => (f.id === id ? { ...f, x, y } : f))
    );
  };

  const handleSelectFurniture = (id) => {
    setSelectedId(id);
  };

  const handleColourChange = (colour) => {
    saveHistory(furniture);
    setFurniture((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, colour } : f))
    );
  };

  const handleScaleChange = (scale) => {
    saveHistory(furniture);
    setFurniture((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, scale } : f))
    );
  };

  const handleShadeChange = (shade) => {
    saveHistory(furniture);
    setFurniture((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, shade } : f))
    );
  };

  const handleWidthChange = (width) => {
    saveHistory(furniture);
    setFurniture((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, actualWidth: Math.max(0.3, width) } : f))
    );
  };

  const handleHeightChange = (height) => {
    saveHistory(furniture);
    setFurniture((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, actualHeight: Math.max(0.3, height) } : f))
    );
  };

  const handleDeleteSelected = () => {
    saveHistory(furniture);
    setFurniture((prev) => prev.filter((f) => f.id !== selectedId));
    setSelectedId(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFurniture(previous);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleSave = () => {
    if (!room) return;
    const design = {
      ...room,
      furniture,
      updatedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('designs') || '[]');
    const index = existing.findIndex((d) => d.id === design.id);
    if (index >= 0) {
      existing[index] = design;
    } else {
      existing.push(design);
    }
    localStorage.setItem('designs', JSON.stringify(existing));
  };

  const handleToggleView = (newView) => {
    setView(newView);
  };

  // Wait for localStorage check before rendering anything
  if (!loaded) return null;

  // Show room setup if no room yet
  if (!room) {
    return <RoomSetup onStart={handleRoomStart} />;
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.body}>
        <FurniturePanel onAddFurniture={handleAddFurniture} />
        <div style={styles.canvasArea}>
          <div style={styles.roomInfo}>
            {room.name} — {room.width}m x {room.length}m
          </div>
          <div style={styles.viewBadge}>{view}</div>

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, visibility: view === '2D' ? 'visible' : 'hidden' }}>
            <RoomCanvas2D
              room={room}
              furniture={furniture}
              onSelectFurniture={handleSelectFurniture}
              selectedId={selectedId}
              onMoveFurniture={handleMoveFurniture}
            />
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, visibility: view === '3D' ? 'visible' : 'hidden' }}>
            <RoomCanvas3D
              room={room}
              furniture={furniture}
            />
          </div>
        </div>
      </div>

      <Toolbar
        view={view}
        onToggleView={handleToggleView}
        onUndo={handleUndo}
        onSave={handleSave}
        onDeleteSelected={handleDeleteSelected}
        selectedFurniture={selectedFurniture}
        onColourChange={handleColourChange}
        onScaleChange={handleScaleChange}
        onShadeChange={handleShadeChange}
        onWidthChange={handleWidthChange}
        onHeightChange={handleHeightChange}
        onRotate={handleRotate}
      />
    </div>
  );
}

export default Designer;