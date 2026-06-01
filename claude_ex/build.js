/* ===========================================================
   Scene builder — returns {svg, hotspots}
   =========================================================== */
const COL = {
  ground: '#F0E3CB',
  deskTop: '#E8C89B',
  cabinet: '#E2BE8F',
  drawerFront: '#EAD1A8',
  drawerInside: '#C7A579',
  leg: '#D9B98C',
  keyboard: '#CCD4DD',
  monFrame: '#AEB8C6',
  monStand: '#9AA5B4',
  screen: '#F1F4F6',
  note: { hooks: '#F1A589', skills: '#F3D27E', settings: '#A6D8BF', agents: '#C7B6E8' },
  bag: '#D88F6E',
  bagFlap: '#CE8160',
  boardFrame: '#C89A68',
  cork: '#E8D3A2',
  pin: '#D9694F',
  paper: '#FBF7EF',
  folder: '#EBCD92',
  pen: '#7FA8B5',
};

const NOTES = [
  { id: 'hooks', b: 10.05, t: 'Hooks', col: COL.note.hooks },
  { id: 'skills', b: 9.00, t: 'Skills', col: COL.note.skills },
  { id: 'settings', b: 7.95, t: 'settings', col: COL.note.settings },
  { id: 'agents', b: 6.90, t: 'agents', col: COL.note.agents },
];
const NW = 2.0, NH = 0.95;

/* one desk (ox = world x-offset, faded = simplified sub-desk) */
function buildDesk(out, hotspots, ox, faded) {
  const o = ox;
  if (faded) out.push(`<g class="hot subdesk" data-id="subdesk" opacity="0.52">`);

  // back-left leg
  out.push(faded ? '' : `<g class="static">`);
  out.push(ISO.box(o + 0.2, 0.7, 0, 0.55, 0.55, 6.2, COL.leg));
  out.push(faded ? '' : `</g>`);

  // cabinet + drawers
  if (!faded) out.push(`<g class="hot" data-id="drawers">`);
  out.push(ISO.box(o + 9.6, 0.7, 0, 5.3, 7.7, 6.2, COL.cabinet));
  out.push(ISO.faceRect('y', 8.4, o + 9.95, 0.5, 4.7, 5.6, COL.drawerInside, { stroke: 'none' }));
  if (!faded) {
    const drawers = [
      { z: 0.45, h: 1.2, pull: 1.3, label: 'output' },
      { z: 1.85, h: 1.2, pull: 2.7, label: 'input' },
      { z: 3.25, h: 1.2, pull: 1.8, label: 'docs' },
      { z: 4.65, h: 1.2, pull: 0.0, label: 'src' },
    ].sort((a, b) => a.pull - b.pull);
    for (const d of drawers) {
      const y0 = 8.4 + d.pull;
      out.push(ISO.box(o + 9.95, y0, d.z, 4.7, 0.62, d.h, COL.drawerFront, { top: 1.16 }));
      if (d.pull > 0.3) {
        out.push(ISO.tile(o + 10.25, 8.55, d.z + d.h, 4.1, d.pull - 0.25, ISO.shade(COL.drawerInside, 1.05), { stroke: 'rgba(120,90,50,0.15)' }));
        out.push(ISO.tile(o + 10.5, 8.75, d.z + d.h + 0.02, 2.2, Math.max(0.5, d.pull - 0.7), COL.paper, { stroke: 'rgba(120,90,50,0.12)' }));
      }
      out.push(ISO.faceText('y', y0 + 0.63, o + 10.35, d.z + 0.38, d.label, { size: 12, weight: 700, fill: '#7a5a38' }));
      const hp = ISO.proj(o + 13.9, y0 + 0.63, d.z + d.h / 2);
      out.push(`<circle cx="${hp[0].toFixed(1)}" cy="${hp[1].toFixed(1)}" r="3" fill="rgba(120,90,50,0.4)"/>`);
    }
    out.push(`</g>`);
    hotspots.push({ id: 'drawers', anchor: [o + 12.0, 11.1, 3.0] });
  } else {
    // faint closed drawer hints
    for (const z of [0.6, 2.2, 3.8]) {
      out.push(ISO.box(o + 9.95, 8.4, z, 4.7, 0.55, 1.25, COL.drawerFront, { top: 1.12 }));
    }
  }

  // front-left leg + slab + keyboard
  if (!faded) out.push(`<g class="static">`);
  out.push(ISO.box(o + 0.2, 7.75, 0, 0.55, 0.55, 6.2, COL.leg));
  out.push(ISO.box(o + 0, 0, 6.2, 15, 9, 0.62, COL.deskTop, { top: 1.1, left: 0.9, right: 0.78 }));
  out.push(ISO.box(o + 2.0, 4.0, 6.82, 4.4, 1.9, 0.22, COL.keyboard, { top: 1.08 }));
  if (!faded) out.push(`</g>`);

  // monitor (PC)
  if (!faded) out.push(`<g class="hot" data-id="claude-dir">`);
  out.push(ISO.box(o + 2.55, 1.95, 6.82, 0.95, 0.8, 0.5, COL.monStand));
  out.push(ISO.box(o + 2.9, 2.1, 7.0, 0.25, 0.25, 1.4, COL.monStand));
  out.push(ISO.box(o + 1.2, 1.7, 7.05, 4.7, 0.4, 4.45, COL.monFrame, { top: 1.08, left: 0.97 }));
  out.push(ISO.faceRect('y', 2.06, o + 1.5, 7.4, 4.1, 3.7, COL.screen, { stroke: 'rgba(80,90,110,0.3)' }));
  if (!faded) {
    out.push(ISO.faceText('y', 2.05, o + 1.78, 10.55, '.claude /', { size: 12, weight: 700, fill: '#9fb0c0' }));
    out.push(ISO.faceText('y', 2.05, o + 1.78, 9.85, 'project files', { size: 9, weight: 500, fill: '#b6c2cf' }));
    for (let i = 0; i < 4; i++) {
      const l1 = ISO.proj(o + 1.8, 2.05, 9.2 - i * 0.55);
      const l2 = ISO.proj(o + 3.4 + (i % 2) * 0.7, 2.05, 9.2 - i * 0.55);
      out.push(`<line x1="${l1[0].toFixed(1)}" y1="${l1[1].toFixed(1)}" x2="${l2[0].toFixed(1)}" y2="${l2[1].toFixed(1)}" stroke="rgba(150,165,180,0.5)" stroke-width="1.4"/>`);
    }
  } else {
    out.push(ISO.faceText('y', 2.05, o + 2.2, 9.3, '…', { size: 22, weight: 700, fill: '#9fb0c0' }));
  }
  if (!faded) {
    out.push(`</g>`);
    hotspots.push({ id: 'claude-dir', anchor: [o + 3.0, 2.0, 11.65] });
  }

  // sticky notes — stuck on the RIGHT EDGE (bezel) of the PC, overhanging
  for (const n of NOTES) {
    const nx = o + 5.0;
    if (!faded) out.push(`<g class="hot note" data-id="${n.id}">`);
    out.push(ISO.faceRect('y', 2.02, nx, n.b, NW, NH, n.col, { stroke: 'rgba(120,90,50,0.22)' }));
    // folded corner
    const c1 = ISO.proj(nx + NW - 0.4, 2.01, n.b);
    const c2 = ISO.proj(nx + NW, 2.01, n.b);
    const c3 = ISO.proj(nx + NW, 2.01, n.b + 0.4);
    out.push(`<polygon points="${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${c3[0].toFixed(1)},${c3[1].toFixed(1)}" fill="rgba(0,0,0,0.07)"/>`);
    if (!faded) {
      out.push(ISO.faceText('y', 2.0, nx + 0.55, n.b + 0.28, n.t, { size: 11.5, weight: 700, fill: '#6a4f33' }));
      out.push(`</g>`);
      hotspots.push({ id: n.id, anchor: [nx + NW * 0.62, 2.0, n.b + NH / 2] });
    }
  }

  // desktop working papers (context)
  if (!faded) {
    out.push(`<g class="hot" data-id="desktop">`);
    const TZ = 6.82;
    out.push(ISO.tile(o + 7.6, 3.6, TZ, 4.2, 3.9, COL.folder, { stroke: 'rgba(120,90,50,0.25)' }));
    out.push(ISO.tile(o + 7.95, 3.5, TZ + 0.01, 3.6, 3.4, COL.paper, { stroke: 'rgba(120,90,50,0.15)' }));
    out.push(ISO.tile(o + 8.25, 3.35, TZ + 0.02, 3.4, 3.2, '#FFFDF8', { stroke: 'rgba(120,90,50,0.13)' }));
    for (let i = 0; i < 5; i++) {
      const l1 = ISO.proj(o + 8.55, 3.7 + i * 0.5, TZ + 0.03);
      const l2 = ISO.proj(o + 11.3, 3.7 + i * 0.5, TZ + 0.03);
      out.push(`<line x1="${l1[0].toFixed(1)}" y1="${l1[1].toFixed(1)}" x2="${l2[0].toFixed(1)}" y2="${l2[1].toFixed(1)}" stroke="rgba(120,100,70,0.28)" stroke-width="1.4"/>`);
    }
    out.push(ISO.tile(o + 7.2, 6.6, TZ + 0.03, 3.0, 2.0, COL.paper, { stroke: 'rgba(120,90,50,0.14)' }));
    out.push(ISO.box(o + 6.7, 4.2, TZ, 0.16, 2.6, 0.16, COL.pen, { top: 1.1 }));
    out.push(`</g>`);
    hotspots.push({ id: 'desktop', anchor: [o + 10.0, 5.4, TZ + 0.4] });
  }

  if (faded) {
    out.push(`</g>`);
    hotspots.push({ id: 'subdesk', anchor: [o + 3.0, 2.0, 11.65] });
  }
}

function buildScene() {
  ISO.setScale(26);
  const out = [];
  const hotspots = [];

  function shadow(cx, cy, rx, ry, op) {
    const p = ISO.proj(cx, cy, 0);
    return `<ellipse cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" rx="${rx}" ry="${ry}" fill="rgba(120,86,52,${op})" filter="url(#soft)"/>`;
  }

  /* ground + shadows */
  out.push(`<g class="static">`);
  out.push(ISO.tile(-12, -10, 0, 70, 34, COL.ground, { stroke: 'none' }));
  out.push(shadow(7.5, 6.5, 210, 84, 0.15));    // main desk
  out.push(shadow(27.5, 6.5, 210, 84, 0.13));   // sub desk
  out.push(shadow(-2.6, 8, 84, 38, 0.15));      // bag
  out.push(`</g>`);

  /* bulletin board (CLAUDE.md) — upper-right, wall-mounted look */
  out.push(`<g class="hot" data-id="board">`);
  const bx = 14.5, by = -4.4, bz = 10.6;
  out.push(ISO.box(bx, by, bz, 8.4, 0.45, 5.4, COL.boardFrame, { top: 1.05, left: 0.96 }));
  out.push(ISO.faceRect('y', by + 0.46, bx + 0.45, bz + 0.45, 7.5, 4.5, COL.cork, { stroke: 'rgba(120,90,50,0.25)' }));
  out.push(ISO.faceText('y', by + 0.47, bx + 0.85, bz + 3.55, 'CLAUDE.md', { size: 17, weight: 700, fill: '#6c4a2c' }));
  out.push(ISO.faceText('y', by + 0.47, bx + 0.85, bz + 2.95, '— 部屋の掲示板（共通ルール）—', { size: 9, weight: 500, fill: '#8a6a44' }));
  function pinned(a, b, w, h, col, lines) {
    let s = ISO.faceRect('y', by + 0.47, a, b, w, h, col, { stroke: 'rgba(120,90,50,0.18)' });
    const pp = ISO.proj(a + w / 2, by + 0.47, b + h - 0.15);
    s += `<circle cx="${pp[0].toFixed(1)}" cy="${pp[1].toFixed(1)}" r="3.4" fill="${COL.pin}"/>`;
    for (let i = 0; i < lines; i++) {
      const l1 = ISO.proj(a + 0.28, by + 0.48, b + h - 0.62 - i * 0.5);
      const l2 = ISO.proj(a + w - 0.28, by + 0.48, b + h - 0.62 - i * 0.5);
      s += `<line x1="${l1[0].toFixed(1)}" y1="${l1[1].toFixed(1)}" x2="${l2[0].toFixed(1)}" y2="${l2[1].toFixed(1)}" stroke="rgba(120,90,50,0.28)" stroke-width="1"/>`;
    }
    return s;
  }
  out.push(pinned(bx + 0.95, bz + 0.95, 2.3, 1.7, COL.paper, 2));
  out.push(pinned(bx + 3.7, bz + 1.1, 2.4, 1.4, '#F6E7C8', 2));
  out.push(`</g>`);
  hotspots.push({ id: 'board', anchor: [bx + 4.0, by + 0.47, bz + 5.0] });

  /* main desk */
  buildDesk(out, hotspots, 0, false);

  /* bag (~/.claude) — left of main desk */
  out.push(`<g class="hot" data-id="bag">`);
  out.push(ISO.box(-4.1, 6.3, 0, 2.9, 3.0, 3.1, COL.bag, { top: 1.1, left: 0.95, right: 0.8 }));
  out.push(ISO.box(-4.1, 8.55, 2.3, 2.9, 0.75, 0.85, COL.bagFlap, { top: 1.12 }));
  out.push(ISO.faceRect('y', 9.32, -3.7, 0.4, 2.1, 1.4, ISO.shade(COL.bag, 1.04), { stroke: 'rgba(120,70,40,0.3)' }));
  const ha = [
    ISO.proj(-3.45, 9.3, 3.1), ISO.proj(-3.45, 9.3, 4.7),
    ISO.proj(-1.85, 9.3, 4.7), ISO.proj(-1.85, 9.3, 3.1),
  ];
  out.push(`<path d="M${ha[0][0].toFixed(1)},${ha[0][1].toFixed(1)} L${ha[1][0].toFixed(1)},${ha[1][1].toFixed(1)} L${ha[2][0].toFixed(1)},${ha[2][1].toFixed(1)} L${ha[3][0].toFixed(1)},${ha[3][1].toFixed(1)}" fill="none" stroke="${ISO.shade(COL.bag, 0.78)}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`);
  out.push(`</g>`);
  hotspots.push({ id: 'bag', anchor: [-2.6, 9.3, 3.8] });

  /* sub-desk (agents) — physically to the right (=lower-right), faded */
  buildDesk(out, hotspots, 20, true);

  return { svg: out.join('\n'), hotspots };
}
