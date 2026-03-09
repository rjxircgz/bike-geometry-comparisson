const SUPABASE_URL = 'https://lisupvefkyjobyistnlu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpc3VwdmVma3lqb2J5aXN0bmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDE3MzAsImV4cCI6MjA4ODU3NzczMH0.D949-fYJCyW2xHHYzM7NC-q8IIBBMDOoExj1emH3moM';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fallback presets (Argon 18 only) — used if Supabase is unavailable
const FALLBACK_PRESETS = [
  { category: 'Road',   name: 'Argon 18 Nitrogen Disc', year: 2019, size: 'XS', hta: 72,   sta: 74.5, reach: 383, stack: 487, topTube: 519, wheelbase: 973,  bbDrop: 70, stemAngle: -6, stemLength: 80 },
  { category: 'Road',   name: 'Argon 18 Nitrogen Disc', year: 2019, size: 'S',  hta: 72.7, sta: 74,   reach: 390, stack: 516, topTube: 538, wheelbase: 983,  bbDrop: 70, stemAngle: -6, stemLength: 90 },
  { category: 'Road',   name: 'Argon 18 Nitrogen Disc', year: 2019, size: 'M',  hta: 72.7, sta: 73.5, reach: 394, stack: 546, topTube: 556, wheelbase: 996,  bbDrop: 70, stemAngle: -6, stemLength: 100 },
  { category: 'Road',   name: 'Argon 18 Nitrogen Disc', year: 2019, size: 'L',  hta: 72.7, sta: 73,   reach: 402, stack: 566, topTube: 575, wheelbase: 1013, bbDrop: 70, stemAngle: -6, stemLength: 100 },
  { category: 'Road',   name: 'Argon 18 Nitrogen Disc', year: 2019, size: 'XL', hta: 73,   sta: 72.5, reach: 409, stack: 592, topTube: 595, wheelbase: 1024, bbDrop: 70, stemAngle: -6, stemLength: 110 },
  { category: 'Road',   name: 'Argon 18 Sum',           year: 2023, size: 'XS', hta: 72.1, sta: 74.5, reach: 382, stack: 493, topTube: 520, wheelbase: 972,  bbDrop: 73, stemAngle: -6, stemLength: 80 },
  { category: 'Road',   name: 'Argon 18 Sum',           year: 2023, size: 'S',  hta: 72.7, sta: 74,   reach: 389, stack: 516, topTube: 538, wheelbase: 975,  bbDrop: 77, stemAngle: -6, stemLength: 90 },
  { category: 'Road',   name: 'Argon 18 Sum Pro',       year: 2023, size: 'XS', hta: 72.1, sta: 74.5, reach: 382, stack: 493, topTube: 520, wheelbase: 972,  bbDrop: 73, stemAngle: -6, stemLength: 80 },
  { category: 'Road',   name: 'Argon 18 Sum Pro',       year: 2023, size: 'S',  hta: 72.7, sta: 74,   reach: 389, stack: 516, topTube: 538, wheelbase: 975,  bbDrop: 77, stemAngle: -6, stemLength: 90 },
  { category: 'Gravel', name: 'Argon 18 Dark Matter',   year: 2025, size: 'XXS', hta: 68.5, sta: 75.5, reach: 370, stack: 520, topTube: 507, wheelbase: 1030, bbDrop: 80, stemAngle: -6, stemLength: 70 },
  { category: 'Gravel', name: 'Argon 18 Dark Matter',   year: 2025, size: 'XS',  hta: 70,   sta: 74.9, reach: 382, stack: 540, topTube: 530, wheelbase: 1036, bbDrop: 80, stemAngle: -6, stemLength: 80 },
  { category: 'Gravel', name: 'Argon 18 Dark Matter',   year: 2025, size: 'S',   hta: 70.5, sta: 74.3, reach: 394, stack: 561, topTube: 553, wheelbase: 1045, bbDrop: 78, stemAngle: -6, stemLength: 90 },
  { category: 'Gravel', name: 'Argon 18 Dark Matter',   year: 2025, size: 'M',   hta: 71,   sta: 73.7, reach: 406, stack: 582, topTube: 577, wheelbase: 1059, bbDrop: 78, stemAngle: -6, stemLength: 90 },
  { category: 'Gravel', name: 'Argon 18 Dark Matter',   year: 2025, size: 'L',   hta: 71,   sta: 73.1, reach: 418, stack: 603, topTube: 602, wheelbase: 1080, bbDrop: 76, stemAngle: -6, stemLength: 100 },
  { category: 'Gravel', name: 'Argon 18 Dark Matter',   year: 2025, size: 'XL',  hta: 71,   sta: 72.5, reach: 430, stack: 629, topTube: 629, wheelbase: 1101, bbDrop: 76, stemAngle: -6, stemLength: 110 },
];

let PRESETS = [...FALLBACK_PRESETS];

// Load presets from Supabase
async function loadPresetsFromSupabase() {
  try {
    const { data, error } = await sb
      .from('bike_geometries')
      .select('*')
      .order('category')
      .order('name')
      .order('size');

    if (error) throw error;

    PRESETS = data.map(r => ({
      category: r.category,
      name: r.name,
      year: r.year,
      size: r.size,
      hta: Number(r.hta),
      sta: Number(r.sta),
      reach: Number(r.reach),
      stack: Number(r.stack),
      topTube: Number(r.top_tube),
      wheelbase: Number(r.wheelbase),
      bbDrop: Number(r.bb_drop),
      stemAngle: Number(r.stem_angle),
      stemLength: Number(r.stem_length),
    }));
    console.log('Loaded', PRESETS.length, 'presets from Supabase.');
  } catch (err) {
    console.warn('Supabase unavailable, using fallback presets:', err.message);
  }
}

const DEFAULTS = [
  { name: 'Colnago V4Rs (53)', color: '#e94560', hta: 72.5, sta: 73.5, reach: 395, stack: 575, topTube: 567, wheelbase: 996, bbDrop: 72, stemAngle: -6, stemLength: 100, stemSpacers: 10, seatpostHeight: 200, seatpostOffset: 20, saddleSetback: 0, saddleLength: 275, saddleTilt: 0 },
  { name: 'Cervélo S5 (56)',   color: '#3498db', hta: 73.5, sta: 73,   reach: 392, stack: 565, topTube: 565, wheelbase: 982, bbDrop: 72, stemAngle: -6, stemLength: 100, stemSpacers: 10, seatpostHeight: 200, seatpostOffset: 20, saddleSetback: 0, saddleLength: 275, saddleTilt: 0 },
];

const PARAM_DEFS = [
  { key: 'hta',              label: 'Head Tube Angle',   unit: '°',  min: 55,  max: 80,  step: 0.1 },
  { key: 'sta',              label: 'Seat Tube Angle',   unit: '°',  min: 65,  max: 80,  step: 0.1 },
  { key: 'reach',            label: 'Reach',             unit: 'mm', min: 350, max: 550, step: 1 },
  { key: 'stack',            label: 'Stack',             unit: 'mm', min: 500, max: 700, step: 1 },
  { key: 'wheelbase',        label: 'Wheelbase',         unit: 'mm', min: 900, max: 1350, step: 1 },
  { key: 'bbDrop',           label: 'BB Drop',           unit: 'mm', min: 0,   max: 100,  step: 1 },
  { key: 'stemAngle',        label: 'Angle',              unit: '°',  min: -35, max: 35,  step: 1,  group: 'Stem' },
  { key: 'stemLength',       label: 'Length',             unit: 'mm', min: 30,  max: 150, step: 1,  group: 'Stem' },
  { key: 'stemSpacers',      label: 'Spacers',            unit: 'mm', min: 0,   max: 60,  step: 1,  group: 'Stem' },
  { key: 'seatpostHeight',   label: 'Height',             unit: 'mm', min: 0,   max: 300, step: 1,  group: 'Seatpost' },
  { key: 'seatpostOffset',   label: 'Offset',             unit: 'mm', min: 0,   max: 40,  step: 1,  group: 'Seatpost' },
  { key: 'saddleSetback',    label: 'Saddle Setback',     unit: 'mm', min: 0,   max: 50,  step: 1,  group: 'Seatpost' },
  { key: 'saddleLength',     label: 'Saddle Length',      unit: 'mm', min: 200, max: 320, step: 1,  group: 'Saddle' },
  { key: 'saddleTilt',       label: 'Saddle Tilt',        unit: '°',  min: -10, max: 10,  step: 0.5, group: 'Saddle' },
];

let bikes = [];
let nextId = 0;

function addBike(preset) {
  const d = preset || {
    name: 'Bike ' + (bikes.length + 1),
    color: ['#e94560','#3498db','#2ecc71','#f39c12'][bikes.length % 4],
    hta: 67, sta: 75, reach: 460, stack: 615, topTube: 610, wheelbase: 1170, bbDrop: 40, stemAngle: -6, stemLength: 60, stemSpacers: 10, seatpostHeight: 200, seatpostOffset: 20, saddleSetback: 0, saddleLength: 275,
  };
  bikes.push({ id: nextId++, visible: true, ...d });
  render();
}

function removeBike(id) {
  bikes = bikes.filter(b => b.id !== id);
  render();
}

function render() {
  renderCards();
  renderToggles();
  renderSVG();
  renderTable();
  document.getElementById('add-bike-btn').disabled = bikes.length >= 4;
}

function renderToggles() {
  const container = document.getElementById('visibility-toggles');
  container.innerHTML = '';
  bikes.forEach(bike => {
    const btn = document.createElement('button');
    btn.className = 'vis-toggle' + (bike.visible ? ' active' : '');
    btn.style.setProperty('--bike-color', bike.color);
    btn.textContent = bike.name;
    btn.addEventListener('click', () => {
      bike.visible = !bike.visible;
      render();
    });
    container.appendChild(btn);
  });
}

/* ── Cards ── */
function renderCards() {
  const container = document.getElementById('bikes-container');
  container.innerHTML = '';
  bikes.forEach(bike => {
    const card = document.createElement('div');
    card.className = 'bike-card';
    card.style.borderTopColor = bike.color;
    card.style.borderTop = `3px solid ${bike.color}`;

    let html = `<button class="remove-btn" data-id="${bike.id}">&times;</button>`;
    html += `<div class="name-row">
      <input type="text" value="${bike.name}" data-id="${bike.id}" data-field="name">
      <input type="color" value="${bike.color}" data-id="${bike.id}" data-field="color">
    </div>`;
    // Searchable preset dropdown (model)
    html += `<div class="preset-search" data-id="${bike.id}">`;
    html += `<input type="text" class="preset-input" placeholder="Search presets\u2026" autocomplete="off">`;
    html += `<span class="chevron">\u25BC</span>`;
    html += `<div class="preset-dropdown"></div>`;
    html += `</div>`;
    // Size selector (shown after model is picked)
    html += `<select class="size-select" data-id="${bike.id}" style="display:none">`;
    html += `<option value="" disabled selected>Select size\u2026</option>`;
    html += `</select>`;

    // Ungrouped params in a 2-col grid
    const ungrouped = PARAM_DEFS.filter(p => !p.group);
    html += `<div class="params-grid">`;
    ungrouped.forEach(p => {
      html += `<div class="param-group">
        <label>${p.label}${p.unit === '°' ? ' (°)' : ''}</label>
        <input type="number" value="${bike[p.key]}" min="${p.min}" max="${p.max}" step="${p.step}"
               data-id="${bike.id}" data-field="${p.key}">
      </div>`;
    });
    html += `</div>`;

    // Grouped params as labeled side-by-side pairs
    const groups = [...new Set(PARAM_DEFS.filter(p => p.group).map(p => p.group))];
    groups.forEach(g => {
      const items = PARAM_DEFS.filter(p => p.group === g);
      html += `<div class="param-pair-label">${g}</div>`;
      html += `<div class="param-pair">`;
      items.forEach(p => {
        html += `<div class="param-group">
          <label>${p.label}${p.unit === '°' ? ' (°)' : ''}</label>
          <input type="number" value="${bike[p.key]}" min="${p.min}" max="${p.max}" step="${p.step}"
                 data-id="${bike.id}" data-field="${p.key}">
        </div>`;
      });
      html += `</div>`;
    });
    card.innerHTML = html;
    container.appendChild(card);
  });

  // Build unique model list (deduplicated by name+year)
  function getModels() {
    const seen = new Set();
    return PRESETS.filter(p => {
      const key = p.name + '|' + p.year;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Searchable preset dropdowns
  container.querySelectorAll('.preset-search').forEach(wrapper => {
    const input = wrapper.querySelector('.preset-input');
    const dropdown = wrapper.querySelector('.preset-dropdown');
    const bikeId = Number(wrapper.dataset.id);
    const sizeSel = wrapper.parentElement.querySelector('.size-select[data-id="' + bikeId + '"]');

    function buildList(filter) {
      const q = (filter || '').toLowerCase();
      const models = getModels();
      const categories = [...new Set(models.map(p => p.category))];
      let html = '';
      let anyMatch = false;
      categories.forEach(cat => {
        const items = models
          .filter(p => p.category === cat)
          .filter(p => !q || p.name.toLowerCase().includes(q)
            || p.category.toLowerCase().includes(q)
            || String(p.year).includes(q));
        if (items.length === 0) return;
        anyMatch = true;
        html += `<div class="cat-label">${cat}</div>`;
        items.forEach(p => {
          html += `<div class="preset-option" data-name="${p.name}" data-year="${p.year}">${p.name} <span class="meta">${p.year}</span></div>`;
        });
      });
      if (!anyMatch) html = '<div class="no-results">No bikes found</div>';
      dropdown.innerHTML = html;
    }

    function open() {
      buildList(input.value);
      wrapper.classList.add('open');
    }
    function close() {
      setTimeout(() => wrapper.classList.remove('open'), 150);
    }

    input.addEventListener('focus', open);
    input.addEventListener('blur', close);
    input.addEventListener('input', () => {
      buildList(input.value);
      wrapper.classList.add('open');
    });

    // Step 1: pick model → populate size dropdown
    dropdown.addEventListener('mousedown', (e) => {
      const opt = e.target.closest('.preset-option');
      if (!opt) return;
      e.preventDefault();
      const modelName = opt.dataset.name;
      const modelYear = Number(opt.dataset.year);
      input.value = modelName + ' ' + modelYear;
      wrapper.classList.remove('open');

      // Find all sizes for this model
      const sizes = PRESETS.filter(p => p.name === modelName && p.year === modelYear);
      sizeSel.innerHTML = '<option value="" disabled selected>Select size\u2026</option>';
      sizes.forEach((s, i) => {
        const idx = PRESETS.indexOf(s);
        sizeSel.innerHTML += `<option value="${idx}">${s.size}</option>`;
      });
      sizeSel.style.display = 'block';

      // If only one size, auto-select it
      if (sizes.length === 1) {
        sizeSel.value = String(PRESETS.indexOf(sizes[0]));
        sizeSel.dispatchEvent(new Event('change'));
      }
    });
  });

  // Step 2: pick size → load geometry
  container.querySelectorAll('.size-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const preset = PRESETS[Number(sel.value)];
      const bike = bikes.find(b => b.id === Number(sel.dataset.id));
      if (!bike || !preset) return;
      bike.name = preset.name + ' (' + preset.size + ')';
      PARAM_DEFS.forEach(p => { if (preset[p.key] != null) bike[p.key] = preset[p.key]; });
      render();
    });
  });

  // Event delegation
  container.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', () => removeBike(Number(btn.dataset.id)))
  );
  container.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => {
      const bike = bikes.find(b => b.id === Number(inp.dataset.id));
      if (!bike) return;
      const field = inp.dataset.field;
      if (field === 'name') bike.name = inp.value;
      else if (field === 'color') bike.color = inp.value;
      else bike[field] = parseFloat(inp.value) || 0;
      renderSVG();
      renderTable();
      // Update card border color live
      if (field === 'color') inp.closest('.bike-card').style.borderTop = `3px solid ${bike.color}`;
    });
  });
}

/* ── SVG Rendering ── */
function deg(a) { return a * Math.PI / 180; }

function computeBikePoints(bike) {
  // BB is origin (0,0). Y-axis points up in our coordinate system.
  const bb = { x: 0, y: 0 };

  // Head tube top is defined by reach/stack from BB.
  const htTop = { x: bike.reach, y: bike.stack };

  // Head tube extends downward from htTop at head tube angle.
  // HTA is measured from horizontal. The tube goes down-and-forward.
  const htLength = 120; // approximate visual head tube length
  const htaRad = deg(bike.hta);
  const htBottom = {
    x: htTop.x + htLength * Math.cos(htaRad),
    y: htTop.y - htLength * Math.sin(htaRad),
  };

  // Seat tube extends upward from BB at seat tube angle.
  const stLength = 500; // approximate visual seat tube length
  const staRad = deg(bike.sta);
  const stTop = {
    x: bb.x - stLength * Math.cos(staRad),
    y: bb.y + stLength * Math.sin(staRad),
  };

  // Seatpost extends above seat tube top along the same angle
  const spHeight = bike.seatpostHeight || 0;
  const spOffset = bike.seatpostOffset || 0;
  const saddleSetback = bike.saddleSetback || 0;
  const seatpostTop = {
    x: stTop.x - spHeight * Math.cos(staRad),
    y: stTop.y + spHeight * Math.sin(staRad),
  };
  // Seatpost offset shifts the clamp backward (horizontally) from seat tube axis
  // Saddle setback shifts the saddle further back on the rails
  const saddle = {
    x: seatpostTop.x - spOffset - saddleSetback,
    y: seatpostTop.y,
  };

  // Saddle tilt and nose/tail points
  const saddleLen = bike.saddleLength || 275;
  const tiltRad = deg(bike.saddleTilt || 0);
  const halfLen = saddleLen / 2;
  const saddleNose = {
    x: saddle.x + halfLen * Math.cos(tiltRad),
    y: saddle.y + halfLen * Math.sin(tiltRad),
  };
  const saddleTail = {
    x: saddle.x - halfLen * Math.cos(tiltRad),
    y: saddle.y - halfLen * Math.sin(tiltRad),
  };

  // Spacers raise the stem origin along the steerer tube (up and back)
  const spacers = bike.stemSpacers || 0;
  const stemOrigin = {
    x: htTop.x - spacers * Math.cos(htaRad),
    y: htTop.y + spacers * Math.sin(htaRad),
  };

  // Stem extends from stem origin, angled relative to the steerer tube.
  // Perpendicular to steerer (forward) is at (90 - HTA)° from horizontal.
  // Stem angle is measured from that perpendicular (negative = angled down).
  const effectiveStemAngle = 90 - bike.hta + bike.stemAngle;
  const stemRad = deg(effectiveStemAngle);
  const stemEnd = {
    x: stemOrigin.x + bike.stemLength * Math.cos(stemRad),
    y: stemOrigin.y + bike.stemLength * Math.sin(stemRad),
  };

  // Wheels — both axles at same height so both wheels sit flat on the ground
  const wheelRadius = 340; // ~700c wheel radius in mm at scale

  // BB drop: BB sits below axle centerline. In Y-up system, axles are above BB.
  const bbDrop = bike.bbDrop || 70;
  const axleY = bbDrop;

  // Front axle: X from fork geometry, Y from BB drop
  const forkLength = 520;
  const frontAxleX = htBottom.x + forkLength * Math.cos(htaRad);
  const frontAxle = { x: frontAxleX, y: axleY };

  // Rear axle: wheelbase back from front axle, same Y
  const wb = bike.wheelbase || 1000;
  const rearAxle = { x: frontAxle.x - wb, y: axleY };

  // Top tube: slopes slightly down from head tube toward seat tube (compact frame)
  // Drop is proportional to ETT for a natural ~2° slope across bike types
  const ett = bike.topTube || 600;
  const ttDrop = ett * 0.035;
  const ttSeatY = htTop.y - ttDrop;
  const ttSeatJoin = {
    x: bb.x - (ttSeatY / Math.tan(staRad)),
    y: ttSeatY,
  };

  return { bb, htTop, htBottom, stTop, seatpostTop, saddle, saddleNose, saddleTail, stemOrigin, stemEnd, rearAxle, frontAxle, ttSeatJoin, wheelRadius, effectiveStemAngle };
}

function renderSVG() {
  const svg = document.getElementById('bike-svg');
  const legend = document.getElementById('svg-legend');
  svg.innerHTML = '';
  legend.innerHTML = '';

  // Compute all points to determine viewBox
  const visibleBikes = bikes.filter(b => b.visible);

  if (visibleBikes.length === 0) {
    svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#555" font-size="16">Add bikes to see the geometry overlay</text>';
    return;
  }

  const allBikePoints = visibleBikes.map(b => ({ bike: b, pts: computeBikePoints(b) }));

  // Gather all x,y coords to calculate bounds
  let allX = [], allY = [];
  allBikePoints.forEach(({ pts }) => {
    const coords = [pts.bb, pts.htTop, pts.htBottom, pts.stTop, pts.seatpostTop, pts.saddle, pts.saddleNose, pts.saddleTail, pts.stemOrigin, pts.stemEnd, pts.rearAxle, pts.frontAxle, pts.ttSeatJoin];
    coords.forEach(c => { allX.push(c.x); allY.push(c.y); });
    // Wheel edges
    allX.push(pts.rearAxle.x - pts.wheelRadius, pts.rearAxle.x + pts.wheelRadius);
    allX.push(pts.frontAxle.x - pts.wheelRadius, pts.frontAxle.x + pts.wheelRadius);
    allY.push(pts.rearAxle.y - pts.wheelRadius, pts.rearAxle.y + pts.wheelRadius);
    allY.push(pts.frontAxle.y - pts.wheelRadius, pts.frontAxle.y + pts.wheelRadius);
  });

  const minX = Math.min(...allX) - 60;
  const maxX = Math.max(...allX) + 60;
  const minY = Math.min(...allY) - 60;
  const maxY = Math.max(...allY) + 60;
  const width = maxX - minX;
  const height = maxY - minY;

  // Flip Y: SVG y goes down, our coordinates y goes up.
  // We'll transform: svgY = maxY - y + minY ... simpler: use a group with scale(1,-1)
  svg.setAttribute('viewBox', `${minX} ${-maxY} ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // Grid / ground reference
  // Draw a subtle ground line at the lowest wheel point
  const groundLevel = Math.min(...allBikePoints.map(({ pts }) =>
    Math.min(pts.rearAxle.y - pts.wheelRadius, pts.frontAxle.y - pts.wheelRadius)
  ));

  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('transform', 'scale(1,-1)');
  const groundLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  groundLine.setAttribute('x1', minX);
  groundLine.setAttribute('x2', maxX);
  groundLine.setAttribute('y1', -groundLevel);
  groundLine.setAttribute('y2', -groundLevel);
  groundLine.setAttribute('stroke', '#0f3460');
  groundLine.setAttribute('stroke-width', '1');
  groundLine.setAttribute('stroke-dasharray', '8,4');
  gridGroup.appendChild(groundLine);
  svg.appendChild(gridGroup);

  // Draw each bike
  const pendingTooltips = [];
  allBikePoints.forEach(({ bike, pts }) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', 'scale(1,-1)');

    const color = bike.color;
    const sw = 2.5;

    function line(a, b, width, dash) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      el.setAttribute('x1', a.x); el.setAttribute('y1', a.y);
      el.setAttribute('x2', b.x); el.setAttribute('y2', b.y);
      el.setAttribute('stroke', color);
      el.setAttribute('stroke-width', width || sw);
      el.setAttribute('stroke-linecap', 'round');
      if (dash) el.setAttribute('stroke-dasharray', dash);
      g.appendChild(el);
    }

    function measureLine(a, b, label, offset) {
      // Dashed line
      line(a, b, 1.5, '8,5');
      // Label at midpoint with background pill
      const mx = (a.x + b.x) / 2 + (offset || 0);
      const my = -((a.y + b.y) / 2); // counter group scale(1,-1)

      const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      tooltip.classList.add('measure-tooltip');
      tooltip.setAttribute('transform-origin', `${mx} ${my}`);

      // Background pill
      const padX = 12, padY = 6, fontSize = 24;
      const estW = label.length * fontSize * 0.55;
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', mx - estW / 2 - padX);
      rect.setAttribute('y', my - fontSize / 2 - padY);
      rect.setAttribute('width', estW + padX * 2);
      rect.setAttribute('height', fontSize + padY * 2);
      rect.setAttribute('rx', 6);
      rect.setAttribute('fill', '#0a0a1a');
      rect.setAttribute('fill-opacity', '0.9');
      rect.setAttribute('stroke', color);
      rect.setAttribute('stroke-width', 1.5);
      tooltip.appendChild(rect);

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', mx);
      txt.setAttribute('y', my);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'central');
      txt.setAttribute('fill', '#fff');
      txt.setAttribute('font-size', fontSize);
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('font-family', 'inherit');
      txt.textContent = label;
      tooltip.appendChild(txt);

      pendingTooltips.push(tooltip);
    }

    function circle(c, r, fill) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      el.setAttribute('cx', c.x); el.setAttribute('cy', c.y);
      el.setAttribute('r', r);
      el.setAttribute('stroke', color);
      el.setAttribute('stroke-width', fill ? 0 : sw);
      el.setAttribute('fill', fill || 'none');
      g.appendChild(el);
    }

    // Wheels
    circle(pts.rearAxle, pts.wheelRadius);
    circle(pts.frontAxle, pts.wheelRadius);

    // Hub dots
    circle(pts.rearAxle, 6, color);
    circle(pts.frontAxle, 6, color);

    // BB dot
    circle(pts.bb, 8, color);

    // Seat tube
    line(pts.bb, pts.stTop, 5);

    // Seatpost
    line(pts.stTop, pts.seatpostTop, 2);

    // Saddle
    line(pts.saddleTail, pts.saddleNose, 3);

    // Head tube
    line(pts.htTop, pts.htBottom, 6);

    // Down tube (BB to head tube bottom)
    line(pts.bb, pts.htBottom, 3);

    // Chainstay (BB to rear axle)
    line(pts.bb, pts.rearAxle, 2);

    // Fork (head tube bottom to front axle)
    line(pts.htBottom, pts.frontAxle, 2.5);

    // Steerer tube / spacers (htTop to stemOrigin)
    line(pts.htTop, pts.stemOrigin, 2);

    // Stem
    line(pts.stemOrigin, pts.stemEnd, 3.5);

    // Handlebar — small T at end of stem
    const barHalf = 30;
    const stemPerp = deg(pts.effectiveStemAngle + 90);
    const barEnd1 = {
      x: pts.stemEnd.x + barHalf * Math.cos(stemPerp),
      y: pts.stemEnd.y + barHalf * Math.sin(stemPerp),
    };
    const barEnd2 = {
      x: pts.stemEnd.x - barHalf * Math.cos(stemPerp),
      y: pts.stemEnd.y - barHalf * Math.sin(stemPerp),
    };
    line(barEnd1, barEnd2, 3);

    // Measurement: wheelbase (dashed hub-to-hub line)
    const wb = Math.round(Math.sqrt(
      (pts.frontAxle.x - pts.rearAxle.x) ** 2 +
      (pts.frontAxle.y - pts.rearAxle.y) ** 2
    ));
    measureLine(pts.rearAxle, pts.frontAxle, `WB: ${wb}mm`, 250);

    // Measurement: BB drop (vertical from axle line down to BB)
    const bbDropPt = { x: pts.bb.x, y: pts.rearAxle.y };
    measureLine(bbDropPt, pts.bb, `BBd: ${bike.bbDrop}mm`, 30);

    // Measurement: saddle height (BB center to saddle nose tip)
    const shDx = pts.saddleNose.x - pts.bb.x;
    const shDy = pts.saddleNose.y - pts.bb.y;
    const saddleHeight = Math.round(Math.sqrt(shDx * shDx + shDy * shDy));
    measureLine(pts.bb, pts.saddleNose, `SH: ${saddleHeight}mm`, -40);

    // Measurement: saddle nose to handlebar (stem clamp)
    const dx = pts.saddleNose.x - pts.stemEnd.x;
    const dy = pts.saddleNose.y - pts.stemEnd.y;
    const dist = Math.round(Math.sqrt(dx * dx + dy * dy));
    measureLine(pts.saddleNose, pts.stemEnd, `Nose–Bar: ${dist}mm`, 20);

    svg.appendChild(g);

    // Legend
    const item = document.createElement('div');
    item.className = 'svg-legend-item';
    item.innerHTML = `<div class="svg-legend-swatch" style="background:${bike.color}"></div><span>${bike.name}</span><span class="legend-measure">Nose–Bar: ${dist}mm</span>`;
    legend.appendChild(item);
  });

  // Append all tooltips last so they render on top of all bike lines
  pendingTooltips.forEach(t => svg.appendChild(t));
}

/* ── Comparison Table ── */
function renderTable() {
  const table = document.getElementById('comparison-table');
  const vb = bikes.filter(b => b.visible);
  if (vb.length === 0) {
    table.innerHTML = '<tr><td style="color:#555;padding:20px;">Add bikes to see the comparison table</td></tr>';
    return;
  }

  let html = '<thead><tr><th>Parameter</th>';
  vb.forEach(b => {
    html += `<th style="color:${b.color}">${b.name}</th>`;
  });
  if (vb.length === 2) html += '<th>Delta</th>';
  html += '</tr></thead><tbody>';

  PARAM_DEFS.forEach(p => {
    const values = vb.map(b => b[p.key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const allSame = min === max;

    html += `<tr><td>${p.label}${p.unit === '°' ? ' (°)' : ''}</td>`;
    values.forEach(v => {
      let cls = '';
      if (!allSame && vb.length > 1) {
        if (v === min) cls = 'cell-min';
        else if (v === max) cls = 'cell-max';
      }
      html += `<td class="${cls}">${v}</td>`;
    });
    if (vb.length === 2) {
      const delta = values[1] - values[0];
      const sign = delta > 0 ? '+' : '';
      html += `<td class="delta-cell">${sign}${delta.toFixed(1)}</td>`;
    }
    html += '</tr>';
  });

  html += '</tbody>';
  table.innerHTML = html;
}

/* ── Init ── */
document.getElementById('add-bike-btn').addEventListener('click', () => addBike());
(async () => {
  await loadPresetsFromSupabase();
  DEFAULTS.forEach(d => addBike(d));
})();
