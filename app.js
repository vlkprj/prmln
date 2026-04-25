// ==========================================
// 1. ІНІЦІАЛІЗАЦІЯ ТЕЛЕГРАМ ТА ЗМІННІ
// ==========================================
const tg = window.Telegram.WebApp;
tg.expand(); // Одразу розгортаємо міні-аппу на весь екран
const mainBtn = tg.MainButton;

const builderOverlay = document.getElementById('builder-overlay');
const previewOverlay = document.getElementById('preview-overlay');
const successOverlay = document.getElementById('success-overlay');
const atmoOverlay = document.getElementById('atmo-overlay');
const photoOverlay = document.getElementById('photo-overlay');

const successVideo = document.getElementById('success-video');
const successText = document.getElementById('success-text');

let currentMode = ''; 
let lastScrollY = 0; 
let isMemeMode = false;

// ==========================================
// 2. КЕРУВАННЯ НАТИВНОЮ КНОПКОЮ ТЕЛЕГРАМУ
// ==========================================
let currentMainBtnCallback = null;

function setMainButton(text, color, callback) {
    mainBtn.setText(text);
    mainBtn.color = color;
    mainBtn.textColor = "#ffffff";
    mainBtn.show();
    
    if (currentMainBtnCallback) {
        tg.offEvent('mainButtonClicked', currentMainBtnCallback);
    }
    currentMainBtnCallback = callback;
    tg.onEvent('mainButtonClicked', currentMainBtnCallback);
}

function hideMainButton() {
    mainBtn.hide();
    if (currentMainBtnCallback) {
        tg.offEvent('mainButtonClicked', currentMainBtnCallback);
        currentMainBtnCallback = null;
    }
}

// ==========================================
// 3. ФУНКЦІЇ ПЕРЕХОДУ ДАЛІ (ДЛЯ НАТИВНОЇ КНОПКИ)
// ==========================================
function handleBasicNext() {
    const previewWorkspace = document.getElementById('preview-workspace');
    const activeCard = document.getElementById('active-card');
    const cardEditor = document.getElementById('card-editor');
    const cardImageWrap = document.getElementById('card-image-wrap');
    
    if (!cardEditor.innerText.trim() && cardImageWrap.style.display === 'none') {
        tg.showAlert('А написати щось чи додати фото? Пустушок не треба.');
        return;
    }
    
    previewWorkspace.innerHTML = '';
    const cardClone = activeCard.cloneNode(true);
    cardClone.id = 'preview-card';
    const clonedEditor = cardClone.querySelector('#card-editor');
    if (clonedEditor) { clonedEditor.id = 'preview-editor'; clonedEditor.setAttribute('contenteditable', 'false'); }
    
    previewWorkspace.appendChild(cardClone);
    builderOverlay.style.display = 'none';
    previewOverlay.style.display = 'flex';
    
    // Міняємо кнопку на Опублікувати
    setMainButton("ОПУБЛІКУВАТИ", "#4CAF50", handlePublish);
}

function handleAtmoNext() {
    const previewWorkspace = document.getElementById('preview-workspace');
    const atmoCard = document.getElementById('atmo-card');
    const hasPhoto = Array.from(atmoCard.querySelectorAll('.atmo-slot img')).some(img => img.style.display === 'block');
    
    if (!hasPhoto) { 
        tg.showAlert('Атмосфера без фото — це тупо вакуум. Додай хоча б одну пікчу.'); 
        return; 
    }

    currentMode = 'skrynka'; 
    previewWorkspace.innerHTML = '';
    const cardClone = atmoCard.cloneNode(true);
    cardClone.id = 'preview-atmo-card';

    cardClone.querySelectorAll('input').forEach(input => {
        input.disabled = true; input.style.border = 'none'; input.style.background = 'transparent'; input.style.color = '#333'; input.style.opacity = '1';
    });

    previewWorkspace.appendChild(cardClone);
    atmoOverlay.style.display = 'none';
    previewOverlay.style.display = 'flex';
    
    setMainButton("ОПУБЛІКУВАТИ", "#4CAF50", handlePublish);
}

function handlePhotoNext() {
    const previewWorkspace = document.getElementById('preview-workspace');
    const photoMainImg = document.getElementById('photo-main-img');
    const photoCard = document.getElementById('photo-card');
    
    if (photoMainImg.style.display === 'none') { 
        tg.showAlert('Закинь хоча б одну картинку.'); 
        return; 
    }

    currentMode = isMemeMode ? 'blackhole' : 'skrynka'; 
    previewWorkspace.innerHTML = '';
    const cardClone = photoCard.cloneNode(true);
    cardClone.id = 'preview-photo-card';

    const captionInput = cardClone.querySelector('#photo-caption-input');
    if (captionInput) captionInput.disabled = true;

    previewWorkspace.appendChild(cardClone);
    photoOverlay.style.display = 'none';
    previewOverlay.style.display = 'flex';
    
    setMainButton("ОПУБЛІКУВАТИ", "#4CAF50", handlePublish);
}

function handlePublish() {
    hideMainButton(); // Ховаємо нативну кнопку
    previewOverlay.style.display = 'none';
    successOverlay.style.display = 'flex';
    
    // Запускаємо потрібне відео
    successVideo.src = currentMode === 'blackhole' ? 'assets/vids/BlackHole.mp4' : 'assets/vids/skrynka.mp4';
    successVideo.play();
    
    // Показуємо текст "Відправлено"
    setTimeout(() => { 
        successText.style.opacity = '1'; 
    }, 1500);

    // АВТОПОВЕРНЕННЯ НА ГОЛОВНУ ЧЕРЕЗ 5 СЕКУНД
    setTimeout(() => {
        successOverlay.style.display = 'none';
        successText.style.opacity = '0'; // Ховаємо текст для наступного разу
        document.body.style.overflow = ''; // Повертаємо скрол
        window.scrollTo({ top: lastScrollY, behavior: 'instant' }); // Кидаємо туди, де юзер був
        tg.BackButton.hide(); // На всяк випадок ховаємо нативну стрілочку
    }, 5000); 
}


// ==========================================
// 4. ГОЛОВНИЙ МАРШРУТИЗАТОР КНОПОК
// ==========================================
document.querySelectorAll('.category-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        const cardType = btn.getAttribute('data-card-type');
        currentMode = btn.getAttribute('data-mode'); 
        const title = btn.getAttribute('data-title');
        
        lastScrollY = window.scrollY;

        if (cardType === 'basic') {
            document.getElementById('builder-title').innerText = title;
            document.getElementById('card-top-label').innerText = title;
            document.getElementById('card-editor').innerHTML = ''; 
            
            builderOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setMainButton("ДАЛІ", "#000000", handleBasicNext);showBackButton();

        } 
        else if (cardType === 'atmosphere') {
            atmoOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            renderAtmoStage('single-polaroid');
            setMainButton("ДАЛІ", "#000000", handleAtmoNext);showBackButton();

        } 
        else if (cardType === 'meme' || cardType === 'photo') {
            isMemeMode = (cardType === 'meme');
            document.getElementById('photo-title').innerText = title;
            
            document.getElementById('photo-main-img').style.display = 'none';
            document.getElementById('photo-main-img').src = '';
            document.getElementById('photo-placeholder-icon').style.display = 'block';
            document.getElementById('photo-caption-input').value = '';
            
            photoOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setMainButton("ДАЛІ", "#000000", handlePhotoNext);showBackButton();

        }
    });
});

// ==========================================
// 5. КНОПКИ НАЗАД (ЗАКРИТТЯ ОВЕРЛЕЇВ)
// ==========================================
document.getElementById('builder-back').addEventListener('click', () => {
    builderOverlay.style.display = 'none';
    document.body.style.overflow = '';
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
    hideMainButton();
});

document.getElementById('atmo-back').addEventListener('click', () => {
    atmoOverlay.style.display = 'none';
    document.body.style.overflow = '';
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
    hideMainButton();
});

document.getElementById('photo-back').addEventListener('click', () => {
    photoOverlay.style.display = 'none';
    document.body.style.overflow = '';
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
    hideMainButton();
});

document.getElementById('preview-back').addEventListener('click', () => {
    previewOverlay.style.display = 'none';
    
    if (document.getElementById('preview-atmo-card')) {
        atmoOverlay.style.display = 'flex';
        setMainButton("ДАЛІ", "#000000", handleAtmoNext);showBackButton();

    } else if (document.getElementById('preview-photo-card')) {
        photoOverlay.style.display = 'flex';
        setMainButton("ДАЛІ", "#000000", handlePhotoNext);showBackButton();

    } else {
        builderOverlay.style.display = 'flex'; 
        setMainButton("ДАЛІ", "#000000", handleBasicNext);showBackButton();

    }
});

// ==========================================
// 6. БАЗОВИЙ КОНСТРУКТОР (ЛОГІКА ТУЛБАРУ)
// ==========================================
const cardEditor = document.getElementById('card-editor');
const activeCard = document.getElementById('active-card');

document.getElementById('tool-bold').addEventListener('click', () => { document.execCommand('bold', false, null); cardEditor.focus(); });
document.getElementById('tool-italic').addEventListener('click', () => { document.execCommand('italic', false, null); cardEditor.focus(); });
document.getElementById('tool-font').addEventListener('change', (e) => activeCard.style.fontFamily = e.target.value);
document.getElementById('tool-color-text').addEventListener('input', (e) => activeCard.style.color = e.target.value);
document.getElementById('tool-color-bg').addEventListener('input', (e) => activeCard.style.backgroundColor = e.target.value);

cardEditor.addEventListener('input', () => {
    const textLength = cardEditor.innerText.trim().length;
    cardEditor.classList.remove('fs-huge', 'fs-large', 'fs-medium', 'fs-small');
    if (textLength < 50) cardEditor.classList.add('fs-huge');
    else if (textLength < 120) cardEditor.classList.add('fs-large');
    else if (textLength < 250) cardEditor.classList.add('fs-medium');
    else cardEditor.classList.add('fs-small');
});

const attachInput = document.getElementById('attach-input');
const cardImageWrap = document.getElementById('card-image-wrap');
const cardAttachedImg = document.getElementById('card-attached-img');

document.getElementById('tool-attach').addEventListener('click', () => attachInput.click());
attachInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) { cardAttachedImg.src = event.target.result; cardImageWrap.style.display = 'block'; };
        reader.readAsDataURL(file);
    }
});
document.getElementById('remove-attached-img').addEventListener('click', () => {
    attachInput.value = ''; cardAttachedImg.src = ''; cardImageWrap.style.display = 'none';
});

const anonText = document.getElementById('anon-text');
const anonIcon = document.getElementById('anon-icon');
document.getElementById('nickname-input').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) { anonText.innerText = val; anonIcon.innerText = 'person'; } 
    else { anonText.innerText = 'Анонімно'; anonIcon.innerText = 'domino_mask'; }
});

// ==========================================
// 7. КОНСТРУКТОР АТМОСФЕРИ (ЛОГІКА СЛОТІВ)
// ==========================================
const atmoStage = document.getElementById('atmo-stage');
const atmoCard = document.getElementById('atmo-card');
const atmoAnonText = document.getElementById('atmo-anon-text');
const atmoAnonIcon = document.getElementById('atmo-anon-icon');

document.getElementById('atmo-color-bg').addEventListener('input', (e) => atmoCard.style.backgroundColor = e.target.value);
document.getElementById('atmo-nickname-input').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) { atmoAnonText.innerText = val; atmoAnonIcon.innerText = 'person'; } 
    else { atmoAnonText.innerText = 'Анонімно'; atmoAnonIcon.innerText = 'domino_mask'; }
});

function renderAtmoStage(layout) {
    atmoStage.innerHTML = '';
    atmoStage.className = `atmo-stage atmo-stage--${layout}`;
    
    let slotCount = 1; let slotClass = 'slot-square'; let hasCaption = false;
    if (layout === 'single-polaroid') { slotCount = 1; slotClass = 'slot-polaroid'; hasCaption = true; }
    if (layout === 'two-polaroid') { slotCount = 2; slotClass = 'slot-polaroid'; hasCaption = true; }
    if (layout === 'grid-four') { slotCount = 4; slotClass = 'slot-grid-item'; }

    for (let i = 0; i < slotCount; i++) {
        const slot = document.createElement('div'); slot.className = `atmo-slot ${slotClass}`;
        const placeholder = document.createElement('div'); placeholder.className = 'atmo-slot-placeholder';
        placeholder.innerHTML = '<span class="material-symbols-outlined" style="font-size:32px;">add_photo_alternate</span>';
        
        const img = document.createElement('img');
        const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';

        slot.appendChild(placeholder); slot.appendChild(img); slot.appendChild(fileInput);

        if (hasCaption) {
            const captionInput = document.createElement('input');
            captionInput.type = 'text'; captionInput.className = 'atmo-caption'; captionInput.placeholder = 'підпис...'; captionInput.maxLength = 30;
            slot.appendChild(captionInput);
        }

        slot.addEventListener('click', (e) => { if (e.target.tagName !== 'INPUT') fileInput.click(); });
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    img.src = event.target.result; img.style.display = 'block';
                    placeholder.style.display = 'none'; slot.style.border = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        atmoStage.appendChild(slot);
    }
}

// ==========================================
// 8. КОНСТРУКТОР ФОТО/МЕМ (ЛОГІКА)
// ==========================================
const photoDropZone = document.getElementById('photo-drop-zone');
const photoFileInput = document.getElementById('photo-file-input');
const photoMainImg = document.getElementById('photo-main-img');
const photoPlaceholderIcon = document.getElementById('photo-placeholder-icon');
const photoAnonText = document.getElementById('photo-anon-text');
const photoAnonIcon = document.getElementById('photo-anon-icon');

photoDropZone.addEventListener('click', () => photoFileInput.click());
photoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            photoMainImg.src = event.target.result; photoMainImg.style.display = 'block'; photoPlaceholderIcon.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('photo-nickname-input').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) { photoAnonText.innerText = val; photoAnonIcon.innerText = 'person'; } 
    else { photoAnonText.innerText = 'Анонімно'; photoAnonIcon.innerText = 'domino_mask'; }
});
