// Загрузочный экран
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');
    const progressBar = document.getElementById('progressBar');
    
    // Функция обновления прогресс-бара
    function updateProgress(percent) {
        progressBar.style.width = percent + '%';
    }
    
    // Симуляция процесса загрузки
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // После завершения загрузки
            setTimeout(() => {
                loader.classList.add('hidden');
                mainContent.style.display = 'block';
                
                // Убираем loader из DOM после анимации
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 300);
        }
        updateProgress(progress);
    }, 200);
});


// Эффект курсора
function initCustomCursor() {
    const cursor = document.getElementById("cursor");
    if (!cursor) return;
    
    const amount = 15; // Уменьшил количество точек для производительности
    const width = 26;
    let mousePosition = { x: 0, y: 0 };
    let dots = [];
    let idle = false;
    
    class Dot {
        constructor(index = 0) {
            this.index = index;
            this.anglespeed = 0.05;
            this.x = 0;
            this.y = 0;
            this.scale = 1 - 0.05 * index;
            this.range = width / 2 - width / 2 * this.scale + 2;
            this.limit = width * 0.75 * this.scale;
            this.element = document.createElement("span");
            gsap.set(this.element, { scale: this.scale });
            cursor.appendChild(this.element);
        }

        lock() {
            this.lockX = this.x;
            this.lockY = this.y;
            this.angleX = Math.PI * 2 * Math.random();
            this.angleY = Math.PI * 2 * Math.random();
        }

        draw() {
            if (!idle) {
                gsap.set(this.element, { x: this.x, y: this.y });
            } else {
                this.angleX += this.anglespeed;
                this.angleY += this.anglespeed;
                this.y = this.lockY + Math.sin(this.angleY) * this.range;
                this.x = this.lockX + Math.sin(this.angleX) * this.range;
                gsap.set(this.element, { x: this.x, y: this.y });
            }
        }
    }

    function buildDots() {
        for (let i = 0; i < amount; i++) {
            let dot = new Dot(i);
            dots.push(dot);
        }
    }

    const onMouseMove = (event) => {
        mousePosition.x = event.clientX - width / 2;
        mousePosition.y = event.clientY - width / 2;
    };

    const positionCursor = () => {
        let x = mousePosition.x;
        let y = mousePosition.y;
        
        dots.forEach((dot, index, dots) => {
            let nextDot = dots[index + 1] || dots[0];
            dot.x = x;
            dot.y = y;
            dot.draw();
            
            if (!idle) {
                const dx = (nextDot.x - dot.x) * 0.35;
                const dy = (nextDot.y - dot.y) * 0.35;
                x += dx;
                y += dy;
            }
        });
        
        requestAnimationFrame(positionCursor);
    };

    // Инициализация
    window.addEventListener("mousemove", onMouseMove);
    buildDots();
    positionCursor();
    
    // Скрываем стандартный курсор
    document.body.style.cursor = 'none';
    
    // Показываем кастомный курсор только когда мышь над документом
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация кастомного курсора
    initCustomCursor();
});


document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');
    
    // Плавный скролл по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Закрываем меню после клика на мобильных
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            }
        });
    });
    
    // Открытие/закрытие меню
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Функции для работы с меню
    function toggleMenu() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        header.classList.remove('fixed');
    }
    
    // Закрепление шапки при прокрутке с открытым меню
    window.addEventListener('scroll', function() {
        if (navMenu.classList.contains('active')) {
            header.classList.add('fixed');
        }
    });
});


// Функция для загрузки и отображения 3D модели
function initModelViewer() {
    const container = document.getElementById('model-container');
    if (!container) return;
    
    // Добавляем индикатор загрузки
    container.innerHTML = '<div class="model-loading">Загрузка модели...</div>';
    
    // Создаем сцену, камеру и рендерер
    const scene = new THREE.Scene();
    scene.background = null; // Прозрачный фон
    
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Улучшенное освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);
    
    // Несколько направленных источников света
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight1.position.set(5, 5, 5).normalize();
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight2.position.set(-5, 3, -5).normalize();
    scene.add(directionalLight2);
    
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight3.position.set(0, -5, 0).normalize();
    scene.add(directionalLight3);
    
    // Точечный свет для дополнительного освещения
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);
    
    // Загрузка модели
    const loader = new THREE.GLTFLoader();
    let model;
    
    loader.load('model/sparrow.glb', function(gltf) {
        model = gltf.scene;
        scene.add(model);
        
        // Устанавливаем материал для модели (если нужно)
        model.traverse(function(child) {
            if (child.isMesh) {
                // Увеличиваем интенсивность материалов
                if (child.material) {
                    child.material.emissive = new THREE.Color(0x222222);
                    child.material.emissiveIntensity = 0.2;
                }
            }
        });
        
        // Центрируем модель
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // Настраиваем камеру
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.8; // Отступ для лучшего обзора
        camera.position.z = cameraZ;
        
        // Устанавливаем начальный наклон модели
        model.rotation.x = -0.2; // Наклон вперед
        model.rotation.z = 0.1; // Легкий поворот
        
        // Переменные для управления вращением
        let targetRotationX = model.rotation.x;
        let targetRotationY = model.rotation.y;
        let currentRotationX = model.rotation.x;
        let currentRotationY = model.rotation.y;
        
        let mouseX = 0;
        let mouseY = 0;
        let isHovered = false;
        
        // Обработка движения мыши
        const handleMouseMove = (event) => {
            if (!isHovered) return;
            
            const rect = container.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Нормализуем координаты от -1 до 1
            mouseX = (x / rect.width) * 2 - 1;
            mouseY = -(y / rect.height) * 2 + 1;
            
            // Устанавливаем целевое вращение на основе позиции мыши
            targetRotationY = mouseX * 0.5;
            targetRotationX = (-0.2) + (mouseY * 0.2);
        };
        
        // Обработчики событий для мыши
        container.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        
        container.addEventListener('mouseleave', () => {
            isHovered = false;
            // Плавный возврат к исходному положению
            targetRotationY = 0;
            targetRotationX = -0.2;
        });
        
        container.addEventListener('mousemove', handleMouseMove);
        
        // Анимация
        function animate() {
            requestAnimationFrame(animate);
            
            if (model) {
                // Плавная интерполяция к целевому вращению
                currentRotationX += (targetRotationX - currentRotationX) * 0.05;
                currentRotationY += (targetRotationY - currentRotationY) * 0.05;
                
                // Применяем вращение
                model.rotation.x = currentRotationX;
                model.rotation.y = currentRotationY;
                
                // Легкое автоматическое вращение, когда не наведено
                if (!isHovered) {
                    targetRotationY += 0.002;
                }
            }
            
            renderer.render(scene, camera);
        }
        
        // Запуск анимации
        animate();
    }, undefined, function(error) {
        console.error('Ошибка загрузки модели:', error);
        container.innerHTML = '<p style="color: #A3989E; text-align: center; padding: 20px;">3D модель временно недоступна</p>';
    });
    
    // Обработка изменения размера окна
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Очистка при удалении элемента
    return () => {
        window.removeEventListener('resize', handleResize);
        // Дополнительная очистка, если нужна
    };
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация 3D модели
    initModelViewer();
});


// Функция для кнопки "Читать далее" в блоке "Обо мне"
function initReadMore() {
    const readMoreBtn = document.getElementById('readMoreBtn');
    const textContainer = document.querySelector('.about-text-container');
    
    if (!readMoreBtn || !textContainer) return;
    
    readMoreBtn.addEventListener('click', function() {
        textContainer.classList.toggle('expanded');
        
        if (textContainer.classList.contains('expanded')) {
            readMoreBtn.textContent = 'Свернуть';
        } else {
            readMoreBtn.textContent = 'Читать далее';
        }
    });
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация кнопки "Читать далее"
    initReadMore();
});


// Функция для инициализации карусели навыков
function initSkillsCarousel() {
    const carousel = document.querySelector('.skills-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    
    // Получаем все карточки навыков из грида
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length === 0) return;
    
    // Очищаем трек
    track.innerHTML = '';
    
    // Определяем количество карточек на слайд в зависимости от ширины экрана
    function getCardsPerSlide() {
        return window.innerWidth <= 450 ? 3 : 3;
    }
    
    // Определяем количество слайдов
    const cardsPerSlide = getCardsPerSlide();
    const slideCount = Math.ceil(skillCards.length / cardsPerSlide);
    
    // Создаем слайды
    for (let i = 0; i < slideCount; i++) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const slideInner = document.createElement('div');
        slideInner.className = 'carousel-slide-inner';
        
        // Добавляем карточки в слайд
        for (let j = 0; j < cardsPerSlide; j++) {
            const cardIndex = i * cardsPerSlide + j;
            if (cardIndex < skillCards.length) {
                slideInner.appendChild(skillCards[cardIndex].cloneNode(true));
            }
        }
        
        slide.appendChild(slideInner);
        track.appendChild(slide);
    }
    
    const slides = track.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    
    // Создаем точки-индикаторы
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Функция для обновления позиции карусели
    function updateCarousel() {
        const slideWidth = track.clientWidth;
        const newPosition = -currentIndex * slideWidth;
        track.style.transform = `translateX(${newPosition}px)`;
        
        // Обновляем активную точку
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Блокируем/разблокируем кнопки навигации
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= slideCount - 1;
    }
    
    // Функция для перехода к определенному слайду
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, slideCount - 1));
        updateCarousel();
    }
    
    // Обработчики событий для кнопок навигации
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });
    
    // Обработчик изменения размера окна
    function handleResize() {
        // Пересоздаем карусель при изменении размера окна
        initSkillsCarousel();
    }
    
    // Используем debounce для избежания множественных вызовов при ресайзе
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Инициализация карусели
    updateCarousel();
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация карусели навыков
    initSkillsCarousel();
});


// Данные проектов
const projectsData = [
    {
        title: "Клуб четырех коней",
        description: "Полная адаптивная верстка сайта по макету от Яндекс с использованием только чистых HTML, CSS, JS. Дополнен анимациями.",
        image: "site-club.png",
        category: "Веб-сайт",
        link: "https://ninapaleha.github.io/TheFourHorsesClub/"
    },
    {
        title: "Конференция перекупов",
        description: "Tilda проект, разработанный по макету, согласованному компаниями Haraba и Боравто. Сайт имеет кастомные адаптивные блоки Zero, интеграции кода для реализации собственной карусели карточек 'Спикеров'. Дополнен анимациями.",
        image: "site-perekup.png",
        category: "Веб-сайт",
        link: "https://perekup-conf-vrn.ru/"
    },
    {
        title: "СКС Боравто Chery",
        description: "Tilda проект, разработан без макета по ТЗ. Интегрированы внешние сервисы: чат бот и callback.",
        image: "site-chery.png",
        category: "Веб-сайт",
        link: "https://chery.borauto.ru/"
    },
    {
        title: "The Wolf's Mark",
        description: "Разработан на Wordpress без макета и ТЗ, с использованием готовой темы.",
        image: "site-wolf.png",
        category: "Веб-сайт",
        link: "https://thewolfsmark.wordpress.com/"
    },
    {
        title: "OMODA Боравто",
        description: "Tilda проект, разработан без макета по ТЗ. Интегрированы внешние сервисы: чат бот и callback.",
        image: "site-omoda.png",
        category: "Веб-сайт",
        link: "https://ninapaleha.github.io/omoda/"
    },
    {
        title: "JAECOO Боравто",
        description: "Tilda проект, разработан без макета по ТЗ. Интегрированы внешние сервисы: чат бот и callback.",
        image: "site-jaecoo.png",
        category: "Веб-сайт",
        link: "https://ninapaleha.github.io/jaecoo/"
    },
    {
        title: "Автокредит Боравто",
        description: "Tilda проект, разработан без макета по ТЗ. Создан с использованием кастомных адаптивных Zero блоков. Дополнен анимациями.",
        image: "site-credit.png",
        category: "Веб-сайт",
        link: "https://region.borauto.ru/"
    },
    {
        title: "Москвич Боравто",
        description: "Многостраничный функциональный сайт, созданный в качестве дипломной работы. Реализован с использованием фреймворка Bootstrap, а так же: HTML, PHP, CSS, MySQL.",
        image: "site-moskvich.png",
        category: "Веб-сайт",
        link: "#projectPopup"
    },
    {
        title: "Экспресс автосервис",
        description: "Tilda проект, разработан без макета по ТЗ. Простой лендинг с использованием стандартных блоков.",
        image: "site-expert.png",
        category: "Веб-сайт",
        link: "https://express-service.borauto.ru/"
    }
];

// Функция для инициализации проектов
function initProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const loadMoreBtn = document.getElementById('load-more');
    const projectsMore = document.getElementById('projects-more');
    
    if (!projectsGrid || !loadMoreBtn) return;
    
    let visibleProjects = 3;
    
    // Функция для отображения проектов
    function renderProjects() {
        projectsGrid.innerHTML = '';
        
        for (let i = 0; i < Math.min(visibleProjects, projectsData.length); i++) {
            const project = projectsData[i];
            const isEven = i % 2 === 0;
            
            const projectItem = document.createElement('div');
            projectItem.className = `project-item ${isEven ? '' : 'reverse'}`;
            
            projectItem.innerHTML = `
                <div class="project-image">
                    <img src="images/${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <p class="project-category">${project.category}</p>
                    <h3 class="project-name">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <a href="${project.link}" class="project-link" ${project.link === '#projectPopup' ? '' : 'target="_blank"'}>
                        <img src="images/arrow-up-right.png" alt="Перейти на сайт">
                    </a>
                </div>
            `;
            
            // Добавляем обработчик для проекта с поп-апом
            if (project.link === '#projectPopup') {
                const link = projectItem.querySelector('.project-link');
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (typeof window.openProjectPopup === 'function') {
                        window.openProjectPopup();
                    }
                });
                
                // Также добавляем обработчик для всей карточки на мобильных
                if (window.innerWidth <= 768) {
                    projectItem.style.cursor = 'pointer';
                    projectItem.addEventListener('click', function(e) {
                        if (!e.target.closest('.project-link')) {
                            e.preventDefault();
                            if (typeof window.openProjectPopup === 'function') {
                                window.openProjectPopup();
                            }
                        }
                    });
                }
            }
            
            projectsGrid.appendChild(projectItem);
        }
        
        // Показываем или скрываем кнопку "Смотреть еще"
        if (visibleProjects >= projectsData.length) {
            projectsMore.style.display = 'none';
        } else {
            projectsMore.style.display = 'flex';
        }
    }
    
    // Обработчик для кнопки "Смотреть еще"
    loadMoreBtn.addEventListener('click', () => {
        visibleProjects += 3;
        renderProjects();
    });
    
    // Инициализация проектов
    renderProjects();
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация проектов
    initProjects();
});


// Функция для кнопки "Наверх"
function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    if (!scrollButton) return;
    
    // Показываем/скрываем кнопку при прокрутке
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }
    
    // Плавная прокрутка наверх
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Обработчики событий
    window.addEventListener('scroll', toggleScrollButton);
    scrollButton.addEventListener('click', scrollToTop);
    
    // Инициализация при загрузке
    toggleScrollButton();
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация кнопки "Наверх"
    initScrollToTop();
});


// Функция для поп-апа недоступного проекта
function initProjectPopup() {
    const popup = document.getElementById('projectPopup');
    const closePopup = document.getElementById('closePopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    
    if (!popup) return;
    
    // Функция для открытия поп-апа (делаем глобальной)
    window.openProjectPopup = function() {
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    // Функция для закрытия поп-апа
    function closeProjectPopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Обработчики событий для закрытия
    if (closePopup) closePopup.addEventListener('click', closeProjectPopup);
    if (closePopupBtn) closePopupBtn.addEventListener('click', closeProjectPopup);
    
    // Закрытие по клику на оверлей
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closeProjectPopup();
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closeProjectPopup();
        }
    });
}

// Обновим данные проекта, чтобы добавить обработчик
function updateProjectData() {
    // Находим карточку проекта "Москвич Боравто"
    const projectCards = document.querySelectorAll('.project-item');
    
    projectCards.forEach(card => {
        const projectName = card.querySelector('.project-name');
        if (projectName && projectName.textContent.includes('Москвич Боравто')) {
            const projectLink = card.querySelector('.project-link');
            if (projectLink) {
                projectLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.openProjectPopup();
                });
            }
            
            // Также добавляем обработчик для самой карточки на мобильных
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    window.openProjectPopup();
                }
            });
        }
    });
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация поп-апа
    initProjectPopup();
    
    // Обновляем данные проекта после их загрузки
    setTimeout(updateProjectData, 1000);
});