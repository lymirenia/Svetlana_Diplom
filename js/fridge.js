const fridgeModule = {
    async init() {
        this.render();
        document.getElementById('add-product-btn').addEventListener('click', () => this.addItem());
    },
    async addItem() {
        const nameInput = document.getElementById('product-name');
        const qtyInput = document.getElementById('product-qty');
        const name = nameInput.value.trim();
        const qty = qtyInput.value.trim() || '1 шт';

        if (!name) return;

        await dbModule.add('fridge', { 
            name, 
            qty,
            date: new Date().toLocaleDateString()
        });

        nameInput.value = '';
        qtyInput.value = '';
        this.render();
    },
    async render() {
        const items = await dbModule.getAll('fridge');
        const list = document.getElementById('fridge-list');
        
        if (items.length === 0) {
            list.innerHTML = '<p style="text-align:center; color: #999;">Холодильник пуст</p>';
            return;
        }

        list.innerHTML = items.map(i => `
            <li>
                <div>
                    <strong style="display:block">${i.name}</strong>
                    <small style="color:#888">${i.qty} • Добавлено: ${i.date || 'недавно'}</small>
                </div>
                <button onclick="fridgeModule.deleteItem(${i.id})" style="background: #ff7675; padding: 5px 12px; font-size: 0.8rem;">✕</button>
            </li>
        `).join('');
    },
    async deleteItem(id) {
        await dbModule.delete('fridge', id);
        this.render();
    }
};