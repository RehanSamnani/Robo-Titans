/* ============================================================
   ROBO TITANS #123 — Interactive 3D Robot Mascot Showcase
   Inspired by Nexie Robot 11 & Parkour R-Bot
   Features:
   - Beautiful 3D procedural humanoid bot with sleek white enamel armor
   - Dynamic canvas-textured glowing digital face (Happy, Combat, Wink, Scan)
   - Cursor-tracking head and articulated arms
   - Customizer: Color themes (Cyan, Gold, Pink, Emerald, Stealth)
   - Animations: Idle Breathing, Hand Wave, Parkour Spring Jump, 360 Spin
   - Orbit drag rotation and zoom inspection
   ============================================================ */

(function () {
    const canvas = document.getElementById('robotCanvas3d');
    if (!canvas || typeof THREE === 'undefined') return;

    // ---------- PALETTE & SKINS ----------
    const SKINS = {
        cyan: {
            name: 'Cyan Surge',
            glow: 0x00f5d4,
            glowHex: '#00f5d4',
            coreHex: '#00f5d4',
            armor: 0xf3f6fa,
            secondary: 0x182236
        },
        gold: {
            name: 'Solar Titan',
            glow: 0xffb703,
            glowHex: '#ffb703',
            coreHex: '#ffb703',
            armor: 0xf5f5f7,
            secondary: 0x2b1e10
        },
        pink: {
            name: 'Neon Plasma',
            glow: 0xf72585,
            glowHex: '#f72585',
            coreHex: '#f72585',
            armor: 0xf8f9fa,
            secondary: 0x2e1124
        },
        emerald: {
            name: 'Matrix Jade',
            glow: 0x06d6a0,
            glowHex: '#06d6a0',
            coreHex: '#06d6a0',
            armor: 0xf0fdf4,
            secondary: 0x0d281e
        },
        stealth: {
            name: 'Stealth Ops',
            glow: 0x00b4d8,
            glowHex: '#00b4d8',
            coreHex: '#00b4d8',
            armor: 0x1c2438,
            secondary: 0x090d17
        }
    };

    let activeSkin = 'cyan';

    // ---------- RENDERER & SCENE ----------
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    const rect = canvas.parentElement.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(rect.width || 480, rect.height || 520);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (rect.width || 480) / (rect.height || 520), 0.1, 100);
    camera.position.set(0, 1.8, 8.5);

    // ---------- LIGHTS ----------
    const ambLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const rimLightLeft = new THREE.DirectionalLight(SKINS.cyan.glow, 2.0);
    rimLightLeft.position.set(-6, 3, -4);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xffffff, 1.0);
    rimLightRight.position.set(6, -2, -4);
    scene.add(rimLightRight);

    // Emissive dynamic point light at core
    const corePointLight = new THREE.PointLight(SKINS.cyan.glow, 1.8, 12);
    corePointLight.position.set(0, 1.6, 1.5);
    scene.add(corePointLight);

    // ---------- SHARED MATERIALS ----------
    const matArmor = new THREE.MeshStandardMaterial({
        color: SKINS.cyan.armor,
        metalness: 0.15,
        roughness: 0.14
    });

    const matJoints = new THREE.MeshStandardMaterial({
        color: SKINS.cyan.secondary,
        metalness: 0.85,
        roughness: 0.3
    });

    const matGlowAccent = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: SKINS.cyan.glow,
        emissiveIntensity: 2.2,
        metalness: 0.1,
        roughness: 0.2
    });

    // ---------- PROCEDURAL DIGITAL FACE TEXTURE ----------
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 256;
    const faceCtx = faceCanvas.getContext('2d');
    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.anisotropy = 4;

    let currentExpression = 'happy'; // 'happy', 'combat', 'wink', 'scan'

    function drawFace(colorHex = '#00f5d4', time = 0) {
        faceCtx.fillStyle = '#060c18';
        faceCtx.fillRect(0, 0, 512, 256);

        // Subtle digital scanline background
        faceCtx.fillStyle = 'rgba(0, 245, 212, 0.04)';
        for (let y = 0; y < 256; y += 8) {
            faceCtx.fillRect(0, y, 512, 4);
        }

        faceCtx.strokeStyle = colorHex;
        faceCtx.fillStyle = colorHex;
        faceCtx.lineWidth = 14;
        faceCtx.lineCap = 'round';
        faceCtx.shadowColor = colorHex;
        faceCtx.shadowBlur = 24;

        if (currentExpression === 'happy') {
            // Cute glowing curved digital eyes (like Nexie)
            // Left Eye
            faceCtx.beginPath();
            faceCtx.arc(170, 110, 42, 0.2, Math.PI - 0.2, true);
            faceCtx.stroke();

            // Right Eye
            faceCtx.beginPath();
            faceCtx.arc(342, 110, 42, 0.2, Math.PI - 0.2, true);
            faceCtx.stroke();

            // Cute digital smile curve
            faceCtx.beginPath();
            faceCtx.arc(256, 135, 45, 0.15, Math.PI - 0.15, false);
            faceCtx.stroke();

            // Cheek blush dots
            faceCtx.shadowBlur = 12;
            faceCtx.fillStyle = colorHex;
            faceCtx.beginPath();
            faceCtx.arc(120, 150, 10, 0, Math.PI * 2);
            faceCtx.arc(392, 150, 10, 0, Math.PI * 2);
            faceCtx.fill();

        } else if (currentExpression === 'combat') {
            // Fierce angled visor eyes
            faceCtx.beginPath();
            faceCtx.moveTo(120, 95);
            faceCtx.lineTo(210, 135);
            faceCtx.lineTo(135, 145);
            faceCtx.closePath();
            faceCtx.fill();

            faceCtx.beginPath();
            faceCtx.moveTo(392, 95);
            faceCtx.lineTo(302, 135);
            faceCtx.lineTo(377, 145);
            faceCtx.closePath();
            faceCtx.fill();

            // Target crosshair
            faceCtx.beginPath();
            faceCtx.arc(256, 128, 22, 0, Math.PI * 2);
            faceCtx.stroke();
            faceCtx.beginPath();
            faceCtx.moveTo(256, 95);
            faceCtx.lineTo(256, 160);
            faceCtx.moveTo(225, 128);
            faceCtx.lineTo(287, 128);
            faceCtx.stroke();

        } else if (currentExpression === 'wink') {
            // Left Eye Happy Arc
            faceCtx.beginPath();
            faceCtx.arc(170, 110, 42, 0.2, Math.PI - 0.2, true);
            faceCtx.stroke();

            // Right Eye Wink Line
            faceCtx.beginPath();
            faceCtx.moveTo(310, 115);
            faceCtx.lineTo(375, 115);
            faceCtx.stroke();

            // Open happy smile
            faceCtx.beginPath();
            faceCtx.arc(256, 140, 38, 0, Math.PI, false);
            faceCtx.fill();

        } else if (currentExpression === 'scan') {
            // Animated radar wave lines
            const offset = (time * 180) % 512;
            faceCtx.lineWidth = 6;
            for (let i = 0; i < 4; i++) {
                const rx = (offset + i * 90) % 512;
                faceCtx.beginPath();
                faceCtx.moveTo(rx, 40);
                faceCtx.lineTo(rx, 216);
                faceCtx.stroke();
            }

            faceCtx.font = 'bold 32px monospace';
            faceCtx.fillText('TARGET LOCK 100%', 120, 138);
        }

        faceTexture.needsUpdate = true;
    }

    drawFace(SKINS.cyan.glowHex);

    // ---------- BUILD PROCEDURAL 3D BOT MODEL ----------
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // 1. Pedestal Base (circular display podium, exactly like in the Nexie reference)
    const baseGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.45, 36);
    const pedestal = new THREE.Mesh(pedestalGeo, matJoints);
    pedestal.position.y = -2.15;
    baseGroup.add(pedestal);

    const baseRingGeo = new THREE.TorusGeometry(2.25, 0.08, 8, 36);
    const baseRing = new THREE.Mesh(baseRingGeo, matGlowAccent);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -1.95;
    baseGroup.add(baseRing);

    robotRoot.add(baseGroup);

    // 2. Pelvis / Hips
    const pelvisGeo = new THREE.CylinderGeometry(0.7, 0.55, 0.5, 16);
    const pelvis = new THREE.Mesh(pelvisGeo, matJoints);
    pelvis.position.y = -0.55;
    robotRoot.add(pelvis);

    // 3. Torso / Chest Body (smooth white enamel armor pod)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.4;
    robotRoot.add(torsoGroup);

    const torsoGeo = new THREE.SphereGeometry(1.05, 24, 24);
    torsoGeo.scale(1.0, 1.25, 0.95);
    const torso = new THREE.Mesh(torsoGeo, matArmor);
    torsoGroup.add(torso);

    // Chest center glowing reactor core (round jewel, Nexie style)
    const coreGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const coreMesh = new THREE.Mesh(coreGeo, matGlowAccent);
    coreMesh.position.set(0, 0.15, 0.92);
    torsoGroup.add(coreMesh);

    const coreRingGeo = new THREE.TorusGeometry(0.38, 0.05, 8, 20);
    const coreRing = new THREE.Mesh(coreRingGeo, matJoints);
    coreRing.position.set(0, 0.15, 0.92);
    torsoGroup.add(coreRing);

    // Collar / Neck Joint
    const neckGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.4, 16);
    const neck = new THREE.Mesh(neckGeo, matJoints);
    neck.position.y = 1.35;
    torsoGroup.add(neck);

    // 4. Head Assembly (smooth rounded monitor head with curved screen)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.05, 0);
    torsoGroup.add(headGroup);

    // Outer helmet
    const helmetGeo = new THREE.SphereGeometry(1.08, 28, 28);
    helmetGeo.scale(1.22, 1.0, 1.05);
    const helmet = new THREE.Mesh(helmetGeo, matArmor);
    headGroup.add(helmet);

    // Curved digital face visor with dynamic canvas texture!
    const faceVisorMat = new THREE.MeshBasicMaterial({
        map: faceTexture,
        transparent: false
    });
    const faceVisorGeo = new THREE.SphereGeometry(0.95, 24, 24, 0, Math.PI);
    faceVisorGeo.scale(0.95, 0.72, 0.4);
    const faceVisor = new THREE.Mesh(faceVisorGeo, faceVisorMat);
    faceVisor.position.set(0, 0.05, 0.75);
    faceVisor.rotation.y = -Math.PI / 2;
    headGroup.add(faceVisor);

    // Side ear cylinders (like headphones, Nexie image)
    [-1.28, 1.28].forEach(ex => {
        const earGroup = new THREE.Group();
        earGroup.position.set(ex, 0.05, 0);

        const earCan = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 18), matJoints);
        earCan.rotation.z = Math.PI / 2;
        earGroup.add(earCan);

        const earRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 18), matGlowAccent);
        earRing.rotation.y = Math.PI / 2;
        earRing.position.x = ex > 0 ? 0.14 : -0.14;
        earGroup.add(earRing);

        headGroup.add(earGroup);
    });

    // Dual antenna pins on top
    [-0.45, 0.45].forEach(ax => {
        const antGroup = new THREE.Group();
        antGroup.position.set(ax, 1.05, 0);
        antGroup.rotation.z = ax * -0.22;

        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.75, 8), matJoints);
        antGroup.add(pin);

        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), matGlowAccent);
        ball.position.y = 0.42;
        antGroup.add(ball);

        headGroup.add(antGroup);
    });

    // 5. Articulated Arms
    // Left Arm (Interactive wave capable)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(1.4, 0.85, 0);
    torsoGroup.add(leftArmGroup);

    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), matJoints);
    leftArmGroup.add(shoulderL);

    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 1.0, 12), matArmor);
    upperArmL.position.y = -0.58;
    leftArmGroup.add(upperArmL);

    const elbowL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), matJoints);
    elbowL.position.y = -1.15;
    leftArmGroup.add(elbowL);

    const foreArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.95, 12), matArmor);
    foreArmL.position.y = -1.7;
    leftArmGroup.add(foreArmL);

    // Hand with articulated fingers
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), matJoints);
    handL.position.y = -2.25;
    leftArmGroup.add(handL);

    // Glowing finger tips
    for (let f = -1; f <= 1; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.35, 6), matGlowAccent);
        finger.position.set(f * 0.1, -2.48, 0);
        leftArmGroup.add(finger);
    }

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-1.4, 0.85, 0);
    torsoGroup.add(rightArmGroup);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), matJoints);
    rightArmGroup.add(shoulderR);

    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 1.0, 12), matArmor);
    upperArmR.position.y = -0.58;
    rightArmGroup.add(upperArmR);

    const elbowR = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), matJoints);
    elbowR.position.y = -1.15;
    rightArmGroup.add(elbowR);

    const foreArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.95, 12), matArmor);
    foreArmR.position.y = -1.7;
    rightArmGroup.add(foreArmR);

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), matJoints);
    handR.position.y = -2.25;
    rightArmGroup.add(handR);

    for (let f = -1; f <= 1; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.35, 6), matGlowAccent);
        finger.position.set(f * 0.1, -2.48, 0);
        rightArmGroup.add(finger);
    }

    // 6. Articulated Legs (Spring suspension, Parkour R-Bot style)
    const legGroups = [];
    [-0.65, 0.65].forEach((lx, idx) => {
        const legPivot = new THREE.Group();
        legPivot.position.set(lx, -0.6, 0);

        const hip = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), matJoints);
        legPivot.add(hip);

        // Thigh
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 1.0, 12), matArmor);
        thigh.position.y = -0.55;
        legPivot.add(thigh);

        // Heavy-duty Spring Knee Damper (Parkour Bot reference)
        const springGroup = new THREE.Group();
        springGroup.position.y = -1.15;
        for (let s = 0; s < 3; s++) {
            const coil = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 6, 14), matGlowAccent);
            coil.rotation.x = Math.PI / 2;
            coil.position.y = (s - 1) * 0.12;
            springGroup.add(coil);
        }
        legPivot.add(springGroup);

        // Shin armor
        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.95, 12), matArmor);
        shin.position.y = -1.75;
        legPivot.add(shin);

        // Ankle joint
        const ankle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), matJoints);
        ankle.position.y = -2.25;
        legPivot.add(ankle);

        // High-tech Boot
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 1.0), matJoints);
        foot.position.set(0, -2.45, 0.2);
        legPivot.add(foot);

        // Underfoot magnetic glow pad
        const soleGlow = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.9), matGlowAccent);
        soleGlow.position.set(0, -2.62, 0.2);
        legPivot.add(soleGlow);

        robotRoot.add(legPivot);
        legGroups.push(legPivot);
    });

    // ============================================================
    // MOUSE DRAG & ORBIT INSPECTION
    // ============================================================
    let isDragging = false;
    let prevMouseX = 0, prevMouseY = 0;
    let targetRotY = 0, currentRotY = 0;
    let targetTiltX = 0, currentTiltX = 0;
    let lookAtMouseX = 0, lookAtMouseY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        lookAtMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        lookAtMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        if (isDragging) {
            const dx = e.clientX - prevMouseX;
            const dy = e.clientY - prevMouseY;
            targetRotY += dx * 0.012;
            targetTiltX = Math.max(-0.4, Math.min(0.4, targetTiltX + dy * 0.008));
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        }
    });

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            prevMouseX = e.touches[0].clientX;
            prevMouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            const dx = e.touches[0].clientX - prevMouseX;
            const dy = e.touches[0].clientY - prevMouseY;
            targetRotY += dx * 0.012;
            targetTiltX = Math.max(-0.4, Math.min(0.4, targetTiltX + dy * 0.008));
            prevMouseX = e.touches[0].clientX;
            prevMouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    // Click to interact (tickle/trigger happy reaction & sound)
    canvas.addEventListener('click', () => {
        triggerAction('wave');
        if (window.playRobotChirp) window.playRobotChirp();
    });

    // Resize handler
    function handleResize() {
        const r = canvas.parentElement.getBoundingClientRect();
        const w = r.width || 480;
        const h = r.height || 520;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    // ============================================================
    // ACTIONS & ANIMATION SEQUENCING
    // ============================================================
    let activeAction = null;
    let actionTimer = 0;

    function triggerAction(actionName) {
        activeAction = actionName;
        actionTimer = 0;

        if (actionName === 'wave') {
            currentExpression = 'happy';
            drawFace(SKINS[activeSkin].glowHex);
        } else if (actionName === 'jump') {
            currentExpression = 'combat';
            drawFace(SKINS[activeSkin].glowHex);
        } else if (actionName === 'spin') {
            currentExpression = 'wink';
            drawFace(SKINS[activeSkin].glowHex);
        } else if (actionName === 'scan') {
            currentExpression = 'scan';
        }
    }
    window.triggerBotAction = triggerAction;

    // Skin switcher
    window.switchBotSkin = function (skinKey) {
        if (!SKINS[skinKey]) return;
        activeSkin = skinKey;
        const s = SKINS[skinKey];

        matArmor.color.setHex(s.armor);
        matJoints.color.setHex(s.secondary);
        matGlowAccent.emissive.setHex(s.glow);
        rimLightLeft.color.setHex(s.glow);
        corePointLight.color.setHex(s.glow);

        drawFace(s.glowHex);

        const label = document.getElementById('activeSkinLabel');
        if (label) label.textContent = s.name;
    };

    window.switchBotExpression = function (exprKey) {
        currentExpression = exprKey;
        drawFace(SKINS[activeSkin].glowHex);
    };

    // ============================================================
    // MAIN RENDER LOOP
    // ============================================================
    const clock = new THREE.Clock();

    function renderLoop() {
        requestAnimationFrame(renderLoop);

        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.getElapsedTime();

        // Face animation update (for scanner mode)
        if (currentExpression === 'scan') {
            drawFace(SKINS[activeSkin].glowHex, time);
        }

        // Smooth rotation damping
        currentRotY += (targetRotY - currentRotY) * 0.08;
        currentTiltX += (targetTiltX - currentTiltX) * 0.08;

        // Apply orbit rotation to robotRoot
        robotRoot.rotation.y = currentRotY;
        robotRoot.rotation.x = currentTiltX;

        // Idle breathing bob
        const breathe = Math.sin(time * 2.2) * 0.04;
        torsoGroup.position.y = 0.4 + breathe;

        // Interactive cursor tracking on head
        const targetHeadYaw = THREE.MathUtils.clamp(lookAtMouseX * 0.5, -0.6, 0.6);
        const targetHeadPitch = THREE.MathUtils.clamp(-lookAtMouseY * 0.4, -0.4, 0.4);
        headGroup.rotation.y += (targetHeadYaw - headGroup.rotation.y) * 0.08;
        headGroup.rotation.x += (targetHeadPitch - headGroup.rotation.x) * 0.08;

        // Base ring subtle rotation
        baseRing.rotation.z += 0.008;

        // Pulse core light
        corePointLight.intensity = 1.6 + Math.sin(time * 3.5) * 0.5;

        // Animation actions handler
        if (activeAction) {
            actionTimer += delta;

            if (activeAction === 'wave') {
                // Wave left arm smoothly
                const waveAngle = Math.sin(actionTimer * 9) * 0.45;
                leftArmGroup.rotation.z = 2.2 + waveAngle;
                leftArmGroup.rotation.x = 0.3;
                if (actionTimer > 2.2) {
                    leftArmGroup.rotation.z = 0;
                    leftArmGroup.rotation.x = 0;
                    activeAction = null;
                }
            } else if (activeAction === 'jump') {
                // Parkour R-Bot spring jump!
                const jumpProgress = actionTimer / 1.4;
                if (jumpProgress <= 1.0) {
                    const jumpHeight = Math.sin(jumpProgress * Math.PI) * 1.8;
                    robotRoot.position.y = jumpHeight;

                    // Spring legs tuck and extend
                    const tuck = Math.sin(jumpProgress * Math.PI) * 0.7;
                    legGroups[0].rotation.x = -tuck;
                    legGroups[1].rotation.x = -tuck * 0.7;
                    leftArmGroup.rotation.x = -tuck * 1.2;
                    rightArmGroup.rotation.x = tuck * 1.2;
                } else {
                    robotRoot.position.y = 0;
                    legGroups[0].rotation.x = 0;
                    legGroups[1].rotation.x = 0;
                    leftArmGroup.rotation.x = 0;
                    rightArmGroup.rotation.x = 0;
                    activeAction = null;
                }
            } else if (activeAction === 'spin') {
                // 360 Combat spin
                targetRotY += 12 * delta;
                if (actionTimer > 1.2) {
                    activeAction = null;
                }
            }
        } else {
            // Default idle arm sway
            leftArmGroup.rotation.z = 0.05 + Math.sin(time * 1.8) * 0.04;
            rightArmGroup.rotation.z = -0.05 - Math.sin(time * 1.8) * 0.04;
        }

        renderer.render(scene, camera);
    }

    renderLoop();
})();
