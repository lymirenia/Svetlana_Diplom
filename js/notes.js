const notesModule = {
    async init() {
        // Отрисовываем существующие заметки при загрузке
        await this.render();
        
        const addBtn = document.getElementById('add-note-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addNote());
        }
    },

    async addNote() {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        // Проверка на пустоту
        if (!title && !content) {
            alert('Сначала напишите заголовок или текст заметки!');
            return;
        }

        // Палитра Food Book для цветных полосок на заметках
        const colors = ['#805D93', '#F49FBC', '#9EBD6E', '#169873', '#FFD3BA'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const note = {
            title: title || 'Без названия',
            content: content || '',
            color: randomColor,
            date: new Date().toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        // Сохраняем в IndexedDB через наш общий dbModule
        await dbModule.add('notes', note);
        
        // Очищаем поля ввода
        titleInput.value = '';
        contentInput.value = '';
        
        // Перерисовываем список
        await this.render();
    },

    async render() {
        const items = await dbModule.getAll('notes');
        const container = document.getElementById('notes-list');
        
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 40px; color: #bbb; border: 2px dashed #ddd; border-radius: 20px;">
                    <p style="font-size: 1.2rem;">📖 Ваша Food Book пока пуста.</p>
                    <p style="font-size: 0.9rem;">Записывайте сюда списки покупок или идеи блюд!</p>
                </div>`;
            return;
        }

        // Выводим заметки: свежие будут сверху
        container.innerHTML = items.reverse().map(note => `
            <div class="note-card" style="border-left: 6px solid ${note.color || 'var(--primary)'};">
                <h4>${this.escapeHtml(note.title)}</h4>
                <p>${this.escapeHtml(note.content)}</p>
                <div class="note-footer">
                    <span class="note-date">📅 ${note.date}</span>
                    <button class="delete-note-btn" onclick="notesModule.deleteNote(${note.id})">Удалить</button>
                </div>
            </div>
        `).join('');
    },

    async deleteNote(id) {
        if (confirm('Удалить эту запись из Food Book?')) {
            await dbModule.delete('notes', id);
            await this.render();
        }
    },

    // Защита от взлома (если в тексте будут HTML-теги)
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};