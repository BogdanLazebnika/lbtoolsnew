/*====================================================================
  ======================   ДАНІ   ======================
====================================================================*/
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

/*====================================================================
  ======================   ІКОНИ   ======================
====================================================================*/
function getIcon(icon, className = 'icon') {
    return `
        <svg class="${className}">
            <use href="assets/img/icons/icons.svg#${icon}"></use>
        </svg>
    `;
}

/*====================================================================
  ======================   ОСНОВНИЙ ФУНКЦІОНАЛ   ======================
====================================================================*/

/**
 * Рендер усіх блоків, позначених атрибутом data-links.
 * Після кожного рендеру автоматично підключаються
 * "аккордеон"-слухачі для header/footer.
 */
function initLinks() {
    /* 1️⃣ Підготовка масиву всіх додатків (для типів category/related/all) */
    const allApps = categories.flatMap(cat =>
        cat.apps.map(app => ({
            ...app,
            category: cat.id,
            categoryName: cat.name,
            categoryIcon: cat.icon
        }))
    );

    /* 2️⃣ Знаходимо всі блоки, які потрібно заповнити */
    const blocks = document.querySelectorAll("[data-links]");

    blocks.forEach(block => {
        const type      = block.dataset.links;   // header | footer | category | related | all
        const category  = block.dataset.category; // використовується в типі “category”
        const current   = block.dataset.current; // використовується в типі “related”

        let html = '';

        /* -------------------------------------------------
           3️⃣ Формуємо HTML‑контент у залежності від type
           ------------------------------------------------- */
        if (type === "header") {
            // ---------- Header (випадаюча шапка) ----------
            html = categories.map(cat => `
                <div class="category-dropdown-header">
                    <div class="category category-header">
                        ${getIcon(cat.icon, 'category-icon category-icon-header')}
                        <span class="category-name category-name-header">${cat.name}</span>
                        <span class="category-name-arrow category-name-arrow-header">▼</span>
                    </div>
                    <div class="category-content category-content-header">
                        <div class="apps-grid apps-grid-header">
                            ${cat.apps.map(app => `
                                <a href="${app.url}" class="app-link app-link-header">
                                    ${getIcon(app.icon, 'app-icon app-icon-header')}
                                    <span class="app-name app-name-header">${app.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        else if (type === "footer") {
            // ---------- Footer (випадаюча підвал) ----------
            html = categories.map(cat => `
                <div class="category-dropdown category-dropdown-footer">
                    <div class="category category-footer">
                        ${getIcon(cat.icon, 'category-icon category-icon-footer')}
                        <span class="category-name category-name-footer">${cat.name}</span>
                        <span class="category-name-arrow category-name-arrow-footer">▼</span>
                    </div>
                    <div class="category-content category-content-footer">
                        <div class="apps-grid apps-grid-footer">
                            ${cat.apps.map(app => `
                                <a href="${app.url}" class="app-link app-link-footer">
                                    ${getIcon(app.icon, 'app-icon app-icon-footer')}
                                    <span class="app-name app-name-footer">${app.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        else if (type === "category") {
            // ---------- Окремий список однієї категорії ----------
            const list = allApps.filter(a => a.category === category);
            html = list.map(app => `
                <a href="${app.url}" class="app-link">
                    ${getIcon(app.icon, 'app-icon')}
                    <span class="app-name">${app.name}</span>
                </a>
            `).join('');
        }
        else if (type === "related") {
            // ---------- Схожі додатки ----------
            const list = allApps.filter(a => a.category === category && a.id !== current);
            html = list.map(app => `
                <a href="${app.url}" class="app-link">
                    ${getIcon(app.icon, 'app-icon')}
                    <span class="app-name">${app.name}</span>
                </a>
            `).join('');
        }
        else if (type === "all") {
            // ---------- Всі додатки, згруповані по категоріях ----------
            const grouped = {};

            allApps.forEach(app => {
                if (!grouped[app.category]) grouped[app.category] = [];
                grouped[app.category].push(app);
            });

            html = Object.entries(grouped).map(([catId, apps]) => {
                const catInfo = categories.find(c => c.id === catId);
                return `
                    <div class="category-group">
                        <div class="category-title">
                            ${getIcon(catInfo.icon, 'category-icon')}
                            <h3>${catInfo.name}</h3>
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

        /* -------------------------------------------------
           4️⃣ Вставляємо сформований HTML у контейнер
           ------------------------------------------------- */
        block.innerHTML = html;

        /* -------------------------------------------------
           5️⃣ Підключаємо логіку «аккордеону» для header/footer
           ------------------------------------------------- */
        if (type === "header" || type === "footer") {
            setupDropdowns(block, type);
        }
    });
}

/**
 * Підключає слухачі до всіх .category‑header чи .category‑footer
 * у переданому контейнері.
 *
 * @param {Element} container  – блок, в якому здійснюємо пошук (data‑links)
 * @param {string}  type      – "header" або "footer"
 */
function setupDropdowns(container, type) {
    const isHeader = type === "header";

    // Які саме класи шукаємо у цьому типі
    const triggerClass    = isHeader ? ".category-header"       : ".category-footer";
    const contentClass    = isHeader ? ".category-content-header" : ".category-content-footer";
    const activeClass     = "active";   // однаковий для обох типів
    const openClass      = "open";

    // Всі «заголовки» випадаючих блоків
    const triggers = container.querySelectorAll(triggerClass);

    triggers.forEach(trigger => {
        const content = trigger.nextElementSibling; // .category-content‑…

        if (!content) return; // безпечний захист

        // Клік по заголовку – відкриття/закриття
        trigger.addEventListener('click', (e) => {
            const alreadyOpen = content.classList.contains(openClass);

            // 1️⃣ Закриваємо всі інші в цьому ж контейнері
            container.querySelectorAll(contentClass).forEach(el => el.classList.remove(openClass));
            container.querySelectorAll(triggerClass).forEach(el => el.classList.remove(activeClass));

            // 2️⃣ Якщо поточний був закрите – відкриваємо
            if (!alreadyOpen) {
                content.classList.add(openClass);
                trigger.classList.add(activeClass);
            }
        });

        // 3️⃣ Клік всередині контенту НЕ має «прокидатися» до document
        //    (інакше випадає «закриття всіх»). Тому зупиняємо підйом.
        content.addEventListener('click', e => e.stopPropagation());
    });
}

/*====================================================================
  ======================   ІНІЦІАЛІЗАЦІЯ   ======================
====================================================================*/
document.addEventListener('DOMContentLoaded', initLinks);

/* ==============================================================
   Додаткова можливість «перезавантажити» блоки
   (використовується, коли підвантажуються нові шаблони)
   ============================================================== */
function reloadLinks() {
    initLinks();
}

/* --------------------------------------------------------------
   Експорт в global scope – потрібен, якщо ви викликаєте
   initLinks() з інших скриптів (наприклад, після fetch‑шаблону)
   -------------------------------------------------------------- */
window.initLinks   = initLinks;
window.reloadLinks = reloadLinks;
