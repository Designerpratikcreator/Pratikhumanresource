document.addEventListener('DOMContentLoaded', () => {
    // --- Common Elements ---
    const body = document.body;

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // --- Theme Switcher ---
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
            if (savedTheme === 'dark-mode') {
                themeSwitcher.checked = true;
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
            themeSwitcher.checked = true;
        }

        themeSwitcher.addEventListener('change', () => {
            if (themeSwitcher.checked) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
            updateSkillBarColors();
        });
    }

    // --- Hero Section Typing Effect ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const phrases = ["EVERY CLASS TO ANY NUMBER"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 60 : 100;

            if (!isDeleting && charIndex === currentPhrase.length) {
                speed = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }

            setTimeout(type, speed);
        }
        type();
    }

    // --- Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Skill Level Indicators ---
    const skillListItems = document.querySelectorAll('.skill-category ul li');
    const skillsObserverOptions = { threshold: 0.2 };
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = parseInt(entry.target.dataset.level, 10);
                const skillBar = entry.target.querySelector('.skill-level-bar');
                if (skillBar) {
                    skillBar.style.width = `${skillLevel}%`;
                    updateSkillBarColor(skillBar, skillLevel);
                }
                observer.unobserve(entry.target);
            }
        });
    }, skillsObserverOptions);

    skillListItems.forEach(item => skillsObserver.observe(item));

    function updateSkillBarColor(skillBar, skillLevel) {
        let colorVar;
        if (skillLevel < 40) colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-low' : '--skill-level-low';
        else if (skillLevel < 70) colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-medium' : '--skill-level-medium';
        else if (skillLevel < 90) colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-high' : '--skill-level-high';
        else colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-expert' : '--skill-level-expert';
        
        skillBar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(colorVar);
    }

    function updateSkillBarColors() {
        skillListItems.forEach(item => {
            const skillLevel = parseInt(item.dataset.level, 10);
            const skillBar = item.querySelector('.skill-level-bar');
            if (skillBar) updateSkillBarColor(skillBar, skillLevel);
        });
    }

    // --- Three.js Background Canvas ---
    const canvas = document.getElementById('hero-background-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.75, 16, 16),
            new THREE.TorusGeometry(0.7, 0.3, 10, 30)
        ];

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0x00CED1, metalness: 0.7, roughness: 0.4 }),
            new THREE.MeshStandardMaterial({ color: 0xBA55D3, metalness: 0.7, roughness: 0.4 })
        ];

        const objects = [];
        for (let i = 0; i < 25; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
            scene.add(mesh);
            objects.push(mesh);
        }

        camera.position.z = 20;

        const animate = () => {
            requestAnimationFrame(animate);
            objects.forEach(obj => {
                obj.rotation.x += 0.003;
                obj.rotation.y += 0.003;
            });
            renderer.render(scene, camera);
        };
        animate();
    }

    /* ==========================================================================
       PAYMENT GATEWAY LOGIC & FORM VALIDATION
       ========================================================================== */
    const orderTypeSelect = document.getElementById('propose-orderType');
    const summaryClass = document.getElementById('summary-class');
    const summaryPrice = document.getElementById('summary-price');
    const summaryTotal = document.getElementById('summary-total');

    // Update Pricing Dynamically
    if (orderTypeSelect) {
        orderTypeSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            const name = selectedOption.text.split('(')[0];

            if (price) {
                const formattedPrice = `$${parseInt(price).toLocaleString()}.00 USD`;
                summaryClass.textContent = name;
                summaryPrice.textContent = formattedPrice;
                summaryTotal.textContent = formattedPrice;
            } else {
                summaryClass.textContent = "Select an Edition";
                summaryPrice.textContent = "$0.00 USD";
                summaryTotal.textContent = "$0.00 USD";
            }
        });
    }

    // Payment Method Radio Switcher
    const paymentOptions = document.querySelectorAll('.payment-card-option');
    const paymentPanels = document.querySelectorAll('.payment-panel');

    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            const radio = option.querySelector('input[type="radio"]');
            radio.checked = true;

            const selectedMethod = radio.value;
            paymentPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${selectedMethod}`) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // Credit Card Input Auto-formatting & Luhn Brand Detection
    const cardNumberInput = document.getElementById('cardNumber');
    const cardBrandIcon = document.getElementById('detected-card-icon');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            let formatted = '';

            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += val[i];
            }
            e.target.value = formatted;

            // Brand detection
            if (val.startsWith('4')) {
                cardBrandIcon.className = 'fab fa-cc-visa card-brand-preview';
                cardBrandIcon.style.color = '#1A1F71';
            } else if (/^5[1-5]/.test(val)) {
                cardBrandIcon.className = 'fab fa-cc-mastercard card-brand-preview';
                cardBrandIcon.style.color = '#EB001B';
            } else if (/^3[47]/.test(val)) {
                cardBrandIcon.className = 'fab fa-cc-amex card-brand-preview';
                cardBrandIcon.style.color = '#006FCF';
            } else {
                cardBrandIcon.className = 'far fa-credit-card card-brand-preview';
                cardBrandIcon.style.color = '#a0aec0';
            }
        });
    }

    // Card Expiry Formatting
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length >= 2) {
                e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
            } else {
                e.target.value = val;
            }
        });
    }

    // Crypto Vault Copy Button
    const copyVaultBtn = document.getElementById('copy-vault-btn');
    if (copyVaultBtn) {
        copyVaultBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
            copyVaultBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyVaultBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
            }, 2000);
        });
    }

    // Luhn Algorithm Card Validation
    function validateLuhn(cardNumber) {
        let clean = cardNumber.replace(/\D/g, '');
        if (clean.length < 13 || clean.length > 19) return false;

        let sum = 0;
        let shouldDouble = false;

        for (let i = clean.length - 1; i >= 0; i--) {
            let digit = parseInt(clean.charAt(i));
            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    }

    // Form Validation Execution
    const appForm = document.getElementById('application-form');
    if (appForm) {
        appForm.addEventListener('submit', (e) => {
            let isValid = true;

            const validateField = (id, errorId, condition) => {
                const input = document.getElementById(id);
                const parent = input ? input.closest('.form-group') : null;
                if (input && parent) {
                    if (!condition(input.value.trim())) {
                        parent.classList.add('has-error');
                        isValid = false;
                    } else {
                        parent.classList.remove('has-error');
                    }
                }
            };

            // Basic Fields
            validateField('appName', 'appName-error', val => val.length > 2);
            validateField('appGender', 'appGender-error', val => val.length > 0);
            validateField('appEmail', 'appEmail-error', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
            validateField('appAddress', 'appAddress-error', val => val.length > 5);
            validateField('propose-orderType', 'orderType-error', val => val !== "");

            // Active Payment Specifics Validation
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            if (selectedMethod === 'card') {
                validateField('cardHolder', 'cardHolder-error', val => val.length > 2);
                validateField('cardNumber', 'cardNumber-error', val => validateLuhn(val));
                validateField('cardExpiry', 'cardExpiry-error', val => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(val));
                validateField('cardCvc', 'cardCvc-error', val => /^[0-9]{3,4}$/.test(val));
            }

            if (!isValid) {
                e.preventDefault();
                const firstError = document.querySelector('.has-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // --- Chatbot Logic ---
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    function appendMessage(text, sender) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bubble ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (sendBtn && chatInput) {
        const handleChat = () => {
            const query = chatInput.value.trim();
            if (!query) return;
            appendMessage(query, 'user');
            chatInput.value = '';

            setTimeout(() => {
                appendMessage(`Thank you for reaching out regarding "${query}". An artist representative will follow up via your specified contact method shortly!`, 'ai');
            }, 600);
        };

        sendBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    // --- Preloader & Scroll Progress Extras ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    });

    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('scroll-progress');
        const backToTop = document.getElementById('backToTop');
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / totalHeight) * 100;

        if (scrollProgress) scrollProgress.style.width = `${scrolled}%`;
        if (backToTop) {
            backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
        }
    });

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Custom Cursor Movement
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });
    }
});
