"use client";

import { motion } from "framer-motion";

export function SkillRadar() {
  const labels = [
    "Typing",
    "Competitive",
    "Learning",
    "Bugs",
    "Speed",
    "Accuracy",
  ];
  const values = [0.78, 0.35, 0.92, 0.55, 0.68, 0.82]; // normalised 0-1
  const cx = 90,
    cy = 90,
    r = 70;
  const n = labels.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, ratio: number) => ({
    x: cx + r * ratio * Math.cos(angle(i)),
    y: cy + r * ratio * Math.sin(angle(i)),
  });

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const fillPoints = values.map((v, i) => point(i, v));
  const fillD =
    fillPoints
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      )
      .join(" ") + "Z";

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Skills
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="bg-card border border-border rounded-sm p-4">
        <svg viewBox="0 0 180 180" className="w-full max-w-[180px] mx-auto">
          {gridLevels.map((lvl) => {
            const pts = Array.from({ length: n }, (_, i) => point(i, lvl));
            const d =
              pts
                .map(
                  (p, i) =>
                    `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
                )
                .join(" ") + "Z";
            return (
              <path
                key={lvl}
                d={d}
                fill="none"
                stroke="rgba(0, 255, 0, 0.4)"
                strokeWidth="0.8"
              />
            );
          })}
          {Array.from({ length: n }, (_, i) => {
            const p = point(i, 1);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={p.x.toFixed(1)}
                y2={p.y.toFixed(1)}
                stroke="rgba(0, 255, 0, 0.4)"
                strokeWidth="0.8"
              />
            );
          })}
          <path
            d={fillD}
            fill="hsl(var(--primary) / 0.18)"
            stroke="rgba(0, 255, 0, 0.4)"
            strokeWidth="1.5"
          />
          {fillPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r="3"
              fill="rgba(0, 255, 0, 0.4)"
            />
          ))}
          {labels.map((lbl, i) => {
            const p = point(i, 1.22);
            return (
              <text
                key={i}
                x={p.x.toFixed(1)}
                y={p.y.toFixed(1)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7.5"
                fill="rgba(0, 255, 0, 0.4)"
                fontFamily="monospace"
              >
                {lbl}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
