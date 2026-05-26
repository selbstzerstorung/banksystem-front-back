// src/components/layout/SantaSnow.jsx
import React, { useMemo } from "react";
import { Dot, Flake, SnowWrap } from "./SantaSnow.styles";

// Lightweight snow overlay for the hidden Santa theme.
// - No canvas
// - No external libs
// - pointer-events disabled so it never blocks the app

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Deterministic pseudo-random in [0, 1)
const rand01 = (i, salt = 0) => {
  const x = Math.sin((i + 1) * 999 + salt * 123.456) * 10000;
  return x - Math.floor(x);
};

const SantaSnow = () => {
  const flakes = useMemo(() => {
    const count = 36;

    return Array.from({ length: count }).map((_, i) => {
      const left = clamp(rand01(i, 1) * 100, 0, 100);
      const size = Math.round(2 + rand01(i, 2) * 4); // 2..6
      const duration = Number((8 + rand01(i, 3) * 8).toFixed(2)); // 8..16
      const swayDuration = Number((2.6 + rand01(i, 4) * 3.2).toFixed(2)); // 2.6..5.8
      const opacity = Number((0.35 + rand01(i, 5) * 0.55).toFixed(2)); // 0.35..0.90
      // Negative delays make the animation look "already running" on load.
      const delay = -Number((rand01(i, 6) * duration).toFixed(2));

      return { i, left, size, duration, swayDuration, opacity, delay };
    });
  }, []);

  return (
    <SnowWrap aria-hidden="true">
      {flakes.map((f) => (
        <Flake
          key={f.i}
          $left={f.left}
          $duration={f.duration}
          $delay={f.delay}
          $opacity={f.opacity}
        >
          <Dot $size={f.size} $swayDuration={f.swayDuration} />
        </Flake>
      ))}
    </SnowWrap>
  );
};

export default SantaSnow;
