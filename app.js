// --- НАЛАШТУВАННЯ ТГ ---
const TG_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TG_CHAT_ID = 'YOUR_SUPERGROUP_ID';
const TG_THREAD_ID = 'YOUR_THREAD_ID';

// --- ГЛОБАЛЬНІ ЗМІННІ ---
const overlay = document.getElementById('master-editor-overlay');
const closeBtn = document.getElementById('close-editor-btn');
const workspace = document.getElementById('editor-workspace');
const videoBg = document.getElementById('master-video-bg');
const overlayTitle = document.getElementById('editor-dynamic-title');
const triggers = document.querySelectorAll('.category-trigger');

let currentMode = ''; 
let currentCardData = {};

// --- СЛУХАЧІ ДЛЯ ВІДКРИТТЯ КАРТКИ ---
triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const dataset = btn.dataset;
        if (!dataset.title) return; 

        currentMode = dataset.mode;
        currentCardData = {
            title: dataset.title,
            placeholder: dataset.placeholder,
            font: dataset.font,
            type: dataset.cardType
        };

        openEditor();
    });
});

// --- ЗАКРИТТЯ РЕДАКТОРА ---
closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    videoBg.style.display = 'none';
    videoBg.pause();
});

// --- ВІДКРИТТЯ РЕДАКТОРА ТА ГЕНЕРАЦІЯ КАРТКИ ---
function openEditor() {
    overlay.style.display = 'flex';
    overlayTitle.textContent = currentCardData.title;
    
    videoBg.src = currentMode === 'blackhole' ? 'assets/vids/BlackHole.mp4' : 'assets/vids/skrynka.mp4';
    
    renderEditState();
}

// --- СТАН: РЕДАГУВАННЯ ---
function renderEditState() {
    workspace.innerHTML = `
        <div class="prmln-card-wrapper">
            <div class="prmln-card-content" 
                 contenteditable="true" 
                 data-placeholder="${currentCardData.placeholder}" 
                 style="font-family: '${currentCardData.font}', sans-serif;"></div>
        </div>
        <div class="action-bottom-bar" id="sticky-bar">
            <button class="btn-sticky" id="btn-next">Далі</button>
        </div>
    `;

    setupVisualViewportFix();

    document.getElementById('btn-next').addEventListener('click', renderPreviewState);
}

// --- СТАН: ПРЕВ'Ю ---
function renderPreviewState() {
    const cardContent = document.querySelector('.prmln-card-content');
    cardContent.setAttribute('contenteditable', 'false'); // Заморожуємо текст

    workspace.innerHTML = `
        <div class="prmln-card-wrapper">
            ${document.querySelector('.prmln-card-wrapper').innerHTML}
        </div>
        <div class="action-bottom-bar" id="sticky-bar">
            <button class="btn-sticky btn-secondary" id="btn-back">Назад</button>
            <button class="btn-sticky" id="btn-publish">Опублікувати</button>
        </div>
    `;

    document.getElementById('btn-back').addEventListener('click', renderEditState);
    document.getElementById('btn-publish').addEventListener('click', publishCard);
}

// --- ПУБЛІКАЦІЯ ТА ВІДЕО ---
function publishCard() {
    const header = document.querySelector('.submit-header');
    header.style.display = 'none';
    workspace.style.display = 'none';
    
    videoBg.style.display = 'block';
    videoBg.play();

    // Створюємо текст поверх відео
    const videoText = document.createElement('div');
    videoText.className = 'video-text-overlay';
    videoText.innerHTML = 'Відправлено до Валківської Приймальні.<br>Очікуйте вашу публікацію на каналі';
    overlay.appendChild(videoText);

    videoText.style.display = 'block';
    setTimeout(() => {
        videoText.style.opacity = '1';
    }, 500);

    sendToTelegram();

    // Автозакриття після відоса
    setTimeout(() => {
        overlay.style.display = 'none';
        header.style.display = 'flex';
        workspace.style.display = 'flex';
        videoText.remove();
    }, 4500); 
}

// --- ВІДПРАВКА В ТГ БОТА ---
async function sendToTelegram() {
    const contentText = document.querySelector('.prmln-card-content').innerText;
    const message = `Нова картка: ${currentCardData.title}\n\nТекст:\n${contentText}`;

    // Тут потім заміниш на відправку згенерованої картинки, поки що шлемо текст
    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
    
    /* Розкоментуй коли впишеш токен
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            message_thread_id: TG_THREAD_ID,
            text: message
        })
    });
    */
}

// --- ФІКС КЛАВІАТУРИ IOS (ВИДИМИЙ VIEWPORT) ---
function setupVisualViewportFix() {
    const stickyBar = document.getElementById('sticky-bar');
    if (!window.visualViewport || !stickyBar) return;

    window.visualViewport.addEventListener('resize', () => {
        const viewportHeight = window.visualViewport.height;
        const offsetTop = window.visualViewport.offsetTop;
        
        if (viewportHeight < window.innerHeight) {
            stickyBar.style.bottom = `${window.innerHeight - viewportHeight - offsetTop}px`;
        } else {
            stickyBar.style.bottom = '0px';
        }
    });
}

// --- ДВЕРІ ТА ІНВЕНТАР (ЗАГЛУШКА НА 1 АЧІВКУ) ---
const secretDoor = document.getElementById('secret-door');
const bagBtn = document.getElementById('bag-btn');
const bagOverlay = document.getElementById('bag-overlay');
const bagClose = document.getElementById('bag-close');
const bagContent = document.getElementById('bag-content');

secretDoor.addEventListener('click', () => {
    alert('Тут поки що нічого нема, двері заколочені. Але ти знайшов пасхалку.');
});

bagBtn.addEventListener('click', () => {
    bagOverlay.style.display = 'flex';
    bagContent.innerHTML = `
        <div style="padding: 20px; font-family: 'Space Grotesk', sans-serif;">
            <div style="margin-bottom: 15px;">🏆 <b>Досягнення:</b> Першовідкривач (знайшов рюкзак)</div>
            <div>🔮 <b>Артефакт:</b> Пилюка з Ранчо</div>
        </div>
    `;
});

bagClose.addEventListener('click', () => {
    bagOverlay.style.display = 'none';
});
