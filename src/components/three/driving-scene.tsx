'use client';

import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Box3, Group, Mesh, Vector3 } from 'three';
import type { createLaneChange } from '../../scene/lane-change';

type LaneChange = ReturnType<typeof createLaneChange>;

function PlayerCar({ speed, laneChange }: { speed: number; laneChange: LaneChange }) {
  const model = useGLTF('/models/car.glb');
  const group = useRef<Group>(null);
  const normalizedModel = useMemo(() => {
    const car = model.scene.clone(true);
    const box = new Box3().setFromObject(car);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    car.position.sub(center);
    car.position.y += size.y / 2;
    const wrapper = new Group();
    wrapper.add(car);
    wrapper.scale.setScalar(3 / Math.max(size.x, size.y, size.z, 0.001));
    return wrapper;
  }, [model.scene]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    laneChange.update(delta, speed);
    group.current.position.y = 0.04 + Math.sin(clock.elapsedTime * 7) * Math.min(speed / 32, 1) * 0.025;
    group.current.position.x = laneChange.getX();
    group.current.rotation.y = laneChange.getYaw();
  });

  return <group ref={group} position={[0, 0, 1.3]}><primitive object={normalizedModel} /></group>;
}

function Road({ speed }: { speed: number }) {
  const marks = useRef<Group>(null);
  useFrame((_, delta) => {
    if (marks.current) marks.current.position.z = (marks.current.position.z + delta * speed * 0.45) % 4;
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[7, 80]} />
        <meshStandardMaterial color="#343c3d" roughness={0.92} />
      </mesh>
      <group ref={marks}>
        {[-1.1, 1.1].flatMap((x) => Array.from({ length: 18 }, (_, index) => (
          <mesh key={`${x}-${index}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.1, index * 4 - 36]}>
            <planeGeometry args={[0.12, 2]} />
            <meshBasicMaterial color="#f2f0db" />
          </mesh>
        )))}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#72916c" />
      </mesh>
    </group>
  );
}

export default function DrivingScene({ speed, night, laneChange }: { speed: number; night: boolean; laneChange: LaneChange }) {
  const sky = night ? '#111b34' : '#b9d9ed';
  const ambient = night ? 0.55 : 1.5;
  const sun = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (sun.current) sun.current.position.y = 4 + Math.sin(clock.elapsedTime * 0.15) * 0.3;
  });

  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 18, 65]} />
      <ambientLight intensity={ambient} />
      <directionalLight position={[5, 9, 3]} intensity={night ? 0.8 : 2.5} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh ref={sun} position={[-7, 4, -30]}>
        <sphereGeometry args={[1.5, 24, 16]} />
        <meshBasicMaterial color={night ? '#e0e8ff' : '#ffdf91'} />
      </mesh>
      <Road speed={speed} />
      <PlayerCar speed={speed} laneChange={laneChange} />
    </>
  );
}

useGLTF.preload('/models/car.glb');
