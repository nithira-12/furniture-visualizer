import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SCALE = 50;

function RoomCanvas3D({ room, furniture }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const meshMapRef = useRef({});
  const furnitureRef = useRef(furniture);
  const isMouseDownRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3 });

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
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(200, 400, 200);
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
        new THREE.MeshLambertMaterial({ color: wallColour, side: THREE.FrontSide })
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
      cameraAngleRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2.2, cameraAngleRef.current.phi + dy * 0.005));
      updateCamera();
    };
    const handleMouseUp = () => { isMouseDownRef.current = false; };

    mount.addEventListener('mousedown', handleMouseDown);
    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseup', handleMouseUp);

    // Animation loop — syncs furniture from ref every frame
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
      currentFurniture.forEach((item) => {
        const scale = item.scale || 1;
        const w = item.width * SCALE * scale;
        const d = item.height * SCALE * scale;
        const h = 40 * scale;
        const shade = item.shade !== undefined ? item.shade : 0.5;
        const colour = new THREE.Color(item.colour);
        colour.multiplyScalar(0.5 + shade * 0.5);

        if (meshMapRef.current[String(item.id)]) {
          const mesh = meshMapRef.current[String(item.id)];
          mesh.position.set(item.x * SCALE, h / 2, item.y * SCALE);
          mesh.material.color.set(colour);
        } else {
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            new THREE.MeshLambertMaterial({ color: colour })
          );
          mesh.position.set(item.x * SCALE, h / 2, item.y * SCALE);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);
          meshMapRef.current[String(item.id)] = mesh;
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