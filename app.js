/* =====================================================================
   LAMBORGHINI AVENTADOR LP 780-4 — INTERACTIVE 3D SHOWCASE
   Three.js + GSAP — Premium Interactive Experience
   ===================================================================== */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';


/* ─────────────────────────────────────────────
   ▶ MODEL URL — PASTE YOUR .glb URL HERE
   ───────────────────────────────────────────── */
const MODEL_URL = './lamborghini_aventador_svj_sdc__free-compressed.gltf';

/* ─────────────────────────────────────────────
   ▶ HDRI ENVIRONMENT MAP URL
   Using a free studio HDRI for realistic reflections
   ───────────────────────────────────────────── */
const HDRI_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr';


/* ═══════════════════════════════════════════════
   SPEC DATA — Hotspot positions & tooltip content
   ═══════════════════════════════════════════════ */
const SPEC_DATA = {
    engine: {
        tag: 'POWERTRAIN',
        title: 'Naturally Aspirated V12',
        val1: '770', unit1: 'CV',
        val2: '720', unit2: 'Nm',
        val3: '2.8', unit3: '0-100 km/h (s)',
        desc: 'The iconic 6.5-litre V12 engine delivers an intoxicating 8,500 rpm redline with 770 CV of pure naturally aspirated fury — the most powerful Lamborghini V12 ever produced.',
        // 3D world position for hotspot (adjust after seeing your model)
        worldPos: new THREE.Vector3(0, 0.8, -1.5)
    },
    aero: {
        tag: 'AERODYNAMICS',
        title: 'Active Aerodynamics',
        val1: '40', unit1: '% more downforce',
        val2: '355', unit2: 'km/h top speed',
        val3: '1.0', unit3: 'drag coefficient',
        desc: 'ALA 2.0 active aerodynamics with patented aero-vectoring system. Carbon fibre front splitter and aggressive rear diffuser generate exceptional downforce.',
        worldPos: new THREE.Vector3(0, 0.4, 2.2)
    },
    wheels: {
        tag: 'CHASSIS',
        title: 'Carbon-Ceramic Brakes',
        val1: '400', unit1: 'mm front disc',
        val2: '380', unit2: 'mm rear disc',
        val3: '20/21', unit3: 'inch alloys',
        desc: 'CCM-R (Carbon Ceramic Matrix Reinforced) braking system. Forged aluminium monoblock callipers with superior heat resistance and 50% weight reduction.',
        worldPos: new THREE.Vector3(1.2, 0.3, 0.5)
    },
    exhaust: {
        tag: 'SOUND',
        title: 'Titanium Exhaust System',
        val1: '9,250', unit1: 'rpm limiter',
        val2: '-40', unit2: '% lighter',
        val3: '108', unit3: 'dB at WOT',
        desc: 'Lightweight titanium exhaust with high-temperature performance. Electronically controlled exhaust valve generates the legendary Aventador V12 symphony.',
        worldPos: new THREE.Vector3(0, 0.45, -2.2)
    }
};


/* ═══════════════════════════════════════════════
   THREE.JS SCENE SETUP
   ═══════════════════════════════════════════════ */
const container = document.getElementById('canvasContainer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0A0A0A);

// Camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(5, 2.5, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = true;
controls.minDistance = 3;
controls.maxDistance = 12;
controls.minPolarAngle = Math.PI * 0.2;
controls.maxPolarAngle = Math.PI * 0.55;
controls.target.set(0, 0.6, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;
controls.update();


/* ─── LIGHTING ─── */
// Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Key Light (warm)
const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
keyLight.position.set(5, 8, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 25;
keyLight.shadow.camera.left = -5;
keyLight.shadow.camera.right = 5;
keyLight.shadow.camera.top = 5;
keyLight.shadow.camera.bottom = -5;
keyLight.shadow.bias = -0.001;
keyLight.shadow.normalBias = 0.02;
scene.add(keyLight);

// Fill light (cool)
const fillLight = new THREE.DirectionalLight(0xb4d5ff, 0.6);
fillLight.position.set(-4, 4, -4);
scene.add(fillLight);

// Rim light (accent orange glow)
const rimLight = new THREE.DirectionalLight(0xFF8700, 0.5);
rimLight.position.set(-3, 2, 6);
scene.add(rimLight);

// Ground bounce light
const bounceLight = new THREE.HemisphereLight(0x222222, 0x111111, 0.3);
scene.add(bounceLight);


/* ─── GROUND PLANE (shadow receiver) ─── */
const groundGeom = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.ShadowMaterial({
    opacity: 0.35,
    color: 0x000000
});
const ground = new THREE.Mesh(groundGeom, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

// Subtle reflective ground circle
const groundCircleGeom = new THREE.CircleGeometry(4, 64);
const groundCircleMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.7,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6
});
const groundCircle = new THREE.Mesh(groundCircleGeom, groundCircleMat);
groundCircle.rotation.x = -Math.PI / 2;
groundCircle.position.y = 0.001;
scene.add(groundCircle);


/* ═══════════════════════════════════════════════
   LOAD HDRI ENVIRONMENT MAP
   ═══════════════════════════════════════════════ */
const rgbeLoader = new RGBELoader();
rgbeLoader.load(HDRI_URL, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // Don't set as background — we want our dark bg
}, undefined, (err) => {
    console.warn('HDRI load failed, using fallback environment:', err);
    // Fallback: use a simple env map
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();
    scene.environment = pmremGen.fromScene(new THREE.Scene()).texture;
});


/* ═══════════════════════════════════════════════
   LOAD 3D MODEL (.glb)
   ═══════════════════════════════════════════════ */
const loaderBar = document.getElementById('loaderBar');
const loaderPercent = document.getElementById('loaderPercent');
const loaderEl = document.getElementById('loader');

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let carModel = null;
let paintMaterial = null;
const headlightMaterials = [];

gltfLoader.load(
    MODEL_URL,
    (gltf) => {
        carModel = gltf.scene;

        // Auto-center and scale the model
        const box = new THREE.Box3().setFromObject(carModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Scale to fit nicely (target ~4 units wide)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        carModel.scale.setScalar(scale);

        // Re-center after scaling
        box.setFromObject(carModel);
        box.getCenter(center);
        carModel.position.sub(center);
        carModel.position.y = 0; // sit on ground

        // Enable shadows and capture materials
        const brakeLightMaterials = [];
        carModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Improve material quality
                if (child.material) {
                    child.material.envMapIntensity = 1.5;

                    // Capture body paint
                    if (child.material.name === 'CARROSSERIE') {
                        paintMaterial = child.material;
                        paintMaterial.roughness = 0.12;
                        paintMaterial.metalness = 0.9;
                    }

                    // ─── BUMPERS / AERO PARTS (Carbon -> Black) ───
                    if (child.material.name === 'CARBONE') {
                        // The user wants front/rear bumpers to be black. 
                        // In this model, the aggressive splitters/diffusers use CARBONE.
                        child.material.color.setHex(0x050505);
                        child.material.map = null; // Remove carbon texture if any
                        child.material.roughness = 0.15;
                        child.material.metalness = 0.8;
                    }

                    // ─── BRAKE LIGHTS (Red Glow — always on) ───
                    if (child.material.name === 'GlassRedLights') {
                        if (!brakeLightMaterials.includes(child.material)) {
                            brakeLightMaterials.push(child.material);
                            // Deep red base color
                            child.material.color.setHex(0xCC0000);
                            // Red emissive glow (always on like real brake/tail lights)
                            child.material.emissive = new THREE.Color(0xFF0000);
                            child.material.emissiveIntensity = 2.5;
                            child.material.roughness = 0.25;
                            child.material.metalness = 0.1;
                            child.material.transparent = true;
                            child.material.opacity = 0.92;
                        }
                    }

                    // ─── HEADLIGHTS (White — toggle controlled) ───
                    if (child.material.name === 'LightEmissiveWhite') {
                        if (!headlightMaterials.includes(child.material)) {
                            headlightMaterials.push(child.material);
                            // Slight warm white for realistic LED DRL look
                            child.material.color.setHex(0xF0F0FF);
                            child.material.emissive = new THREE.Color(0xFFFFFF);
                            child.material.emissiveIntensity = 0; // start off
                            child.material.roughness = 0.15;
                        }
                    }
                    if (child.material.name === 'GlassWhite') {
                        if (!headlightMaterials.includes(child.material)) {
                            headlightMaterials.push(child.material);
                            // Crystalline white reflector
                            child.material.color.setHex(0xE8E8F0);
                            child.material.emissive = new THREE.Color(0xFFFFFF);
                            child.material.emissiveIntensity = 0; // start off
                            child.material.roughness = 0.1;
                            child.material.metalness = 0.3;
                        }
                    }

                    // ─── HEADLIGHT LENS (Realistic clear glass) ───
                    if (child.material.name === 'HdLightsLens') {
                        child.material.color.setHex(0xCCCCDD);
                        child.material.roughness = 0.05;
                        child.material.metalness = 0.0;
                        child.material.transparent = true;
                        child.material.opacity = 0.55;
                        child.material.envMapIntensity = 2.5;
                    }

                    // ─── GLASS LIGHT COVER (Dark transparent) ───
                    if (child.material.name === 'GlassLights') {
                        child.material.roughness = 0.0;
                        child.material.metalness = 0.0;
                        child.material.transparent = true;
                        child.material.opacity = 0.35;
                        child.material.envMapIntensity = 3.0;
                    }

                    // ─── ORANGE TURN SIGNALS ───
                    if (child.material.name === 'GlassOrangeLights') {
                        child.material.color.setHex(0xFF6600);
                        child.material.emissive = new THREE.Color(0xFF4400);
                        child.material.emissiveIntensity = 0.8;
                        child.material.roughness = 0.1;
                    }
                }
            }
        });

        scene.add(carModel);

        // Update controls target based on model center
        const newBox = new THREE.Box3().setFromObject(carModel);
        const newCenter = newBox.getCenter(new THREE.Vector3());
        controls.target.copy(newCenter);
        controls.update();

        // Trigger entrance animation after a brief delay
        setTimeout(() => {
            hideLoader();
            playEntranceAnimation();
        }, 600);
    },
    (progress) => {
        if (progress.total > 0) {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            loaderBar.style.width = pct + '%';
            loaderPercent.textContent = pct + '%';
        }
    },
    (error) => {
        console.error('Model load error:', error);
        loaderPercent.textContent = '3D Preview Offline';
        
        // Fail-safe: Hide loader and play animations so the rest of the prototype is functional
        setTimeout(() => {
            hideLoader();
            playEntranceAnimation();
        }, 1500);
    }
);


/* ═══════════════════════════════════════════════
   LOADING → REVEAL
   ═══════════════════════════════════════════════ */
function hideLoader() {
    loaderEl.classList.add('hidden');
}


/* ═══════════════════════════════════════════════
   GSAP ENTRANCE ANIMATION
   ═══════════════════════════════════════════════ */
function playEntranceAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Nav
    tl.to('#topNav', { opacity: 1, y: 0, duration: 0.9 }, 0.1);

    // Left panel
    tl.to('#leftPanel', { opacity: 1, x: 0, duration: 0.8 }, 0.3);

    // Right panel
    tl.to('#rightPanel', { opacity: 1, x: 0, duration: 0.8 }, 0.4);

    // CTA
    tl.to('#ctaArea', { opacity: 1, y: 0, duration: 0.8 }, 0.5);

    // Customizer Panel
    tl.call(() => {
        document.getElementById('customizerPanel').classList.add('visible');
    }, null, 0.55);

    // Drag hint
    tl.to('#dragHint', { opacity: 1, y: 0, duration: 0.7 }, 0.6);

    // Background text
    tl.fromTo('.bg-text-main',
        { opacity: 0, scale: 0.85, y: 40 },
        { opacity: 0.03, scale: 1, y: 0, duration: 1.2 },
        0.2
    );
    tl.fromTo('.bg-text-sub',
        { opacity: 0, y: 30 },
        { opacity: 0.08, y: 0, duration: 1 },
        0.4
    );

    // Show hotspots after a delay
    tl.call(() => {
        document.querySelectorAll('.hotspot').forEach(h => h.classList.add('visible'));
    }, null, 1.5);

    // Auto-hide drag hint
    tl.to('#dragHint', { opacity: 0, duration: 0.6 }, '+=4');
}


/* ═══════════════════════════════════════════════
   HOTSPOT PROJECTION — 3D → 2D screen coords
   ═══════════════════════════════════════════════ */
const hotspotEls = {
    engine: document.getElementById('hotspot-engine'),
    aero: document.getElementById('hotspot-aero'),
    wheels: document.getElementById('hotspot-wheels'),
    exhaust: document.getElementById('hotspot-exhaust')
};

function updateHotspotPositions() {
    if (!carModel) return;

    for (const [key, data] of Object.entries(SPEC_DATA)) {
        const worldPos = data.worldPos.clone();

        // Transform the world position by the model's matrix
        // Since we centered the model, positions are relative to origin
        const screenPos = worldPos.clone().project(camera);

        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

        const el = hotspotEls[key];
        if (el) {
            // Hide if behind camera
            if (screenPos.z > 1) {
                el.style.display = 'none';
            } else {
                el.style.left = (x - 14) + 'px';
                el.style.top = (y - 14) + 'px';
                if (el.classList.contains('visible')) {
                    el.style.display = 'block';
                }
            }
        }
    }
}


/* ═══════════════════════════════════════════════
   TOOLTIP SYSTEM
   ═══════════════════════════════════════════════ */
const tooltipCard = document.getElementById('tooltipCard');
const tooltipTag = document.getElementById('tooltipTag');
const tooltipTitle = document.getElementById('tooltipTitle');
const tooltipVal1 = document.getElementById('tooltipVal1');
const tooltipUnit1 = document.getElementById('tooltipUnit1');
const tooltipVal2 = document.getElementById('tooltipVal2');
const tooltipUnit2 = document.getElementById('tooltipUnit2');
const tooltipVal3 = document.getElementById('tooltipVal3');
const tooltipUnit3 = document.getElementById('tooltipUnit3');
const tooltipDesc = document.getElementById('tooltipDesc');
const tooltipClose = document.getElementById('tooltipClose');

let activeSpec = null;

function showTooltip(specKey) {
    if (activeSpec === specKey) return;
    activeSpec = specKey;

    const data = SPEC_DATA[specKey];
    if (!data) return;

    // Populate
    tooltipTag.textContent = data.tag;
    tooltipTitle.textContent = data.title;
    tooltipVal1.textContent = data.val1;
    tooltipUnit1.textContent = data.unit1;
    tooltipVal2.textContent = data.val2;
    tooltipUnit2.textContent = data.unit2;
    tooltipVal3.textContent = data.val3;
    tooltipUnit3.textContent = data.unit3;
    tooltipDesc.textContent = data.desc;

    // Position tooltip near the hotspot
    const hotspot = hotspotEls[specKey];
    if (hotspot) {
        const rect = hotspot.getBoundingClientRect();
        let left = rect.left + 40;
        let top = rect.top - 60;

        // Keep within viewport
        if (left + 360 > window.innerWidth) {
            left = rect.left - 380;
        }
        if (top + 300 > window.innerHeight) {
            top = window.innerHeight - 320;
        }
        if (top < 80) top = 80;
        if (left < 20) left = 20;

        tooltipCard.style.left = left + 'px';
        tooltipCard.style.top = top + 'px';
    }

    tooltipCard.classList.add('visible');

    // Show/Hide Engine HUD
    const engineHud = document.getElementById('engineHud');
    if (specKey === 'engine') {
        engineHud.classList.add('visible');
    } else {
        engineHud.classList.remove('visible');
    }

    // Highlight spec icon
    document.querySelectorAll('.spec-icon-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.spec-icon-btn[data-spec="${specKey}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Show connection line
    updateConnectionLine(specKey, true);
}

function hideTooltip() {
    activeSpec = null;
    tooltipCard.classList.remove('visible');
    document.getElementById('engineHud').classList.remove('visible');
    document.querySelectorAll('.spec-icon-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.conn-line').forEach(line => line.classList.remove('visible'));
}

tooltipClose.addEventListener('click', hideTooltip);


/* ═══════════════════════════════════════════════
   SVG CONNECTION LINES
   ═══════════════════════════════════════════════ */
function updateConnectionLine(specKey, show) {
    const line = document.getElementById(`connLine-${specKey}`);
    if (!line) return;

    if (!show) {
        line.classList.remove('visible');
        return;
    }

    const hotspot = hotspotEls[specKey];
    const specBtn = document.querySelector(`.spec-icon-btn[data-spec="${specKey}"]`);

    if (!hotspot || !specBtn) return;

    const hotspotRect = hotspot.getBoundingClientRect();
    const specRect = specBtn.getBoundingClientRect();

    line.setAttribute('x1', hotspotRect.left + hotspotRect.width / 2);
    line.setAttribute('y1', hotspotRect.top + hotspotRect.height / 2);
    line.setAttribute('x2', specRect.left);
    line.setAttribute('y2', specRect.top + specRect.height / 2);

    line.classList.add('visible');
}


/* ═══════════════════════════════════════════════
   EVENT LISTENERS — Hotspot & Spec Icon Hover
   ═══════════════════════════════════════════════ */

// Hotspot hover / click
document.querySelectorAll('.hotspot').forEach(hotspot => {
    const spec = hotspot.dataset.spec;

    hotspot.addEventListener('mouseenter', () => showTooltip(spec));
    hotspot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeSpec === spec) {
            hideTooltip();
        } else {
            showTooltip(spec);
        }
    });
});

// Right-panel spec icon hover / click
document.querySelectorAll('.spec-icon-btn').forEach(btn => {
    const spec = btn.dataset.spec;

    btn.addEventListener('mouseenter', () => showTooltip(spec));
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeSpec === spec) {
            hideTooltip();
        } else {
            showTooltip(spec);
        }
    });
});

// Close tooltip when clicking elsewhere
document.addEventListener('click', (e) => {
    if (!e.target.closest('.tooltip-card') &&
        !e.target.closest('.hotspot') &&
        !e.target.closest('.spec-icon-btn')) {
        hideTooltip();
    }
});


/* ═══════════════════════════════════════════════
   CTA BUTTON — MAGNETIC HOVER EFFECT
   ═══════════════════════════════════════════════ */
const ctaBtn = document.getElementById('ctaBtn');

ctaBtn.addEventListener('mousemove', (e) => {
    const rect = ctaBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(ctaBtn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out'
    });
});

ctaBtn.addEventListener('mouseleave', () => {
    gsap.to(ctaBtn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
    });
});


/* ═══════════════════════════════════════════════
   ANIMATION LOOP
   ═══════════════════════════════════════════════ */
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    updateHotspotPositions();

    // Update active connection line position
    if (activeSpec) {
        updateConnectionLine(activeSpec, true);
    }

    renderer.render(scene, camera);
}
animate();


/* ═══════════════════════════════════════════════
   RESIZE HANDLER
   ═══════════════════════════════════════════════ */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


/* ═══════════════════════════════════════════════
   STOP AUTO-ROTATE ON USER INTERACTION
   ═══════════════════════════════════════════════ */
let interactionTimeout;
controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(interactionTimeout);
});

controls.addEventListener('end', () => {
    // Resume auto-rotate after 5 seconds of inactivity
    interactionTimeout = setTimeout(() => {
        controls.autoRotate = true;
    }, 5000);
});


/* ═══════════════════════════════════════════════
   V12 ENGINE WEB AUDIO SYNTHESIZER
   ═══════════════════════════════════════════════ */
class V12Synth {
    constructor() {
        this.ctx = null;
        this.oscillators = [];
        this.gainNodes = [];
        this.filter = null;
        this.noiseNode = null;
        this.noiseGain = null;
        this.mainGain = null;
        this.isPlaying = false;
        this.currentRpm = 1000;
        this.revTween = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // Create audio context
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();

        // Main gain
        this.mainGain = this.ctx.createGain();
        this.mainGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
        this.mainGain.connect(this.ctx.destination);

        // Low pass filter to simulate cabin/exhaust insulation
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.Q.setValueAtTime(4.0, this.ctx.currentTime);
        this.filter.connect(this.mainGain);

        // Sub oscillator (low rumble)
        this.createOscillator(35, 'sawtooth', 0.8);
        this.createOscillator(35.5, 'square', 0.3); // detuned
        // Mid range cylinder fire
        this.createOscillator(70, 'sawtooth', 0.6);
        this.createOscillator(70.3, 'sawtooth', 0.5); // detuned
        // High scream
        this.createOscillator(140, 'sawtooth', 0.4);
        this.createOscillator(140.6, 'sawtooth', 0.3);

        // Distort for metallic growl
        const waveShaper = this.ctx.createWaveShaper();
        waveShaper.curve = this.makeDistortionCurve(50);
        waveShaper.connect(this.filter);

        // Connect all osc gains to distortion
        this.gainNodes.forEach(gain => gain.connect(waveShaper));

        // Exhaust noise (airflow)
        this.createExhaustNoise();

        this.initialized = true;
    }

    createOscillator(freq, type, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);

        osc.connect(gain);
        osc.start(0);

        this.oscillators.push(osc);
        this.gainNodes.push(gain);
    }

    createExhaustNoise() {
        // White noise buffer
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        this.noiseNode = this.ctx.createBufferSource();
        this.noiseNode.buffer = noiseBuffer;
        this.noiseNode.loop = true;

        // Bandpass filter for noise to simulate rushing exhaust wind
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(100, this.ctx.currentTime);
        noiseFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

        this.noiseGain = this.ctx.createGain();
        this.noiseGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

        this.noiseNode.connect(noiseFilter);
        noiseFilter.connect(this.noiseGain);
        this.noiseGain.connect(this.mainGain);
        this.noiseNode.start(0);
    }

    makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    start() {
        if (!this.initialized) this.init();
        if (this.isPlaying) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        // Fade in main volume
        this.mainGain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.1);
        this.isPlaying = true;
        this.updateRpm(1000);
    }

    stop() {
        if (!this.isPlaying) return;
        // Fade out
        this.mainGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.3);
        this.isPlaying = false;
    }

    updateRpm(rpm) {
        if (!this.initialized) return;
        this.currentRpm = rpm;

        // Update UI HUD Text
        document.getElementById('rpmVal').textContent = Math.round(rpm).toLocaleString();

        // Update HUD SVG bar
        // dashoffset = 283 (empty) -> 0 (full)
        const pct = (rpm - 1000) / 7500;
        const offset = 283 - (283 * pct);
        document.getElementById('rpmBar').style.strokeDashoffset = offset;

        // Map RPM to synth parameters
        const baseFreq = (rpm / 1000) * 35; // base frequency scaled with RPM

        // Update base oscillator frequencies
        this.oscillators[0].frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        this.oscillators[1].frequency.setValueAtTime(baseFreq + 0.5, this.ctx.currentTime);
        // Mids
        this.oscillators[2].frequency.setValueAtTime(baseFreq * 2, this.ctx.currentTime);
        this.oscillators[3].frequency.setValueAtTime(baseFreq * 2 + 0.3, this.ctx.currentTime);
        // Highs
        this.oscillators[4].frequency.setValueAtTime(baseFreq * 4, this.ctx.currentTime);
        this.oscillators[5].frequency.setValueAtTime(baseFreq * 4 + 0.6, this.ctx.currentTime);

        // Filter cutoff opens up as engine revs
        const cutoff = 120 + (pct * 1600); // 120Hz -> 1720Hz
        this.filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);

        // Increase noise volume with RPM (exhaust flow velocity)
        const noiseVol = 0.01 + (pct * 0.08);
        this.noiseGain.gain.setValueAtTime(noiseVol, this.ctx.currentTime);
    }

    rev(targetRpm, duration = 1.0) {
        if (!this.initialized) this.init();
        if (this.revTween) this.revTween.kill();

        const self = this;
        this.revTween = gsap.to(this, {
            currentRpm: targetRpm,
            duration: duration,
            ease: targetRpm > 1000 ? 'power2.out' : 'power1.inOut',
            onUpdate: function() {
                self.updateRpm(self.currentRpm);
            }
        });
    }
}

// Instantiate engine synth
const v12Synth = new V12Synth();


/* ═══════════════════════════════════════════════
   INTERACTIVE COLOR CUSTOMIZER (PAINT)
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
        // Toggle UI Active
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        const colorHex = dot.dataset.color;
        const color = new THREE.Color(colorHex);

        if (paintMaterial) {
            // Smoothly animate car paint material color with GSAP
            gsap.to(paintMaterial.color, {
                r: color.r,
                g: color.g,
                b: color.b,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    });
});


/* ═══════════════════════════════════════════════
   HEADLIGHTS CONTROLLER WITH VISUAL BEAMS
   ═══════════════════════════════════════════════ */
let headlightsOn = false;
const headlightToggle = document.getElementById('headlightToggle');

// Left and Right Headlight spotlights
const leftSpot = new THREE.SpotLight(0xffffff, 0, 15, Math.PI * 0.15, 0.5, 1.0);
leftSpot.position.set(-0.8, 0.48, 2.0);
leftSpot.castShadow = true;
leftSpot.shadow.bias = -0.001;

const rightSpot = new THREE.SpotLight(0xffffff, 0, 15, Math.PI * 0.15, 0.5, 1.0);
rightSpot.position.set(0.8, 0.48, 2.0);
rightSpot.castShadow = true;
rightSpot.shadow.bias = -0.001;

// Spot Targets (pointing forward and slightly down)
const spotTargetLeft = new THREE.Object3D();
spotTargetLeft.position.set(-0.8, 0, 8.0);
const spotTargetRight = new THREE.Object3D();
spotTargetRight.position.set(0.8, 0, 8.0);

scene.add(spotTargetLeft);
scene.add(spotTargetRight);
leftSpot.target = spotTargetLeft;
rightSpot.target = spotTargetRight;

scene.add(leftSpot);
scene.add(rightSpot);

headlightToggle.addEventListener('click', () => {
    headlightsOn = !headlightsOn;
    headlightToggle.setAttribute('aria-checked', headlightsOn);

    // Emissive intensity animation (headlights only — not brake lights)
    headlightMaterials.forEach(mat => {
        gsap.to(mat, {
            emissiveIntensity: headlightsOn ? 5.0 : 0.0,
            duration: 0.4,
            ease: 'power2.out'
        });
        if (headlightsOn) {
            // Warm white for realistic xenon/LED headlights
            mat.emissive.setHex(0xFFF5E8);
        }
    });

    // Spotlight beam intensity animation
    gsap.to(leftSpot, {
        intensity: headlightsOn ? 5.0 : 0.0,
        duration: 0.4,
        ease: 'power2.out'
    });
    gsap.to(rightSpot, {
        intensity: headlightsOn ? 5.0 : 0.0,
        duration: 0.4,
        ease: 'power2.out'
    });
});


/* ═══════════════════════════════════════════════
   ENVIRONMENT & STUDIO LIGHTS PRESETS
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const preset = btn.dataset.preset;
        transitionLighting(preset);
    });
});

function transitionLighting(presetName) {
    const duration = 0.8;
    const ease = 'power2.inOut';

    if (presetName === 'studio') {
        // Reset to default studio setup
        gsap.to(scene.background, { r: 0.04, g: 0.04, b: 0.04, duration, ease });
        gsap.to(keyLight, { intensity: 2.0, duration, ease });
        gsap.to(keyLight.color, { r: 1.0, g: 0.96, b: 0.9, duration, ease });
        gsap.to(fillLight, { intensity: 0.6, duration, ease });
        gsap.to(fillLight.color, { r: 0.7, g: 0.83, b: 1.0, duration, ease });
        gsap.to(rimLight, { intensity: 0.5, duration, ease });
        gsap.to(rimLight.color, { r: 1.0, g: 0.53, b: 0.0, duration, ease });
        gsap.to(ambientLight, { intensity: 0.4, duration, ease });
        gsap.to(groundCircleMat, { opacity: 0.6, duration, ease });
    }
    else if (presetName === 'midnight') {
        // Dark midnight theme
        gsap.to(scene.background, { r: 0.01, g: 0.01, b: 0.01, duration, ease });
        gsap.to(keyLight, { intensity: 0.2, duration, ease });
        gsap.to(keyLight.color, { r: 0.5, g: 0.6, b: 0.7, duration, ease });
        gsap.to(fillLight, { intensity: 0.1, duration, ease });
        gsap.to(fillLight.color, { r: 0.3, g: 0.3, b: 0.5, duration, ease });
        gsap.to(rimLight, { intensity: 1.8, duration, ease });
        gsap.to(rimLight.color, { r: 1.0, g: 1.0, b: 1.0, duration, ease });
        gsap.to(ambientLight, { intensity: 0.05, duration, ease });
        gsap.to(groundCircleMat, { opacity: 0.2, duration, ease });
    }
    else if (presetName === 'neon') {
        // Dramatic Cyberpunk Neon-X theme
        gsap.to(scene.background, { r: 0.03, g: 0.0, b: 0.06, duration, ease });
        gsap.to(keyLight, { intensity: 1.2, duration, ease });
        gsap.to(keyLight.color, { r: 0.0, g: 1.0, b: 1.0, duration, ease }); // Cyan key
        gsap.to(fillLight, { intensity: 0.8, duration, ease });
        gsap.to(fillLight.color, { r: 0.54, g: 0.17, b: 0.89, duration, ease }); // Purple fill
        gsap.to(rimLight, { intensity: 2.2, duration, ease });
        gsap.to(rimLight.color, { r: 1.0, g: 0.08, b: 0.58, duration, ease }); // Pink rim
        gsap.to(ambientLight, { intensity: 0.15, duration, ease });
        gsap.to(groundCircleMat, { opacity: 0.8, duration, ease });
    }
}


/* ═══════════════════════════════════════════════
   V12 ENGINE HUD INTERACTION & REV BTN
   ═══════════════════════════════════════════════ */
const hudRevBtn = document.getElementById('hudRevBtn');

const startEngineRev = () => {
    v12Synth.start();
    v12Synth.rev(8200, 1.2); // Rev up to 8200 RPM
};

const stopEngineRev = () => {
    v12Synth.rev(1000, 0.8); // Drop back to 1000 RPM idle
};

// Revving handlers (both mouse and touch for mobile)
hudRevBtn.addEventListener('mousedown', startEngineRev);
hudRevBtn.addEventListener('mouseup', stopEngineRev);
hudRevBtn.addEventListener('mouseleave', stopEngineRev);

hudRevBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startEngineRev();
});
hudRevBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopEngineRev();
});

// Start/Stop engine synth when engine spec is toggled/viewed
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('visible')) {
            v12Synth.start();
        } else {
            v12Synth.stop();
        }
    });
});
observer.observe(document.getElementById('engineHud'), { attributes: true, attributeFilter: ['class'] });


/* ═══════════════════════════════════════════════
   DYNAMIC PAGE ROUTER & CAMERA ANGLE TRANSITIONS
   ═══════════════════════════════════════════════ */
const pages = document.querySelectorAll('.page-overlay');
const navLinks = document.querySelectorAll('.nav-link');

function switchPage(pageId) {
    // Hide tooltips & SVG lines
    hideTooltip();

    // Toggle nav link active states
    navLinks.forEach(link => {
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Toggle page overlay active states
    pages.forEach(page => {
        if (page.id === `page-${pageId}`) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    // Toggle basic UI panels visibility based on page
    const customizerPanel = document.getElementById('customizerPanel');
    const leftPanel = document.getElementById('leftPanel');
    const rightPanel = document.getElementById('rightPanel');
    const ctaArea = document.getElementById('ctaArea');
    const dragHint = document.getElementById('dragHint');
    const hotspots = document.querySelectorAll('.hotspot');

    if (pageId === 'showcase') {
        customizerPanel.style.display = 'flex';
        leftPanel.style.display = 'flex';
        rightPanel.style.display = 'flex';
        ctaArea.style.display = 'flex';
        dragHint.style.display = 'flex';
        hotspots.forEach(h => h.classList.add('visible'));

        // Reset camera to standard Showcase View
        transitionCamera(new THREE.Vector3(5, 2.5, 6), new THREE.Vector3(0, 0.6, 0));
        controls.autoRotate = true;
    } else {
        customizerPanel.style.display = 'none';
        leftPanel.style.display = 'none';
        rightPanel.style.display = 'none';
        ctaArea.style.display = 'none';
        dragHint.style.display = 'none';
        hotspots.forEach(h => h.classList.remove('visible'));
        controls.autoRotate = false;

        // Page-specific camera angles
        if (pageId === 'performance') {
            // Tight rear-angle focus on engine and exhausts
            transitionCamera(new THREE.Vector3(2.5, 1.8, -4.5), new THREE.Vector3(0, 0.5, -1));
        } else if (pageId === 'gallery') {
            // Premium high-angle 3/4 beauty view
            transitionCamera(new THREE.Vector3(-5.5, 2.2, 5.0), new THREE.Vector3(0, 0.6, 0));
            // Trigger community/personal tab update
            const activeTab = document.querySelector('.garage-tab-btn.active');
            if (activeTab && activeTab.id === 'tabMyGarageBtn') {
                renderPersonalGarage();
            } else {
                fetchGallery();
            }
        } else if (pageId === 'reserve') {
            // Cinematic top-down dynamic lines review
            transitionCamera(new THREE.Vector3(0.1, 4.8, 0.1), new THREE.Vector3(0, 0.4, 0));
            prepopulateForm();
        } else if (pageId === 'store') {
            // Side dynamic focus on accessories
            transitionCamera(new THREE.Vector3(3.5, 1.5, 4.0), new THREE.Vector3(0, 0.4, 0.5));
        } else if (pageId === 'admin') {
            // Far high-angle review
            transitionCamera(new THREE.Vector3(-6.0, 3.0, -6.0), new THREE.Vector3(0, 0.6, 0));
            renderAdminPanel();
        } else if (pageId === 'auth') {
            // Standard perspective focus
            transitionCamera(new THREE.Vector3(5.0, 2.5, 6.0), new THREE.Vector3(0, 0.6, 0));
        }
    }
}

function transitionCamera(targetPos, targetLookAt) {
    gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => controls.update()
    });

    gsap.to(controls.target, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration: 1.5,
        ease: 'power3.inOut'
    });
}

// Bind navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.dataset.page;
        switchPage(pageId);
    });
});

// Configure bottom CTA to redirect to Reserve page
document.getElementById('ctaBtn').addEventListener('click', () => {
    switchPage('reserve');
});


/* ═══════════════════════════════════════════════
   TOAST NOTIFICATION UTILITY
   ═══════════════════════════════════════════════ */
const toast = document.getElementById('toastNotification');
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}


/* ═══════════════════════════════════════════════
   PROTOTYPE CLIENT-SIDE DATABASE SYSTEM (localStorage)
   ═══════════════════════════════════════════════ */

class MockDatabase {
    constructor() {
        this.init();
    }

    init() {
        // 1. Initialize Users Table
        if (!localStorage.getItem('mock_users')) {
            const defaultUsers = [
                { id: 1, username: 'user1', email: 'user1@lamborghini.corp', password: 'password123', role: 'user' },
                { id: 2, username: 'admin', email: 'admin@lamborghini.corp', password: 'adminpassword', role: 'admin' }
            ];
            localStorage.setItem('mock_users', JSON.stringify(defaultUsers));
        }

        // 2. Initialize Configurations Table (with pre-built community designs)
        if (!localStorage.getItem('mock_configurations')) {
            const defaultConfigs = [
                { id: 101, userId: null, name: 'Aventador Arancio Sunset', color: '#FF8700', headlights: true, preset: 'studio', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
                { id: 102, userId: null, name: 'Ultimae Verde Matrix', color: '#39FF14', headlights: false, preset: 'neon', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
                { id: 103, userId: null, name: 'Bespoke Nero Shadow', color: '#111111', headlights: true, preset: 'midnight', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() }
            ];
            localStorage.setItem('mock_configurations', JSON.stringify(defaultConfigs));
        }

        // 3. Initialize Consultations Table
        if (!localStorage.getItem('mock_reservations')) {
            const defaultReservations = [
                { id: 201, userId: 1, clientName: 'User One', clientEmail: 'user1@lamborghini.corp', configName: 'Aventador Arancio Sunset', color: '#FF8700', preset: 'studio', status: 'Pending', timestamp: new Date().toISOString() }
            ];
            localStorage.setItem('mock_reservations', JSON.stringify(defaultReservations));
        }

        // 4. Initialize Store Orders Table
        if (!localStorage.getItem('mock_orders')) {
            const defaultOrders = [
                { id: 301, userId: 1, clientName: 'User One', items: 'ALA 2.0 Carbon Wing x1, Titanium Race Exhaust x1', totalAmount: 31400, status: 'Pending', timestamp: new Date().toISOString() }
            ];
            localStorage.setItem('mock_orders', JSON.stringify(defaultOrders));
        }
    }

    // --- Users Queries ---
    registerUser(username, email, password) {
        const users = JSON.parse(localStorage.getItem('mock_users'));
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new Error('Username already exists.');
        }
        const newUser = {
            id: Date.now(),
            username,
            email,
            password, // Storing plaintext for simple mockup prototype
            role: 'user'
        };
        users.push(newUser);
        localStorage.setItem('mock_users', JSON.stringify(users));
        return newUser;
    }

    loginUser(username, password) {
        const users = JSON.parse(localStorage.getItem('mock_users'));
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (!user) {
            throw new Error('Invalid username or password.');
        }
        return user;
    }

    // --- Configurations Queries ---
    getConfigurations() {
        return JSON.parse(localStorage.getItem('mock_configurations'));
    }

    getUserConfigurations(userId) {
        const configs = this.getConfigurations();
        return configs.filter(c => c.userId === userId);
    }

    saveConfiguration(name, color, headlights, preset, userId = null) {
        const configs = this.getConfigurations();
        const newConfig = {
            id: Date.now(),
            userId,
            name,
            color,
            headlights: !!headlights,
            preset,
            timestamp: new Date().toISOString()
        };
        configs.unshift(newConfig);
        
        // Cap community designs at 30
        if (configs.length > 30) {
            configs.pop();
        }
        
        localStorage.setItem('mock_configurations', JSON.stringify(configs));
        return newConfig;
    }

    deleteConfiguration(id, userId) {
        let configs = this.getConfigurations();
        configs = configs.filter(c => !(c.id === id && c.userId === userId));
        localStorage.setItem('mock_configurations', JSON.stringify(configs));
    }

    // --- Reservations Queries ---
    getReservations() {
        return JSON.parse(localStorage.getItem('mock_reservations'));
    }

    getUserReservations(userId) {
        const res = this.getReservations();
        return res.filter(r => r.userId === userId);
    }

    saveReservation(clientName, clientEmail, configName, color, preset, userId = null) {
        const res = this.getReservations();
        const newRes = {
            id: Date.now(),
            userId,
            clientName,
            clientEmail,
            configName,
            color,
            preset,
            status: 'Pending',
            timestamp: new Date().toISOString()
        };
        res.unshift(newRes);
        localStorage.setItem('mock_reservations', JSON.stringify(res));
        return newRes;
    }

    updateReservationStatus(id, newStatus) {
        const res = this.getReservations();
        const item = res.find(r => r.id === id);
        if (item) {
            item.status = newStatus;
            localStorage.setItem('mock_reservations', JSON.stringify(res));
        }
    }

    // --- Orders Queries ---
    getOrders() {
        return JSON.parse(localStorage.getItem('mock_orders'));
    }

    getUserOrders(userId) {
        const ords = this.getOrders();
        return ords.filter(o => o.userId === userId);
    }

    saveOrder(clientName, items, totalAmount, userId = null) {
        const ords = this.getOrders();
        const newOrd = {
            id: Date.now(),
            userId,
            clientName,
            items,
            totalAmount,
            status: 'Pending',
            timestamp: new Date().toISOString()
        };
        ords.unshift(newOrd);
        localStorage.setItem('mock_orders', JSON.stringify(ords));
        return newOrd;
    }

    updateOrderStatus(id, newStatus) {
        const ords = this.getOrders();
        const item = ords.find(o => o.id === id);
        if (item) {
            item.status = newStatus;
            localStorage.setItem('mock_orders', JSON.stringify(ords));
        }
    }
}

const db = new MockDatabase();

/* ═══════════════════════════════════════════════
   SESSION MANAGEMENT
   ═══════════════════════════════════════════════ */

let currentUserSession = null;

function loadSession() {
    const sessionData = localStorage.getItem('active_session');
    if (sessionData) {
        currentUserSession = JSON.parse(sessionData);
        updateAuthUI();
    }
}

function saveSession(user) {
    currentUserSession = user;
    localStorage.setItem('active_session', JSON.stringify(user));
    updateAuthUI();
}

function clearSession() {
    currentUserSession = null;
    localStorage.removeItem('active_session');
    updateAuthUI();
    showToast("Logged out of session.");
    switchPage('showcase');
}

function updateAuthUI() {
    const navAuthBtn = document.getElementById('navAuthBtn');
    const authDropdownUser = document.getElementById('authDropdownUser');
    const btnLogout = document.getElementById('btnLogout');
    const navAdminLink = document.getElementById('navAdminLink');

    if (currentUserSession) {
        navAuthBtn.querySelector('span').textContent = currentUserSession.username;
        authDropdownUser.textContent = `${currentUserSession.username} (${currentUserSession.role})`;
        btnLogout.style.display = 'block';
        
        // Show administrative panel menu if admin
        if (currentUserSession.role === 'admin') {
            navAdminLink.style.display = 'block';
        } else {
            navAdminLink.style.display = 'none';
        }
    } else {
        navAuthBtn.querySelector('span').textContent = "Login / Sign Up";
        authDropdownUser.textContent = "Not logged in";
        btnLogout.style.display = 'none';
        navAdminLink.style.display = 'none';
    }
}

// Bind Log out trigger
document.getElementById('btnLogout').addEventListener('click', clearSession);

// Click nav user wrapper
document.getElementById('navAuthBtn').addEventListener('click', () => {
    if (!currentUserSession) {
        switchPage('auth');
    }
});

/* ═══════════════════════════════════════════════
   AUTHENTICATION FORM LOGIC
   ═══════════════════════════════════════════════ */

const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

tabLoginBtn.addEventListener('click', () => {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
});

tabRegisterBtn.addEventListener('click', () => {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Login submit
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        const loggedUser = db.loginUser(username, pass);
        saveSession(loggedUser);
        showToast(`Welcome back, ${loggedUser.username}!`);
        
        // Redirect
        if (loggedUser.role === 'admin') {
            switchPage('admin');
        } else {
            switchPage('gallery');
        }
        
        // Reset forms
        loginForm.reset();
    } catch (err) {
        showToast(err.message);
    }
});

// Signup submit
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;

    try {
        const registered = db.registerUser(username, email, pass);
        saveSession(registered);
        showToast(`Profile created successfully! Welcome ${registered.username}`);
        
        switchPage('gallery');
        registerForm.reset();
    } catch (err) {
        showToast(err.message);
    }
});


/* ═══════════════════════════════════════════════
   MOCK COMMUNITY GARAGE RENDER
   ═══════════════════════════════════════════════ */

const galleryGrid = document.getElementById('galleryGrid');
const galleryLoading = document.getElementById('galleryLoading');

function fetchGallery() {
    if (galleryLoading) galleryLoading.style.display = 'flex';
    
    // Clear old cards
    document.querySelectorAll('#galleryGrid .gallery-card').forEach(c => c.remove());

    const data = db.getConfigurations();
    
    if (galleryLoading) galleryLoading.style.display = 'none';
    
    if (data.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'gallery-loading';
        emptyMsg.textContent = 'No custom specifications found. Be the first to build one!';
        galleryGrid.appendChild(emptyMsg);
        return;
    }

    data.forEach(config => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-config-name">${escapeHTML(config.name)}</h3>
                    <span class="card-creator">COMMUNITY COMMISSION</span>
                </div>
                <span class="card-timestamp">${new Date(config.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="card-specs">
                <div class="card-spec-row">
                    <span class="card-spec-label">Paint Color</span>
                    <div class="card-color-badge">
                        <span class="card-color-dot" style="background: ${config.color};"></span>
                        <span>${config.color}</span>
                    </div>
                </div>
                <div class="card-spec-row">
                    <span class="card-spec-label">Headlights</span>
                    <span>${config.headlights ? 'ACTIVE' : 'OFF'}</span>
                </div>
                <div class="card-spec-row">
                    <span class="card-spec-label">Studio Light</span>
                    <span class="card-preset-badge">${config.preset.toUpperCase()}</span>
                </div>
            </div>
            <button class="card-load-btn" data-color="${config.color}" data-preset="${config.preset}" data-lights="${config.headlights}">
                LOAD SPEC
            </button>
        `;
        galleryGrid.appendChild(card);
    });

    // Bind community load buttons
    document.querySelectorAll('#galleryGrid .card-load-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            const preset = btn.dataset.preset;
            const lights = btn.dataset.lights === 'true';
            loadConfigurationIntoShowcase(color, preset, lights);
        });
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function loadConfigurationIntoShowcase(colorHex, presetName, headlightsOnState) {
    if (paintMaterial) {
        const color = new THREE.Color(colorHex);
        gsap.to(paintMaterial.color, {
            r: color.r,
            g: color.g,
            b: color.b,
            duration: 1.0,
            ease: 'power2.out'
        });
        document.querySelectorAll('.color-dot').forEach(dot => {
            if (dot.dataset.color.toLowerCase() === colorHex.toLowerCase()) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    transitionLighting(presetName);
    document.querySelectorAll('.preset-btn').forEach(btn => {
        if (btn.dataset.preset === presetName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    headlightsOn = headlightsOnState;
    headlightToggle.setAttribute('aria-checked', headlightsOn);
    headlightMaterials.forEach(mat => {
        gsap.to(mat, {
            emissiveIntensity: headlightsOn ? 5.0 : 0.0,
            duration: 0.4
        });
    });
    gsap.to(leftSpot, { intensity: headlightsOn ? 5.0 : 0.0, duration: 0.4 });
    gsap.to(rightSpot, { intensity: headlightsOn ? 5.0 : 0.0, duration: 0.4 });

    showToast("Specification loaded into Showcase!");
    switchPage('showcase');
}

// Prepopulate reservation fields
const clientNameInput = document.getElementById('clientName');
const clientEmailInput = document.getElementById('clientEmail');
const configNameInput = document.getElementById('configName');
const configColorInput = document.getElementById('configColor');
const configPresetInput = document.getElementById('configPreset');
const reserveForm = document.getElementById('reserveForm');
const successScreen = document.getElementById('successScreen');

function prepopulateForm() {
    const activeColorBtn = document.querySelector('.color-dot.active');
    const activePresetBtn = document.querySelector('.preset-btn.active');

    configColorInput.value = activeColorBtn ? activeColorBtn.dataset.color : '#FF8700';
    configPresetInput.value = activePresetBtn ? activePresetBtn.dataset.preset : 'studio';
    
    if (currentUserSession) {
        clientNameInput.value = currentUserSession.username;
        clientEmailInput.value = currentUserSession.email;
    }

    reserveForm.style.opacity = '1';
    reserveForm.style.pointerEvents = 'auto';
    successScreen.style.display = 'none';
}

// Handle reservation request consult submit
reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = clientNameInput.value;
    const email = clientEmailInput.value;
    const configName = configNameInput.value;
    const color = configColorInput.value;
    const preset = configPresetInput.value;

    const uId = currentUserSession ? currentUserSession.id : null;

    // 1. Save spec to configs table
    db.saveConfiguration(`${configName} (by ${name})`, color, headlightsOn, preset, uId);

    // 2. Save consult consultation request
    db.saveReservation(name, email, configName, color, preset, uId);

    gsap.to(reserveForm, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            reserveForm.style.pointerEvents = 'none';
            successScreen.style.display = 'flex';
            showToast("Commission specification published!");
            
            setTimeout(() => {
                switchPage('gallery');
                clientNameInput.value = '';
                clientEmailInput.value = '';
                configNameInput.value = '';
            }, 3200);
        }
    });
});


/* ═══════════════════════════════════════════════
   PERSONAL GARAGE & TABS CONTROLLER
   ═══════════════════════════════════════════════ */

const tabCommunityBtn = document.getElementById('tabCommunityBtn');
const tabMyGarageBtn = document.getElementById('tabMyGarageBtn');
const garageCommunityContent = document.getElementById('garageCommunityContent');
const garagePersonalContent = document.getElementById('garagePersonalContent');

tabCommunityBtn.addEventListener('click', () => {
    tabCommunityBtn.classList.add('active');
    tabMyGarageBtn.classList.remove('active');
    garageCommunityContent.classList.add('active');
    garagePersonalContent.classList.remove('active');
    fetchGallery();
});

tabMyGarageBtn.addEventListener('click', () => {
    tabMyGarageBtn.classList.add('active');
    tabCommunityBtn.classList.remove('active');
    garagePersonalContent.classList.add('active');
    garageCommunityContent.classList.remove('active');
    renderPersonalGarage();
});

function renderPersonalGarage() {
    const personalGrid = document.getElementById('personalGrid');
    const personalConsultsList = document.getElementById('personalConsultsList');
    const personalOrdersList = document.getElementById('personalOrdersList');

    // Clean old renders
    personalGrid.innerHTML = '';
    personalConsultsList.innerHTML = '';
    personalOrdersList.innerHTML = '';

    if (!currentUserSession) {
        personalGrid.innerHTML = '<div class="gallery-loading">Please log in to view your saved designs.</div>';
        personalConsultsList.innerHTML = '<div class="gallery-loading">Please log in to view your requests.</div>';
        personalOrdersList.innerHTML = '<div class="gallery-loading">Please log in to view your orders.</div>';
        return;
    }

    // 1. Render user configurations
    const userConfigs = db.getUserConfigurations(currentUserSession.id);
    if (userConfigs.length === 0) {
        personalGrid.innerHTML = '<div class="gallery-loading">You have no saved configurations yet.</div>';
    } else {
        userConfigs.forEach(config => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <h3 class="card-config-name">${escapeHTML(config.name)}</h3>
                        <span class="card-creator">MY SPEC</span>
                    </div>
                    <span class="card-timestamp">${new Date(config.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="card-specs">
                    <div class="card-spec-row">
                        <span class="card-spec-label">Paint Color</span>
                        <div class="card-color-badge">
                            <span class="card-color-dot" style="background: ${config.color};"></span>
                            <span>${config.color}</span>
                        </div>
                    </div>
                    <div class="card-spec-row">
                        <span class="card-spec-label">Headlights</span>
                        <span>${config.headlights ? 'ACTIVE' : 'OFF'}</span>
                    </div>
                    <div class="card-spec-row">
                        <span class="card-spec-label">Studio Light</span>
                        <span class="card-preset-badge">${config.preset.toUpperCase()}</span>
                    </div>
                </div>
                <div class="gallery-card-actions">
                    <button class="card-load-btn" data-color="${config.color}" data-preset="${config.preset}" data-lights="${config.headlights}">LOAD</button>
                    <button class="card-delete-btn" data-id="${config.id}">DELETE</button>
                </div>
            `;
            personalGrid.appendChild(card);
        });

        // Bind custom personal clicks
        personalGrid.querySelectorAll('.card-load-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                loadConfigurationIntoShowcase(btn.dataset.color, btn.dataset.preset, btn.dataset.lights === 'true');
            });
        });

        personalGrid.querySelectorAll('.card-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                db.deleteConfiguration(id, currentUserSession.id);
                showToast("Configuration deleted.");
                renderPersonalGarage();
            });
        });
    }

    // 2. Render user consult requests
    const userConsults = db.getUserReservations(currentUserSession.id);
    if (userConsults.length === 0) {
        personalConsultsList.innerHTML = '<div class="gallery-loading">No active consult requests.</div>';
    } else {
        userConsults.forEach(consult => {
            const item = document.createElement('div');
            item.className = 'consult-item';
            
            let statusClass = 'status-pending';
            if (consult.status === 'Contacted') statusClass = 'status-contacted';
            if (consult.status === 'Completed') statusClass = 'status-completed';
            if (consult.status === 'Cancelled') statusClass = 'status-cancelled';

            item.innerHTML = `
                <div class="consult-header">
                    <span class="consult-spec-name">${escapeHTML(consult.configName)}</span>
                    <span class="consult-status ${statusClass}">${consult.status.toUpperCase()}</span>
                </div>
                <div class="consult-details">
                    <span>Paint: <strong>${consult.color}</strong></span> | 
                    <span>Studio: <strong>${consult.preset.toUpperCase()}</strong></span>
                    <br/>
                    <small>Submitted: ${new Date(consult.timestamp).toLocaleDateString()}</small>
                </div>
            `;
            personalConsultsList.appendChild(item);
        });
    }

    // 3. Render user store orders
    const userOrders = db.getUserOrders(currentUserSession.id);
    if (userOrders.length === 0) {
        personalOrdersList.innerHTML = '<div class="gallery-loading">No active orders placed.</div>';
    } else {
        userOrders.forEach(order => {
            const item = document.createElement('div');
            item.className = 'order-item';
            
            let statusClass = 'status-pending';
            if (order.status === 'Contacted') statusClass = 'status-contacted';
            if (order.status === 'Completed') statusClass = 'status-completed';

            item.innerHTML = `
                <div class="order-header">
                    <span class="order-id">ORDER #${order.id.toString().slice(-5)}</span>
                    <span class="order-status ${statusClass}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-details">
                    <p>Items: <strong>${escapeHTML(order.items)}</strong></p>
                    <span>Total Cost: <strong>$${order.totalAmount.toLocaleString()}</strong></span>
                    <br/>
                    <small>Ordered: ${new Date(order.timestamp).toLocaleDateString()}</small>
                </div>
            `;
            personalOrdersList.appendChild(item);
        });
    }
}


/* ═══════════════════════════════════════════════
   BESPOKE ACCESSORIES STORE & SHOPPING CART
   ═══════════════════════════════════════════════ */

let shoppingCart = [];

const navCartBtn = document.getElementById('navCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartOverlayBlur = document.getElementById('cartOverlayBlur');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalVal = document.getElementById('cartTotalVal');
const cartCheckoutForm = document.getElementById('cartCheckoutForm');
const cartClientName = document.getElementById('cartClientName');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartCountBadge = document.getElementById('cartCount');

// Toggle Cart Open/Close
const openCart = () => {
    cartDrawer.classList.add('open');
    cartOverlayBlur.classList.add('active');
    renderCart();
};

const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartOverlayBlur.classList.remove('active');
};

navCartBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlayBlur.addEventListener('click', closeCart);

// Add item to cart button triggers
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);

        const existing = shoppingCart.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            shoppingCart.push({ id, name, price, qty: 1 });
        }

        showToast(`${name} added to cart!`);
        updateCartBadge();
        openCart();
    });
});

function updateCartBadge() {
    const totalQty = shoppingCart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadge.textContent = totalQty;
    checkoutBtn.disabled = totalQty === 0;
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    if (shoppingCart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty-message">No custom parts added. Customize your spec from the Store!</div>';
        cartTotalVal.textContent = '$0';
        return;
    }

    let total = 0;

    shoppingCart.forEach(item => {
        const itemCost = item.price * item.qty;
        total += itemCost;

        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div class="cart-item-details">
                <h4>${escapeHTML(item.name)}</h4>
                <span>$${item.price.toLocaleString()}</span>
            </div>
            <div class="cart-item-actions">
                <button class="cart-qty-btn qty-minus" data-id="${item.id}">-</button>
                <span class="cart-qty-val">${item.qty}</span>
                <button class="cart-qty-btn qty-plus" data-id="${item.id}">+</button>
                <button class="cart-item-remove" data-id="${item.id}">&times;</button>
            </div>
        `;
        cartItemsContainer.appendChild(el);
    });

    cartTotalVal.textContent = `$${total.toLocaleString()}`;

    // Bind quantity increment/decrement/removes
    cartItemsContainer.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = shoppingCart.find(i => i.id === id);
            if (item) {
                item.qty--;
                if (item.qty <= 0) {
                    shoppingCart = shoppingCart.filter(i => i.id !== id);
                }
                updateCartBadge();
                renderCart();
            }
        });
    });

    cartItemsContainer.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = shoppingCart.find(i => i.id === id);
            if (item) {
                item.qty++;
                updateCartBadge();
                renderCart();
            }
        });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            shoppingCart = shoppingCart.filter(i => i.id !== id);
            updateCartBadge();
            renderCart();
        });
    });

    if (currentUserSession) {
        cartClientName.value = currentUserSession.username;
    }
}

// Handle Order Checkout
cartCheckoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (shoppingCart.length === 0) return;

    const name = cartClientName.value;
    const itemsDescription = shoppingCart.map(item => `${item.name} x${item.qty}`).join(', ');
    const totalAmount = shoppingCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const uId = currentUserSession ? currentUserSession.id : null;

    db.saveOrder(name, itemsDescription, totalAmount, uId);

    // Reset shopping cart
    shoppingCart = [];
    updateCartBadge();
    closeCart();
    showToast("Specification checkout order submitted successfully!");
});


/* ═══════════════════════════════════════════════
   DEALERSHIP ADMIN PANEL CONTROLLER
   ═══════════════════════════════════════════════ */

const adminTabConsultsBtn = document.getElementById('adminTabConsultsBtn');
const adminTabOrdersBtn = document.getElementById('adminTabOrdersBtn');
const adminConsultsContent = document.getElementById('adminConsultsContent');
const adminOrdersContent = document.getElementById('adminOrdersContent');

adminTabConsultsBtn.addEventListener('click', () => {
    adminTabConsultsBtn.classList.add('active');
    adminTabOrdersBtn.classList.remove('active');
    adminConsultsContent.classList.add('active');
    adminOrdersContent.classList.remove('active');
    renderAdminPanel();
});

adminTabOrdersBtn.addEventListener('click', () => {
    adminTabOrdersBtn.classList.add('active');
    adminTabConsultsBtn.classList.remove('active');
    adminOrdersContent.classList.add('active');
    adminConsultsContent.classList.remove('active');
    renderAdminPanel();
});

function renderAdminPanel() {
    if (!currentUserSession || currentUserSession.role !== 'admin') {
        showToast("Administrative access denied.");
        switchPage('showcase');
        return;
    }

    const consultsBody = document.getElementById('adminConsultsTableBody');
    const ordersBody = document.getElementById('adminOrdersTableBody');

    // Clean old
    consultsBody.innerHTML = '';
    ordersBody.innerHTML = '';

    // 1. Populate consultations
    const consults = db.getReservations();
    if (consults.length === 0) {
        consultsBody.innerHTML = '<tr><td colspan="7" class="admin-table-empty">No consultation bookings registered.</td></tr>';
    } else {
        consults.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHTML(item.clientName)}</strong><br/><small>${escapeHTML(item.clientEmail)}</small></td>
                <td>${escapeHTML(item.configName)}</td>
                <td><span class="admin-color-dot" style="background: ${item.color};"></span>${item.color}</td>
                <td>${item.preset.toUpperCase()}</td>
                <td>STUDIO</td>
                <td>${new Date(item.timestamp).toLocaleDateString()}</td>
                <td>
                    <select class="admin-status-select" data-id="${item.id}">
                        <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Contacted" ${item.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${item.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            `;
            consultsBody.appendChild(tr);
        });

        // Add status change listener
        consultsBody.querySelectorAll('.admin-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const id = parseInt(select.dataset.id);
                const val = e.target.value;
                db.updateReservationStatus(id, val);
                showToast(`Consultation request updated to ${val}`);
                renderAdminPanel();
            });
        });
    }

    // 2. Populate orders
    const orders = db.getOrders();
    if (orders.length === 0) {
        ordersBody.innerHTML = '<tr><td colspan="5" class="admin-table-empty">No parts or merchandise orders placed.</td></tr>';
    } else {
        orders.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHTML(item.clientName)}</strong></td>
                <td>${escapeHTML(item.items)}</td>
                <td><strong>$${item.totalAmount.toLocaleString()}</strong></td>
                <td>${new Date(item.timestamp).toLocaleDateString()}</td>
                <td>
                    <select class="admin-status-select" data-id="${item.id}">
                        <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Contacted" ${item.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
            `;
            ordersBody.appendChild(tr);
        });

        // Add status change listener
        ordersBody.querySelectorAll('.admin-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const id = parseInt(select.dataset.id);
                const val = e.target.value;
                db.updateOrderStatus(id, val);
                showToast(`Order details updated to ${val}`);
                renderAdminPanel();
            });
        });
    }
}


/* ═══════════════════════════════════════════════
   INIT SCRIPT (LOADS USER SESSION)
   ═══════════════════════════════════════════════ */
loadSession();



/* ═══════════════════════════════════════════════
   LAUNCH CONTROL ACCELERATION SIMULATION
   ═══════════════════════════════════════════════ */
const launchBtn = document.getElementById('launchBtn');
const telemetrySpeed = document.getElementById('telemetrySpeed');
const telemetryGear = document.getElementById('telemetryGear');
const speedoBar = document.getElementById('speedoBar');
const gforceDot = document.getElementById('gforceDot');
const gforceLatText = document.getElementById('gforceLat');
const gforceLongText = document.getElementById('gforceLong');

const statAero = document.getElementById('statAero');
const statThrottle = document.getElementById('statThrottle');
const statBrakeTemp = document.getElementById('statBrakeTemp');

let isLaunching = false;

function triggerLaunchControl() {
    if (isLaunching) return;
    isLaunching = true;

    v12Synth.start();

    // Disable link clicks during simulation
    navLinks.forEach(link => link.style.pointerEvents = 'none');
    launchBtn.disabled = true;

    // Phase 1: Engine Rev-up (Launch Mode Activated)
    let countdown = 3;
    launchBtn.textContent = `COUNTDOWN: ${countdown}`;
    
    // Rev V12 synth to launch RPM (5400) and hold it
    v12Synth.rev(5400, 1.2);
    gsap.to(gforceDot, { left: '50%', top: '55%', duration: 1.0 }); // minor engine vibrations
    
    const cdInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            launchBtn.textContent = `COUNTDOWN: ${countdown}`;
            // Play engine backfire sound pulse by shifting RPM rapidly
            v12Synth.rev(5800, 0.1);
            setTimeout(() => v12Synth.rev(5400, 0.1), 100);
        } else {
            clearInterval(cdInterval);
            runLaunch();
        }
    }, 1000);
}

function runLaunch() {
    launchBtn.textContent = "LAUNCH ACTIVE!";
    
    const runData = {
        speed: 0,
        rpm: 5400,
        gear: 1,
        latG: 0.05,
        longG: 1.45,
        throttle: 100,
        brakeTemp: 85,
        wingAngle: 4
    };

    // Update Diagnostics displays
    statThrottle.textContent = '100% (WOT)';
    statAero.textContent = '4° (Corsa Mode)';

    // Play authentic tire-spin screech via high pitch noise node
    if (v12Synth.initialized) {
        v12Synth.noiseGain.gain.setValueAtTime(0.3, v12Synth.ctx.currentTime);
        v12Synth.noiseGain.gain.linearRampToValueAtTime(0.02, v12Synth.ctx.currentTime + 0.6);
    }

    const mainTimeline = gsap.timeline({
        onUpdate: () => {
            // Update Speed HUD
            telemetrySpeed.textContent = Math.round(runData.speed);
            // speedoBar offset: 188 -> 0
            const speedoOffset = 188 - (188 * (runData.speed / 355));
            speedoBar.style.strokeDashoffset = speedoOffset;

            // Update Gear HUD
            telemetryGear.textContent = runData.gear;

            // Update G-Force Dot positions (Long G maps to Y axis, Lat G maps to X axis)
            // Range: 50% +/- 40%
            const dotX = 50 + (runData.latG * 25);
            const dotY = 50 - (runData.longG * 25); // Acceleration forces body back, dot goes down
            gforceDot.style.left = `${dotX}%`;
            gforceDot.style.top = `${dotY}%`;

            gforceLatText.textContent = `${runData.latG.toFixed(2)}G`;
            gforceLongText.textContent = `${runData.longG.toFixed(2)}G`;

            // Update Synth RPM
            v12Synth.updateRpm(runData.rpm);
        },
        onComplete: () => {
            // Keep at top speed briefly, then decelerate
            setTimeout(decelerateRun, 1500);
        }
    });

    // GEAR 1: 0 - 82 km/h
    mainTimeline.to(runData, {
        speed: 82,
        rpm: 8300,
        longG: 1.55,
        latG: 0.12,
        duration: 1.0,
        ease: 'power1.in'
    });

    // GEAR 2 SHIFT: RPM Drop & Gear Change
    mainTimeline.to(runData, {
        rpm: 5200,
        longG: 0.9,
        gear: 2,
        duration: 0.08,
        ease: 'none'
    });
    // Gear 2 Acceleration: 82 - 135 km/h
    mainTimeline.to(runData, {
        speed: 135,
        rpm: 8300,
        longG: 1.1,
        latG: -0.06,
        duration: 0.8,
        ease: 'none'
    });

    // GEAR 3 SHIFT
    mainTimeline.to(runData, {
        rpm: 5400,
        longG: 0.7,
        gear: 3,
        duration: 0.08,
        ease: 'none'
    });
    // Gear 3 Acceleration: 135 - 192 km/h
    mainTimeline.to(runData, {
        speed: 192,
        rpm: 8300,
        longG: 0.85,
        latG: 0.04,
        duration: 0.9,
        ease: 'none'
    });

    // GEAR 4 SHIFT
    mainTimeline.to(runData, {
        rpm: 5500,
        longG: 0.5,
        gear: 4,
        duration: 0.08,
        ease: 'none'
    });
    // Gear 4 Acceleration: 192 - 250 km/h
    mainTimeline.to(runData, {
        speed: 250,
        rpm: 8300,
        longG: 0.6,
        latG: 0.02,
        duration: 1.1,
        ease: 'none'
    });

    // GEAR 5 SHIFT
    mainTimeline.to(runData, {
        rpm: 5600,
        longG: 0.35,
        gear: 5,
        duration: 0.08,
        ease: 'none'
    });
    // Gear 5 Acceleration: 250 - 310 km/h
    mainTimeline.to(runData, {
        speed: 310,
        rpm: 8300,
        longG: 0.42,
        latG: -0.02,
        duration: 1.4,
        ease: 'none'
    });

    // GEAR 6 SHIFT
    mainTimeline.to(runData, {
        rpm: 5800,
        longG: 0.2,
        gear: 6,
        duration: 0.08,
        ease: 'none'
    });
    // Gear 6 Acceleration: 310 - 355 km/h (Top Speed Redline)
    mainTimeline.to(runData, {
        speed: 355,
        rpm: 8400,
        longG: 0.1,
        latG: 0.0,
        duration: 1.8,
        ease: 'power1.out'
    });
}

function decelerateRun() {
    launchBtn.textContent = "BRAKING ACTIVE!";
    statThrottle.textContent = '0%';
    statAero.textContent = '35° (Airbrake Open)';
    
    // Animate rear wing flaps tilt in 3D model!
    // Since we centered/scaled, we can animate visual wing mesh rotation if found, 
    // or simulate it via diagnostics dashboard.
    
    const brakeData = {
        speed: 355,
        rpm: 8400,
        gear: 6,
        latG: 0,
        longG: -1.95, // Heavy braking deceleration Gs
        brakeTemp: 85
    };

    gsap.to(brakeData, {
        speed: 0,
        rpm: 1000,
        longG: 0,
        brakeTemp: 295, // Brakes heat up significantly
        duration: 3.5,
        ease: 'power2.out',
        onUpdate: () => {
            // Speed HUD
            telemetrySpeed.textContent = Math.round(brakeData.speed);
            const speedoOffset = 188 - (188 * (brakeData.speed / 355));
            speedoBar.style.strokeDashoffset = speedoOffset;

            // Decelerating RPM Pitch
            v12Synth.updateRpm(brakeData.rpm);

            // Shift down gears dynamically
            if (brakeData.speed > 280) brakeData.gear = 6;
            else if (brakeData.speed > 220) brakeData.gear = 5;
            else if (brakeData.speed > 160) brakeData.gear = 4;
            else if (brakeData.speed > 100) brakeData.gear = 3;
            else if (brakeData.speed > 40) brakeData.gear = 2;
            else if (brakeData.speed > 5) brakeData.gear = 1;
            else brakeData.gear = 'N';

            telemetryGear.textContent = brakeData.gear;

            // G-Force dot shifts upwards (body flies forward)
            const dotY = 50 - (brakeData.longG * 25);
            gforceDot.style.top = `${dotY}%`;
            gforceLongText.textContent = `${brakeData.longG.toFixed(2)}G`;

            // Display heated brakes
            statBrakeTemp.textContent = `${Math.round(brakeData.brakeTemp)}°C`;
        },
        onComplete: () => {
            // Reset simulation states
            isLaunching = false;
            launchBtn.disabled = false;
            launchBtn.textContent = "ACTIVATE LAUNCH CONTROL";
            statThrottle.textContent = '0%';
            statAero.textContent = '4° (Low Drag)';
            statBrakeTemp.textContent = '85°C';
            gsap.to(gforceDot, { left: '50%', top: '50%', duration: 0.5 });
            gforceLatText.textContent = '0.00G';
            gforceLongText.textContent = '0.00G';

            // Re-enable page switching
            navLinks.forEach(link => link.style.pointerEvents = 'auto');
            v12Synth.stop();
        }
    });
}

// Bind Launch Click
launchBtn.addEventListener('click', triggerLaunchControl);

// Spacebar keyboard listener for Launch control when on Performance page
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        const perfPage = document.getElementById('page-performance');
        if (perfPage && perfPage.classList.contains('active')) {
            e.preventDefault();
            triggerLaunchControl();
        }
    }
});


