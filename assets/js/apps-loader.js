/*====================================================================
  1️⃣  ДАНІ ПРО ЗАСТОСУНКИ
====================================================================*/
const APPS_DATA = [
  {
    id: "image-converter",
    name: "Конвертер зображень",
    category: "Зображення",
    subcategory: "Конвертація",
    url: "image-converter.html",
    icon: "compress-pdf-outline-ico",
    description: "Конвертуйте зображення між форматами JPG, PNG, WebP, GIF"
  },
  {
    id: "image-resizer",
    name: "Зміна розміру зображень",
    category: "Зображення",
    subcategory: "Редагування",
    url: "image-resizer.html",
    icon: "file-dock",
    description: "Змініть розмір зображення без втрати якості"
  },
  {
    id: "image-compressor",
    name: "Стиснення зображень",
    category: "Зображення",
    subcategory: "Оптимізація",
    url: "image-compressor.html",
    icon: "compress-image-outline-ico",
    description: "Стисніть зображення для веб‑сайтів та соцмереж"
  },
  {
    id: "image-watermark",
    name: "Додавання водяних знаків",
    category: "Зображення",
    subcategory: "Захист",
    url: "image-watermark.html",
    icon: "watermark-outline-ico",
    description: "Додайте водяні знаки до ваших зображень"
  },
  {
    id: "video-converter",
    name: "Конвертер відео",
    category: "Відео",
    subcategory: "Конвертація",
    url: "video-converter.html",
    icon: "convert-video-outline-ico",
    description: "Конвертуйте відео між MP4, AVI, MOV, MKV форматами"
  },
  {
    id: "video-cutter",
    name: "Обрізка відео",
    category: "Відео",
    subcategory: "Редагування",
    url: "video-cutter.html",
    icon: "cut-video-outline-ico",
    description: "Обріжте відео та видаліть зайві частини"
  },
  {
    id: "video-compressor",
    name: "Стиснення відео",
    category: "Відео",
    subcategory: "Оптимізація",
    url: "video-compressor.html",
    icon: "compress-video-outline-ico",
    description: "Зменшіть розмір відеофайлів"
  },
  {
    id: "pdf-merger",
    name: "Об'єднання PDF",
    category: "Документи",
    subcategory: "Обробка",
    url: "pdf-merger.html",
    icon: "merge-pdf-outline-ico",
    description: "Об'єднайте кілька PDF файлів в один"
  },
  {
    id: "pdf-splitter",
    name: "Розділення PDF",
    category: "Документи",
    subcategory: "Обробка",
    url: "pdf-splitter.html",
    icon: "split-pdf-outline-ico",
    description: "Розділіть PDF файл на окремі сторінки"
  },
  {
    id: "pdf-to-word",
    name: "PDF в Word",
    category: "Документи",
    subcategory: "Конвертація",
    url: "pdf-to-word.html",
    icon: "pdf-to-word-outline-ico",
    description: "Конвертуйте PDF файли в формат Word"
  },
  {
    id: "audio-converter",
    name: "Конвертер аудіо",
    category: "Аудіо",
    subcategory: "Конвертація",
    url: "audio-converter.html",
    icon: "convert-audio-outline-ico",
    description: "Конвертуйте MP3, WAV, FLAC, AAC формати"
  },
  {
    id: "audio-cutter",
    name: "Обрізка аудіо",
    category: "Аудіо",
    subcategory: "Редагування",
    url: "audio-cutter.html",
    icon: "cut-audio-outline-ico",
    description: "Обріжте аудіофайли та створіть рингтони"
  },
  {
    id: "file-compressor",
    name: "Архіватор файлів",
    category: "Файли",
    subcategory: "Архівація",
    url: "file-compressor.html",
    icon: "compress-file-outline-ico",
    description: "Стискайте файли в ZIP, RAR формати"
  },
  {
    id: "file-converter",
    name: "Універсальний конвертер",
    category: "Файли",
    subcategory: "Конвертація",
    url: "file-converter.html",
    icon: "convert-file-outline-ico",
    description: "Конвертуйте будь-які типи файлів"
  }
];

/*====================================================================
  2️⃣  КЛАС ДЛЯ РОБОТИ З ДАНИМИ
====================================================================*/
const AppsLoader = {
  getAllApps() { return APPS_DATA; },

  getAppsByCategory(category) {
    return APPS_DATA.filter(app => app.category === category);
  },

  getAppsByCategoryAndSubcategory(category, subcategory) {
    return APPS_DATA.filter(app => app.category === category && app.subcategory === subcategory);
  },

  getCategories() {
    return [...new Set(APPS_DATA.map(app => app.category))];
  },

  getSubcategories(category) {
    return [...new Set(
      APPS_DATA.filter(app => app.category === category)
               .map(app => app.subcategory)
    )];
  },

  getGroupedApps() {
    return APPS_DATA.reduce((acc, app) => {
      acc[app.category] ??= {};
      acc[app.category][app.subcategory] ??= [];
      acc[app.category][app.subcategory].push(app);
      return acc;
    }, {});
  },

  getAppById(id)   { return APPS_DATA.find(app => app.id === id); },
  getAppByUrl(url) { return APPS_DATA.find(app => app.url === url); }
};

/*====================================================================
  3️⃣  ДОПОМОГА ДЛЯ РЕНДЕРИНГУ SVG‑ІКОНОК
====================================================================*/
const IconRenderer = {
  /**
   * Повертає готовий DOM‑елемент <svg> → <use>.
   * Далі його просто додаємо в потрібний контейнер.
   */
  createSVGIcon(iconName, className = 'icon') {
    const SVG_NS   = 'http://www.w3.org/2000/svg';
    const XLINK_NS = 'http://www.w3.org/1999/xlink';
    const href     = `assets/img/icons/icons.svg#${iconName}`;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', className);
    svg.setAttribute('aria-hidden', 'true');

    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', href);
    use.setAttributeNS(XLINK_NS, 'xlink:href', href);

    svg.appendChild(use);
    return svg;
  },

  /** Якщо треба саме рядок HTML (не використовується у нашому коді) */
  createSVGIconHTML(iconName, className = 'icon') {
    const href = `assets/img/icons/icons.svg#${iconName}`;
    return `<svg class="${className}" aria-hidden="true">
              <use href="${href}" xlink:href="${href}"></use>
            </svg>`;
  }
};

/*====================================================================
  4️⃣  UI‑РЕНДЕРЕР
====================================================================*/
const AppsRenderer = {
  /*------------------------------------------------------------------
   4.1  Хедер‑меню (випадаюче)
  ------------------------------------------------------------------*/
  createHeaderMenu(rootClass = 'apps-menu') {
    const categories = AppsLoader.getCategories();
    const root = document.querySelector(`.${rootClass}`);
    if (!root) return;

    root.classList.add('has-dropdown');

    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';

    categories.forEach(cat => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'category-item';

      /*--- заголовок категорії (без іконки) ------------------------*/
      const header = document.createElement('div');
      header.className = 'category-header';
      header.innerHTML = `
        <span class="category-name">${cat}</span>
        <span class="dropdown-arrow">▼</span>
      `;

      /*--- список застосунків -------------------------------------*/
      const appsList = document.createElement('div');
      appsList.className = 'apps-list';

      AppsLoader.getAppsByCategory(cat).forEach(app => {
        const link = document.createElement('a');
        link.href = app.url;
        link.className = 'app-link';

        const iconContainer = document.createElement('span');
        iconContainer.className = 'app-icon-container';
        iconContainer.appendChild(
          IconRenderer.createSVGIcon(app.icon, 'app-icon')
        );

        const name = document.createElement('span');
        name.className = 'app-name';
        name.textContent = app.name;

        const desc = document.createElement('span');
        desc.className = 'app-description';
        desc.textContent = app.description;

        link.append(iconContainer, name, desc);
        appsList.appendChild(link);
      });

      categoryItem.append(header, appsList);
      dropdown.appendChild(categoryItem);
    });

    root.appendChild(dropdown);
    this._initDropdownHandlers();
  },

  /*------------------------------------------------------------------
   4.2  Обробники випадаючих списків
  ------------------------------------------------------------------*/
  _initDropdownHandlers() {
    const headers = document.querySelectorAll('.category-header');

    headers.forEach(header => {
      header.addEventListener('click', () => {
        const list = header.nextElementSibling; // .apps-list
        const isOpen = list.classList.toggle('show');
        header.classList.toggle('active', isOpen);

        // Закриваємо решту
        headers.forEach(other => {
          if (other !== header) {
            const otherList = other.nextElementSibling;
            otherList.classList.remove('show');
            other.classList.remove('active');
          }
        });
      });
    });
  },

  /*------------------------------------------------------------------
   4.3  Сторінка конкретної категорії (category.html?cat=…)
  ------------------------------------------------------------------*/
  createCategoryPage() {
    const params   = new URLSearchParams(window.location.search);
    const category = params.get('cat');
    if (!category) return;

    const titleEl   = document.getElementById('category-title');
    const wrapper   = document.getElementById('category-apps');
    if (!wrapper) return;

    if (titleEl) titleEl.textContent = category;

    const apps = AppsLoader.getAppsByCategory(category);
    if (!apps.length) {
      wrapper.innerHTML = `<p>У цій категорії ще немає застосунків.</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    apps.forEach(app => {
      const card = document.createElement('div');
      card.className = 'category-app-card';

      /*--- хедер (іконка + підкатегорія) ---------------------------*/
      const header = document.createElement('div');
      header.className = 'app-card-header';

      const iconWrap = document.createElement('div');
      iconWrap.className = 'app-card-icon';
      iconWrap.appendChild(
        IconRenderer.createSVGIcon(app.icon, 'app-card-svg-icon')
      );

      const subcat = document.createElement('div');
      subcat.className = 'app-card-subcategory';
      subcat.textContent = app.subcategory;

      header.append(iconWrap, subcat);

      /*--- тіло (назва + опис) ------------------------------------*/
      const body = document.createElement('div');
      body.className = 'app-card-body';

      const h3 = document.createElement('h3');
      h3.className = 'app-card-title';
      h3.innerHTML = `<a href="${app.url}">${app.name}</a>`;

      const p = document.createElement('p');
      p.className = 'app-card-description';
      p.textContent = app.description;

      body.append(h3, p);

      /*--- футер (кнопка) ----------------------------------------*/
      const footer = document.createElement('div');
      footer.className = 'app-card-footer';
      footer.innerHTML = `<a href="${app.url}" class="app-card-btn">Відкрити застосунок</a>`;

      /*--- збираємо картку ---------------------------------------*/
      card.append(header, body, footer);
      fragment.appendChild(card);
    });

    wrapper.innerHTML = '';
    wrapper.appendChild(fragment);
  },

  /*------------------------------------------------------------------
   4.4  Футер (розділ «Категорії»)
  ------------------------------------------------------------------*/
  createFooterCategories() {
    const container = document.getElementById('footer-categories');
    if (!container) return;

    const fragment = document.createDocumentFragment();

    AppsLoader.getCategories().forEach(cat => {
      const col = document.createElement('div');
      col.className = 'footer-category';

      const title = document.createElement('h4');
      title.className = 'footer-category-title';
      title.textContent = cat;
      col.appendChild(title);

      const ul = document.createElement('ul');
      ul.className = 'footer-apps-list';

      AppsLoader.getAppsByCategory(cat).forEach(app => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href = app.url;

        const iconSpan = document.createElement('span');
        iconSpan.appendChild(
          IconRenderer.createSVGIcon(app.icon, 'footer-app-icon')
        );

        const txt = document.createElement('span');
        txt.textContent = app.name;

        a.append(iconSpan, txt);
        li.appendChild(a);
        ul.appendChild(li);
      });

      col.appendChild(ul);
      fragment.appendChild(col);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
  },

  /*------------------------------------------------------------------
   4.5  Виведення застосунків у довільному контейнері
  ------------------------------------------------------------------*/
  renderAppsByCategory(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const apps = AppsLoader.getAppsByCategory(category);
    if (!apps.length) {
      container.innerHTML = `<p>Немає застосунків у категорії «${category}».</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    apps.forEach(app => {
      const card = document.createElement('div');
      card.className = 'app-card';

      const iconWrap = document.createElement('div');
      iconWrap.className = 'app-card-icon';
      iconWrap.appendChild(
        IconRenderer.createSVGIcon(app.icon, 'app-card-svg-icon')
      );

      const title = document.createElement('h3');
      title.className = 'app-card-title';
      title.innerHTML = `<a href="${app.url}">${app.name}</a>`;

      const desc = document.createElement('p');
      desc.className = 'app-card-description';
      desc.textContent = app.description;

      const subcat = document.createElement('div');
      subcat.className = 'app-card-subcategory';
      subcat.textContent = app.subcategory;

      const link = document.createElement('a');
      link.href = app.url;
      link.className = 'app-card-link';
      link.textContent = 'Відкрити →';

      card.append(iconWrap, title, desc, subcat, link);
      fragment.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
  },

  /*------------------------------------------------------------------
   4.6  Виведення **всіх** застосунків (на головній сторінці)
  ------------------------------------------------------------------*/
  renderAllApps(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const fragment = document.createDocumentFragment();

    AppsLoader.getCategories().forEach(cat => {
      const section = document.createElement('section');
      section.className = 'category-section';

      const h2 = document.createElement('h2');
      h2.className = 'category-title';
      h2.textContent = cat;

      const grid = document.createElement('div');
      grid.className = 'category-apps-grid';

      AppsLoader.getAppsByCategory(cat).forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';

        const iconWrap = document.createElement('div');
        iconWrap.className = 'app-card-icon';
        iconWrap.appendChild(
          IconRenderer.createSVGIcon(app.icon, 'app-card-svg-icon')
        );

        const title = document.createElement('h3');
        title.className = 'app-card-title';
        title.innerHTML = `<a href="${app.url}">${app.name}</a>`;

        const desc = document.createElement('p');
        desc.className = 'app-card-description';
        desc.textContent = app.description;

        const subcat = document.createElement('div');
        subcat.className = 'app-card-subcategory';
        subcat.textContent = app.subcategory;

        const link = document.createElement('a');
        link.href = app.url;
        link.className = 'app-card-link';
        link.textContent = 'Відкрити →';

        card.append(iconWrap, title, desc, subcat, link);
        grid.appendChild(card);
      });

      section.append(h2, grid);
      fragment.appendChild(section);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
  }
};

/*====================================================================
  5️⃣  ІНІЦІАЛІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ DOM
====================================================================*/
document.addEventListener('DOMContentLoaded', () => {
  // 1️⃣ Шапка
  AppsRenderer.createHeaderMenu('apps-menu');

  // 2️⃣ Сторінка категорії (category.html?cat=…)
  if (window.location.pathname.includes('category.html')) {
    AppsRenderer.createCategoryPage();
  }

  // 3️⃣ Футер
  AppsRenderer.createFooterCategories();

  // 4️⃣ Закриття меню, коли користувач клацає поза ним
  document.addEventListener('click', e => {
    if (!e.target.closest('.has-dropdown')) {
      const dropdown = document.querySelector('.dropdown-menu');
      if (dropdown) dropdown.classList.remove('show');

      document.querySelectorAll('.apps-list')
        .forEach(list => list.classList.remove('show'));

      document.querySelectorAll('.category-header')
        .forEach(h => h.classList.remove('active'));
    }
  });
});

/*====================================================================
  6️⃣  Доступність глобально (для консолі та дебагу)
====================================================================*/
window.AppsLoader   = AppsLoader;
window.AppsRenderer = AppsRenderer;
window.IconRenderer = IconRenderer;
