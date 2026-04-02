// =====================
// ДАНІ
// =====================
const categories = [
    {
        id: "images",
        name: "Зображення",
        icon: "image-ico",
        apps: [
            { id: "compress-image", name: "Стиснення зображень", url: "/apps/compress-image", icon: "image-ico", popular: true },
            { id: "resize-image", name: "Зміна розміру", url: "/apps/resize-image", icon: "image-ico" },
            { id: "convert-image", name: "Конвертація формату", url: "/apps/convert-image", icon: "image-ico" }
        ]
    },
    {
        id: "video",
        name: "Відео",
        icon: "video-outline-ico",
        apps: [
            { id: "compress-video", name: "Стиснення відео", url: "/apps/compress-video", icon: "compress-video-outline-ico", popular: true },
            { id: "convert-video", name: "Конвертація відео", url: "/apps/convert-video", icon: "convert-video-outline-ico" }
        ]
    },
    {
        id: "audio",
        name: "Аудіо",
        icon: "audio-outline-ico",
        apps: [
            { id: "convert-audio", name: "Конвертація аудіо", url: "/apps/convert-audio", icon: "convert-audio-outline-ico", popular: true },
            { id: "trim-audio", name: "Обрізання аудіо", url: "/apps/trim-audio", icon: "trim-audio-outline-ico" }
        ]
    }
];

// =====================
// ІКОНКА
// =====================
function getIcon(icon, className = 'icon') {
    return `
        <svg class="${className}">
            <use href="assets/img/icons/icons.svg#${icon}"></use>
        </svg>
    `;
}

// =====================
// ВСЯ ЛОГІКА 🔥 (ОНОВЛЕНА ВЕРСІЯ)
// =====================
function initLinks() {
    // 👉 всі apps в один масив
    const allApps = categories.flatMap(cat =>
        cat.apps.map(app => ({
            ...app,
            category: cat.id,
            categoryName: cat.name,
            categoryIcon: cat.icon
        }))
    );

    // 👉 знаходимо ВСІ блоки на сторінці
    const blocks = document.querySelectorAll("[data-links]");

    blocks.forEach(block => {
        const type = block.dataset.links;
        const category = block.dataset.category;
        const current = block.dataset.current;

        let content = '';

        // =====================
        // ТИПИ ВИВОДУ
        // =====================

        if (type === "header" || type === "footer") {
            // Випадаючі категорії для шапки та футера
            content = categories.map(cat => `
                <div class="category-dropdown">
                    <div class="category-header">
                        ${getIcon(cat.icon, 'category-icon')}
                        <span class="category-name">${cat.name}</span>
                    </div>
                    <div class="category-content">
                        <div class="apps-grid">
                            ${cat.apps.map(app => `
                                <a href="${app.url}" class="app-link">
                                    ${getIcon(app.icon, 'app-icon')}
                                    <span class="app-name">${app.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        else if (type === "category") {
            // Простий список для конкретної категорії
            const list = allApps.filter(a => a.category === category);
            content = list.map(app => `
                <a href="${app.url}" class="app-link">
                    ${getIcon(app.icon, 'app-icon')}
                    <span class="app-name">${app.name}</span>
                </a>
            `).join('');
        }
        else if (type === "related") {
            // Пов'язані додатки
            const list = allApps.filter(a => a.category === category && a.id !== current);
            content = list.map(app => `
                <a href="${app.url}" class="app-link">
                    ${getIcon(app.icon, 'app-icon')}
                    <span class="app-name">${app.name}</span>
                </a>
            `).join('');
        }
        else if (type === "all") {
            // Всі додатки з групуванням по категоріях
            const groupedByCategory = {};
            
            // Групуємо додатки по категоріях
            allApps.forEach(app => {
                if (!groupedByCategory[app.category]) {
                    groupedByCategory[app.category] = [];
                }
                groupedByCategory[app.category].push(app);
            });

            // Створюємо контент з заголовками категорій
            content = Object.entries(groupedByCategory).map(([categoryId, apps]) => {
                const categoryInfo = categories.find(cat => cat.id === categoryId);
                return `
                    <div class="category-group">
                        <div class="category-title">
                            ${getIcon(categoryInfo.icon, 'category-icon')}
                            <h3>${categoryInfo.name}</h3>
                        </div>
                        <div class="apps-grid">
                            ${apps.map(app => `
                                <a href="${app.url}" class="app-link">
                                    ${getIcon(app.icon, 'app-icon')}
                                    <span class="app-name">${app.name}</span>
                                   
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        // =====================
        // РЕНДЕР
        // =====================
        block.innerHTML = content;

        // Додаємо обробник подій для випадаючих списків
        if (type === "header" || type === "footer") {
            const dropdowns = block.querySelectorAll('.category-header');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    const isOpen = content.classList.contains('open');
                    
                    // Закриваємо всі інші
                    block.querySelectorAll('.category-content').forEach(item => {
                        item.classList.remove('open');
                    });
                    block.querySelectorAll('.category-header').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Відкриваємо поточний, якщо був закритий
                    if (!isOpen) {
                        content.classList.add('open');
                        this.classList.add('active');
                    }
                });
            });
        }
    });
}


// Викликаємо функцію при завантаженні сторінки
document.addEventListener('DOMContentLoaded', initLinks);

// Додатково: можливість перезавантажити список
function reloadLinks() {
    initLinks();
}

// Експортуємо функції для глобального використання
window.initLinks = initLinks;
window.reloadLinks = reloadLinks;