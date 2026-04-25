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
// ЗМІННІ ДЛЯ ФОТО ТА НІКНЕЙМУ
const toolAttach = document.getElementById('tool-attach');
const attachInput = document.getElementById('attach-input');
const cardImageWrap = document.getElementById('card-image-wrap');
const cardAttachedImg = document.getElementById('card-attached-img');
const removeAttachedImg = document.getElementById('remove-attached-img');

const nicknameInput = document.getElementById('nickname-input');
const anonText = document.getElementById('anon-text');
const anonIcon = document.getElementById('anon-icon');

// ЗВ'ЯЗКА КНОПКИ З ІНПУТОМ ФАЙЛУ
toolAttach.addEventListener('click', () => {
    attachInput.click();
});

// ЗАВАНТАЖЕННЯ ФОТО
attachInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            cardAttachedImg.src = event.target.result;
            cardImageWrap.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// ВИДАЛЕННЯ ФОТО
removeAttachedImg.addEventListener('click', () => {
    attachInput.value = '';
    cardAttachedImg.src = '';
    cardImageWrap.style.display = 'none';
});

// ЛАЙВ-ОНОВЛЕННЯ НІКНЕЙМУ
nicknameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
        anonText.innerText = val;
        anonIcon.innerText = 'person'; // Міняємо маску на звичайного юзера
    } else {
        anonText.innerText = 'Анонімно';
        anonIcon.innerText = 'domino_mask';
    }
});
// ЗМІННІ АТМОСФЕРИ
const atmoOverlay = document.getElementById('atmo-overlay');
const atmoStage = document.getElementById('atmo-stage');
const atmoColorBg = document.getElementById('atmo-color-bg');
const atmoCard = document.getElementById('atmo-card');
const atmoNicknameInput = document.getElementById('atmo-nickname-input');
const atmoAnonText = document.getElementById('atmo-anon-text');
const atmoAnonIcon = document.getElementById('atmo-anon-icon');

// ВІДКРИТТЯ АТМОСФЕРИ (Прив'язуємо до кнопки в головному меню)
document.querySelector('.b-atmosphere').addEventListener('click', () => {
    atmoOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    renderAtmoStage('single-polaroid'); // Дефолтний лейаут
});

// ЗАКРИТТЯ АТМОСФЕРИ
document.getElementById('atmo-back').addEventListener('click', () => {
    atmoOverlay.style.display = 'none';
    document.body.style.overflow = '';
});

// ЗМІНА ФОНУ КАРТКИ АТМОСФЕРИ
atmoColorBg.addEventListener('input', (e) => {
    atmoCard.style.backgroundColor = e.target.value;
});

// ЛАЙВ-НІКНЕЙМ ДЛЯ АТМОСФЕРИ
atmoNicknameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
        atmoAnonText.innerText = val;
        atmoAnonIcon.innerText = 'person';
    } else {
        atmoAnonText.innerText = 'Анонімно';
        atmoAnonIcon.innerText = 'domino_mask';
    }
});

// ЛОГІКА ПЕРЕМИКАННЯ ЛЕЙАУТІВ
document.querySelectorAll('.atmo-layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.atmo-layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAtmoStage(btn.getAttribute('data-layout'));
    });
});

// ФУНКЦІЯ ГЕНЕРАЦІЇ СЛОТІВ ДЛЯ ФОТО
function renderAtmoStage(layout) {
    atmoStage.innerHTML = '';
    atmoStage.className = `atmo-stage atmo-stage--${layout}`;
    
    let slotCount = 1;
    let slotClass = 'slot-square';
    let hasCaption = false;

    if (layout === 'single-polaroid') { slotCount = 1; slotClass = 'slot-polaroid'; hasCaption = true; }
    if (layout === 'two-polaroid') { slotCount = 2; slotClass = 'slot-polaroid'; hasCaption = true; }
    if (layout === 'grid-four') { slotCount = 4; slotClass = 'slot-grid-item'; }

    for (let i = 0; i < slotCount; i++) {
        const slot = document.createElement('div');
        slot.className = `atmo-slot ${slotClass}`;
        
        const placeholder = document.createElement('div');
        placeholder.className = 'atmo-slot-placeholder';
        placeholder.innerHTML = '<span class="material-symbols-outlined" style="font-size:32px;">add_photo_alternate</span>';
        
        const img = document.createElement('img');
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        slot.appendChild(placeholder);
        slot.appendChild(img);
        slot.appendChild(fileInput);

        if (hasCaption) {
            const captionInput = document.createElement('input');
            captionInput.type = 'text';
            captionInput.className = 'atmo-caption';
            captionInput.placeholder = 'підпис...';
            captionInput.maxLength = 30;
            slot.appendChild(captionInput);
        }

        // Клік по слоту відкриває галерею (якщо не клікнули по інпуту тексту)
        slot.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                fileInput.click();
            }
        });

        // Завантаження фото в слот
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    img.src = event.target.result;
                    img.style.display = 'block';
                    placeholder.style.display = 'none';
                    slot.style.border = 'none'; // Прибираємо пунктир, коли є фото
                };
                reader.readAsDataURL(file);
            }
        });

        atmoStage.appendChild(slot);
    }
}
// ПЕРЕХІД В ПРЕВ'Ю ДЛЯ АТМОСФЕРИ
document.getElementById('atmo-next-btn').addEventListener('click', () => {
    const previewWorkspace = document.getElementById('preview-workspace');
    const atmoCard = document.getElementById('atmo-card');

    // Перевіряємо чи є хоча б одне завантажене фото (ігноруємо логотип)
    const hasPhoto = Array.from(atmoCard.querySelectorAll('.atmo-slot img')).some(img => img.style.display === 'block');
    
    if (!hasPhoto) {
        alert('Атмосфера без фото — це тупо вакуум. Додай хоча б одну пікчу.');
        return;
    }

    // Встановлюємо режим, щоб після "Опублікувати" гарантовано полетіло відео Скриньки
    currentMode = 'skrynka'; 

    // Чистимо загальний екран прев'ю
    previewWorkspace.innerHTML = '';
    
    // Робимо точну копію картки атмосфери
    const cardClone = atmoCard.cloneNode(true);
    cardClone.id = 'preview-atmo-card';

    // Вирубаємо всі інпути (підписи) в клоні, щоб вони стали просто текстом
    cardClone.querySelectorAll('input').forEach(input => {
        input.disabled = true;
        input.style.border = 'none';
        input.style.background = 'transparent';
        input.style.color = '#333'; // Щоб текст не ставав сірим як disabled
        input.style.opacity = '1';
    });

    // Вставляємо клон на екран перевірки
    previewWorkspace.appendChild(cardClone);

    // Перемикаємо екрани
    atmoOverlay.style.display = 'none';
    previewOverlay.style.display = 'flex';
});
