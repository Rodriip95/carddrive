'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { PerspectiveCamera } from 'three';
import { createDrivingExperience } from '../../scene/app';
import type { ScenarioConfig } from '../../domain/scenario';

type DrivingExperienceApi = Awaited<ReturnType<typeof createDrivingExperience>>;

export default function DrivingScene({ pedalRef, speedLimit, night, running, controlsEnabled, scenario, onReady, onLoadStateChange, onDecisionReady, onActionResult, onSpeedChange, onAssetWarning }: {
  // Pedal sostenido por el usuario: -1 freno, 0 nada, 1 acelerador.
  pedalRef: MutableRefObject<-1 | 0 | 1>;
  speedLimit: number;
  night: boolean;
  running: boolean;
  controlsEnabled: boolean;
  scenario: ScenarioConfig;
  onReady: (experience: DrivingExperienceApi | null) => void;
  onLoadStateChange: (state: 'loading' | 'ready' | 'error') => void;
  onDecisionReady: () => void;
  onActionResult: (success: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onAssetWarning: (warning: string | null) => void;
}) {
  const { camera, scene, size } = useThree();
  const experience = useRef<DrivingExperienceApi | null>(null);
  const nightRef = useRef(night);
  const lastSpeed = useRef(-1);
  nightRef.current = night;
  const [loadError, setLoadError] = useState(false);
  const perspectiveCamera = camera as PerspectiveCamera;

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    onLoadStateChange('loading');
    void createDrivingExperience(scene, perspectiveCamera, scenario).then((created) => {
      if (cancelled) {
        created.dispose();
        return;
      }
      experience.current = created;
      onLoadStateChange('ready');
      onAssetWarning(created.assetWarning);
      created.resize(size.width, size.height);
      created.setNight(nightRef.current);
      lastSpeed.current = Math.round(created.getSpeed());
      onSpeedChange(lastSpeed.current);
      onReady(created);
    }).catch((error: unknown) => {
      if (!cancelled) {
        console.error('Error al cargar la escena de conducción:', error);
        setLoadError(true);
        onLoadStateChange('error');
      }
    });

    return () => {
      cancelled = true;
      experience.current?.dispose();
      experience.current = null;
      onReady(null);
    };
  }, [scene, perspectiveCamera, scenario, onReady, onLoadStateChange, onSpeedChange, onAssetWarning]);

  useLayoutEffect(() => {
    experience.current?.resize(size.width, size.height);
  }, [size.width, size.height]);

  useEffect(() => {
    experience.current?.setNight(night);
  }, [night]);

  useFrame((_, delta) => {
    const current = experience.current;
    if (!running || !current) return;
    const step = Math.min(delta, 0.1);
    if (controlsEnabled) current.drive(pedalRef.current, step, speedLimit);
    const { decisionReady, actionResult } = current.update(step);
    // Solo avisamos a React cuando cambia el valor mostrado, no en cada fotograma.
    const shownSpeed = Math.round(current.getSpeed());
    if (shownSpeed !== lastSpeed.current) {
      lastSpeed.current = shownSpeed;
      onSpeedChange(shownSpeed);
    }
    if (decisionReady) onDecisionReady();
    if (actionResult) onActionResult(actionResult === 'success');
  }, -1);

  return loadError ? <>
    <color attach="background" args={['#b9d9ed']} />
    <ambientLight intensity={1} />
  </> : null;
}
