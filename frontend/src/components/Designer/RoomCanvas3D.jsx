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
  const w = (item.actualWidth || item.width) * SCALE * scale;
  const d = (item.actualHeight || item.height) * SCALE * scale;

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

    case 'loveSeat': {
      // Similar to sofa but smaller
      const seat = new THREE.Mesh(new THREE.BoxGeometry(w, 16, d * 0.6), mat());
      seat.position.set(0, 8, d * 0.1);
      group.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(w, 24, d * 0.2), darkMat());
      back.position.set(0, 12, -d * 0.4);
      group.add(back);
      const armL = new THREE.Mesh(new THREE.BoxGeometry(w * 0.15, 24, d * 0.6), darkMat());
      armL.position.set(-w * 0.42, 12, d * 0.1);
      group.add(armL);
      const armR = armL.clone();
      armR.position.set(w * 0.42, 12, d * 0.1);
      group.add(armR);
      break;
    }

    case 'consoleTable': {
      // Narrow table for entryways
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d), mat());
      top.position.set(0, 32, 0);
      group.add(top);
      // Two legs
      const leg = new THREE.Mesh(new THREE.BoxGeometry(w * 0.2, 30, 5), darkMat());
      const legL = leg.clone();
      legL.position.set(-w * 0.35, 15, 0);
      group.add(legL);
      const legR = leg.clone();
      legR.position.set(w * 0.35, 15, 0);
      group.add(legR);
      break;
    }

    case 'kingBed': {
      // Larger bed variant
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(w, 14, d * 0.85), mat());
      mattress.position.set(0, 14, d * 0.05);
      group.add(mattress);
      const head = new THREE.Mesh(new THREE.BoxGeometry(w, 42, d * 0.1), darkMat());
      head.position.set(0, 21, -d * 0.46);
      group.add(head);
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, 8, d), darkMat());
      base.position.set(0, 4, 0);
      group.add(base);
      // Two pillows
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(w * 0.4, 5, d * 0.15),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' }));
      pillow.position.set(-w * 0.25, 22, -d * 0.3);
      group.add(pillow);
      const pillow2 = pillow.clone();
      pillow2.position.set(w * 0.25, 22, -d * 0.3);
      group.add(pillow2);
      break;
    }

    case 'tvStand': {
      // TV stand / media unit
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, 30, d), mat());
      body.position.set(0, 15, 0);
      group.add(body);
      // Screen representation (black panel on top)
      const screen = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, 2, d * 0.3),
        new THREE.MeshLambertMaterial({ color: '#1a1a1a' }));
      screen.position.set(0, 32, -d * 0.2);
      group.add(screen);
      break;
    }

    case 'tableLamp': {
      // Table lamp
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, w, d), mat());
      base.position.set(0, w * 0.5, 0);
      group.add(base);
      const pole = new THREE.Mesh(new THREE.BoxGeometry(w * 0.3, 60, w * 0.3), darkMat());
      pole.position.set(0, 40, 0);
      group.add(pole);
      const shade = new THREE.Mesh(new THREE.CylinderGeometry(w * 1.5, w * 1.5, w * 2, 16),
        new THREE.MeshLambertMaterial({ color: '#FFE4B5' }));
      shade.position.set(0, 65, 0);
      group.add(shade);
      break;
    }

    case 'plant': {
      // Simple plant representation
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(w * 1.2, w * 1.3, d * 1.5, 12),
        new THREE.MeshLambertMaterial({ color: '#8B4513' }));
      pot.position.set(0, d * 0.75, 0);
      group.add(pot);
      // Foliage (green sphere on top)
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(w * 2, 8, 8),
        new THREE.MeshLambertMaterial({ color: item.colour }));
      foliage.position.set(0, d * 3.5, 0);
      group.add(foliage);
      break;
    }

    case 'mirror': {
      // Wall mounted mirror
      const frame = new THREE.Mesh(new THREE.BoxGeometry(w, d, 5), darkMat());
      frame.position.set(0, d * 0.5, 2);
      group.add(frame);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, d * 0.9, 2),
        new THREE.MeshPhongMaterial({ color: '#E8F4F8', shininess: 100 }));
      glass.position.set(0, d * 0.5, 3);
      group.add(glass);
      break;
    }

    case 'shelf': {
      // Wall shelf
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(w, 8, d), mat());
      shelf.position.set(0, 40, 0);
      group.add(shelf);
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(8, 35, d * 0.5), darkMat());
      bracket.position.set(-w * 0.4, 21, d * 0.25);
      group.add(bracket);
      break;
    }

    case 'diningChair': {
      // Chair seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(w, 8, d), mat());
      seat.position.set(0, 18, 0);
      group.add(seat);
      // Backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(w, 28, 5), darkMat());
      back.position.set(0, 23, -d * 0.5);
      group.add(back);
      // Four legs
      const legGeo = new THREE.BoxGeometry(4, 16, 4);
      [
        [-w * 0.3, 8, -d * 0.3],
        [w * 0.3, 8, -d * 0.3],
        [-w * 0.3, 8, d * 0.3],
        [w * 0.3, 8, d * 0.3],
      ].forEach((pos) => {
        const leg = new THREE.Mesh(legGeo, darkMat());
        leg.position.set(...pos);
        group.add(leg);
      });
      break;
    }

    case 'coffeeTable': {
      // Coffee table (lower, wider)
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 3, d), mat());
      top.position.set(0, 20, 0);
      group.add(top);
      // Legs with stretcher for stability
      const leg = new THREE.Mesh(new THREE.BoxGeometry(w * 0.15, 18, 5), darkMat());
      [-w * 0.35, w * 0.35].forEach((x) => {
        const l = leg.clone();
        l.position.set(x, 9, -d * 0.35);
        group.add(l);
        const l2 = leg.clone();
        l2.position.set(x, 9, d * 0.35);
        group.add(l2);
      });
      break;
    }

    case 'workTable': {
      // Work table (similar to desk but slightly different proportions)
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d), mat());
      top.position.set(0, 36, 0);
      group.add(top);
      const panelL = new THREE.Mesh(new THREE.BoxGeometry(5, 34, d), darkMat());
      panelL.position.set(-w * 0.48, 17, 0);
      group.add(panelL);
      const panelR = panelL.clone();
      panelR.position.set(w * 0.48, 17, 0);
      group.add(panelR);
      break;
    }

    case 'computerDesk': {
      // Computer desk with monitor stand
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d * 0.7), mat());
      top.position.set(0, 36, -d * 0.1);
      group.add(top);
      const panelL = new THREE.Mesh(new THREE.BoxGeometry(5, 34, d * 0.7), darkMat());
      panelL.position.set(-w * 0.48, 17, -d * 0.1);
      group.add(panelL);
      const panelR = panelL.clone();
      panelR.position.set(w * 0.48, 17, -d * 0.1);
      group.add(panelR);
      // Monitor stand
      const stand = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, 3, 5), darkMat());
      stand.position.set(0, 40, d * 0.4);
      group.add(stand);
      const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, 20, 3),
        new THREE.MeshLambertMaterial({ color: '#1a1a1a' }));
      monitorFrame.position.set(0, 52, d * 0.4);
      group.add(monitorFrame);
      break;
    }

    case 'singleBed': {
      // Smaller bed variant
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(w, 14, d * 0.85), mat());
      mattress.position.set(0, 14, d * 0.05);
      group.add(mattress);
      const head = new THREE.Mesh(new THREE.BoxGeometry(w, 38, d * 0.1), darkMat());
      head.position.set(0, 20, -d * 0.46);
      group.add(head);
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, 8, d), darkMat());
      base.position.set(0, 4, 0);
      group.add(base);
      // Single pillow
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(w * 0.35, 5, d * 0.15),
        new THREE.MeshLambertMaterial({ color: '#FFFFFF' }));
      pillow.position.set(0, 22, -d * 0.3);
      group.add(pillow);
      break;
    }

    case 'dresser': {
      // Dresser with drawers
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, 50, d), mat());
      body.position.set(0, 25, 0);
      group.add(body);
      // Drawer divisions (visual)
      [12, 26, 40].forEach((y) => {
        const divider = new THREE.Mesh(new THREE.BoxGeometry(w * 0.95, 2, d * 0.95), darkMat());
        divider.position.set(0, y, 0);
        group.add(divider);
      });
      // Handles
      const handles = new THREE.Mesh(new THREE.BoxGeometry(3, 8, 3),
        new THREE.MeshLambertMaterial({ color: '#C0C0C0' }));
      [12, 26, 40].forEach((y) => {
        const h = handles.clone();
        h.position.set(w * 0.4, y, d * 0.52);
        group.add(h);
      });
      break;
    }

    case 'cabinet': {
      // Storage cabinet
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, 60, d), mat());
      body.position.set(0, 30, 0);
      group.add(body);
      // Door seam
      const seam = new THREE.Mesh(new THREE.BoxGeometry(3, 58, d * 0.02), darkMat());
      seam.position.set(0, 30, d * 0.5);
      group.add(seam);
      break;
    }

    case 'floorLamp': {
      // Floor lamp
      const base = new THREE.Mesh(new THREE.CylinderGeometry(w * 1.5, w * 1.5, w * 0.8, 16),
        new THREE.MeshLambertMaterial({ color: '#1a1a1a' }));
      base.position.set(0, w * 0.4, 0);
      group.add(base);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.2, w * 0.2, 120, 8),
        darkMat());
      pole.position.set(0, 70, 0);
      group.add(pole);
      const shade = new THREE.Mesh(new THREE.CylinderGeometry(w * 2.5, w * 2, w * 2.5, 16),
        new THREE.MeshLambertMaterial({ color: '#FFE4B5' }));
      shade.position.set(0, 110, 0);
      group.add(shade);
      break;
    }

    case 'painting': case 'wallArt': {
      // Painting / wall art (flat)
      const frame = new THREE.Mesh(new THREE.BoxGeometry(w, d, 5), darkMat());
      frame.position.set(0, d * 0.5, 2);
      group.add(frame);
      const canvas = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, d * 0.9, 2),
        new THREE.MeshLambertMaterial({ color: item.colour }));
      canvas.position.set(0, d * 0.5, 3);
      group.add(canvas);
      break;
    }

    case 'ottoman': {
      // Ottoman (padded cube)
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, w * 0.8, d), mat());
      body.position.set(0, w * 0.4, 0);
      group.add(body);
      // Soft edge detail
      const edge = new THREE.Mesh(new THREE.BoxGeometry(w, 2, d),
        new THREE.MeshLambertMaterial({ color: baseColour.clone().multiplyScalar(0.8) }));
      edge.position.set(0, w * 0.85, 0);
      group.add(edge);
      break;
    }

    case 'bookcase': {
      // Bookcase (similar to bookshelf)
      const frame = new THREE.Mesh(new THREE.BoxGeometry(w, 85, d), mat());
      frame.position.set(0, 42, 0);
      group.add(frame);
      [18, 36, 54, 72].forEach((y) => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 3, d * 0.9), darkMat());
        shelf.position.set(0, y, 0);
        group.add(shelf);
      });
      break;
    }

    case 'rug': {
      // Rug (flat plane)
      const rug = new THREE.Mesh(new THREE.PlaneGeometry(w, d),
        new THREE.MeshLambertMaterial({ color: item.colour }));
      rug.rotation.x = -Math.PI / 2;
      rug.position.set(0, 0.5, 0);
      group.add(rug);
      // Border edge
      const edges = new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, d));
      const border = new THREE.LineSegments(edges,
        new THREE.LineBasicMaterial({ color: '#333333', linewidth: 2 }));
      border.rotation.x = -Math.PI / 2;
      border.position.set(0, 0.6, 0);
      group.add(border);
      break;
    }

    case 'bench': {
      // Bench seating
      const seat = new THREE.Mesh(new THREE.BoxGeometry(w, 10, d * 0.7), mat());
      seat.position.set(0, 18, 0);
      group.add(seat);
      // Support frame
      const supportL = new THREE.Mesh(new THREE.BoxGeometry(8, 16, d), darkMat());
      supportL.position.set(-w * 0.45, 8, 0);
      group.add(supportL);
      const supportR = supportL.clone();
      supportR.position.set(w * 0.45, 8, 0);
      group.add(supportR);
      break;
    }

    case 'deskette': {
      // Small desk variant
      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 4, d * 0.7), mat());
      top.position.set(0, 32, 0);
      group.add(top);
      // Single support leg on each side
      const leg = new THREE.Mesh(new THREE.BoxGeometry(8, 30, d * 0.6), darkMat());
      const legL = leg.clone();
      legL.position.set(-w * 0.45, 15, 0);
      group.add(legL);
      const legR = leg.clone();
      legR.position.set(w * 0.45, 15, 0);
      group.add(legR);
      break;
    }

    default: {
      // Fallback plain box with label
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
          opacity: 0.2,
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

    // Build initial furniture
furniture.forEach((item) => {
  const group = buildFurnitureMesh(item);
  group.position.set(item.x * SCALE, 0, item.y * SCALE);
  group.rotation.y = ((item.rotation || 0) * Math.PI) / 180;
  group.userData = { 
    furnitureId: item.id,
    colour: item.colour,
    shade: item.shade,
    scale: item.scale,
    rotation: item.rotation
  };
  scene.add(group);
  meshMapRef.current[String(item.id)] = group;
});
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
      
  // Remove and rebuild if colour, shade, scale, or dimensions changed
      currentFurniture.forEach((item) => {
        if (meshMapRef.current[String(item.id)]) {
          const group = meshMapRef.current[String(item.id)];
          group.position.set(item.x * SCALE, 0, item.y * SCALE);
          group.rotation.y = ((item.rotation || 0) * Math.PI) / 180;
          const stored = group.userData;
          if (stored.colour !== item.colour || stored.shade !== item.shade || stored.scale !== item.scale || 
              stored.actualWidth !== item.actualWidth || stored.actualHeight !== item.actualHeight) {
            scene.remove(group);
            delete meshMapRef.current[String(item.id)];
            const newGroup = buildFurnitureMesh(item);
            newGroup.position.set(item.x * SCALE, 0, item.y * SCALE);
            newGroup.userData = { furnitureId: item.id, colour: item.colour, shade: item.shade, scale: item.scale, actualWidth: item.actualWidth, actualHeight: item.actualHeight };
            scene.add(newGroup);
            meshMapRef.current[String(item.id)] = newGroup;
          }
        } else {
          const group = buildFurnitureMesh(item);
          group.position.set(item.x * SCALE, 0, item.y * SCALE);
          group.userData = { furnitureId: item.id, colour: item.colour, shade: item.shade, scale: item.scale, actualWidth: item.actualWidth, actualHeight: item.actualHeight };
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