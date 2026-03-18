// Простий скрипт для завантаження шапки та футера
document.addEventListener('DOMContentLoaded', function() {
    // Завантажуємо шапку
    loadHeader();
    
    // Завантажуємо футер
    loadFooter();
});

// Функція для завантаження шапки
function loadHeader() {
    const headerElement = document.getElementById('header');
    if (!headerElement) {
        console.warn('Елемент з id="header" не знайдено на сторінці');
        return;
    }
    
    fetch('templates/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            headerElement.innerHTML = html;
            // Після завантаження шапки ініціалізуємо функціонал
            initializeHeaderFunctionality();
            
            // Ініціалізуємо меню застосунків після завантаження шапки
            if (typeof AppsRenderer !== 'undefined') {
                setTimeout(() => {
                    AppsRenderer.createHeaderMenu();
                }, 50); // Невелика затримка для гарантії рендерингу
            }
        })
        .catch(error => {
            console.error('Помилка завантаження шапки:', error);
            // Створюємо резервну шапку
            createFallbackHeader(headerElement);
        });
}

// Функція для завантаження футера
function loadFooter() {
    const footerElement = document.getElementById('footer');
    if (!footerElement) {
        console.warn('Елемент з id="footer" не знайдено на сторінці');
        return;
    }
    
    fetch('templates/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            footerElement.innerHTML = html;
            
            // Ініціалізуємо футер з категоріями
            if (typeof AppsRenderer !== 'undefined') {
                setTimeout(() => {
                    AppsRenderer.createFooterCategories();
                }, 50);
            }
        })
        .catch(error => {
            console.error('Помилка завантаження футера:', error);
            // Створюємо резервний футер
            createFallbackFooter(footerElement);
        });
}

// Резервна шапка на випадок помилки завантаження
function createFallbackHeader(container) {
    const fallbackHTML = `
        <div class="header-container">
            <div class="logo">
                <a href="index.html">LB Tools</a>
            </div>
            
            <nav class="main-nav">
                <ul class="nav-list">
                    <li><a href="index.html">Головна</a></li>
                    <li><a href="services.html">Застосунки</a></li>
                    <li><a href="about.html">Про нас</a></li>
                    <li><a href="contact.html">Контакти</a></li>
                </ul>
            </nav>
            
            <button class="theme-toggle" id="themeToggle" aria-label="Перемкнути тему">
                <span class="theme-icon">🌙</span>
            </button>
            
            <button class="mobile-menu-btn">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    `;
    
    container.innerHTML = fallbackHTML;
    initializeHeaderFunctionality();
}

// Резервний футер на випадок помилки завантаження
function createFallbackFooter(container) {
    container.innerHTML = `
        <div class="footer-content">
            <p>&copy; ${new Date().getFullYear()} LB Tools. Всі права захищені.</p>
        </div>
    `;
}

// Логіка Шапки
function initializeHeaderFunctionality() {
    // Перемикання теми з анімацією
    setupThemeToggle();
    
    // Мобільне меню
    setupMobileMenu();
    
    // Ефект при скролі
    setupScrollEffect();
    
    // Активний пункт меню
    highlightActiveMenu();
    
    // Налаштування десктопного меню при ховері
    setupDesktopMenuHover();
    
    // Додаємо обробник для закриття меню при переході по посиланню
    setupMenuCloseOnClick();
}

// Налаштування перемикання теми
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.warn('Кнопка перемикання теми не знайдена');
        return;
    }
    
    // Відключаємо подвійний клік
    let isThemeChanging = false;
    
    themeToggle.addEventListener('click', () => {
        if (isThemeChanging) return;
        isThemeChanging = true;
        
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Додаємо анімацію
        themeToggle.classList.add('switching', 'pulse');
        
        // Змінюємо тему після затримки для анімації
        setTimeout(() => {
            htmlElement.setAttribute('data-theme', newTheme);
            
            const themeIcon = themeToggle.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            }
            
            // Збереження в localStorage
            try {
                localStorage.setItem('theme', newTheme);
            } catch (e) {
                console.warn('Не вдалося зберегти тему в localStorage:', e);
            }
            
            // Видаляємо класи анімації
            setTimeout(() => {
                themeToggle.classList.remove('switching', 'pulse');
                isThemeChanging = false;
            }, 600);
        }, 150);
    });

    // Завантаження теми з localStorage
    const savedTheme = getSavedTheme();
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    } else {
        // Встановлюємо тему за замовчуванням на основі системних налаштувань
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', defaultTheme);
        if (themeIcon) {
            themeIcon.textContent = defaultTheme === 'dark' ? '☀️' : '🌙';
        }
    }
}

// Отримання збереженої теми з обробкою помилок
function getSavedTheme() {
    try {
        return localStorage.getItem('theme');
    } catch (e) {
        console.warn('Не вдалося отримати тему з localStorage:', e);
        return null;
    }
}

// Налаштування мобільного меню
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    if (!mobileMenuBtn || !mainNav) {
        console.warn('Елементи мобільного меню не знайдені');
        return;
    }
    
    // Створюємо окремий оверлей для кліків
    let overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
    }
    
    // Функція для закриття меню
    const closeMenu = () => {
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('active');
        body.classList.remove('menu-open');
        overlay.classList.remove('active');
        
        // Закриваємо всі відкриті підменю
        closeAllSubmenus();
        
        // Відновлюємо позицію скролу
        const scrollY = Math.abs(parseInt(body.style.top || '0'));
        body.style.top = '';
        body.style.position = '';
        body.style.width = '';
        
        if (scrollY) {
            window.scrollTo(0, scrollY);
        }
    };
    
    // Функція для закриття всіх підменю
    const closeAllSubmenus = () => {
        // Закриваємо меню застосунків
        const dropdown = document.querySelector('.dropdown-menu');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
        
        // Закриваємо всі списки застосунків
        document.querySelectorAll('.apps-list, .mobile-apps-list').forEach(list => {
            list.classList.remove('show');
        });
        
        // Закриваємо всі заголовки категорій
        document.querySelectorAll('.category-header, .mobile-category-header').forEach(header => {
            header.classList.remove('active');
        });
    };
    
    // Функція для відкриття меню
    const openMenu = () => {
        mobileMenuBtn.classList.add('active');
        mainNav.classList.add('active');
        body.classList.add('menu-open');
        overlay.classList.add('active');
        
        // Запам'ятовуємо позицію скролу
        const scrollY = window.scrollY;
        body.style.top = `-${scrollY}px`;
        body.style.position = 'fixed';
        body.style.width = '100%';
    };
    
    // Відкриття/закриття меню по кнопці
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = mobileMenuBtn.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Закриття меню при кліку на оверлей
    overlay.addEventListener('click', closeMenu);
    
    // Закриття меню при натисканні клавіші ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuBtn.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Закриття меню при зміні розміру вікна (якщо перейшли на десктоп)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 767 && mobileMenuBtn.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
    
    // Запобігання кліку на меню при кліку всередині нього
    mainNav.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Закриття меню при кліку на посилання всередині меню
    setupMenuCloseOnClick();
}

// Налаштування ефекту скролу
function setupScrollEffect() {
    let scrollTimer;
    
    window.addEventListener('scroll', () => {
        const siteHeader = document.querySelector('.site-header') || 
                          document.querySelector('.header-container');
        
        if (!siteHeader) return;
        
        // Додаємо debounce для оптимізації
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }, 10);
    });
}

// Підсвічування активного пункту меню
function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    if (navLinks.length === 0) return;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Нормалізуємо шляхи
        const linkPage = href === 'index.html' ? 'index.html' : href;
        const normalizedCurrentPage = currentPage === '' ? 'index.html' : currentPage;
        
        // Перевіряємо чи посилання відповідає поточній сторінці
        if (linkPage === normalizedCurrentPage) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

// Налаштування десктопного меню при ховері
function setupDesktopMenuHover() {
    const appsMenuItem = document.querySelector('.nav-list li.has-dropdown');
    
    if (!appsMenuItem) return;
    
    let hoverTimer;
    
    appsMenuItem.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        const dropdown = appsMenuItem.querySelector('.dropdown-menu');
        if (dropdown) {
            dropdown.classList.add('show');
        }
    });
    
    appsMenuItem.addEventListener('mouseleave', () => {
        const dropdown = appsMenuItem.querySelector('.dropdown-menu');
        if (dropdown) {
            hoverTimer = setTimeout(() => {
                dropdown.classList.remove('show');
                closeAllSubmenusInDropdown(dropdown);
            }, 300); // Невелика затримка для плавного переходу
        }
    });
    
    // Запобігаємо закриттю при наведенні на дропдаун
    const dropdown = appsMenuItem.querySelector('.dropdown-menu');
    if (dropdown) {
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimer);
        });
        
        dropdown.addEventListener('mouseleave', () => {
            hoverTimer = setTimeout(() => {
                dropdown.classList.remove('show');
                closeAllSubmenusInDropdown(dropdown);
            }, 300);
        });
    }
}

// Закриття всіх підменю в дропдауні
function closeAllSubmenusInDropdown(dropdown) {
    dropdown.querySelectorAll('.apps-list').forEach(list => {
        list.classList.remove('show');
    });
    
    dropdown.querySelectorAll('.category-header').forEach(header => {
        header.classList.remove('active');
    });
}

// Закриття меню при кліку на посилання
function setupMenuCloseOnClick() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                // Невелика затримка для плавного переходу
                setTimeout(() => {
                    const overlay = document.querySelector('.mobile-menu-overlay');
                    if (overlay) overlay.click();
                }, 100);
            }
        }
    });
}

// Експортуємо функції для глобального використання
window.HeaderManager = {
    loadHeader,
    loadFooter,
    initializeHeaderFunctionality,
    setupThemeToggle,
    setupMobileMenu,
    highlightActiveMenu
};

// Автоматична ініціалізація при завантаженні сторінки
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Перевіряємо чи шапка вже завантажена
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            initializeHeaderFunctionality();
        }
    });
} else {
    // Якщо DOM вже завантажений
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
        initializeHeaderFunctionality();
    }
}

// Додаємо обробник для зміни орієнтації екрану
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
            const overlay = document.querySelector('.mobile-menu-overlay');
            if (overlay) overlay.click();
        }
    }, 300);
});
