// =====================
// УТИЛІТНІ ФУНКЦІЇ ДЛЯ ОПТИМІЗАЦІЇ
// =====================

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =====================
// ОСНОВНИЙ КОД
// =====================

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');

    const loadPromises = [];

    if (header) {
        loadPromises.push(
            fetch('templates/header.html')
                .then(r => r.text())
                .then(h => {
                    header.innerHTML = h;
                    initHeader();
                    initHeaderScroll();
                })
        );
    }
    
    if (footer) {
        loadPromises.push(
            fetch('templates/footer.html')
                .then(r => r.text())
                .then(f => {
                    footer.innerHTML = f;
                })
        );
    }

    // Ініціалізуємо посилання після завантаження всіх шаблонів
    Promise.all(loadPromises).then(() => {
        initLinks();
    });
});

function initHeaderScroll() {
    const siteHeader = document.querySelector('.site-header');
    
    if (siteHeader) {
        // Оптимізований скролл з тротлінгом
        const handleScroll = throttle(() => {
            siteHeader.classList.toggle('scrolled', window.scrollY > 72);
        }, 16); // ~60fps
        
        window.addEventListener('scroll', handleScroll);
        
        // Початковий стан
        siteHeader.classList.toggle('scrolled', window.scrollY > 50);
    }
}

function initHeader() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const updateIcon = (theme) => {
            const icon = themeBtn.querySelector('.icon');
            if (icon) {
                icon.querySelector('use').setAttribute('href', 
                    `assets/img/icons/icons.svg#${theme === 'dark' ? 'sun-ico' : 'moon-ico'}`);
            }
        };
        
        themeBtn.onclick = () => {
            const html = document.documentElement;
            const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateIcon(theme);
        };
        
        const saved = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', saved);
        updateIcon(saved);
    }
    
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    if (menuBtn && nav) {
        menuBtn.onclick = () => {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        };
    }
    
    const appsToggle = document.getElementById('appsToggle');
    const appsDropdown = document.getElementById('appsDropdown');

    if (appsToggle && appsDropdown) {
        appsToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            appsDropdown.classList.toggle('open');
            
            const arrow = this.querySelector('.dropdown-arrow-header-link');
            if (arrow) {
                arrow.classList.toggle('active');
            }
        });
        
        document.addEventListener('click', function(e) {
            if (appsDropdown.classList.contains('open') && 
                !appsDropdown.contains(e.target) && 
                e.target !== appsToggle) {
                appsDropdown.classList.remove('open');
                
                const arrow = appsToggle.querySelector('.dropdown-arrow-header-link');
                if (arrow) {
                    arrow.classList.remove('active');
                }
            }
        });
        
        appsDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}


/* -------------------------------------------------
   Footer‑Apps “Застосунки” – автопідключення
   (ставте в кінець вашого скрипту)
--------------------------------------------------- */
(() => {
    // ------- 1️⃣ Селектори, які вже є у вашій розмітці -------
    const BTN_SELECTOR  = '.footer-menu-item:nth-child(2) .footer-menu-link';
    const MENU_SELECTOR = '.footer-apps-section';

    // ------- 2️⃣ Під’єднуємо обробники -------
    const attachHandler = (button, menu) => {
        if (!button || !menu) return;

        // уникаємо дублювання підключення
        if (button.__footerAppsHandlerAttached) return;
        button.__footerAppsHandlerAttached = true;

        /* ---------- 1. Клік по всій сторінці (capture) ----------
           capture = true → обробник працює *до* stopPropagation() у шапці   */
        document.addEventListener('click', (e) => {
            const clickOnButton = button === e.target || button.contains(e.target);
            const menuIsOpen    = menu.classList.contains('active');

            if (clickOnButton) {            // клік саме по кнопці «Застосунки»
                e.preventDefault();         // блокуємо перехід за <a>
                menu.classList.toggle('active');
                button.classList.toggle('active-button');
            } else if (menuIsOpen && !menu.contains(e.target)) {
                // клік поза меню – закрити
                menu.classList.remove('active');
                button.classList.remove('active-button');
            }
        }, true); // <-- **ОСЬ ВАЖЛИВО: capture‑фаза**

        /* ---------- 2. Клік всередині меню ----------
           Зупиняємо «прокидання» далі, інакше потрапляло б у
           документ‑слухач (хоча в нашому випадку capture вже спрацював). */
        menu.addEventListener('click', (e) => e.stopPropagation());
    };

    // ------- 3️⃣ Пошук елементів одразу (може вже бути в DOM) -------
    const buttonNow = document.querySelector(BTN_SELECTOR);
    const menuNow   = document.querySelector(MENU_SELECTOR);

    if (buttonNow && menuNow) {
        attachHandler(buttonNow, menuNow);
    } else {
        // ------- 4️⃣ Якщо футер підвантажується динамічно – чекаємо -------
        const observer = new MutationObserver(() => {
            const btn = document.querySelector(BTN_SELECTOR);
            const mnu = document.querySelector(MENU_SELECTOR);
            if (btn && mnu) {
                attachHandler(btn, mnu);
                observer.disconnect(); // більше не потрібно спостерігати
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
