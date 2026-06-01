/* ===========================================================
   Isometric helpers + scene builder
   World axes:  +x -> lower-right,  +y -> lower-left,  +z -> up
   =========================================================== */
const ISO = (function () {
  const SQ = 0.8660254;
  let S = 30; // px per world unit

  function proj(x, y, z) {
    return [(x - y) * SQ * S, ((x + y) * 0.5 - z) * S];
  }
  function P(x, y, z) {
    const p = proj(x, y, z);
    return p[0].toFixed(2) + ',' + p[1].toFixed(2);
  }
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function shade(hex, f) {
    const [r, g, b] = hexToRgb(hex);
    const c = v => Math.max(0, Math.min(255, Math.round(v * f)));
    return `rgb(${c(r)},${c(g)},${c(b)})`;
  }
  function poly(points, fill, extra = '') {
    return `<polygon points="${points}" fill="${fill}" ${extra}/>`;
  }

  // full cuboid with 3 visible faces (top, +y front-left, +x right)
  function box(x, y, z, w, d, h, color, opt = {}) {
    const tF = opt.top !== undefined ? opt.top : 1.13;
    const lF = opt.left !== undefined ? opt.left : 0.92;  // +y face (front-left)
    const rF = opt.right !== undefined ? opt.right : 0.74; // +x face (right)
    const x1 = x + w, y1 = y + d, z1 = z + h;
    const stroke = opt.stroke !== undefined ? opt.stroke : 'rgba(86,60,40,0.16)';
    const sw = opt.sw || 1.2;
    const sa = `stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"`;
    let s = '';
    s += poly([P(x1, y, z), P(x1, y1, z), P(x1, y1, z1), P(x1, y, z1)].join(' '), shade(color, rF), sa);
    s += poly([P(x, y1, z), P(x1, y1, z), P(x1, y1, z1), P(x, y1, z1)].join(' '), shade(color, lF), sa);
    s += poly([P(x, y, z1), P(x1, y, z1), P(x1, y1, z1), P(x, y1, z1)].join(' '), shade(color, tF), sa);
    return s;
  }

  // flat panel on the top plane (z const) - a sheet of paper etc.
  function tile(x, y, z, w, d, color, opt = {}) {
    const stroke = opt.stroke !== undefined ? opt.stroke : 'rgba(86,60,40,0.18)';
    const sa = `stroke="${stroke}" stroke-width="${opt.sw || 1}" stroke-linejoin="round"`;
    return poly([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)].join(' '), color, sa);
  }

  // flat rectangle living on a vertical face plane.
  // plane 'y' => constant y, spans (x: width) x (z: height up)
  // plane 'x' => constant x, spans (y: width) x (z: height up)
  function faceRect(plane, c, a, b, w, h, color, opt = {}) {
    // c = constant coord; a = horiz start; b = vertical(z) start
    let pts;
    if (plane === 'y') {
      pts = [P(a, c, b), P(a + w, c, b), P(a + w, c, b + h), P(a, c, b + h)];
    } else {
      pts = [P(c, a, b), P(c, a + w, b), P(c, a + w, b + h), P(c, a, b + h)];
    }
    const stroke = opt.stroke !== undefined ? opt.stroke : 'rgba(86,60,40,0.18)';
    const sa = `stroke="${stroke}" stroke-width="${opt.sw || 1}" stroke-linejoin="round"`;
    return poly(pts.join(' '), color, sa);
  }

  // sheared text sitting on a vertical face plane
  // plane 'y': constant y face; plane 'x': constant x face
  function faceText(plane, c, a, b, str, opt = {}) {
    const p = (plane === 'y') ? proj(a, c, b) : proj(c, a, b);
    const m = (plane === 'y')
      ? `matrix(${SQ},0.5,0,1,${p[0].toFixed(2)},${p[1].toFixed(2)})`
      : `matrix(${-SQ},0.5,0,1,${p[0].toFixed(2)},${p[1].toFixed(2)})`;
    const fs = opt.size || 13;
    const fill = opt.fill || '#5b4636';
    const weight = opt.weight || 600;
    const anchor = opt.anchor || 'start';
    return `<text transform="${m}" font-size="${fs}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}" font-family="'Zen Maru Gothic','Hiragino Maru Gothic ProN',sans-serif" letter-spacing="0.02em">${str}</text>`;
  }

  return { proj, P, shade, box, tile, faceRect, faceText, poly, SQ,
    setScale: v => { S = v; }, getScale: () => S };
})();
