// =====================
// ПОЛІПШЕНА ВЕРСІЯ ДЛЯ АСИНХРОННОЇ РОБОТИ
// =====================

// Завантаження шапки та футера
document.addEventListener('DOMContentLoaded', () => {
    // Завантаження шапки
    const header = document.getElementById('header');
    if (header) {
        fetch('templates/header.html')
            .then(r => r.text())
            .then(h => {
                header.innerHTML = h;
                initHeader();
                // Після завантаження шапки ініціалізуємо посилання
                initLinks();
            });
    }
    
    // Завантаження футера
    const footer = document.getElementById('footer');
    if (footer) {
        fetch('templates/footer.html')
            .then(r => r.text())
            .then(f => {
                footer.innerHTML = f;
                // Після завантаження футера ініціалізуємо посилання
                initLinks();
            });
    }
});

// Ініціалізація шапки
function initHeader() {
    
    // Кнопка теми
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        // Функція для оновлення іконки
        const updateIcon = (theme) => {
            const icon = themeBtn.querySelector('.icon');
            if (icon) {
                // Змінюємо символ в href
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
        
        // Завантаження теми
        const saved = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', saved);
        updateIcon(saved);
    }
    
    // Кнопка мобільного меню
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    if (menuBtn && nav) {
        menuBtn.onclick = () => {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        };
    }
    
    // Додайте цей код до вашої функції initHeader() або окремо

// Кнопка застосунків
const appsToggle = document.getElementById('appsToggle');
const appsDropdown = document.getElementById('appsDropdown');

if (appsToggle && appsDropdown) {
    appsToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Запобігаємо спливанню події
        
        // Перемикаємо клас open
        appsDropdown.classList.toggle('open');
        
        // Додаємо/видаляємо клас active для стрілки
        const arrow = this.querySelector('.dropdown-arrow-header-link');
        if (arrow) {
            arrow.classList.toggle('active');
        }
        
        console.log('Меню застосунків переключено! Стан:', appsDropdown.classList.contains('open') ? 'відкрито' : 'закрито');
    });
    
    // Закриття меню при кліку поза ним
    document.addEventListener('click', function(e) {
        if (appsDropdown.classList.contains('open') && 
            !appsDropdown.contains(e.target) && 
            e.target !== appsToggle) {
            appsDropdown.classList.remove('open');
            
            // Видаляємо клас active з стрілки
            const arrow = appsToggle.querySelector('.dropdown-arrow-header-link');
            if (arrow) {
                arrow.classList.remove('active');
            }
            
            console.log('Меню застосунків закрито (клік поза меню)');
        }
    });
    
    // Запобігаємо закриттю при кліку всередині меню
    appsDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}



    
}