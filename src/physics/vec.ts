/** Minimal 3D vector / quaternion helpers (physics must not depend on three). */
export interface V3 { x: number; y: number; z: number }
export interface Q4 { x: number; y: number; z: number; w: number }

export const v3 = (x = 0, y = 0, z = 0): V3 => ({ x, y, z });
export const add = (a: V3, b: V3): V3 => v3(a.x + b.x, a.y + b.y, a.z + b.z);
export const sub = (a: V3, b: V3): V3 => v3(a.x - b.x, a.y - b.y, a.z - b.z);
export const scale = (a: V3, s: number): V3 => v3(a.x * s, a.y * s, a.z * s);
export const dot = (a: V3, b: V3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a: V3, b: V3): V3 => v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
export const len = (a: V3): number => Math.hypot(a.x, a.y, a.z);
export const norm = (a: V3): V3 => { const l = len(a) || 1; return scale(a, 1 / l); };
export const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
export const smoothstep = (t: number): number => { const u = clamp(t, 0, 1); return u * u * (3 - 2 * u); };
/** wrap an angle to (-π, π] */
export const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));

/** Quaternion from an orthonormal basis (columns: x axis, y axis, z axis). */
export function quatFromBasis(xa: V3, ya: V3, za: V3): Q4 {
  const m00 = xa.x, m01 = ya.x, m02 = za.x;
  const m10 = xa.y, m11 = ya.y, m12 = za.y;
  const m20 = xa.z, m21 = ya.z, m22 = za.z;
  const tr = m00 + m11 + m22;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    return { w: 0.25 * s, x: (m21 - m12) / s, y: (m02 - m20) / s, z: (m10 - m01) / s };
  }
  if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    return { w: (m21 - m12) / s, x: 0.25 * s, y: (m01 + m10) / s, z: (m02 + m20) / s };
  }
  if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    return { w: (m02 - m20) / s, x: (m01 + m10) / s, y: 0.25 * s, z: (m12 + m21) / s };
  }
  const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
  return { w: (m10 - m01) / s, x: (m02 + m20) / s, y: (m12 + m21) / s, z: 0.25 * s };
}

/** Quaternion from axis (unit) and angle (rad). */
export const qAxis = (ax: number, ay: number, az: number, a: number): Q4 => {
  const s = Math.sin(a / 2);
  return { x: ax * s, y: ay * s, z: az * s, w: Math.cos(a / 2) };
};
export const qMul = (a: Q4, b: Q4): Q4 => ({
  x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
  y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
  z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
});
export const qConj = (q: Q4): Q4 => ({ x: -q.x, y: -q.y, z: -q.z, w: q.w });
/** Rotate a vector by a quaternion. */
export const qRot = (q: Q4, v: V3): V3 => {
  const p = qMul(qMul(q, { x: v.x, y: v.y, z: v.z, w: 0 }), qConj(q));
  return { x: p.x, y: p.y, z: p.z };
};
