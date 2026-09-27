/* ============================================================
   ROBO TITANS #123 — Ultra-Luminous 3D Cybernetic Background World
   Dynamic Ecosystem:
   - 🏎️ High-Speed Cyber Cars / Robotic Rovers with glowing rims, neon underglow & headlight beams
   - 🛸 Aerial Drones with spinning energy halos, blinking beacons & sweeping searchlights
   - 🤖 Patrolling Mechs / Robots striding across cyber catwalks
   - 🦾 6-Axis Industrial Robotic Arms with laser beams & sparking contact points
   - 🏙️ Cyber Highway, Holographic Energy Rings, City Pillars & Stardust Nebula
   - 🎥 Interactive Camera Director (Arena, Drone Follow, Rover Chase, Assembly Bay)
   ============================================================ */

(function () {
    const canvas = document.getElementById('bg3d');
    if (!canvas || typeof THREE === 'undefined') return;

    // ---------- PALETTE & CONSTANTS ----------
    const PALETTE = {
        bg: 0x070b19,
        fog: 0x070b19,
        cyan: 0x00f5d4,
        electricBlue: 0x00b4d8,
        royalBlue: 0x2563eb,
        purple: 0x8b5cf6,
        gold: 0xffb703,
        orange: 0xfb8500,
        pink: 0xf72585,
        neonGreen: 0x06d6a0,
        laserRed: 0xff0055,
        whiteEnamel: 0xf8fafc,
        darkChassis: 0x0f172a,
        steel: 0x334155
    };

    // ---------- SCENE & RENDERER ----------
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(PALETTE.fog, 0.012);

    const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 400);
    const defaultCamPos = new THREE.Vector3(0, 8, 36);
    camera.position.copy(defaultCamPos);

    // Camera modes: 'cinematic', 'drone', 'rover', 'ground'
    let currentCamMode = 'cinematic';
    window.setBgCameraMode = function(mode) {
        currentCamMode = mode;
    };

    // ---------- LIGHTING ----------
    const ambientLight = new THREE.AmbientLight(0x243350, 1.4);
    scene.add(ambientLight);

    const keySun = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    keySun.position.set(25, 45, 30);
    scene.add(keySun);

    const cyanSpot = new THREE.PointLight(PALETTE.cyan, 3.2, 85);
    cyanSpot.position.set(-20, 15, 15);
    scene.add(cyanSpot);

    const goldSpot = new THREE.PointLight(PALETTE.gold, 2.8, 80);
    goldSpot.position.set(22, 6, 10);
    scene.add(goldSpot);

    const purpleFill = new THREE.PointLight(PALETTE.purple, 2.0, 70);
    purpleFill.position.set(0, -2, -15);
    scene.add(purpleFill);

    // ---------- MATERIALS ----------
    function createGlowMaterial(colorHex, intensity = 2.2) {
        return new THREE.MeshStandardMaterial({
            color: 0x090d16,
            emissive: colorHex,
            emissiveIntensity: intensity,
            metalness: 0.1,
            roughness: 0.2
        });
    }

    const matWhiteEnamel = new THREE.MeshStandardMaterial({
        color: PALETTE.whiteEnamel,
        metalness: 0.35,
        roughness: 0.15
    });

    const matDarkCarbon = new THREE.MeshStandardMaterial({
        color: PALETTE.darkChassis,
        metalness: 0.85,
        roughness: 0.3
    });

    const matSteel = new THREE.MeshStandardMaterial({
        color: PALETTE.steel,
        metalness: 0.75,
        roughness: 0.35
    });

    const matGlowCyan = createGlowMaterial(PALETTE.cyan, 2.4);
    const matGlowBlue = createGlowMaterial(PALETTE.electricBlue, 2.2);
    const matGlowGold = createGlowMaterial(PALETTE.gold, 2.2);
    const matGlowOrange = createGlowMaterial(PALETTE.orange, 2.5);
    const matGlowPink = createGlowMaterial(PALETTE.pink, 2.4);
    const matGlowGreen = createGlowMaterial(PALETTE.neonGreen, 2.4);
    const matLaserRed = createGlowMaterial(PALETTE.laserRed, 3.5);

    // ---------- ENVIRONMENT: HIGHWAY & CYBER CITYSCAPE ----------
    const envGroup = new THREE.Group();
    scene.add(envGroup);

    // Infinite Neon Grid Floor
    const gridMajor = new THREE.GridHelper(300, 75, PALETTE.cyan, 0x1e293b);
    gridMajor.position.y = -6;
    gridMajor.material.opacity = 0.55;
    gridMajor.material.transparent = true;
    envGroup.add(gridMajor);

    const gridMinor = new THREE.GridHelper(300, 150, 0x0f172a, 0x0a0f1d);
    gridMinor.position.y = -6.04;
    envGroup.add(gridMinor);

    // Elevated Cyber Highway Lanes (with glowing neon borders)
    const highwayLanes = [-18, -9, 0, 9, 18];
    highwayLanes.forEach((laneX, idx) => {
        // Highway deck
        const deckGeo = new THREE.BoxGeometry(4.2, 0.25, 300);
        const deck = new THREE.Mesh(deckGeo, matDarkCarbon);
        deck.position.set(laneX, -5.9, 0);
        envGroup.add(deck);

        // Glowing center guide strip
        const stripGeo = new THREE.PlaneGeometry(0.3, 300);
        const stripMat = new THREE.MeshBasicMaterial({
            color: idx % 2 === 0 ? PALETTE.cyan : PALETTE.gold,
            transparent: true,
            opacity: 0.6
        });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.rotation.x = -Math.PI / 2;
        strip.position.set(laneX, -5.76, 0);
        envGroup.add(strip);

        // Glowing guardrail lines
        [-2.0, 2.0].forEach(gx => {
            const railGeo = new THREE.CylinderGeometry(0.06, 0.06, 300, 4);
            const rail = new THREE.Mesh(railGeo, idx % 2 === 0 ? matGlowCyan : matGlowBlue);
            rail.rotation.x = Math.PI / 2;
            rail.position.set(laneX + gx, -5.7, 0);
            envGroup.add(rail);
        });
    });

    // Elevated Pedestrian / Mech Catwalks (running horizontally across Z)
    const catwalkZPositions = [-50, 0, 50];
    catwalkZPositions.forEach(cz => {
        const bridgeGeo = new THREE.BoxGeometry(60, 0.4, 3.5);
        const bridge = new THREE.Mesh(bridgeGeo, matSteel);
        bridge.position.set(0, -2.5, cz);
        envGroup.add(bridge);

        const bridgeGlowGeo = new THREE.PlaneGeometry(60, 0.3);
        const bridgeGlow = new THREE.Mesh(bridgeGlowGeo, new THREE.MeshBasicMaterial({
            color: PALETTE.cyan,
            transparent: true,
            opacity: 0.5
        }));
        bridgeGlow.rotation.x = -Math.PI / 2;
        bridgeGlow.position.set(0, -2.28, cz);
        envGroup.add(bridgeGlow);
    });

    // Distant Cybernetic Skyscraper Towers & Pillars
    const towerCoords = [
        [-45, -6, -60], [-45, -6, -20], [-45, -6, 20], [-45, -6, 60],
        [45, -6, -60], [45, -6, -20], [45, -6, 20], [45, -6, 60],
        [-65, -6, -40], [-65, -6, 40],
        [65, -6, -40], [65, -6, 40]
    ];
    towerCoords.forEach(([tx, ty, tz], idx) => {
        const height = 45 + Math.random() * 35;
        const towerGeo = new THREE.BoxGeometry(7, height, 7);
        const tower = new THREE.Mesh(towerGeo, matDarkCarbon);
        tower.position.set(tx, ty + height / 2, tz);
        envGroup.add(tower);

        // Illuminated window grid strips
        for (let w = 0; w < 4; w++) {
            const stripGeo = new THREE.BoxGeometry(7.2, 0.4, 7.2);
            const strip = new THREE.Mesh(stripGeo, (idx + w) % 2 === 0 ? matGlowCyan : matGlowGold);
            strip.position.set(tx, ty + 10 + w * 9, tz);
            envGroup.add(strip);
        }

        // Roof beacon transmitter
        const beaconGeo = new THREE.SphereGeometry(0.5, 8, 8);
        const beacon = new THREE.Mesh(beaconGeo, matGlowPink);
        beacon.position.set(tx, ty + height + 1, tz);
        envGroup.add(beacon);
    });

    // Floating Holographic Rings
    const holoRings = [];
    for (let r = 0; r < 6; r++) {
        const ringGeo = new THREE.TorusGeometry(3.5 + r * 0.4, 0.08, 8, 32);
        const ring = new THREE.Mesh(ringGeo, r % 2 === 0 ? matGlowCyan : matGlowGold);
        ring.position.set(
            (Math.random() - 0.5) * 60,
            12 + Math.random() * 14,
            (Math.random() - 0.5) * 80
        );
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        envGroup.add(ring);
        holoRings.push(ring);
    }

    // Glowing Starfield & Cosmic Dust Particles
    const starCount = 550;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 220;
        starPositions[i * 3 + 1] = Math.random() * 70 - 6;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
        color: PALETTE.cyan,
        size: 0.22,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ============================================================
    // 🏎️ 1. ROBOTIC CARS / AUTONOMOUS CYBER ROVERS
    // ============================================================
    const cars = [];

    function buildRoboticCar(glowMat, index) {
        const car = new THREE.Group();

        // Sleek aerodynamic sports body
        const bodyGeo = new THREE.BoxGeometry(2.8, 0.7, 5.6);
        const body = new THREE.Mesh(bodyGeo, matWhiteEnamel);
        body.position.y = 0.55;
        car.add(body);

        // Lower carbon aero skirts & diffuser
        const skirtGeo = new THREE.BoxGeometry(3.0, 0.35, 5.4);
        const skirt = new THREE.Mesh(skirtGeo, matDarkCarbon);
        skirt.position.y = 0.22;
        car.add(skirt);

        // Neon Underglow bar
        const underglowGeo = new THREE.PlaneGeometry(2.6, 4.8);
        const underglowMat = new THREE.MeshBasicMaterial({
            color: glowMat.emissive,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const underglow = new THREE.Mesh(underglowGeo, underglowMat);
        underglow.rotation.x = Math.PI / 2;
        underglow.position.y = 0.05;
        car.add(underglow);

        // Cabin canopy / tinted glass cockpit
        const cabinGeo = new THREE.BoxGeometry(1.9, 0.6, 2.8);
        const cabinMat = new THREE.MeshStandardMaterial({
            color: 0x050a14,
            metalness: 0.95,
            roughness: 0.08,
            emissive: glowMat.emissive,
            emissiveIntensity: 0.35
        });
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(0, 1.05, -0.3);
        car.add(cabin);

        // Front dual laser headlights with real projecting light cones
        [-1.0, 1.0].forEach(hx => {
            const hlMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.14, 0.15), glowMat);
            hlMesh.position.set(hx, 0.55, 2.85);
            car.add(hlMesh);

            // Forward volumetric light beam
            const beamGeo = new THREE.ConeGeometry(2.2, 12, 16, 1, true);
            const beamMat = new THREE.MeshBasicMaterial({
                color: glowMat.emissive,
                transparent: true,
                opacity: 0.16,
                side: THREE.DoubleSide
            });
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.rotation.x = -Math.PI / 2;
            beam.position.set(hx, 0.55, 8.85);
            car.add(beam);
        });

        // Rear glowing exhaust thrusters
        [-0.8, 0.8].forEach(rx => {
            const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.5, 12), matGlowOrange);
            thruster.rotation.x = Math.PI / 2;
            thruster.position.set(rx, 0.5, -2.85);
            car.add(thruster);
        });

        // Rear aerodynamic high wing spoiler
        const spoilerWing = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.1, 0.7), matDarkCarbon);
        spoilerWing.position.set(0, 1.35, -2.5);
        car.add(spoilerWing);

        [-1.2, 1.2].forEach(sx => {
            const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.4), matDarkCarbon);
            pylon.position.set(sx, 1.1, -2.5);
            car.add(pylon);
        });

        // 4 Cybernetic illuminated hub wheels
        const wheels = [];
        const wheelCoords = [
            [-1.45, 0.5, 1.8], [1.45, 0.5, 1.8],
            [-1.45, 0.5, -1.8], [1.45, 0.5, -1.8]
        ];

        wheelCoords.forEach(([wx, wy, wz]) => {
            const wheelRoot = new THREE.Group();
            wheelRoot.position.set(wx, wy, wz);

            // Tire
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.45, 16), matDarkCarbon);
            tire.rotation.z = Math.PI / 2;
            wheelRoot.add(tire);

            // Glowing rim halo
            const rim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.06, 8, 18), glowMat);
            rim.rotation.y = Math.PI / 2;
            wheelRoot.add(rim);

            car.add(wheelRoot);
            wheels.push(wheelRoot);
        });

        car.userData = {
            type: 'car',
            wheels,
            speed: 0.45 + Math.random() * 0.4,
            laneX: 0,
            targetLaneX: 0,
            laneTimer: 2 + Math.random() * 5
        };

        return car;
    }

    // Populate car fleet
    const carGlows = [matGlowCyan, matGlowGold, matGlowPink, matGlowBlue, matGlowGreen, matGlowOrange];
    const laneChoices = [-18, -9, 0, 9, 18];

    for (let i = 0; i < 8; i++) {
        const glow = carGlows[i % carGlows.length];
        const car = buildRoboticCar(glow, i);
        const laneX = laneChoices[i % laneChoices.length];
        const dir = laneX >= 0 ? 1 : -1;

        car.userData.direction = dir;
        car.userData.laneX = laneX;
        car.userData.targetLaneX = laneX;
        car.position.set(laneX, -5.4, (Math.random() - 0.5) * 240);
        car.rotation.y = dir === 1 ? 0 : Math.PI;

        scene.add(car);
        cars.push(car);
    }

    // ============================================================
    // 🛸 2. AERIAL HIGH-TECH DRONES / QUADCOPTERS
    // ============================================================
    const drones = [];

    function buildQuadcopter(glowMat) {
        const drone = new THREE.Group();

        // Sleek aerodynamic pod body
        const podGeo = new THREE.SphereGeometry(0.95, 18, 18);
        podGeo.scale(1.25, 0.7, 1.25);
        const pod = new THREE.Mesh(podGeo, matWhiteEnamel);
        drone.add(pod);

        // Glowing panoramic eye / front scanner
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 14), glowMat);
        eye.position.set(0, 0.08, 0.95);
        drone.add(eye);

        // 4 Outrigger carbon struts with spinning energy rings
        const rotors = [];
        const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
        const armDist = 2.4;

        armAngles.forEach(ang => {
            const ax = Math.cos(ang) * armDist;
            const az = Math.sin(ang) * armDist;

            // Arm
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, armDist, 8), matDarkCarbon);
            arm.position.set(ax * 0.5, 0.05, az * 0.5);
            arm.rotation.z = Math.PI / 2;
            arm.rotation.y = -ang;
            drone.add(arm);

            // Rotor Turbine Nacelle
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.1, 8, 22), matSteel);
            ring.rotation.x = Math.PI / 2;
            ring.position.set(ax, 0.15, az);
            drone.add(ring);

            // Glowing spinning turbine blade
            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.04, 0.18), glowMat);
            blade.position.set(ax, 0.16, az);
            drone.add(blade);
            rotors.push(blade);
        });

        // Downward scanning volumetric searchlight cone
        const beamGeo = new THREE.ConeGeometry(4.2, 18, 16, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
            color: glowMat.emissive,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide
        });
        const searchlight = new THREE.Mesh(beamGeo, beamMat);
        searchlight.position.set(0, -9.2, 0);
        drone.add(searchlight);

        // Blinking communication antenna
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6), matSteel);
        ant.position.set(0, 0.75, -0.4);
        drone.add(ant);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), matGlowPink);
        beacon.position.set(0, 1.22, -0.4);
        drone.add(beacon);

        drone.userData = {
            type: 'drone',
            rotors,
            beacon,
            searchlight,
            targetPos: new THREE.Vector3(
                (Math.random() - 0.5) * 60,
                7 + Math.random() * 16,
                (Math.random() - 0.5) * 85
            ),
            hoverPhase: Math.random() * Math.PI * 2,
            hoverSpeed: 1.6 + Math.random() * 1.4
        };

        const sc = 0.9 + Math.random() * 0.35;
        drone.scale.set(sc, sc, sc);
        return drone;
    }

    // Populate aerial drone squadron
    const droneGlows = [matGlowCyan, matGlowGold, matGlowPink, matGlowBlue, matGlowGreen, matGlowCyan];
    for (let i = 0; i < 6; i++) {
        const drone = buildQuadcopter(droneGlows[i % droneGlows.length]);
        drone.position.set(
            (Math.random() - 0.5) * 65,
            7 + Math.random() * 18,
            (Math.random() - 0.5) * 90
        );
        scene.add(drone);
        drones.push(drone);
    }

    // ============================================================
    // 🤖 3. BIPEDAL PATROL ROBOTS / MECHS
    // ============================================================
    const mechs = [];

    function buildPatrolMech(glowMat) {
        const mech = new THREE.Group();

        // Torso / Reactor
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.7, 1.8, 14), matWhiteEnamel);
        torso.position.y = 2.5;
        mech.add(torso);

        const core = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), glowMat);
        core.position.set(0, 2.6, 0.6);
        mech.add(core);

        // Head with glowing visor
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 3.8, 0);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 16), matWhiteEnamel);
        head.scale.set(1.2, 1.0, 1.05);
        headGroup.add(head);

        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.42, 0.2), glowMat);
        visor.position.set(0, 0.05, 0.68);
        headGroup.add(visor);

        // Ear cylinders
        [-0.95, 0.95].forEach(ex => {
            const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.22, 12), matSteel);
            ear.rotation.z = Math.PI / 2;
            ear.position.set(ex, 0, 0);
            headGroup.add(ear);
        });

        mech.add(headGroup);

        // Arms
        const arms = [];
        [-1.2, 1.2].forEach(ax => {
            const armRoot = new THREE.Group();
            armRoot.position.set(ax, 2.9, 0);

            const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 10), matSteel);
            armRoot.add(shoulder);

            const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.95, 8), matWhiteEnamel);
            upper.position.y = -0.58;
            armRoot.add(upper);

            const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.95, 8), matDarkCarbon);
            fore.position.y = -1.35;
            armRoot.add(fore);

            const hand = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), glowMat);
            hand.position.y = -1.9;
            armRoot.add(hand);

            mech.add(armRoot);
            arms.push(armRoot);
        });

        // Legs
        const legs = [];
        [-0.55, 0.55].forEach(lx => {
            const legRoot = new THREE.Group();
            legRoot.position.set(lx, 1.6, 0);

            const hip = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), matSteel);
            legRoot.add(hip);

            const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.15, 8), matWhiteEnamel);
            thigh.position.y = -0.68;
            legRoot.add(thigh);

            const knee = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 6, 14), glowMat);
            knee.rotation.x = Math.PI / 2;
            knee.position.y = -1.35;
            legRoot.add(knee);

            const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, 1.05, 8), matDarkCarbon);
            shin.position.y = -1.9;
            legRoot.add(shin);

            const boot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.95), matSteel);
            boot.position.set(0, -2.5, 0.18);
            legRoot.add(boot);

            mech.add(legRoot);
            legs.push(legRoot);
        });

        mech.userData = {
            type: 'mech',
            headGroup,
            arms,
            legs,
            walkCycle: Math.random() * Math.PI * 2,
            walkSpeed: 3.4,
            patrolDir: Math.random() > 0.5 ? 1 : -1,
            patrolMinZ: -55,
            patrolMaxZ: 55
        };

        const sc = 0.95 + Math.random() * 0.25;
        mech.scale.set(sc, sc, sc);
        return mech;
    }

    // Place patrolling mechs on catwalks and sides
    const mechTracks = [
        { x: -28, y: -3.4, z: -15 },
        { x: 28, y: -3.4, z: 20 },
        { x: -14, y: -3.4, z: 45 },
        { x: 14, y: -3.4, z: -35 },
        { x: 0, y: 0.1, z: 0 } // on elevated catwalk!
    ];
    mechTracks.forEach((trk, idx) => {
        const mech = buildPatrolMech(carGlows[idx % carGlows.length]);
        mech.position.set(trk.x, trk.y, trk.z);
        scene.add(mech);
        mechs.push(mech);
    });

    // ============================================================
    // 🦾 4. HEAVY 6-AXIS INDUSTRIAL ROBOTIC ARMS
    // ============================================================
    const industrialArms = [];

    function buildRoboticArm(baseX, baseZ) {
        const station = new THREE.Group();
        station.position.set(baseX, -5.9, baseZ);

        // Pedestal Base
        const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 1.3, 14), matDarkCarbon);
        station.add(pedestal);

        // Glowing base ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.09, 8, 18), matGlowCyan);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.55;
        station.add(ring);

        // Turntable (rotates 360)
        const turntable = new THREE.Group();
        turntable.position.y = 0.85;
        station.add(turntable);

        const tableMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.7, 14), matSteel);
        turntable.add(tableMesh);

        // Shoulder joint
        const shoulderJoint = new THREE.Group();
        shoulderJoint.position.set(0, 0.65, 0);
        turntable.add(shoulderJoint);

        const shoulderSphere = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 12), matDarkCarbon);
        shoulderJoint.add(shoulderSphere);

        // Lower arm boom
        const lowerBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 3.8, 8), matWhiteEnamel);
        lowerBoom.position.set(0, 2.0, 0);
        shoulderJoint.add(lowerBoom);

        // Elbow joint
        const elbowJoint = new THREE.Group();
        elbowJoint.position.set(0, 3.9, 0);
        shoulderJoint.add(elbowJoint);

        const elbowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.58, 12, 12), matSteel);
        elbowJoint.add(elbowSphere);

        // Forearm boom
        const foreBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 3.2, 8), matDarkCarbon);
        foreBoom.position.set(0, 1.7, 0);
        elbowJoint.add(foreBoom);

        // Wrist & Welding / Laser Tool
        const wristJoint = new THREE.Group();
        wristJoint.position.set(0, 3.4, 0);
        elbowJoint.add(wristJoint);

        const toolHead = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 8), matGlowGold);
        toolHead.rotation.x = Math.PI;
        wristJoint.add(toolHead);

        // Active laser beam
        const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 4.8, 6), matLaserRed);
        laser.position.set(0, -2.5, 0);
        wristJoint.add(laser);

        // Spark emitter particle at contact point
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), matGlowOrange);
        spark.position.set(0, -4.8, 0);
        wristJoint.add(spark);

        station.userData = {
            type: 'arm',
            turntable,
            shoulderJoint,
            elbowJoint,
            wristJoint,
            laser,
            spark,
            animPhase: Math.random() * Math.PI * 2,
            speed: 0.9 + Math.random() * 0.5
        };

        scene.add(station);
        industrialArms.push(station);
        return station;
    }

    // Place heavy industrial stations
    buildRoboticArm(-32, -25);
    buildRoboticArm(-32, 25);
    buildRoboticArm(32, -25);
    buildRoboticArm(32, 25);

    // ============================================================
    // MOUSE PARALLAX & RESIZE
    // ============================================================
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ============================================================
    // ANIMATION & TICK LOOP
    // ============================================================
    const clock = new THREE.Clock();
    const highwayBoundZ = 135;

    function animate() {
        requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.getElapsedTime();

        // Smooth mouse lerp
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // ---------- 1. UPDATE CARS ----------
        cars.forEach((car, idx) => {
            const u = car.userData;
            // Forward movement
            car.position.z += u.speed * u.direction * 65 * delta;

            // Spinning wheels
            u.wheels.forEach(w => {
                w.children[0].rotation.x += u.speed * u.direction * 3.8;
                w.children[1].rotation.x += u.speed * u.direction * 3.8;
            });

            // Smooth lane shifting
            u.laneTimer -= delta;
            if (u.laneTimer <= 0) {
                u.laneTimer = 3.5 + Math.random() * 5.5;
                const lanes = u.direction === 1 ? [0, 9, 18] : [-18, -9, 0];
                u.targetLaneX = lanes[Math.floor(Math.random() * lanes.length)];
            }
            const laneDiff = u.targetLaneX - car.position.x;
            car.position.x += laneDiff * 0.03;

            // Tilt & yaw into turns
            const targetRotY = (u.direction === 1 ? 0 : Math.PI) - laneDiff * 0.07;
            car.rotation.y += (targetRotY - car.rotation.y) * 0.08;
            car.rotation.z = -laneDiff * 0.02;

            // Wrap around highway boundary
            if (car.position.z > highwayBoundZ) car.position.z = -highwayBoundZ;
            if (car.position.z < -highwayBoundZ) car.position.z = highwayBoundZ;
        });

        // ---------- 2. UPDATE DRONES ----------
        drones.forEach((drone, idx) => {
            const u = drone.userData;

            // Rotor spin
            u.rotors.forEach(r => {
                r.rotation.y += 32 * delta;
            });

            // Beacon flash
            if (u.beacon) {
                u.beacon.material.emissiveIntensity = 0.8 + Math.sin(time * 9 + idx) * 1.8;
            }

            // Searchlight sweeping angle
            if (u.searchlight) {
                u.searchlight.rotation.z = Math.sin(time * 2 + idx) * 0.15;
            }

            // Flight towards target waypoint
            const toTarget = new THREE.Vector3().subVectors(u.targetPos, drone.position);
            if (toTarget.length() < 3.5) {
                u.targetPos.set(
                    (Math.random() - 0.5) * 65,
                    6 + Math.random() * 18,
                    (Math.random() - 0.5) * 90
                );
            }
            toTarget.normalize();
            drone.position.addScaledVector(toTarget, 11 * delta);

            // Aerodynamic hover bob & banking
            const hoverY = Math.sin(time * u.hoverSpeed + u.hoverPhase) * 0.025;
            drone.position.y += hoverY;

            const heading = Math.atan2(toTarget.x, toTarget.z);
            drone.rotation.y += (heading - drone.rotation.y) * 0.05;
            drone.rotation.z = -toTarget.x * 0.35;
            drone.rotation.x = toTarget.z * 0.22;
        });

        // ---------- 3. UPDATE PATROL MECHS ----------
        mechs.forEach((mech, idx) => {
            const u = mech.userData;
            u.walkCycle += delta * u.walkSpeed;

            // Forward/backward stride
            mech.position.z += u.patrolDir * 3.2 * delta;
            if (mech.position.z > u.patrolMaxZ) {
                u.patrolDir = -1;
                mech.rotation.y = Math.PI;
            } else if (mech.position.z < u.patrolMinZ) {
                u.patrolDir = 1;
                mech.rotation.y = 0;
            }

            // Articulated limbs swing
            const swing = Math.sin(u.walkCycle) * 0.6;
            u.legs[0].rotation.x = swing;
            u.legs[1].rotation.x = -swing;
            u.arms[0].rotation.x = -swing * 0.65;
            u.arms[1].rotation.x = swing * 0.65;

            // Head horizontal sweep
            u.headGroup.rotation.y = Math.sin(time * 1.6 + idx) * 0.4;
        });

        // ---------- 4. UPDATE INDUSTRIAL ROBOTIC ARMS ----------
        industrialArms.forEach(station => {
            const u = station.userData;
            const armTime = time * u.speed + u.animPhase;

            u.turntable.rotation.y = Math.sin(armTime * 0.7) * 1.1;
            u.shoulderJoint.rotation.x = 0.35 + Math.sin(armTime * 1.2) * 0.35;
            u.elbowJoint.rotation.x = -0.65 + Math.cos(armTime * 1.35) * 0.45;
            u.wristJoint.rotation.x = -u.shoulderJoint.rotation.x - u.elbowJoint.rotation.x;

            const sparkVal = Math.random() > 0.25 ? 3.0 + Math.random() * 2.5 : 0.2;
            u.spark.material.emissiveIntensity = sparkVal;
            u.laser.material.emissiveIntensity = 2.0 + Math.sin(armTime * 14) * 1.2;
        });

        // ---------- 5. PARTICLES & HOLOGRAPHIC RINGS ----------
        starField.rotation.y = time * 0.02;
        holoRings.forEach((r, idx) => {
            r.rotation.x += 0.005 * (idx + 1);
            r.rotation.y += 0.008 * (idx + 1);
        });

        // ---------- 6. CAMERA DIRECTOR MODES ----------
        if (currentCamMode === 'cinematic') {
            const targetCamX = mouseX * 7;
            const targetCamY = 8 - mouseY * 4.5;
            camera.position.x += (targetCamX - camera.position.x) * 0.035;
            camera.position.y += (targetCamY - camera.position.y) * 0.035;
            camera.position.z += (36 - camera.position.z) * 0.035;
            camera.lookAt(0, 3, -12);
        } else if (currentCamMode === 'drone' && drones.length > 0) {
            const leadDrone = drones[0];
            const targetCam = leadDrone.position.clone().add(new THREE.Vector3(0, 3.5, 12));
            camera.position.lerp(targetCam, 0.05);
            camera.lookAt(leadDrone.position);
        } else if (currentCamMode === 'rover' && cars.length > 0) {
            const leadCar = cars[0];
            const offset = leadCar.userData.direction === 1 ? new THREE.Vector3(0, 2.2, -11) : new THREE.Vector3(0, 2.2, 11);
            const targetCam = leadCar.position.clone().add(offset);
            camera.position.lerp(targetCam, 0.06);
            camera.lookAt(leadCar.position.clone().add(new THREE.Vector3(0, 1, 0)));
        } else if (currentCamMode === 'ground') {
            camera.position.lerp(new THREE.Vector3(-22, -1.5, 18), 0.04);
            camera.lookAt(-32, 0, -25);
        }

        // Ambient light pulsation
        cyanSpot.intensity = 2.8 + Math.sin(time * 2.4) * 0.5;
        goldSpot.intensity = 2.4 + Math.cos(time * 1.9) * 0.45;

        renderer.render(scene, camera);
    }

    animate();
})();
