import Particles from 'react-particles';
import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
import type { Container, Engine } from 'tsparticles-engine';

export const ParticlesAnimate = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: '#ffffff',
          },
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: '#000000',
          },
          links: {
            color: '#000000',
            distance: 150,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.1,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 1 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};
