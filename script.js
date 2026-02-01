document.addEventListener('DOMContentLoaded', () => {

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const body = document.querySelector('body');
    const menuTiles = document.querySelectorAll('.menu-item-tile');
    const sections = document.querySelectorAll('.section');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Burger menu functionality
    const navSlide = () => {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            body.classList.toggle('body-lock');
        });
    }
    navSlide();

    // Close menu function
    const closeMenu = () => {
        if (nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            body.classList.remove('body-lock');
        }
    }

    // Smooth scroll for links and menu tiles
    const smoothScroll = (targetElement) => {
        closeMenu();
        setTimeout(() => {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }

    // Handle menu tile clicks
    menuTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScroll(targetElement);
            }
        });
    });

    // Smooth scroll for other links
    const smoothScrollLinks = document.querySelectorAll('a.smooth-scroll');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScroll(targetElement);
            }
        });
    });

    // Scroll to top button functionality
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // Animate sections and handle active menu item on scroll
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }

            const id = entry.target.getAttribute('id');
            const menuItem = document.querySelector(`.menu-item-tile[data-target="#${id}"]`);

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                menuTiles.forEach(tile => tile.classList.remove('active'));
                if (menuItem) {
                    menuItem.classList.add('active');
                }
            }
        });
    }, {
        threshold: [0.1, 0.5]
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });


    // --- Contact Form Submission with Formspree ---
    const contactForm = document.getElementById('contact-form');
    const notification = document.getElementById('custom-notification');
    let notificationTimer;

    const showNotification = (message, iconClass, isError = false) => {
        const p = notification.querySelector('p');
        const icon = notification.querySelector('i');

        p.textContent = message;
        icon.className = `fas ${iconClass} notification-icon`;

        notification.style.borderColor = isError ? '#e53e3e' : 'var(--accent-secondary)';
        icon.style.color = isError ? '#e53e3e' : 'var(--accent-secondary)';

        notification.classList.add('show');

        clearTimeout(notificationTimer);
        notificationTimer = setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    };

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        const formData = new FormData(this);

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Спасибо! Ваша заявка принята.', 'fa-check-circle');
                this.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    const errorMessage = data["errors"].map(error => error["message"]).join(", ");
                    throw new Error(errorMessage);
                } else {
                    throw new Error('Ошибка сервера. Попробуйте позже.');
                }
            }
        } catch (error) {
            showNotification(error.message || 'Сетевая ошибка. Проверьте подключение.', 'fa-exclamation-triangle', true);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить заявку';
        }
    });

    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter');
    const words = ["цифровой код", "эффективные решения", "удобных ботов"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const typeSpeed = isDeleting ? 75 : 150;

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typewriterElement.textContent = currentWord.substring(0, charIndex);

        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(type, typeSpeed);
    }

    type();

});