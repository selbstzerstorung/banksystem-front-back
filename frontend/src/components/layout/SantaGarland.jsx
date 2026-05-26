// src/components/layout/SantaGarland.jsx
import React, { useMemo, useState } from "react";
import { STORAGE_KEYS } from "../../utils/constants";
import { Bulb, BulbRow, GarlandWrap, Tail, TailButton, Wire } from "./SantaGarland.styles";

const readWarm = () => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.SANTA_GARLAND_WARM) === "1";
  } catch {
    return false;
  }
};

const writeWarm = (value) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SANTA_GARLAND_WARM, value ? "1" : "0");
  } catch {
    // ignore
  }
};

const SantaGarland = () => {
  const [warmWhite, setWarmWhite] = useState(readWarm);

  const bulbs = useMemo(() => {
    const count = 18;
    const colors = ["#C81E1E", "#22C55E", "#3B82F6", "#F59E0B"]; // red / green / blue / orange
    const warm = "#FFE8A3";

    return Array.from({ length: count }).map((_, i) => {
      const color = warmWhite ? warm : colors[i % colors.length];
      const glow = warmWhite
        ? `0 0 10px rgba(255, 232, 163, 0.65), 0 0 18px rgba(255, 232, 163, 0.35)`
        : `0 0 10px ${color}55, 0 0 18px ${color}22`;
      const delay = (i % 6) * 120;
      return { key: i, color, glow, delay };
    });
  }, [warmWhite]);

  const toggleWarm = () => {
    setWarmWhite((prev) => {
      const next = !prev;
      writeWarm(next);
      return next;
    });
  };

  return (
    <GarlandWrap aria-hidden="true">
      <Wire />
      <BulbRow>
        {bulbs.map((b) => (
          <Bulb key={b.key} $color={b.color} $glow={b.glow} $delay={b.delay} />
        ))}
      </BulbRow>

      <TailButton type="button" onClick={toggleWarm} aria-label="Toggle garland warm-white">
        <Tail />
      </TailButton>
    </GarlandWrap>
  );
};

export default SantaGarland;
