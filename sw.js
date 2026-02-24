const CACHE_NAME = 'budget-zero-v2'; // Обновили версию кэша
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/db.js',
    '/js/fridge.js',
    '/js/recipes.js',
    '/js/settings.js',
    '/data/recipes.json',
    '/data/food-items.json' // ИЗМЕНЕНИЕ: Добавили файл подсказок
];

// Установка: кэшируем статику
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// Активация: удаляем старые кэши
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Перехват запросов: Сначала Кэш, потом Сеть (Offline First)
self.addEventListener('fetch', event => {
    // Игнорируем запросы к внешним API (например, Google AI), их не кэшируем в static
    if (event.request.url.includes('http')) {
        // Стандартная стратегия кэширования
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Если есть в кэше - возвращаем
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Иначе идем в сеть
                return fetch(event.request);
            })
    );
});