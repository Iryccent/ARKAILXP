import * as THREE from 'three';

export function initializeCourseView() {
    // --- Sound Configuration ---
    // Tone.js is loaded via CDN, so it's available globally.
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const sounds = {
        select: () => synth.triggerAttackRelease("C4", "8n", Tone.now()),
        correct: () => synth.triggerAttackRelease(["C5", "E5", "G5"], "8n", Tone.now()),
        incorrect: () => synth.triggerAttackRelease("C3", "8n", Tone.now()),
        submit: () => synth.triggerAttackRelease("G4", "8n", Tone.now()),
    };

    // --- 3D Scene Configuration ---
    const threeCanvas = document.getElementById('three-canvas');
    if (!threeCanvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.4,
        wireframe: true
    });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x22d3ee, 10, 100);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        shape.rotation.x += 0.001;
        shape.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Chat Logic ---
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const typingIndicator = document.getElementById('typing-indicator');

    function addMessage(content, type) {
        const el = document.createElement('div');
        el.className = `chat-message ${type}-message`;
        el.innerHTML = `<p>${content}</p>`;
        chatMessages.appendChild(el);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initial bot message
    const initialBotMessage = document.querySelector('[data-i18n="course.aiTutor.greeting"]').textContent;
    addMessage(initialBotMessage, 'bot');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;
        addMessage(message, 'user');
        userInput.value = '';

        typingIndicator.style.display = 'flex';
        // Dummy response
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            addMessage("That's an excellent question. The Role+Task+Context structure is like giving a chef a detailed recipe instead of just saying 'cook something tasty'. You give them the 'who' (role), the 'what' (task), and the 'where/when' (context), ensuring a much more precise result.", 'bot');
        }, 1500);
    });

    // --- Quiz Logic ---
    let selectedOption = null;
    const correctAnswerIndex = 1; // B) Rol + Tarea + Contexto

    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach((option, index) => {
        option.addEventListener('click', () => selectAnswer(option, index));
    });

    function selectAnswer(element, index) {
        sounds.select();
        quizOptions.forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        selectedOption = { element, index };
    }

    document.getElementById('submit-quiz-btn').addEventListener('click', () => {
        if (selectedOption === null) return;
        sounds.submit();
        const { element, index } = selectedOption;
        if (index === correctAnswerIndex) {
            element.classList.add('correct');
            sounds.correct();
            launchConfetti();
        } else {
            element.classList.add('incorrect');
            sounds.incorrect();
            quizOptions[correctAnswerIndex].classList.add('correct');
        }
        // Disable further clicks
        quizOptions.forEach(el => el.style.pointerEvents = 'none');
        document.getElementById('submit-quiz-btn').disabled = true;
    });

    // --- Confetti Logic ---
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    let confettiPieces = [];

    function launchConfetti() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        for (let i = 0; i < 100; i++) {
            confettiPieces.push({
                x: Math.random() * confettiCanvas.width,
                y: -20,
                size: Math.random() * 5 + 2,
                speed: Math.random() * 5 + 2,
                angle: Math.random() * 360,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                rotation: Math.random() * 10 - 5
            });
        }

        function updateConfetti() {
            if (!confettiCtx) return;
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiPieces.forEach((p, i) => {
                p.y += p.speed;
                p.angle += p.rotation;

                confettiCtx.save();
                confettiCtx.translate(p.x, p.y);
                confettiCtx.rotate(p.angle * Math.PI / 180);
                confettiCtx.fillStyle = p.color;
                confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                confettiCtx.restore();

                if (p.y > confettiCanvas.height) confettiPieces.splice(i, 1);
            });

            if (confettiPieces.length > 0) {
                requestAnimationFrame(updateConfetti);
            }
        }
        updateConfetti();
    }
}