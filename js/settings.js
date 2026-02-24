document.addEventListener('DOMContentLoaded', () => {
    const ids = ['user-age', 'user-height', 'user-activity', 'user-health', 'user-allergies', 'user-prefs'];
    ids.forEach(id => {
        const val = localStorage.getItem(id);
        if (val) document.getElementById(id).value = val;
    });

    document.getElementById('save-profile-btn').addEventListener('click', () => {
        ids.forEach(id => localStorage.setItem(id, document.getElementById(id).value));
        alert('Профиль сохранен!');
    });
});