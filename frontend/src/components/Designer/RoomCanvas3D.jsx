import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SCALE = 50;

// Build simple recognisable 3D shapes for each furniture type
const buildFurnitureMesh = (item) => {
  const scale = item.scale || 1;
  const shade = item.shade !== undefined ? item.shade : 0.5;
  const baseColour = new THREE.Color(item.colour);
  baseColour.multiplyScalar(0.5 + shade * 0.5);
  const mat = () => new THREE.MeshLambertMaterial({ color: baseColour.clone() });
  const darkMat = () => new THREE.MeshLambertMaterial({ color: baseColour.clone().multiplyScalar(0.7) });

  const group = new THREE.Group();
  const w = item.width * SCALE * scale;
  const d = item.height * SCALE * scale;

  switch (item.type) {

    case 'sofa': {
      // Seat base
      const seat = new THREE.Mesh(new THREE.BoxGeometry(w, 18, d * 0.6), mat());
      seat.position.set(0, 9, d * 0.1);
      group.add(seat);
      // Back rest
      const back = new THREE.Mesh(new THREE.BoxGeometry(w, 28, d * 0.2), darkMat());
      back.position.set(0, 14, -d * 0.4);
      group.add(back);
      // Left arm
      const armL = new THREE.Mesh(new THREE.BoxGeometry(w * 0.12, 26, d * 0.6), darkMat());
      armL.position.set(-w * 0.44, 13, d * 0.1);
      group.add(armL);
      // Right arm
      const armR = armL.clone();
      armR.position.set(w * 0.44, 13, d * 0.1);
      group.add(armR);
      break;
    }

    case 'armchair': {
      // Seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(w, 16, d * 0.6), mat());
      seat.position.set(0, 8, d * 0.1);
      group.add(seat);
      // Back
      const back = new THREE.Mesh(new THREE.BoxGeometry(w, 26, d * 0.15), darkMat());
      back.position.set(0, 18, -d * 0.4);
      group.add(back);
      // Arms
      const armL = new THREE.Mesh(new THREE.BoxGeometry(w * 0.15, 22, d * 0.6), darkMat());
      armL.position.set(-w * 0.42, 11, d * 0.1);
      group.add(armL);
      const armR = armL.clone();
      armR.position.set(w * 0.42, 11, d * 0.1);
      group.add(armR);
      break;
    }

    case 'diningTable': {
      // Table top
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 5, d), mat());
      top.position.set(0, 38, 0);
      group.add(top);
      // Four legs
      const legGeo = new THREE.BoxGeometry(5, 36, 5);
      const positions = [
        [-w * 0.42, 18, -d * 0.42],
        [w * 0.42, 18, -d * 0.42],
        [-w * 0.42, 18, d * 0.42],
        [w * 0.42, 18, d * 0.42],
      ];
      positions.forEach((pos) => {
        const leg = new THREE.Mesh(legGeo, darkMat());
        leg.position.set(...pos);
        group.add(leg);
      });
      break;
    }

    case 'sideTable': {
      // Top
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d), mat());
      top.position.set(0, 30, 0);
      group.add(top);
      // Single centre leg
      const leg = new THREE.Mesh(new THREE.BoxGeometry(w * 0.3, 28, d * 0.3), darkMat());
      leg.position.set(0, 14, 0);
      group.add(leg);
      break;
    }

    case 'bed': {
      // Mattress
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(w, 14, d * 0.85), mat());
      mattress.position.set(0, 14, d * 0.05);
      group.add(mattress);
      // Headboard
      const head = new THREE.Mesh(new THREE.BoxGeometry(w, 40, d * 0.1), darkMat());
      head.position.set(0, 20, -d * 0.46);
      group.add(head);
      // Bed base
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, 8, d), darkMat());
      base.position.set(0, 4, 0);
      group.add(base);
      // Pillow
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(w * 0.35, 5, d * 0.15), 
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' }));
      pillow.position.set(-w * 0.2, 22, -d * 0.3);
      group.add(pillow);
      const pillow2 = pillow.clone();
      pillow2.position.set(w * 0.2, 22, -d * 0.3);
      group.add(pillow2);
      break;
    }

    case 'desk': {
      // Desktop
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d), mat());
      top.position.set(0, 36, 0);
      group.add(top);
      // Two side panels instead of legs
      const panelL = new THREE.Mesh(new THREE.BoxGeometry(5, 34, d), darkMat());
      panelL.position.set(-w * 0.47, 17, 0);
      group.add(panelL);
      const panelR = panelL.clone();
      panelR.position.set(w * 0.47, 17, 0);
      group.add(panelR);
      break;
    }

    case 'wardrobe': {
      // Main body
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, 90, d), mat());
      body.position.set(0, 45, 0);
      group.add(body);
      // Door line (visual detail)
      const divider = new THREE.Mesh(new THREE.BoxGeometry(3, 88, d * 0.02), darkMat());
      divider.position.set(0, 45, d * 0.5);
      group.add(divider);
      // Handles
      const handleL = new THREE.Mesh(new THREE.BoxGeometry(3, 12, 3),
        new THREE.MeshLambertMaterial({ color: '#C0C0C0' }));
      handleL.position.set(-w * 0.12, 45, d * 0.52);
      group.add(handleL);
      const handleR = handleL.clone();
      handleR.position.set(w * 0.12, 45, d * 0.52);
      group.add(handleR);
      break;
    }

    case 'bookshelf': {
      // Main frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(w, 80, d), mat());
      frame.position.set(0, 40, 0);
      group.add(frame);
      // Shelves
      [20, 40, 60].forEach((y) => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 3, d * 0.9), darkMat());
        shelf.position.set(0, y, 0);
        group.add(shelf);
      });
      break;
    }

    default: {
      // Fallback plain box
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, 30, d), mat());
      box.position.set(0, 15, 0);
      group.add(box);
    }
  }

  return group;
};

function RoomCanvas3D({ room, furniture }) {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const meshMapRef = useRef({});
  const furnitureRef = useRef(furniture);
  const isMouseDownRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3 });
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => { furnitureRef.current = furniture; }, [furniture]);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#D6E4F0');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    cameraRef.current = camera;

    const roomW = room.width * SCALE;
    const roomL = room.length * SCALE;
    const radius = Math.max(roomW, roomL) * 2;

    const updateCamera = () => {
      const { theta, phi } = cameraAngleRef.current;
      camera.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(300, 500, 300);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomW, roomL),
      new THREE.MeshLambertMaterial({ color: room.floorColour || '#C8A97E' })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallHeight = 150;
    const wallColour = room.wallColour || '#F5F0EB';
   const makeWall = (w, h, px, py, pz, ry) => {
      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshLambertMaterial({ 
          color: wallColour, 
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        })
      );
      wall.position.set(px, py, pz);
      wall.rotation.y = ry;
      scene.add(wall);
    };
    makeWall(roomW, wallHeight, 0, wallHeight / 2, -roomL / 2, 0);
    makeWall(roomW, wallHeight, 0, wallHeight / 2, roomL / 2, Math.PI);
    makeWall(roomL, wallHeight, -roomW / 2, wallHeight / 2, 0, Math.PI / 2);
    makeWall(roomL, wallHeight, roomW / 2, wallHeight / 2, 0, -Math.PI / 2);

    // Mouse orbit
    const handleMouseDown = (e) => {
      isMouseDownRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e) => {
      if (!isMouseDownRef.current) return;
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      cameraAngleRef.current.theta -= dx * 0.005;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.2,
        cameraAngleRef.current.phi + dy * 0.005));
      updateCamera();
    };
    const handleMouseUp = () => { isMouseDownRef.current = false; };

    mount.addEventListener('mousedown', handleMouseDown);
    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const currentFurniture = furnitureRef.current;
      const existingIds = new Set(currentFurniture.map((f) => String(f.id)));

      // Remove deleted
      Object.keys(meshMapRef.current).forEach((id) => {
        if (!existingIds.has(id)) {
          scene.remove(meshMapRef.current[id]);
          delete meshMapRef.current[id];
        }
      });

      // Add or update
      
  // Remove and rebuild if colour or shade changed
      currentFurniture.forEach((item) => {
        if (meshMapRef.current[String(item.id)]) {
          const group = meshMapRef.current[String(item.id)];
          group.position.set(item.x * SCALE, 0, item.y * SCALE);
          group.rotation.y = ((item.rotation || 0) * Math.PI) / 180;
          const stored = group.userData;
          if (stored.colour !== item.colour || stored.shade !== item.shade || stored.scale !== item.scale) {
            scene.remove(group);
            delete meshMapRef.current[String(item.id)];
            const newGroup = buildFurnitureMesh(item);
            newGroup.position.set(item.x * SCALE, 0, item.y * SCALE);
            newGroup.userData = { furnitureId: item.id, colour: item.colour, shade: item.shade, scale: item.scale };
            scene.add(newGroup);
            meshMapRef.current[String(item.id)] = newGroup;
          }
        } else {
          const group = buildFurnitureMesh(item);
          group.position.set(item.x * SCALE, 0, item.y * SCALE);
          group.userData = { furnitureId: item.id, colour: item.colour, shade: item.shade, scale: item.scale };
          scene.add(group);
          meshMapRef.current[String(item.id)] = group;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      mount.removeEventListener('mousedown', handleMouseDown);
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [room]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
    />
  );
}

  export default RoomCanvas3D;