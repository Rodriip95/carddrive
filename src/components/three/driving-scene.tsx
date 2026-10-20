'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PerspectiveCamera } from 'three';
import { createDrivingExperience } from '../../scene/app';
import type { ScenarioConfig } from '../../domain/scenario';

type DrivingExperienceApi = Awaited<ReturnType<typeof createDrivingExperience>>;

export default function DrivingScene({ speed, night, running, scenario, onReady, onDecisionReady, onAssetWarning }: {
  speed: number;
  night: boolean;
  running: boolean;
  scenario: ScenarioConfig;
  onReady: (experience: DrivingExperienceApi | null) => void;
  onDecisionReady: () => void;
  onAssetWarning: (warning: string | null) => void;
}) {
  const { camera, scene, size } = useThree();
  const experience = useRef<DrivingExperienceApi | null>(null);
  const speedRef = useRef(speed);
  const nightRef = useRef(night);
  speedRef.current = speed;
  nightRef.current = night;
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const perspectiveCamera = camera as PerspectiveCamera;

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    setLoading(true);
    void createDrivingExperience(scene, perspectiveCamera, scenario).then((created) => {
      if (cancelled) {
        created.dispose();
        return;
      }
      experience.current = created;
      setLoading(false);
      onAssetWarning(created.assetWarning);
      created.resize(size.width, size.height);
      created.setSpeed(speedRef.current);
      created.setNight(nightRef.current);
      onReady(created);
    }).catch((error: unknown) => {
      if (!cancelled) {
        console.error('Error al cargar la escena de conducción:', error);
        setLoadError(true);
      }
    });

    return () => {
      cancelled = true;
      experience.current?.dispose();
      experience.current = null;
      onReady(null);
    };
  }, [scene, perspectiveCamera, scenario, onReady, onAssetWarning]);

  useLayoutEffect(() => {
    experience.current?.resize(size.width, size.height);
  }, [size.width, size.height]);

  useEffect(() => {
    experience.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    experience.current?.setNight(night);
  }, [night]);

  useFrame((_, delta) => {
    if (!running || !experience.current) return;
    if (experience.current.update(Math.min(delta, 0.1))) onDecisionReady();
  }, -1);

  if (loading && !loadError) return <Html center><p className="canvas-loading" role="status">Cargando los vehículos…</p></Html>;
  return loadError ? <>
    <color attach="background" args={['#b9d9ed']} />
    <ambientLight intensity={1} />
  </> : null;
}
