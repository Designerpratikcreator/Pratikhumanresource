document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Handling ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 400);
        });
    }

    // --- Navigation & Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Theme Switcher ---
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode', themeSwitcher.checked);
        });
    }

    // --- Back To Top & Scroll Progress ---
    const backToTop = document.getElementById('backToTop');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (scrollProgress) {
            scrollProgress.style.width = (scrollTop / height) * 100 + '%';
        }
        if (backToTop) {
            backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- PAYMENT GATEWAY TAB INTERACTION ---
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentPanels = document.querySelectorAll('.payment-panel');
    const selectedPaymentInput = document.getElementById('selected-payment-method');

    paymentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            paymentTabs.forEach(t => t.classList.remove('active'));
            paymentPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const method = tab.getAttribute('data-method');
            const targetPanel = document.getElementById(`panel-${method}`);
            
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            if (selectedPaymentInput) {
                selectedPaymentInput.value = method;
            }
        });
    });

    // --- CARD INPUT FORMATTING MASKS ---
    function formatCardNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value.substring(0, 19);
    }

    function formatExpiry(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
    }

    const cardInputs = ['card-number-gen', 'visa-mc-number'];
    cardInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', formatCardNumber);
    });

    const expiryInputs = ['card-expiry-gen', 'visa-mc-expiry'];
    expiryInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', formatExpiry);
    });

    // --- ACQUISITION PAYMENT FORM VALIDATION ---
    const acquisitionForm = document.getElementById('acquisition-payment-form');
    if (acquisitionForm) {
        acquisitionForm.addEventListener('submit', (e) => {
            let isValid = true;

            const name = document.getElementById('appName');
            const email = document.getElementById('appEmail');
            const address = document.getElementById('appAddress');
            const orderType = document.getElementById('propose-orderType');

            // Reset Errors
            document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('invalid'));

            if (!name.value.trim()) {
                name.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            if (!email.value.trim() || !email.value.includes('@')) {
                email.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            if (!address.value.trim()) {
                address.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            if (!orderType.value) {
                orderType.closest('.form-group').classList.add('invalid');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // --- Three.js Background Animation (Hero) ---
    const canvas = document.getElementById('hero-background-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x27ae60, wireframe: true });
        const torusKnot = new THREE.Mesh(geometry, material);
        
        scene.add(torusKnot);
        camera.position.z = 30;

        function animate() {
            requestAnimationFrame(animate);
            torusKnot.rotation.x += 0.01;
            torusKnot.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    }

    // Footer Current Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
