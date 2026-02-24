import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SCALE = 50;

function RoomCanvas2D({ room, furniture, onSelectFurniture, selectedId, onMoveFurniture }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshMapRef = useRef({});
  const labelMapRef = useRef({});
  const animationRef = useRef(null);
  const isDraggingRef = useRef(false);
  const selectedMeshRef = useRef(null);
  const offsetRef = useRef({ x: 0, z: 0 });
  const furnitureRef = useRef(furniture);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => { furnitureRef.current = furniture; }, [furniture]); 
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

   useEffect(() => { 

     meshMapRef.current = {};
     labelMapRef.current = {};
    
     const mount = mountRef.current; 
  
     const width = mount.clientWidth;
  
     const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(room.wallColour || '#F5F0EB');
    sceneRef.current = scene;

    const roomW = room.width * SCALE;
    const roomL = room.length * SCALE;
    const maxDim = Math.max(roomW, roomL);
    const aspect = width / height;

    const camera = new THREE.OrthographicCamera(
      (-maxDim * aspect) / 1.2,
      (maxDim * aspect) / 1.2,
      maxDim / 1.2,
      -maxDim / 1.2,
      0.1,
      1000
    );
    camera.position.set(0, 100, 0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomW, roomL),
      new THREE.MeshBasicMaterial({ color: room.floorColour || '#C8A97E' })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Border
    const border = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(roomW, roomL)),
      new THREE.LineBasicMaterial({ color: '#5C3D2E' })
    );
    border.rotation.x = -Math.PI / 2;
    border.position.y = 0.1;
    scene.add(border);

    // Grid
    const grid = new THREE.GridHelper(maxDim * 2, 20, '#D4C5B5', '#D4C5B5');
    grid.position.y = 0.05;
    scene.add(grid);

    // Helper to create label texture
    const makeLabel = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 32);
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const currentFurniture = furnitureRef.current;
      const currentSelectedId = selectedIdRef.current;
      const existingIds = new Set(currentFurniture.map((f) => String(f.id)));

      // Remove deleted
      Object.keys(meshMapRef.current).forEach((id) => {
        if (!existingIds.has(id)) {
          scene.remove(meshMapRef.current[id]);
          scene.remove(labelMapRef.current[id]);
          delete meshMapRef.current[id];
          delete labelMapRef.current[id];
        }
      });

      // Add or update
      currentFurniture.forEach((item) => {
        const scale = item.scale || 1;
        const w = item.width * SCALE * scale;
        const d = item.height * SCALE * scale;
        const isSelected = item.id === currentSelectedId;
        const colour = isSelected ? '#FF8C00' : item.colour;

        if (meshMapRef.current[String(item.id)]) {
          const mesh = meshMapRef.current[String(item.id)];
          mesh.position.set(item.x * SCALE, 1, item.y * SCALE);
          mesh.material.color.set(colour);
          mesh.rotation.y = ((item.rotation || 0) * Math.PI) / 180;

          // Update label position
          if (labelMapRef.current[String(item.id)]) {
            labelMapRef.current[String(item.id)].position.set(
              item.x * SCALE, 3, item.y * SCALE
            );
          }
        } else {
          // Main furniture box
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, 3, d),
            new THREE.MeshBasicMaterial({ color: colour })
          );
          mesh.position.set(item.x * SCALE, 1, item.y * SCALE);
          mesh.userData = { furnitureId: item.id };
          scene.add(mesh);
          meshMapRef.current[String(item.id)] = mesh;

          // Label sprite
          const labelTexture = makeLabel(item.label);
          const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
          const sprite = new THREE.Sprite(labelMaterial);
          sprite.scale.set(w * 0.9, d * 0.4, 1);
          sprite.position.set(item.x * SCALE, 3, item.y * SCALE);
          scene.add(sprite);
          labelMapRef.current[String(item.id)] = sprite;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [room]);

  const getWorldPosition = (e) => {
    const mount = mountRef.current;
    const rect = mount.getBoundingClientRect();
    const camera = cameraRef.current;
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const vec = new THREE.Vector3(ndcX, ndcY, 0).unproject(camera);
    return { x: vec.x, z: vec.z };
  };

  const handleMouseDown = (e) => {
    const mount = mountRef.current;
    const rect = mount.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const meshes = Object.values(meshMapRef.current);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      onSelectFurniture(mesh.userData.furnitureId);
      selectedMeshRef.current = mesh;
      isDraggingRef.current = true;
      const pos = getWorldPosition(e);
      offsetRef.current = {
        x: pos.x - mesh.position.x,
        z: pos.z - mesh.position.z,
      };
    } else {
      onSelectFurniture(null);
      selectedMeshRef.current = null;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !selectedMeshRef.current) return;
    const pos = getWorldPosition(e);
    const newX = pos.x - offsetRef.current.x;
    const newZ = pos.z - offsetRef.current.z;
    selectedMeshRef.current.position.x = newX;
    selectedMeshRef.current.position.z = newZ;
    if (labelMapRef.current[String(selectedMeshRef.current.userData.furnitureId)]) {
      labelMapRef.current[String(selectedMeshRef.current.userData.furnitureId)].position.set(
        newX, 3, newZ
      );
    }
    onMoveFurniture(
      selectedMeshRef.current.userData.furnitureId,
      newX / SCALE,
      newZ / SCALE
    );
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    selectedMeshRef.current = null;
  };

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}

export default RoomCanvas2D;