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

    // Helper to create detailed label with icon
    const makeLabel = (text, type) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 256, 96);
      
      // Furniture icons based on type
      const icons = {
        sofa: '🛋️', armchair: '🪑', loveSeat: '🛋️',
        diningTable: '🍽️', coffeeTable: '☕', sideTable: '🏷️', deskTable: '📋', consoleTable: '📋',
        bed: '🛏️', singleBed: '🛏️', kingBed: '🛏️',
        wardrobe: '🚪', bookshelf: '📚', dresser: '🗄️', cabinet: '🗄️', tvStand: '📺',
        desk: '💻', computerDesk: '💻',
        lamp: '💡', tableLamp: '💡', plant: '🌿',
        painting: '🖼️', mirror: '🪞', shelf: '📚', rug: '🧵', ottoman: '🪑', bookcase: '📚',
      };
      
      const icon = icons[type] || '📦';
      
      // Draw icon
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, 128, 30);
      
      // Draw text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(text, 128, 75);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Helper to create arrow indicator
    const makeArrow = (scale) => {
      const arrowGroup = new THREE.Group();
      const arrowMat = new THREE.MeshLambertMaterial({ color: '#FFFFFF', emissive: '#666666' });
      
      // Shaft (thin cylinder)
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(scale * 0.08, scale * 0.08, scale * 0.3, 8),
        arrowMat
      );
      shaft.position.set(0, 0, -scale * 0.15);
      arrowGroup.add(shaft);
      
      // Arrowhead (cone)
      const head = new THREE.Mesh(
        new THREE.ConeGeometry(scale * 0.2, scale * 0.25, 8),
        arrowMat
      );
      head.position.set(0, 0, -scale * 0.38);
      head.rotation.x = Math.PI / 2;
      arrowGroup.add(head);
      
      return arrowGroup;
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
        const baseW = item.actualWidth || item.width;
        const baseD = item.actualHeight || item.height;
        const w = baseW * SCALE * scale;
        const d = baseD * SCALE * scale;
        const isSelected = item.id === currentSelectedId;
        const colour = isSelected ? '#FF8C00' : item.colour;

        if (meshMapRef.current[String(item.id)]) {
          const mesh = meshMapRef.current[String(item.id)];
          const stored = mesh.userData;
          
          // Check if dimensions, scale, or colour changed
          if (stored.actualWidth !== item.actualWidth || stored.actualHeight !== item.actualHeight || stored.scale !== item.scale || stored.colour !== item.colour || stored.rotation !== item.rotation) {
            // Remove old mesh and recreate with new dimensions
            scene.remove(mesh);
            scene.remove(labelMapRef.current[String(item.id)]);
            delete meshMapRef.current[String(item.id)];
            delete labelMapRef.current[String(item.id)];
            
          // Create new mesh with updated dimensions
            const newMesh = new THREE.Mesh(
              new THREE.BoxGeometry(w, 3, d),
              new THREE.MeshLambertMaterial({ 
                color: colour,
                emissive: isSelected ? new THREE.Color('#FFA500') : 0x000000,
                emissiveIntensity: isSelected ? 0.3 : 0
              })
            );
            newMesh.position.set(item.x * SCALE, 1, item.y * SCALE);
            newMesh.rotation.y = ((item.rotation || 0) * Math.PI) / 180;
            newMesh.userData = { furnitureId: item.id, actualWidth: item.actualWidth, actualHeight: item.actualHeight, scale: item.scale, colour: item.colour, rotation: item.rotation };
            scene.add(newMesh);
            meshMapRef.current[String(item.id)] = newMesh;
            
            // Add orientation arrow
            const arrow = makeArrow(Math.min(w, d) * 0.5);
            arrow.position.set(0, 2, -d * 0.42);
            newMesh.add(arrow);
            
            // Recreate label
            const labelTexture = makeLabel(item.label, item.type);
            const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
            const sprite = new THREE.Sprite(labelMaterial);
            sprite.scale.set(w * 1.2, d * 0.8, 1);
            sprite.position.set(item.x * SCALE, 3, item.y * SCALE);
            scene.add(sprite);
            labelMapRef.current[String(item.id)] = sprite;
          } else {
            // Just update position, color, and rotation
            mesh.position.set(item.x * SCALE, 1, item.y * SCALE);
            mesh.material.color.set(colour);
            mesh.material.needsUpdate = true;
            mesh.material.emissive.set(isSelected ? new THREE.Color('#FFA500') : 0x000000);
            mesh.material.emissiveIntensity = isSelected ? 0.3 : 0;
            mesh.rotation.y = ((item.rotation || 0) * Math.PI) / 180;
            mesh.userData.colour = item.colour;
            mesh.userData.rotation = item.rotation;

            // Update label position
            if (labelMapRef.current[String(item.id)]) {
              labelMapRef.current[String(item.id)].position.set(
                item.x * SCALE, 3, item.y * SCALE
              );
            }
          }
        } else {
          // Main furniture box
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, 3, d),
            new THREE.MeshLambertMaterial({ 
              color: colour,
              emissive: isSelected ? new THREE.Color('#FFA500') : 0x000000,
              emissiveIntensity: isSelected ? 0.3 : 0
            })
          );
          mesh.position.set(item.x * SCALE, 1, item.y * SCALE);
          mesh.rotation.y = ((item.rotation || 0) * Math.PI) / 180;
          mesh.userData = { furnitureId: item.id, actualWidth: item.actualWidth, actualHeight: item.actualHeight, scale: item.scale, colour: item.colour, rotation: item.rotation };
          scene.add(mesh);
          meshMapRef.current[String(item.id)] = mesh;

          // Orientation indicator (arrow pointing front of furniture)
          const arrow = makeArrow(Math.min(w, d) * 0.5);
          arrow.position.set(0, 2, -d * 0.42);
          mesh.add(arrow);

          // Label sprite with icon
          const labelTexture = makeLabel(item.label, item.type);
          const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
          const sprite = new THREE.Sprite(labelMaterial);
          sprite.scale.set(w * 1.2, d * 0.8, 1);
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
    let newX = pos.x - offsetRef.current.x;
    let newZ = pos.z - offsetRef.current.z;
    
    // Get furniture dimensions to calculate boundaries
    const furnitureId = selectedMeshRef.current.userData.furnitureId;
    const furniture = furnitureRef.current.find(f => f.id === furnitureId);
    
    if (furniture) {
      const scale = furniture.scale || 1;
      const baseW = furniture.actualWidth || furniture.width;
      const baseD = furniture.actualHeight || furniture.height;
      const halfWidth = (baseW * SCALE * scale) / 2;
      const halfHeight = (baseD * SCALE * scale) / 2;
      const roomW = room.width * SCALE;
      const roomL = room.length * SCALE;
      
      // Constrain to room boundaries
      const minX = -roomW / 2 + halfWidth;
      const maxX = roomW / 2 - halfWidth;
      const minZ = -roomL / 2 + halfHeight;
      const maxZ = roomL / 2 - halfHeight;
      
      newX = Math.max(minX, Math.min(maxX, newX));
      newZ = Math.max(minZ, Math.min(maxZ, newZ));
    }
    
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