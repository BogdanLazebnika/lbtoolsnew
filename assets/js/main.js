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
