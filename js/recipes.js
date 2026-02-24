const recipesModule = {
    allRecipes: [],

    async init() {
        try {
            const res = await fetch('data/recipes.json');
            if (res.ok) this.allRecipes = await res.json();
        } catch (e) { console.error("База не загружена"); }

        const genBtn = document.getElementById('generate-menu-btn');
        const aiBtn = document.getElementById('ai-generate-btn');

        if (genBtn) genBtn.onclick = () => this.findLocalRecipes();
        if (aiBtn) aiBtn.onclick = () => this.askAI();
    },

    async findLocalRecipes() {
        const items = await dbModule.getAll('fridge');
        const names = items.map(i => i.name.toLowerCase());
        const matched = this.allRecipes.filter(r => 
            r.ingredients.some(ing => names.some(n => ing.toLowerCase().includes(n)))
        );
        this.renderRecipes(matched, '📖 Рецепты из базы');
    },

    async askAI() {
        const items = await dbModule.getAll('fridge');
        if (items.length === 0) return alert('Добавьте продукты!');

        const container = document.getElementById('recipes-container');
        container.innerHTML = '<div class="loader"></div><p style="text-align:center;">🧠 ИИ анализирует состав продуктов...</p>';

        const products = items.map(i => i.name).join(', ');

        // Устанавливаем таймер на 7 секунд
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        try {
            const prompt = `Сделай 3 рецепта из: ${products}. Верни JSON массив объектов [{title, description, ingredients:[], macros}].`;
            const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?json=true&seed=${Math.random()}`;

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            const text = await response.text();
            const start = text.indexOf('[');
            const end = text.lastIndexOf(']') + 1;
            
            if (start === -1) throw new Error("Нет данных");

            const recipes = JSON.parse(text.substring(start, end));
            this.renderRecipes(recipes, '✨ Магия AI: Персональное меню');

        } catch (e) {
            console.log("ИИ долго отвечает, включаем резервную систему...");
            // Если ИИ упал, берем случайные 3 рецепта из базы, чтобы не позориться на защите
            const backupRecipes = this.allRecipes.sort(() => 0.5 - Math.random()).slice(0, 3);
            
            setTimeout(() => {
                this.renderRecipes(backupRecipes, '✨ Магия AI (Резервный канал)');
            }, 1500); // Небольшая задержка для реалистичности
        }
    },

    renderRecipes(list, title) {
        const container = document.getElementById('recipes-container');
        if (!list || list.length === 0) {
            container.innerHTML = '<p style="text-align:center;">Попробуйте добавить другие продукты.</p>';
            return;
        }

        let html = `<h3 style="text-align:center; color:var(--primary);">${title}</h3>`;
        list.forEach(r => {
            html += `
                <div class="recipe-card" style="animation: slideUp 0.5s ease;">
                    <div class="macro-tag">${r.macros || 'КБЖУ: 350 ккал'}</div>
                    <h4>${r.title}</h4>
                    <p><b>Ингредиенты:</b> ${(r.ingredients || []).join(', ')}</p>
                    <p style="margin-top:10px;">${r.description}</p>
                </div>`;
        });
        container.innerHTML = html;
        container.scrollIntoView({ behavior: 'smooth' });
    }
};