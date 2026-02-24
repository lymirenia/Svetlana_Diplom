document.addEventListener('DOMContentLoaded', async () => {
    // 1. Инициализируем базу данных
    try {
        await dbModule.init();
        console.log('База данных готова');
    } catch (err) {
        console.error('Не удалось запустить БД', err);
    }

    // 2. Запускаем все модули
    if (typeof fridgeModule !== 'undefined') fridgeModule.init();
    if (typeof recipesModule !== 'undefined') recipesModule.init();
    if (typeof notesModule !== 'undefined') notesModule.init();
    // settings.js работает сам по себе через DOMContentLoaded внутри файла

    // 3. Логика переключения вкладок (Адаптивная)
    const navButtons = document.querySelectorAll('.nav-links button');
    const views = document.querySelectorAll('.view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;

            // Скрываем все секции
            views.forEach(view => view.classList.add('hidden'));
            
            // Показываем нужную
            const activeView = document.getElementById(target);
            if (activeView) activeView.classList.remove('hidden');

            // Управляем подсветкой кнопок
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Прокрутка наверх при смене вкладки (удобно для телефона)
            window.scrollTo(0, 0);
        });
    });
});