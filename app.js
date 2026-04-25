// ==========================================
// 1. ГЛОБАЛЬНІ ЗМІННІ ТА ЕКРАНИ
// ==========================================
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
// 2. ГОЛОВНИЙ МАРШРУТИЗАТОР КНОПОК
// ==========================================
const categoryButtons = document.querySelectorAll('.category-trigger');

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const cardType = btn.getAttribute('data-card-type');
        currentMode = btn.getAttribute('data-mode'); // skrynka або blackhole
        const title = btn.getAttribute('data-title');
        
        lastScrollY = window.scrollY;

        if (cardType === 'basic') {
            document.getElementById('builder-title').innerText = title;
            document.getElementById('card-top-label').innerText = title;
            document.getElementById('card-editor').innerHTML = ''; 
            
            builderOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } 
        else if (cardType === 'atmosphere') {
            atmoOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            renderAtmoStage('single-polaroid'); // Дефолтний лейаут
        } 
        else if (cardType === 'meme' || cardType === 'photo') {
            isMemeMode = (cardType === 'meme');
            document.getElementById('photo-title').innerText = title;
            
            // Чистимо попереднє фото
            document.getElementById('photo-main-img').style.display = 'none';
            document.getElementById('photo-main-img').src = '';
            document.getElementById('photo-placeholder-icon').style.display = 'block';
            document.getElementById('photo-caption-input').value = '';
            
            photoOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });
});

// ==========================================
// 3. КНОПКИ НАЗАД (ЗАКРИТТЯ ОВЕРЛЕЇВ)
// ==========================================
document.getElementById('builder-back').addEventListener('click', () => {
    builderOverlay.style.display = 'none';
    document.body.style.overflow = '';
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
});

document.getElementById('atmo-back').addEventListener('click', () => {
    atmoOverlay.style.display = 'none';
    document.body.style.overflow = '';
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
});

document.getElementById('photo-back').addEventListener('click', () => {
    photoOverlay.style.display = 'none';
    document.body.style.overflow = '';
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
});

document.getElementById('preview-back').addEventListener('click', () => {
    previewOverlay.style.display = 'none';
    
    // Перевіряємо, що лежить у прев'ю, щоб повернутись в правильний конструктор
    if (document.getElementById('preview-atmo-card')) {
        atmoOverlay.style.display = 'flex';
    } else if (document.getElementById('preview-photo-card')) {
        photoOverlay.style.display = 'flex';
    } else {
        builderOverlay.style.display = 'flex'; 
    }
});

// ==========================================
// 4. БАЗОВИЙ КОНСТРУКТОР
// ==========================================
const cardEditor = document.getElementById('card-editor');
const activeCard = document.getElementById('active-card');
const toolBold = document.getElementById('tool-bold');
const toolItalic = document.getElementById('tool-italic');
const toolFont = document.getElementById('tool-font');
const toolColorText = document.getElementById('tool-color-text');
const toolColorBg = document.getElementById('tool-color-bg');

const toolAttach = document.getElementById('tool-attach');
const attachInput = document.getElementById('attach-input');
const cardImageWrap = document.getElementById('card-image-wrap');
const cardAttachedImg = document.getElementById('card-attached-img');
const removeAttachedImg = document.getElementById('remove-attached-img');

const nicknameInput = document.getElementById('nickname-input');
const anonText = document.getElementById('anon-text');
const anonIcon = document.getElementById('anon-icon');

toolBold.addEventListener('click', () => { document.execCommand('bold', false, null); cardEditor.focus(); });
toolItalic.addEventListener('click', () => { document.execCommand('italic', false, null); cardEditor.focus(); });

toolFont.addEventListener('change', (e) => activeCard.style.fontFamily = e.target.value);
toolColorText.addEventListener('input', (e) => activeCard.style.color = e.target.value);
toolColorBg.addEventListener('input', (e) => activeCard.style.backgroundColor = e.target.value);

cardEditor.addEventListener('input', () => {
    const textLength = cardEditor.innerText.trim().length;
    cardEditor.classList.remove('fs-huge', 'fs-large', 'fs-medium', 'fs-small');
    if (textLength < 50) cardEditor.classList.add('fs-huge');
    else if (textLength < 120) cardEditor.classList.add('fs-large');
    else if (textLength < 250) cardEditor.classList.add('fs-medium');
    else cardEditor.classList.add('fs-small');
});

toolAttach.addEventListener('click', () => attachInput.click());
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
removeAttachedImg.addEventListener('click', () => {
    attachInput.value = '';
    cardAttachedImg.src = '';
    cardImageWrap.style.display = 'none';
});

nicknameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) { anonText.innerText = val; anonIcon.innerText = 'person'; } 
    else { anonText.innerText = 'Анонімно'; anonIcon.innerText = 'domino_mask'; }
});

document.getElementById('builder-next-btn').addEventListener('click', () => {
    const previewWorkspace = document.getElementById('preview-workspace');
    if (!cardEditor.innerText.trim() && cardImageWrap.style.display === 'none') {
        alert('А написати щось чи додати фото? Карток-пустушок нам не треба.');
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
});

// ==========================================
// 5. КОНСТРУКТОР АТМОСФЕРИ
// ==========================================
const atmoStage = document.getElementById('atmo-stage');
const atmoColorBg = document.getElementById('atmo-color-bg');
const atmoCard = document.getElementById('atmo-card');
const atmoNicknameInput = document.getElementById('atmo-nickname-input');
const atmoAnonText = document.getElementById('atmo-anon-text');
const atmoAnonIcon = document.getElementById('atmo-anon-icon');

atmoColorBg.addEventListener('input', (e) => atmoCard.style.backgroundColor = e.target.value);

atmoNicknameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) { atmoAnonText.innerText = val; atmoAnonIcon.innerText = 'person'; } 
    else { atmoAnonText.innerText = 'Анонімно'; atmoAnonIcon.innerText = 'domino_mask'; }
});

document.querySelectorAll('.atmo-layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.atmo-layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAtmoStage(btn.getAttribute('data-layout'));
    });
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

document.getElementById('atmo-next-btn').addEventListener('click', () => {
    const previewWorkspace = document.getElementById('preview-workspace');
    const hasPhoto = Array.from(atmoCard.querySelectorAll('.atmo-slot img')).some(img => img.style.display === 'block');
    
    if (!hasPhoto) { alert('Атмосфера без фото — це тупо вакуум. Додай хоча б одну пікчу.'); return; }

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
});

// ==========================================
// 6. КОНСТРУКТОР ФОТО/МЕМ
// ==========================================
const photoDropZone = document.getElementById('photo-drop-zone');
const photoFileInput = document.getElementById('photo-file-input');
const photoMainImg = document.getElementById('photo-main-img');
const photoPlaceholderIcon = document.getElementById('photo-placeholder-icon');
const photoNicknameInput = document.getElementById('photo-nickname-input');
const photoAnonText = document.getElementById('photo-anon-text');
const photoAnonIcon = document.getElementById('photo-anon-icon');
const photoCard = document.getElementById('photo-card');

photoDropZone.addEventListener('click', () => photoFileInput.click());

photoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            photoMainImg.src = event.target.result;
            photoMainImg.style.display = 'block';
            photoPlaceholderIcon.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

photoNicknameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) { photoAnonText.innerText = val; photoAnonIcon.innerText = 'person'; } 
    else { photoAnonText.innerText = 'Анонімно'; photoAnonIcon.innerText = 'domino_mask'; }
});

document.getElementById('photo-next-btn').addEventListener('click', () => {
    const previewWorkspace = document.getElementById('preview-workspace');
    if (photoMainImg.style.display === 'none') { alert('Закинь хоча б одну картинку.'); return; }

    currentMode = isMemeMode ? 'blackhole' : 'skrynka'; 
    previewWorkspace.innerHTML = '';
    const cardClone = photoCard.cloneNode(true);
    cardClone.id = 'preview-photo-card';

    const captionInput = cardClone.querySelector('#photo-caption-input');
    if (captionInput) captionInput.disabled = true;

    previewWorkspace.appendChild(cardClone);
    photoOverlay.style.display = 'none';
    previewOverlay.style.display = 'flex';
});

// ==========================================
// 7. ФІНАЛЬНА ПУБЛІКАЦІЯ
// ==========================================
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
