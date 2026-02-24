const dbModule = {
    db: null,

    async init() {
        return new Promise((resolve, reject) => {
            // Поднимаем версию до 2, так как мы добавили 'notes'
            const request = indexedDB.open('BudgetZeroDB', 2);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                // Создаем хранилище для холодильника, если его нет
                if (!db.objectStoreNames.contains('fridge')) {
                    db.createObjectStore('fridge', { keyPath: 'id', autoIncrement: true });
                }
                // Создаем хранилище для заметок, если его нет
                if (!db.objectStoreNames.contains('notes')) {
                    db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };

            request.onerror = (e) => {
                console.error('Ошибка БД:', e.target.error);
                reject(e.target.error);
            };
        });
    },

    async getAll(storeName) {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        return new Promise(res => {
            store.getAll().onsuccess = e => res(e.target.result);
        });
    },

    async add(storeName, item) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        return new Promise(res => {
            const req = store.add(item);
            req.onsuccess = () => res();
        });
    },

    async delete(storeName, id) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        return new Promise(res => {
            const req = store.delete(id);
            req.onsuccess = () => res();
        });
    }
};