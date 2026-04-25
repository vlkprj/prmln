// ЗМІННІ ЕКРАНІВ
const builderOverlay = document.getElementById('builder-overlay');
const previewOverlay = document.getElementById('preview-overlay');
const successOverlay = document.getElementById('success-overlay');

// ЗМІННІ ВІДЕО
const successVideo = document.getElementById('success-video');
const successText = document.getElementById('success-text');
let currentMode = ''; 

// КНОПКИ ГОЛОВНОГО ФІДУ
const categoryButtons = document.querySelectorAll('.category-trigger');

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentMode = btn.getAttribute('data-mode');
        const title = btn.getAttribute('data-title');
        
        document.getElementById('builder-title').innerText = title;
        
        builderOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    });
});

// КНОПКИ НАВІГАЦІЇ
document.getElementById('builder-back').addEventListener('click', () => {
    builderOverlay.style.display = 'none';
    document.body.style.overflow = '';
});

// КНОПКА "ДАЛІ" (Перехід в Прев'ю + Клонування картки)
document.getElementById('builder-next-btn').addEventListener('click', () => {
    const previewWorkspace = document.getElementById('preview-workspace');
    const activeCard = document.getElementById('active-card');
    const cardEditor = document.getElementById('card-editor');
    
    // Якщо юзер нічого не написав, не пускаємо далі (або пускаємо, але попереджаємо. Поки просто не пускаємо)
    if (!cardEditor.innerText.trim()) {
        alert('А написати щось? Карток-пустушок нам не треба.');
        return;
    }

    // Чистимо попередній перегляд
    previewWorkspace.innerHTML = '';
    
    // Робимо точну копію нашої картки
    const cardClone = activeCard.cloneNode(true);
    cardClone.id = 'preview-card'; // Змінюємо ID щоб не було конфліктів
    
    // Вирубаємо можливість редагувати текст в прев'ю
    const clonedEditor = cardClone.querySelector('#card-editor');
    if (clonedEditor) {
        clonedEditor.id = 'preview-editor';
        clonedEditor.setAttribute('contenteditable', 'false');
    }

    // Вставляємо клон на екран
    previewWorkspace.appendChild(cardClone);

    // Перемикаємо екрани
    builderOverlay.style.display = 'none';
    previewOverlay.style.display = 'flex';
});


document.getElementById('preview-back').addEventListener('click', () => {
    previewOverlay.style.display = 'none';
    builderOverlay.style.display = 'flex';
});

// ПУБЛІКАЦІЯ
document.getElementById('publish-btn').addEventListener('click', () => {
    previewOverlay.style.display = 'none';
    successOverlay.style.display = 'flex';
    
    if (currentMode === 'blackhole') {
        successVideo.src = 'assets/vids/BlackHole.mp4';
    } else {
        successVideo.src = 'assets/vids/skrynka.mp4';
    }
    
    successVideo.play();
    
    setTimeout(() => {
        successText.style.opacity = '1';
    }, 1500); 
});
// ЗМІННІ КОНСТРУКТОРА
const cardEditor = document.getElementById('card-editor');
const activeCard = document.getElementById('active-card');
const toolBold = document.getElementById('tool-bold');
const toolItalic = document.getElementById('tool-italic');
const toolFont = document.getElementById('tool-font');
const toolColorText = document.getElementById('tool-color-text');
const toolColorBg = document.getElementById('tool-color-bg');

// ФОРМАТУВАННЯ ТЕКСТУ (Жирний / Курсив)
toolBold.addEventListener('click', () => {
    document.execCommand('bold', false, null);
    cardEditor.focus();
});

toolItalic.addEventListener('click', () => {
    document.execCommand('italic', false, null);
    cardEditor.focus();
});

// ЗМІНА ШРИФТА І КОЛЬОРІВ
toolFont.addEventListener('change', (e) => {
    activeCard.style.fontFamily = e.target.value;
});

toolColorText.addEventListener('input', (e) => {
    activeCard.style.color = e.target.value;
});

toolColorBg.addEventListener('input', (e) => {
    activeCard.style.backgroundColor = e.target.value;
});

// АВТОМАТИЧНИЙ РОЗМІР ТЕКСТУ
cardEditor.addEventListener('input', () => {
    const textLength = cardEditor.innerText.trim().length;
    
    // Очищаємо старі класи
    cardEditor.classList.remove('fs-huge', 'fs-large', 'fs-medium', 'fs-small');
    
    // Задаємо нові в залежності від кількості символів
    if (textLength < 50) {
        cardEditor.classList.add('fs-huge');
    } else if (textLength < 120) {
        cardEditor.classList.add('fs-large');
    } else if (textLength < 250) {
        cardEditor.classList.add('fs-medium');
    } else {
        cardEditor.classList.add('fs-small');
    }
});
