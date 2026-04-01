document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = '0';
    document.fonts.ready.then(() => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '1';
    });

    const glitchLetter = document.getElementById('glitch-letter');
    if (glitchLetter) {
        setInterval(() => {
            glitchLetter.innerText = glitchLetter.innerText === 'Е' ? 'О' : 'Е';
        }, 800);
    }

    const hints = ["як зробити місто краще", "а давайте…", "можна ж було б…", "як покращити…"];
    const hintEl = document.getElementById('idea-hint-text');
    if (hintEl) {
        let hintIdx = 0;
        setInterval(() => {
            hintIdx = (hintIdx + 1) % hints.length;
            hintEl.innerText = hints[hintIdx];
        }, 2000);
    }

    const words = ["щось..", "про.."];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const storyEl = document.getElementById('story-text');

    function typeWriter() {
        if (!storyEl) return;
        const currentWord = words[wordIdx];
        if (isDeleting) {
            storyEl.innerText = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            storyEl.innerText = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }
        let speed = isDeleting ? 40 : 120;
        if (!isDeleting && charIdx === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            speed = 500;
        }
        setTimeout(typeWriter, speed);
    }
    typeWriter();

    const silenceBtn = document.getElementById('btn-silence');
    const overlay = document.getElementById('silence-overlay');
    const closeBtn = document.getElementById('close-silence');
    const timerEl = document.getElementById('silence-timer');
    const breatheContainer = document.getElementById('breathe-container');
    const breatheMsg = document.getElementById('breathe-msg');
    const silenceMainMsg = document.getElementById('silence-main-msg');
    let silenceInterval;
    let silenceTimeout;
    let breatheInterval;
    let initialTimeout;

    function closeSilence() {
        if (overlay) overlay.style.display = 'none';
        clearInterval(silenceInterval);
        clearInterval(breatheInterval);
        clearTimeout(initialTimeout);
        clearTimeout(silenceTimeout);
    }

    if (silenceBtn && overlay) {
        const noseIcon = document.getElementById('nose-icon');

        silenceBtn.addEventListener('click', () => {
            overlay.style.display = 'flex';
            breatheContainer.style.display = 'none';
            timerEl.style.display = 'none';
            silenceMainMsg.style.display = 'block';
            silenceMainMsg.innerText = 'ну мовчіть...';

            initialTimeout = setTimeout(() => {
                silenceMainMsg.innerText = 'давайте подихаємо або шо..';

                silenceTimeout = setTimeout(() => {
                    silenceMainMsg.style.display = 'none';
                    breatheContainer.style.display = 'flex';
                    timerEl.style.display = 'block';
                    timerEl.innerText = '30';
                    let timeLeft = 30;

                    silenceInterval = setInterval(() => {
                        timeLeft--;
                        timerEl.innerText = timeLeft;
                        if (timeLeft <= 0) closeSilence();
                    }, 1000);

                    breatheMsg.innerText = 'Вдих';
                    noseIcon.className = 'nose-emoji nose-exhale';
                    noseIcon.innerText = '👃🏻';

                    setTimeout(() => {
                        noseIcon.className = 'nose-emoji nose-inhale';
                    }, 50);

                    breatheInterval = setInterval(() => {
                        if (breatheMsg.innerText === 'Вдих') {
                            breatheMsg.innerText = 'Виииидих';
                            noseIcon.className = 'nose-emoji nose-exhale';
                            noseIcon.innerText = '😮‍💨';
                        } else {
                            breatheMsg.innerText = 'Вдих';
                            noseIcon.className = 'nose-emoji nose-inhale';
                            noseIcon.innerText = '👃🏻';
                        }
                    }, 4000);

                }, 2000);
            }, 1500);
        });

        closeBtn.addEventListener('click', closeSilence);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSilence();
        });
    }

    const fab = document.getElementById('scroll-fab');
    const fabIcon = document.getElementById('fab-icon');

    function checkScrollPosition() {
        const scrolledToBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10;
        if (fab) {
            if (window.scrollY > 100) {
                fab.classList.add('show');
            } else {
                fab.classList.remove('show');
            }
        }
        if (fabIcon) {
            fabIcon.innerHTML = scrolledToBottom ? 'arrow_upward' : 'arrow_downward';
        }
    }

    window.addEventListener('scroll', checkScrollPosition);

    if (fab) {
        fab.addEventListener('click', () => {
            if (fabIcon.innerHTML === 'arrow_upward') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const shopopaloBtn = document.querySelector('.b-shopopalo');
                if (shopopaloBtn) {
                    shopopaloBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            }
        });
    }

    setTimeout(() => {
        const peekY = Math.min(400, document.body.scrollHeight / 2.5);

        function bounceScroll(targetY, duration, easing, callback) {
            const startY = window.scrollY;
            const diff = targetY - startY;
            let start = null;

            function step(timestamp) {
                if (!start) start = timestamp;
                const time = timestamp - start;
                const percent = Math.min(time / duration, 1);
                window.scrollTo(0, startY + diff * easing(percent));
                if (time < duration) {
                    window.requestAnimationFrame(step);
                } else if (callback) {
                    callback();
                }
            }
            window.requestAnimationFrame(step);
        }

        const easeOutExpo = x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        const easeInOutCubic = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

        bounceScroll(peekY, 800, easeOutExpo, () => {
            setTimeout(() => {
                bounceScroll(0, 550, easeInOutCubic);
            }, 150);
        });
    }, 600);

    let isInitialLoad = true;
    setTimeout(() => { isInitialLoad = false; }, 800);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.pressing && !isInitialLoad) {
                entry.target.dataset.pressing = 'true';
                entry.target.classList.add('simulate-press');
                setTimeout(() => {
                    entry.target.classList.remove('simulate-press');
                    delete entry.target.dataset.pressing;
                }, 400);
            }
        });
    }, {
        rootMargin: '-30% 0px -30% 0px'
    });

    document.querySelectorAll('.btn').forEach(btn => {
        observer.observe(btn);
    });

    document.querySelectorAll('.react').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('clicked')) return;
            this.classList.add('clicked');
            let parts = this.innerText.split(' ');
            let count = parseInt(parts[1]) + 1;
            this.innerText = parts[0] + ' ' + count;
            this.style.background = '#e7f3ff';
            this.style.color = '#1877f2';
        });
    });



    const complainPhrases = ["🚰на відсутність води", "на сусідів 🏘️", "🐟 на вонючу рибу в магазині", "на 🕳️ яму", "на життя 😫", "на ще щось", "🔥 на паліїв 🔥", "💸🏷️на ціни"];
    let complainIdx = 0;
    const popEl = document.getElementById('complain-pop');

    if (popEl) {
        setInterval(() => {
            popEl.classList.remove('pop-up');
            setTimeout(() => {
                complainIdx = (complainIdx + 1) % complainPhrases.length;
                popEl.innerText = complainPhrases[complainIdx];
                popEl.classList.add('pop-up');
            }, 500);
        }, 2000);
    }

    const rumorsWrap = document.getElementById('rumors-btn-wrap');
    const rumorsDesc = document.getElementById('rumors-dynamic-text');
    const rumorsTitle = document.getElementById('rumors-title');

    if (rumorsWrap && rumorsDesc && rumorsTitle) {
        const rumorPhrases = ["А ви чули, шо...", "А ви бачили….?", "А ЦЕ ПРАВДА, ШО..", "Кажуть, шо..."];
        const actionPhrases = ["НАПИСАТИ", "ЗАПИТАТИ"];
        const emojis = ["😮", "👀", "🫢", "🤔", "👂"];
        let rIdx = 0;
        let aIdx = 0;

        function runRumorsCycle() {
            rumorsWrap.classList.add('is-button-mode');
            aIdx = (aIdx + 1) % actionPhrases.length;
            rumorsDesc.innerText = actionPhrases[aIdx];

            let scrambleCount = 0;
            const scrambleInt = setInterval(() => {
                scrambleCount++;
                let str = "";
                for (let i = 0; i < 3; i++) str += emojis[Math.floor(Math.random() * emojis.length)];
                rumorsTitle.innerText = str;
                if (scrambleCount > 8) {
                    clearInterval(scrambleInt);
                    rumorsTitle.innerText = "ЧУТКИ";
                }
            }, 250);

            setTimeout(() => {
                rumorsWrap.classList.remove('is-button-mode');
                rIdx = (rIdx + 1) % rumorPhrases.length;
                rumorsDesc.innerText = rumorPhrases[rIdx];
                rumorsTitle.innerText = "ЧУТКИ";
                setTimeout(runRumorsCycle, 4000);
            }, 6000);
        }

        setTimeout(runRumorsCycle, 4000);
    }
    
    //сабміт тута//

const submitOverlay = document.getElementById('submit-overlay');
const closeSubmitBtn = document.getElementById('close-submit');
const submitActionBtn = document.getElementById('submit-action-btn');
const submitEditor = document.getElementById('submit-editor');
const submitContent = document.getElementById('submit-content');
const submitSentScreen = document.getElementById('submit-sent-screen');
const closeSentBtn = document.getElementById('close-sent');
const submitVideo = document.getElementById('submit-video');
const attachBtn = document.getElementById('attach-btn');
const attachInput = document.getElementById('attach-input');
const attachPreview = document.getElementById('attach-preview');
const fontSelect = document.getElementById('font-select');
const submitPreviewScreen = document.getElementById('submit-preview-screen');
const previewPostCard = document.getElementById('preview-post-card');
const previewMetaLine = document.getElementById('preview-meta-line');
const previewEditBtn = document.getElementById('preview-edit-btn');
const previewSendBtn = document.getElementById('preview-send-btn');

let lastScrollY = 0;
let finishSendTimeout;

const buttonTitles = {
    '.b-write-main': 'НАПИСАТИ',
    '.b-story': 'РОЗКАЗАТИ',
    '.b-serious': 'НАПИСАТИ ЩОСЬ СЕРЙОЗНЕ',
    '.b-petition': 'ЗВЕРНЕННЯ',
    '.b-complain': 'ПОСКАРЖИТИСЬ',
    '.b-zbir': 'ЗБІР',
    '.b-idea': 'Є ІДЕЯ',
    '.b-thank': 'ПОДЯКУВАТИ',
    '.b-unpopular': 'НЕПОПУЛЯРНА ДУМКА',
    '.b-shopopalo': 'ШОПОПАЛО',
    '.b-admins': 'НАПИСАТИ АДМІНАМ',
    '.rumors-container': 'ЧУТКИ',
    '.b-problem': 'ОТАКА ПРОБЛЕМА',
    '.b-advice': 'ПОТРІБНА ПОРАДА',
    '.b-birthday': 'ПРИВІТАТИ З ДНЕМ НАРОДЖЕННЯ'
};

let toastTimeout;
function showValkyToast(text) {
    if (!text) return;
    
    let toast = document.getElementById('valky-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'valky-toast';
        toast.className = 'valky-toast';
        document.body.appendChild(toast);
    }
    
    toast.innerText = text;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000); 
}



function openSubmitOverlay(mode, placeholderText, defaultFont, titleText) {
    lastScrollY = window.scrollY;
    submitOverlay.className = `submit-overlay ${mode}-mode`;
    submitOverlay.style.display = 'flex';
    submitContent.style.display = 'flex';
    submitPreviewScreen.style.display = 'none';  
    submitSentScreen.style.display = 'none';
    submitVideo.style.transition = 'none';
    submitVideo.style.display = 'block';
    document.body.classList.add('submit-open');

    const overlayTitle = submitOverlay.querySelector('.submit-overlay-title');
    if (overlayTitle) overlayTitle.style.display = 'none'; 

    let innerTitle = submitContent.querySelector('.caps-label.dynamic-title');
    if (!innerTitle) {
        innerTitle = document.createElement('div');
        innerTitle.className = 'caps-label dynamic-title';
        innerTitle.style.marginBottom = '15px';
        innerTitle.style.color = '#fff';
        innerTitle.style.textAlign = 'center';
        const editorWrap = document.querySelector('.submit-editor-wrap');
        submitContent.insertBefore(innerTitle, editorWrap);
    }
    innerTitle.innerText = titleText || 'НАПИСАТИ';

    const src = mode === 'mailbox' ? 'assets/vids/skrynka.mp4' : 'assets/vids/BlackHole.mp4';
    submitVideo.src = src;
    submitVideo.style.filter = '';
    submitVideo.style.transition = '';
    submitVideo.load();
    submitVideo.pause();
    submitVideo.currentTime = 0;
    
    submitEditor.innerHTML = '';
    submitEditor.setAttribute('data-placeholder', 'Пишіть сюди...');
    
    const counter = document.getElementById('char-counter');
    if (counter) counter.innerText = '0';
    
    const cardHint = document.getElementById('card-count-hint');
    if (cardHint) cardHint.innerText = '';
    
    const inlinePreview = document.getElementById('attach-preview-inline');
    if (inlinePreview) inlinePreview.innerHTML = '';
    
    const appliedFont = defaultFont ? `'${defaultFont}', sans-serif` : 'Inter, sans-serif';
    submitEditor.style.fontFamily = appliedFont;
    submitEditor.dataset.activeFont = appliedFont;
    
    if (fontSelect) {
        Array.from(fontSelect.options).forEach(opt => {
            if (appliedFont.includes(opt.value)) {
                fontSelect.value = opt.value;
            }
        });
    }

 
    const hintEl = document.getElementById('submit-hint-text');
    if (hintEl) hintEl.style.display = 'none'; 

    if (placeholderText) {
        showValkyToast(placeholderText); 
    }
    

    currentBgColor = '#FAF8F4';
    currentTextColor = '#222221';
    textColorDots.forEach(d => d.classList.toggle('active', d.dataset.color === '#222221'));
    bgColorDots.forEach(d => d.classList.toggle('active', d.dataset.color === '#FAF8F4'));
    applyEditorColors();
}



submitEditor.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
    submitEditor.style.fontFamily = submitEditor.dataset.activeFont || 'Inter, sans-serif';
});

submitEditor.addEventListener('input', () => {
    submitEditor.style.fontFamily = submitEditor.dataset.activeFont || 'Inter, sans-serif';
    const len = submitEditor.innerText.replace(/\n$/, '').length;
    const counter = document.getElementById('char-counter');
    if (counter) counter.innerText = len; 
    
    const cardHint = document.getElementById('card-count-hint');
    if (cardHint) {
        const cardCount = Math.ceil(len / 350) || 1;
        if (cardCount > 1) {
            cardHint.innerHTML = `<div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.25); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); padding:6px 16px; border-radius:20px; font-size:13px; font-family:'Inter',sans-serif; color:#fff; font-weight:600; box-shadow:0 4px 15px rgba(0,0,0,0.1); border:1px solid rgba(255,255,255,0.1);"><span class="material-symbols-outlined" style="font-size:18px;">auto_awesome_mosaic</span> Розділено на ${cardCount} картки</div>`;
        } else {
            cardHint.innerHTML = '';
        }
    }
});




function closeSubmitOverlay() {
    submitOverlay.style.display = 'none';
    submitOverlay.className = 'submit-overlay';
    submitEditor.innerHTML = '';
    
    const inlinePreview = document.getElementById('attach-preview-inline');
    if (inlinePreview) inlinePreview.innerHTML = '';
    
    if (typeof submitVideo !== 'undefined' && submitVideo) {
        submitVideo.pause();
        submitVideo.src = '';
        submitVideo.style.display = '';
    }

   
    if (typeof atmoVideo !== 'undefined' && atmoVideo) {
        atmoVideo.style.display = ''; 
        atmoVideo.style.filter = '';
        atmoVideo.style.zIndex = '';
        atmoVideo.play().catch(e => console.log('Safari video unfreeze:', e));
    }
    
    clearTimeout(finishSendTimeout);
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });

    const atmoPreviewScreen = document.getElementById('atmo-preview-screen');
    const atmoContent = document.getElementById('atmo-content');
    const atmoSentScreen = document.getElementById('atmo-sent-screen');

    if (atmoPreviewScreen) atmoPreviewScreen.style.display = 'none';
    if (atmoContent) atmoContent.style.display = 'flex';
    if (atmoSentScreen) atmoSentScreen.style.display = 'none';

    const atmoImgs = document.querySelectorAll('.atmo-slot-img-fill');
    atmoImgs.forEach(img => {
        img.src = '';
        img.style.display = 'none';
    });

    const atmoCaps = document.querySelectorAll('.atmo-polaroid-caption');
    atmoCaps.forEach(cap => cap.value = '');

   
    const allHeaders = document.querySelectorAll('.submit-header');
    allHeaders.forEach(h => h.style.display = '');
}



const mailboxButtons = ['.b-story', '.b-serious', '.b-petition', '.b-complain', '.b-birthday', '.b-zbir', '.b-idea', '.side-tag', '.b-write-main', '.b-thank', '.b-advice'];
const holeButtons = ['.b-unpopular', '.b-shopopalo', '.b-admins', '.rumors-container', '.b-problem'];


const buttonPlaceholders = {
    '.b-write-main': 'Ну пишіть',
    '.b-story': 'Розказуйте',
    '.b-serious': 'Пишіть щось, ну тільки ж серйозне(о)',
    '.b-petition': 'Це ж неофіційне звернення, ви ж розумієте? Але ВОНИ побачать, не сумнівайтеся 👀',
    '.b-complain': 'Шо там вже сталося? Розказуйте-показуйте. Матюкатись можна.',
    '.b-zbir': 'Додайте будь ласка всю важливу інформацію, офіційний (якщо є) запит, контакти і посилання, а також текст збору. Ми перевіримо і обовʼязково опублікуємо',
    '.b-idea': 'Цікаво-цікаво. Розказуйте',
    '.b-thank': 'Кому і за шо дякувати будете? Пишіть ❤️',
    '.b-unpopular': 'Ага, тобто хочете срач розпочати?',
    '.b-shopopalo': 'Пишіть своє шопопало, але майте на увазі, що якщо шопопалість вашого шопопала буде занадто, ми не гарантуємо, що опублікуємо це на каналі',
    '.b-admins': 'Ну пишіть вже...',
    '.rumors-container': 'Ну розказуйте шо чули, шо бачили. Чи ви просто запитати?',
    '.b-problem': 'Розказуйте-показуйте. Де, шо і коли',
    '.b-advice': 'Можливо вам підкажуть щось',
    '.b-birthday': 'Напишіть своє привітання, побажання. Можна додати картинку'
};


const buttonFonts = {
    '.b-write-main': 'Fira Sans Extra Condensed',
    '.b-story': 'Vollkorn',
    '.b-serious': 'Philosopher',
    '.b-petition': 'Vollkorn',
    '.side-tag': 'Inter',
    '.rumors-container': 'Balsamiq Sans',
    '.b-thank': 'Fira Sans Extra Condensed',
    '.b-complain': 'Oswald',
    '.b-problem': 'Fira Sans Extra Condensed',
    '.b-unpopular': 'Dela Gothic One',
    '.b-zbir': 'Space Grotesk',
    '.b-idea': 'Oswald',
    '.b-shopopalo': 'Balsamiq Sans',
    '.b-birthday': 'Bad Script',
    '.b-admins': 'Fira Sans Extra Condensed',
    '.b-advice': 'Fira Sans Extra Condensed'
};



// цикли mailboxButtons.forEach + holeButtons.forEach//
mailboxButtons.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('click', () => openSubmitOverlay('mailbox', buttonPlaceholders[sel], buttonFonts[sel], buttonTitles[sel]));
});

holeButtons.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('click', () => openSubmitOverlay('hole', buttonPlaceholders[sel], buttonFonts[sel], buttonTitles[sel]));
});



if (closeSubmitBtn) closeSubmitBtn.addEventListener('click', closeSubmitOverlay);

if (closeSentBtn) closeSentBtn.addEventListener('click', closeSubmitOverlay);

submitOverlay.addEventListener('click', (e) => {
    if (e.target === submitOverlay) closeSubmitOverlay();
});

document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        document.execCommand(btn.dataset.cmd, false, null);
        btn.classList.toggle('active');
        submitEditor.focus();
    });
});


if (fontSelect) {
    fontSelect.addEventListener('change', () => {
        const selectedFont = fontSelect.value;
        const fontString = `'${selectedFont}', sans-serif`;
        submitEditor.style.fontFamily = fontString;
        submitEditor.dataset.activeFont = fontString;
        submitEditor.focus();
    });
}

const attachPreviewInline = document.getElementById('attach-preview-inline');

if (attachBtn && attachInput) {
    attachBtn.addEventListener('click', () => attachInput.click());
    attachInput.addEventListener('change', () => {
        const file = attachInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (attachPreviewInline) {
                attachPreviewInline.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'attach-thumb-full';
                attachPreviewInline.appendChild(img);
            }
        };
        reader.readAsDataURL(file);
    });
}
const mainTextColorBtn = document.getElementById('main-text-color');
const mainBgColorBtn = document.getElementById('main-bg-color');
const popoverText = document.getElementById('popover-text');
const popoverBg = document.getElementById('popover-bg');
const inlineDoneBtn = document.getElementById('inline-done-btn');

let currentBgColor = '#FAF8F4';
let currentTextColor = '#222221';

function applyEditorColors() {
    submitEditor.style.background = currentBgColor;
    submitEditor.style.color = currentTextColor;
    mainTextColorBtn.style.background = currentTextColor;
    mainBgColorBtn.style.background = currentBgColor;
}

function bindKeepFocus(element, callback) {
    if (!element) return;
    element.addEventListener('mousedown', (e) => {
        e.preventDefault();
        callback(e);
    });
    element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        callback(e);
    }, { passive: false });
}

bindKeepFocus(mainTextColorBtn, () => {
    popoverText.classList.toggle('show');
    popoverBg.classList.remove('show');
});

bindKeepFocus(mainBgColorBtn, () => {
    popoverBg.classList.toggle('show');
    popoverText.classList.remove('show');
});

document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.color-picker-wrap')) {
        popoverText.classList.remove('show');
        popoverBg.classList.remove('show');
    }
});

document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.color-picker-wrap')) {
        popoverText.classList.remove('show');
        popoverBg.classList.remove('show');
    }
}, { passive: true });

const safeTextColors = {
    '#FAF8F4': ['#222221'],
    '#262624': ['#FAF8F4', '#4282AA', '#B24A3B', '#D97757'],
    '#FFFFFF': ['#222221']
};

const safeBgForText = {
    '#222221': ['#FAF8F4', '#FFFFFF'],
    '#B24A3B': ['#FAF8F4', '#FFFFFF'],
    '#4282AA': ['#262624', '#FAF8F4'],
    '#D97757': ['#262624', '#FAF8F4']
};

document.querySelectorAll('.text-color-dot').forEach(dot => {
    bindKeepFocus(dot, () => {
        const color = dot.dataset.color;
        const allowedBgs = safeBgForText[color];
        if (allowedBgs && !allowedBgs.includes(currentBgColor)) {
            currentBgColor = allowedBgs[0];
        }
        currentTextColor = color;
        applyEditorColors();
        popoverText.classList.remove('show');
        submitEditor.focus();
    });
});

document.querySelectorAll('.bg-color-dot').forEach(dot => {
    bindKeepFocus(dot, () => {
        const color = dot.dataset.color;
        const allowedTexts = safeTextColors[color];
        if (allowedTexts && !allowedTexts.includes(currentTextColor)) {
            currentTextColor = allowedTexts[0];
        }
        currentBgColor = color;
        applyEditorColors();
        popoverBg.classList.remove('show');
        submitEditor.focus();
    });
});

function updateInlineDoneButtonState() {
    if (!submitEditor || !inlineDoneBtn) return;
    const textLength = submitEditor.innerText.trim().length;
    const hasPhoto = attachPreviewInline && attachPreviewInline.innerHTML.trim() !== '';
    inlineDoneBtn.disabled = (textLength === 0 && !hasPhoto);
}

if (submitEditor) {
    submitEditor.addEventListener('focus', () => {
        updateInlineDoneButtonState();
        inlineDoneBtn.classList.add('show');
    });
    
    submitEditor.addEventListener('blur', () => {
        setTimeout(() => inlineDoneBtn.classList.remove('show'), 150);
    });

    submitEditor.addEventListener('input', updateInlineDoneButtonState);
}

if (attachPreviewInline) {
    const observer = new MutationObserver(updateInlineDoneButtonState);
    observer.observe(attachPreviewInline, { childList: true });
}

bindKeepFocus(inlineDoneBtn, () => {
    if (!inlineDoneBtn.disabled) {
        submitEditor.blur();
    }
});




function generateValkyCardsHTML(rawHTML, photosArr, bgColor, textColor, font, authorName, extraClass = '') {
    let html = '';
    const safeFont = font.replace(/"/g, "'"); 
    
    const headerHTML = `
        <div class="valky-card-header-pill" style="transform: scale(0.85); margin-bottom: 14px; margin-top: -8px;">
            <<img src="assets/images/anonfacelogo.PNG" alt="Анонім">
            <span class="pill-yellow">ВАЛКІВСЬКА</span>
            <span class="pill-white">ПРИЙМАЛЬНЯ</span>
        </div>
    `;
    const authorHTML = `<div class="valky-card-author">${authorName}</div>`;
    const CHARS_PER_CARD = 350;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHTML.replace(/<br\s*\/?>/gi, '\n'); 
    let pureText = tempDiv.innerText || '';

    let chunks = [];
    let useHTML = false;

    if (pureText.trim().length > 0) {
        if (pureText.length <= CHARS_PER_CARD) {
            chunks.push(rawHTML);
            useHTML = true;
        } else {
            let currentChunk = '';
            const tokens = pureText.split(/([ \n])/);
            for (let t of tokens) {
                if ((currentChunk + t).length > CHARS_PER_CARD) {
                    chunks.push(currentChunk.trim());
                    currentChunk = t;
                } else {
                    currentChunk += t;
                }
            }
            if (currentChunk.trim()) chunks.push(currentChunk.trim());
        }
    } else if (photosArr.length === 0) {
        chunks.push('порожньо');
    }

    const isMultiCard = chunks.length > 1;

    chunks.forEach((chunk, idx) => {
        let fontClass = 'fs-small';
        let align = 'left';

        if (!isMultiCard) {
            const len = useHTML ? pureText.length : chunk.length;
            if (len < 80) fontClass = 'fs-huge';
            else if (len < 180) fontClass = 'fs-large';
            else if (len < 280) fontClass = 'fs-medium';
            align = len > 193 ? 'left' : 'center';
        }

        const showHeader = idx === 0 ? headerHTML : '';
        const showArrow = (idx < chunks.length - 1 || photosArr.length > 0) ? '<div class="valky-card-arrow">→</div>' : '';
        
        const finalContent = useHTML ? chunk : chunk.replace(/\n/g, '<br>');

        html += `
            <div class="valky-card ${extraClass}" style="background:${bgColor}; color:${textColor}; font-family:${safeFont} !important;">
                ${showHeader}
                <div class="valky-card-body ${fontClass}" style="font-family:${safeFont} !important; text-align:${align};">${finalContent}</div>
                ${showArrow}
                ${authorHTML}
            </div>
        `;
    });

    photosArr.slice(0, 5).forEach(src => {
        html += `
            <div class="valky-card" style="background:${bgColor}; color:${textColor}; font-family:${safeFont} !important;">
                ${headerHTML}
                <div class="valky-card-photo-wrap">
                    <img src="${src}" class="valky-card-photo">
                </div>
                ${authorHTML}
            </div>
        `;
    });

    return html;
}




//генератор карточок всьо


// Анонімність //
function getActiveNickname(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return '👤 Анонімно';
    const checkbox = container.querySelector('.anon-checkbox');
    const input = container.querySelector('.anon-name-field');
    if (checkbox && checkbox.checked) return '👤 Анонімно';
    if (input && input.value.trim() !== '') return `від: ${input.value.trim()}`;
    return '👤 Анонімно';
}



// Головний редактор //
if (submitActionBtn) {
    submitActionBtn.addEventListener('click', () => {
        const nameVal = getActiveNickname('submit-content');
        const rawText = submitEditor.innerHTML || '';

        let photosArr = [];
        const inlinePreview = document.getElementById('attach-preview-inline');
        if (inlinePreview) {
            const imgs = inlinePreview.querySelectorAll('img');
            imgs.forEach(img => photosArr.push(img.src));
        }

        const isHole = submitOverlay.classList.contains('hole-mode');
        const bg = currentBgColor || (isHole ? '#1a1a1a' : '#fff');
        const tc = currentTextColor || (isHole ? '#e0e0e0' : '#1a1a1a');
        const font = submitEditor.style.fontFamily || 'Inter, sans-serif';

        const innerTitle = document.querySelector('.caps-label.dynamic-title');
        const isBirthday = innerTitle && innerTitle.innerText === 'ПРИВІТАТИ З ДНЕМ НАРОДЖЕННЯ';
        const extraClass = isBirthday ? 'festive-birthday-card' : '';

        previewPostCard.innerHTML = generateValkyCardsHTML(rawText, photosArr, bg, tc, font, nameVal, extraClass);

        if (previewMetaLine) previewMetaLine.style.display = 'none';
       
        submitContent.style.display = 'none';
        submitPreviewScreen.style.display = 'flex';

        const mainHeader = document.querySelector('.submit-header');
        if (mainHeader) mainHeader.style.display = 'none';
    });
}

if (previewEditBtn) {
    previewEditBtn.addEventListener('click', () => {
        submitPreviewScreen.style.display = 'none';
        submitContent.style.display = 'flex';

        const mainHeader = document.querySelector('.submit-header');
        if (mainHeader) mainHeader.style.display = 'flex';
    });
}

if (previewSendBtn) {
    previewSendBtn.addEventListener('click', () => {
        const mode = submitOverlay.classList.contains('mailbox-mode') ? 'mailbox' : 'hole';
        submitPreviewScreen.style.background = 'transparent';
        if (previewMetaLine) previewMetaLine.style.opacity = '0';
        const editBtn = document.getElementById('preview-edit-btn');
        if (editBtn) editBtn.style.opacity = '0';
        previewSendBtn.style.opacity = '0';
        const previewLabel = document.querySelector('.preview-label');
        if (previewLabel) previewLabel.style.opacity = '0';

        if (submitVideo) {
            submitVideo.currentTime = 0;
            submitVideo.style.zIndex = '14';
            submitVideo.style.display = 'block';
            submitVideo.style.filter = 'blur(0px) brightness(0.8)';
            submitVideo.play();
        }
  
        previewPostCard.classList.add(`fly-to-${mode}`);

        const animDuration = mode === 'hole' ? 4600 : 1000;

        setTimeout(() => {
            submitPreviewScreen.style.display = 'none';
            submitPreviewScreen.style.background = '';
            if (submitVideo) submitVideo.style.zIndex = '';
            previewPostCard.classList.remove(`fly-to-${mode}`);
            if (previewMetaLine) previewMetaLine.style.opacity = '1';
            if (editBtn) editBtn.style.opacity = '1';
            if (previewSendBtn) previewSendBtn.style.opacity = '1';
            if (previewLabel) previewLabel.style.opacity = '1';
        }, animDuration);

        const finishSend = () => {
            if (submitVideo) submitVideo.style.display = 'none';
            submitSentScreen.style.display = 'flex';
        };

        if (submitVideo) {
            submitVideo.onended = finishSend;
            finishSendTimeout = setTimeout(() => {
                if (submitSentScreen.style.display !== 'flex') finishSend();
            }, 8000);
        } else {
            finishSend();
        }
    });
}


// Атмосфера //
const atmoOverlay = document.getElementById('atmo-overlay');
const closeAtmoBtn = document.getElementById('close-atmo');
const atmoActionBtn = document.getElementById('atmo-action-btn');
const atmoContent = document.getElementById('atmo-content');
const atmoSentScreen = document.getElementById('atmo-sent-screen');
const closeAtmoSent = document.getElementById('close-atmo-sent');
const atmoStage = document.getElementById('atmo-stage');

function openAtmoOverlay() {
    lastScrollY = window.scrollY;
    atmoOverlay.className = `submit-overlay atmo-overlay mailbox-mode`;
    atmoOverlay.style.display = 'flex';
    atmoContent.style.display = 'flex';
    atmoSentScreen.style.display = 'none';
    document.body.classList.add('submit-open');

    currentAtmoLayout = 'single-polaroid';
    document.querySelectorAll('.atmo-layout-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.layout === 'single-polaroid');
    });

    renderAtmoStage(currentAtmoLayout);
}

function closeAtmoOverlay() {
    atmoOverlay.style.display = 'none';
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });

    const atmoHeader = document.querySelector('#atmo-overlay .submit-header');
    if (atmoHeader) atmoHeader.style.display = 'flex';

    if (typeof atmoVideo !== 'undefined' && atmoVideo) {
        atmoVideo.style.display = 'block';
        atmoVideo.style.filter = '';
        atmoVideo.style.zIndex = '';
        atmoVideo.pause();
        atmoVideo.load();
    }

    const atmoPreviewScreen = document.getElementById('atmo-preview-screen');
    const atmoContent = document.getElementById('atmo-content');
    const atmoSentScreen = document.getElementById('atmo-sent-screen');

    if (atmoPreviewScreen) atmoPreviewScreen.style.display = 'none';
    if (atmoContent) atmoContent.style.display = 'flex';
    if (atmoSentScreen) atmoSentScreen.style.display = 'none';

    const atmoImgs = document.querySelectorAll('.atmo-slot-img-fill');
    atmoImgs.forEach(img => {
        img.src = '';
        img.style.display = 'none';
        img.style.objectPosition = '50% 50%';
    });
    
    const atmoCaps = document.querySelectorAll('.atmo-polaroid-caption');
    atmoCaps.forEach(cap => cap.value = '');
    
    const atmoInputs = document.querySelectorAll('.atmo-polaroid-slot input[type="file"], .atmo-square-slot input[type="file"]');
    atmoInputs.forEach(inp => inp.value = '');
    
    const atmoPlaceholders = document.querySelectorAll('.atmo-slot-placeholder');
    atmoPlaceholders.forEach(pl => pl.style.display = 'flex');
}

const atmoBtnEl = document.querySelector('.b-atmosphere');
if (atmoBtnEl) atmoBtnEl.addEventListener('click', openAtmoOverlay);

if (closeAtmoBtn) closeAtmoBtn.addEventListener('click', closeAtmoOverlay);
if (closeAtmoSent) closeAtmoSent.addEventListener('click', closeAtmoOverlay);

let currentAtmoLayout = 'single-polaroid';

function buildAtmoSlot(isPolaroid, captionEnabled) {
    const slot = document.createElement('div');
    slot.className = isPolaroid ? 'atmo-polaroid-slot' : 'atmo-square-slot';
    
    const inner = document.createElement('div');
    inner.className = 'atmo-slot-placeholder';
    inner.innerHTML = `<span class="material-symbols-outlined" style="font-size:36px; color:#ccc;">add_photo_alternate</span>`;
    
    const img = document.createElement('img');
    img.className = 'atmo-slot-img-fill';
    img.style.display = 'none';
    img.style.objectFit = 'cover';
    img.style.objectPosition = '50% 50%';
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    
    slot.appendChild(inner);
    slot.appendChild(img);
    slot.appendChild(input);
    
    if (isPolaroid && captionEnabled) {
        const cap = document.createElement('input');
        cap.type = 'text';
        cap.className = 'atmo-polaroid-caption';
        cap.placeholder = 'підпис...';
        cap.maxLength = 35;
        slot.appendChild(cap);
    }
    
    let isDragging = false;
    let startX, startY, startPosX, startPosY;

    img.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return;
        isDragging = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        const pos = img.style.objectPosition.split(' ');
        startPosX = parseFloat(pos[0]) || 50;
        startPosY = parseFloat(pos[1]) || 50;
    }, { passive: true });

    img.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            isDragging = true;
            e.preventDefault();
            const percentX = (dx / img.offsetWidth) * 100;
            const percentY = (dy / img.offsetHeight) * 100;
            
            let newX = startPosX - (percentX * 1.5);
            let newY = startPosY - (percentY * 1.5);
            
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));
            
            img.style.objectPosition = `${newX}% ${newY}%`;
        }
    }, { passive: false });
    
    slot.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
        if (isDragging) return;
        input.click();
    });
    
    input.addEventListener('change', () => {
        const files = Array.from(input.files);
        if (!files.length) return;
        
        const allSlots = document.querySelectorAll('#atmo-stage .atmo-polaroid-slot, #atmo-stage .atmo-square-slot');
        const currentIndex = Array.from(allSlots).indexOf(slot);
        
        files.forEach((file, i) => {
            const targetSlot = allSlots[currentIndex + i];
            if (targetSlot) {
                const targetImg = targetSlot.querySelector('.atmo-slot-img-fill');
                const targetInner = targetSlot.querySelector('.atmo-slot-placeholder');
                const reader = new FileReader();
                reader.onload = (ev) => {
                    targetImg.src = ev.target.result;
                    targetImg.style.display = 'block';
                    targetImg.style.objectPosition = '50% 50%';
                    if(targetInner) targetInner.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.value = '';
    });
    
    return slot;
}



function renderAtmoStage(layout) {
    if (!atmoStage) return;
    atmoStage.innerHTML = '';
    atmoStage.className = 'atmo-stage atmo-stage--' + layout;
    
    if (layout === 'single-polaroid') {
        atmoStage.appendChild(buildAtmoSlot(true, true));
    } else if (layout === 'two-polaroid') {
        atmoStage.appendChild(buildAtmoSlot(true, true));
        atmoStage.appendChild(buildAtmoSlot(true, true));
        atmoStage.style.display = 'flex';
        atmoStage.style.gap = '10px';
    } else if (layout === 'single-square') {
        atmoStage.appendChild(buildAtmoSlot(false, false));
    } else if (layout === 'grid-four') {
        for (let i = 0; i < 4; i++) atmoStage.appendChild(buildAtmoSlot(false, false));
    }
}

document.querySelectorAll('.atmo-layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.atmo-layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentAtmoLayout = btn.dataset.layout;
        renderAtmoStage(currentAtmoLayout);
    });
});

const atmoVideo = document.getElementById('atmo-video');

if (atmoVideo) {
    atmoVideo.src = 'assets/vids/skrynka.mp4';
    atmoVideo.load();
}

const atmoPreviewScreen = document.getElementById('atmo-preview-screen');
const atmoPreviewCard = document.getElementById('atmo-preview-card');
const atmoPreviewMetaLine = document.getElementById('atmo-preview-meta-line');
const atmoPreviewEditBtn = document.getElementById('atmo-preview-edit-btn');
const atmoPreviewSendBtn = document.getElementById('atmo-preview-send-btn');

let currentAtmoBg = '#FAF8F4';
const atmoBgDots = document.querySelectorAll('.atmo-bg-dot');

atmoBgDots.forEach(dot => {
    dot.addEventListener('click', () => {
        atmoBgDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentAtmoBg = dot.dataset.color;
        if (atmoStage) atmoStage.style.background = currentAtmoBg;
    });
});

if (atmoActionBtn) {
    atmoActionBtn.addEventListener('click', () => {
        const nameVal = getActiveNickname('atmo-content');
        let photosData = [];
        
        const slots = atmoStage.querySelectorAll('.atmo-polaroid-slot, .atmo-square-slot');
        slots.forEach(slot => {
            const img = slot.querySelector('.atmo-slot-img-fill');
            const cap = slot.querySelector('.atmo-polaroid-caption');
         
            if (img && img.style.display !== 'none' && img.src) {
                photosData.push({
                    src: img.src,
                    caption: cap && cap.value ? cap.value.trim() : '',
                    isPolaroid: slot.classList.contains('atmo-polaroid-slot'),
                    objPos: img.style.objectPosition || '50% 50%'
                });
            }
        });
        
        const textColor = ['#FAF8F4', '#FFFFFF'].includes(currentAtmoBg) ? '#1a1a1a' : '#FAF8F4';
        let html = '';
        
        const headerHTML = `
            <div class="valky-card-header-pill" style="transform: scale(0.85); margin-bottom: 14px; margin-top: -8px;">
                <img src="assets/images/anonfacelogo.PNG" alt="Анонім">
                <span class="pill-yellow">ВАЛКІВСЬКА</span>
                <span class="pill-white">ПРИЙМАЛЬНЯ</span>
            </div>
        `;
        const authorHTML = `<div class="valky-card-author" style="color:${textColor};">${nameVal}</div>`;

        if (photosData.length > 0) {
            html += `
                <div class="valky-card" style="background:${currentAtmoBg}; justify-content: space-between; align-items: center;">
                    ${headerHTML}
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; width: 100%; margin: auto 0; position: relative;">
            `;
            
            if (photosData.length === 4) {
                html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; margin-bottom: 24px;">`;
                photosData.forEach(p => {
                    html += `
                        <div style="background: #fff; padding: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border-radius: 2px;">
                            <img src="${p.src}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; object-position: ${p.objPos}; border: 1px solid #eee; display: block;">
                        </div>
                    `;
                });
                html += `</div>`;
            } else if (photosData.length === 2) {
                html += `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 320px; position: relative; margin-bottom: 24px;">`;
                photosData.forEach((p, idx) => {
                    const rotate = idx === 0 ? '-6deg' : '9deg';
                    const left = idx === 0 ? '0%' : 'auto';
                    const right = idx === 1 ? '-4%' : 'auto';
                    const zIndex = idx === 0 ? '1' : '2';
                    const top = idx === 0 ? '0px' : '55px';
                    const width = idx === 0 ? '58%' : '65%';
                    const shadow = idx === 0 ? '0 4px 15px rgba(0,0,0,0.15)' : '0 12px 30px rgba(0,0,0,0.3)';

                    html += `
                        <div style="position: absolute; left: ${left}; right: ${right}; top: ${top}; z-index: ${zIndex}; background: #fff; padding: 10px 10px 15px 10px; box-shadow: ${shadow}; border-radius: 2px; display: flex; flex-direction: column; width: ${width}; transform: rotate(${rotate});">
                            <img src="${p.src}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; object-position: ${p.objPos}; border: 1px solid #eee;">
                            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 35px; padding-top: 5px;">
                                ${p.caption ? `<div style="font-family: 'Caveat', cursive; font-size: 16px; color: #111; text-align: center; line-height: 1;">${p.caption}</div>` : ''}
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
            } else {
                const p = photosData[0];
                const isSquare = !p.isPolaroid;
                const pb = isSquare ? '10px' : '10px';
                const minH = isSquare ? '0' : '40px';
                const w = isSquare ? '85%' : '80%';

                html += `
                    <div style="background: #fff; padding: 10px 10px ${pb} 10px; box-shadow: 0 6px 15px rgba(0,0,0,0.15); border-radius: 2px; display: flex; flex-direction: column; width: ${w}; margin-top: -10px; margin-bottom: 24px;">
                        <img src="${p.src}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; object-position: ${p.objPos}; border: 1px solid #eee; display: block;">
                        ${!isSquare ? `
                        <div style="display: flex; align-items: center; justify-content: center; min-height: ${minH}; padding-top: 8px;">
                            ${p.caption ? `<div style="font-family: 'Caveat', cursive; font-size: 22px; color: #111; text-align: center; line-height: 1;">${p.caption}</div>` : ''}
                        </div>
                        ` : ''}
                    </div>
                `;
            }

            html += `
                    </div>
                    ${authorHTML}
                </div>
            `;
        } else {
            html += `<div class="valky-card" style="background:${currentAtmoBg};"><div style="color:${textColor}; margin: auto;">Пусто</div></div>`;
        }

        atmoPreviewCard.innerHTML = html;
        if (atmoPreviewMetaLine) atmoPreviewMetaLine.style.display = 'none';
        
        atmoContent.style.display = 'none';
        atmoPreviewScreen.style.display = 'flex';
        
        const atmoHeader = document.querySelector('#atmo-overlay .submit-header');
        if (atmoHeader) atmoHeader.style.display = 'none';
    });
}





if (atmoPreviewEditBtn) {
    atmoPreviewEditBtn.addEventListener('click', () => {
        atmoPreviewScreen.style.display = 'none';
        atmoContent.style.display = 'flex';
        
        const atmoHeader = document.querySelector('#atmo-overlay .submit-header');
        if (atmoHeader) atmoHeader.style.display = 'flex';
    });
}

if (atmoPreviewSendBtn) {
    atmoPreviewSendBtn.addEventListener('click', () => {
        atmoPreviewScreen.style.background = 'transparent';
        if (atmoPreviewMetaLine) atmoPreviewMetaLine.style.opacity = '0';
        if (atmoPreviewEditBtn) atmoPreviewEditBtn.style.opacity = '0';
        atmoPreviewSendBtn.style.opacity = '0';
        
        const previewLabel = atmoPreviewScreen.querySelector('.preview-label');
        if (previewLabel) previewLabel.style.opacity = '0';

        if (atmoVideo) {
            atmoVideo.currentTime = 0;
            atmoVideo.style.zIndex = '14';
            atmoVideo.style.display = 'block';
            atmoVideo.style.filter = 'blur(0px) brightness(0.8)';
            atmoVideo.play().catch(e => console.log(e));
        }

        atmoPreviewCard.classList.add('fly-to-mailbox');

        setTimeout(() => {
            atmoPreviewScreen.style.display = 'none';
            atmoPreviewScreen.style.background = '';
            if (atmoVideo) atmoVideo.style.zIndex = '';
            atmoPreviewCard.classList.remove('fly-to-mailbox');
            if (atmoPreviewMetaLine) atmoPreviewMetaLine.style.opacity = '1';
            if (atmoPreviewEditBtn) atmoPreviewEditBtn.style.opacity = '1';
            atmoPreviewSendBtn.style.opacity = '1';
            if (previewLabel) previewLabel.style.opacity = '1';
        }, 1000);

        const finishSend = () => {
            if (atmoVideo) atmoVideo.style.display = 'none';
            atmoSentScreen.style.display = 'flex';
        };

        if (atmoVideo) {
            atmoVideo.onended = finishSend;
            setTimeout(() => {
                if (atmoSentScreen.style.display !== 'flex') finishSend();
            }, 8000);
        } else {
            finishSend();
        }
    });
}


// Фото і Мем //
const photoOverlay = document.getElementById('photo-overlay');
const closePhotoBtn = document.getElementById('close-photo');
const photoActionBtn = document.getElementById('photo-action-btn');
const photoContent = document.getElementById('photo-content');
const photoSentScreen = document.getElementById('photo-sent-screen');
const closePhotoSent = document.getElementById('close-photo-sent');
const photoDropZone = document.getElementById('photo-drop-zone');
const photoFileInput = document.getElementById('photo-file-input');
const photoPreviewImg = document.getElementById('photo-preview-img');
const photoDropInner = document.getElementById('photo-drop-inner');
const photoOverlayTitle = document.getElementById('photo-overlay-title');

function openPhotoOverlay(type, mode) {
    lastScrollY = window.scrollY;
    photoOverlay.className = `submit-overlay photo-overlay ${mode}-mode`;
    photoOverlay.style.display = 'flex';
    photoContent.style.display = 'flex';
    photoSentScreen.style.display = 'none';
    photoPreviewImg.style.display = 'none';
    photoDropInner.style.display = 'flex';
    photoFileInput.value = '';
    photoOverlayTitle.innerText = type === 'meme' ? 'ВІДПРАВИТИ МЕМ' : 'ВІДПРАВИТИ ФОТО';
    document.body.classList.add('submit-open');
    const captionWrap = document.getElementById('photo-caption-wrap');
    if (captionWrap) captionWrap.style.display = 'none';
    
    const photoVideo = document.getElementById('photo-video');
    if(photoVideo) {
        photoVideo.src = mode === 'hole' ? 'assets/vids/BlackHole.mp4' : 'assets/vids/skrynka.mp4';
        photoVideo.load();
    }
}

function closePhotoOverlay() {
    photoOverlay.style.display = 'none';
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
}

const photoBtnEl = document.querySelector('.b-photo');
const memeBtnEl = document.querySelector('.b-meme');
if (photoBtnEl) photoBtnEl.addEventListener('click', () => openPhotoOverlay('photo', 'mailbox'));
if (memeBtnEl) memeBtnEl.addEventListener('click', () => openPhotoOverlay('meme', 'hole'));

if (closePhotoBtn) closePhotoBtn.addEventListener('click', closePhotoOverlay);
if (closePhotoSent) closePhotoSent.addEventListener('click', closePhotoOverlay);

if (photoDropZone) {
    photoDropZone.addEventListener('click', () => photoFileInput.click());
}

if (photoFileInput) {
    photoFileInput.addEventListener('change', () => {
        const file = photoFileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreviewImg.src = e.target.result;
            photoPreviewImg.style.display = 'block';
            photoDropInner.style.display = 'none';
            const captionWrap = document.getElementById('photo-caption-wrap');
            if (captionWrap) captionWrap.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
}

const photoPreviewScreen = document.getElementById('photo-preview-screen');
const photoPreviewCard = document.getElementById('photo-preview-card');
const photoPreviewMetaLine = document.getElementById('photo-preview-meta-line');
const photoPreviewEditBtn = document.getElementById('photo-preview-edit-btn');
const photoPreviewSendBtn = document.getElementById('photo-preview-send-btn');

if (photoActionBtn) {
    photoActionBtn.addEventListener('click', () => {
        const nameVal = getActiveNickname('photo-content');
        const rawText = document.getElementById('photo-caption') ? document.getElementById('photo-caption').value.trim() : '';
        let photosArr = [];
        
        if (photoPreviewImg && photoPreviewImg.src && photoPreviewImg.style.display !== 'none') {
            photosArr.push(photoPreviewImg.src);
        }

        const isHole = photoOverlay.classList.contains('hole-mode');
        const bg = isHole ? '#1a1a1a' : '#fff';
        const tc = isHole ? '#e0e0e0' : '#1a1a1a';
        const font = isHole ? 'Impact, sans-serif' : "'Inter', sans-serif";

        photoPreviewCard.innerHTML = generateValkyCardsHTML(rawText, photosArr, bg, tc, font, nameVal);
        if (photoPreviewMetaLine) photoPreviewMetaLine.style.display = 'none';
        
        photoContent.style.display = 'none';
        photoPreviewScreen.style.display = 'flex';
    });
}

if (photoPreviewEditBtn) {
    photoPreviewEditBtn.addEventListener('click', () => {
        photoPreviewScreen.style.display = 'none';
        photoContent.style.display = 'flex';
    });
}

if (photoPreviewSendBtn) {
    photoPreviewSendBtn.addEventListener('click', () => {
        const mode = photoOverlay.classList.contains('hole-mode') ? 'hole' : 'mailbox';
        photoPreviewScreen.style.background = 'transparent';
        if (photoPreviewMetaLine) photoPreviewMetaLine.style.opacity = '0';
        if (photoPreviewEditBtn) photoPreviewEditBtn.style.opacity = '0';
        photoPreviewSendBtn.style.opacity = '0';
        const previewLabel = photoPreviewScreen.querySelector('.preview-label');
        if (previewLabel) previewLabel.style.opacity = '0';

        const photoVideo = document.getElementById('photo-video');
        if (photoVideo) {
            photoVideo.currentTime = 0;
            photoVideo.style.zIndex = '14';
            photoVideo.style.display = 'block';
            photoVideo.style.filter = 'blur(0px) brightness(0.8)';
            photoVideo.play();
        }

        photoPreviewCard.classList.add(`fly-to-${mode}`);

        const animDuration = mode === 'hole' ? 4600 : 1000;

        setTimeout(() => {
            photoPreviewScreen.style.display = 'none';
            photoPreviewScreen.style.background = '';
            if (photoVideo) photoVideo.style.zIndex = '';
            photoPreviewCard.classList.remove(`fly-to-${mode}`);
            if (photoPreviewMetaLine) photoPreviewMetaLine.style.opacity = '1';
            if (photoPreviewEditBtn) photoPreviewEditBtn.style.opacity = '1';
            if (photoPreviewSendBtn) photoPreviewSendBtn.style.opacity = '1';
            if (previewLabel) previewLabel.style.opacity = '1';
        }, animDuration);

        const finishSend = () => {
            if (photoVideo) photoVideo.style.display = 'none';
            photoSentScreen.style.display = 'flex';
        };

        if (photoVideo) {
            photoVideo.onended = finishSend;
            setTimeout(() => { if (photoSentScreen.style.display !== 'flex') finishSend(); }, 8000);
        } else {
            finishSend();
        }
    });
}


    function showAchievementCard(text) {
    const cleanText = text.replace(/\n\n📸[\s\S]*/g, '').replace(/\n\n👀[\s\S]*/g, '');
    const lines = cleanText.split('\n').filter(l => l.trim());
    const titleLine = lines[0] || '';
    const numberMatch = titleLine.match(/Досягнення #(\d+)/);
    const number = numberMatch ? numberMatch[1] : '';
    const titleText = titleLine.replace(/Досягнення #\d+:?\s*/, '').trim();
    const descText = lines.slice(1).join(' ').trim();

    const card = document.createElement('div');
    card.className = 'achievement-card';
    card.innerHTML = `
        <div class="card-plastic-wrap">
            <span class="achievement-close" onclick="this.closest('.achievement-card').remove()">✕</span>
            <div class="card-inner">
                <div class="card-body">
                    <div class="card-number">Досягнення #${number}</div>
                    <div class="card-title">${titleText}</div>
                    <div class="card-desc">${descText}</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(card);
}


function showDoorBubble(event, text, customDuration) {
    const doorEl = event.currentTarget;
    const rect = doorEl.getBoundingClientRect();
    const bubble = document.createElement('div');
    bubble.className = 'door-bubble';
    bubble.innerText = text;
    bubble.style.left = `${rect.left + rect.width / 2}px`;
    bubble.style.top = `${rect.top}px`;
    bubble.style.position = 'fixed';
    document.body.appendChild(bubble);
    const duration = customDuration || Math.max(2500, text.length * 60);
    setTimeout(() => bubble.remove(), duration);
}


    function showPredictionPopup(text) {
    const isArtifact = text.includes('артефакт');

    if (isArtifact) {
        const nameMatch = text.match(/<b>(.*?)<\/b>/);
        const artifactName = nameMatch ? nameMatch[1] : text;

        const card = document.createElement('div');
        card.className = 'artifact-card';
        card.innerHTML = `
            <div class="artifact-plastic-wrap">
                <span class="achievement-close" onclick="this.closest('.artifact-card').remove()">✕</span>
                <div class="artifact-inner">
                    <div class="artifact-image-area">
                        <span class="artifact-image-placeholder">🗿</span>
                    </div>
                    <div class="artifact-body">
                        <div class="artifact-label">Артефакт знайдено</div>
                        <div class="artifact-name">${artifactName}</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(card);
        setTimeout(() => card.remove(), 8000);
        return;
    }

    const card = document.createElement('div');
    card.className = 'prediction-card';
    card.innerHTML = `<div class="prediction-card-text">${text}</div>`;
    document.body.appendChild(card);
    setTimeout(() => card.remove(), 8000);
}


    const doorBtn = document.getElementById('secret-door');
    if (doorBtn) {
        const bubbles = [
            "🤨", "🙄", "🥱", "🤖", "👊🏻", "🫵🏻", "👁️ 👁️", "👀", "💥", "🥁", "📸", "🔒", "👁️‍🗨️","🪗", "🎶", "🎧", "📬",
            "шо?", "гарного дня ❤️ (чи вечора)", "ви хто?", "та шо?", "по голові собі постукай", "закрито", "перерва", "пізніше", "нє","ніт", "скіп", "ой всьо", "а смисл?", "скіки можна?",  "touch grass, pls", "шось ти дуже активний", "я щас мамі твоїй подзвоню", "тут тільки для vip", "от дурне 🤠", "тю", "ходять тут всякі…", "ля", "таке враження, шо ти NPC якесь", "ми знаємо твій IP 👁️", "bruh", "і?", "Лудоманія — це хвороба 🎰", "наполегливість 10/10, результат 0/10", "ну да, я бачу тебе через фронталку, а шо?", "ну давай ще раз сто, раптом спрацює (ні)", "тіп реально тапає 💀", "let me sleep bro 🛌", "цьом в лобік ❤️",
    "гарного дня сонечко ☀️ (більше не стукай)", "на гербі Валок є три сливи, знаєш чому?", "я щас візьму віника", "в мене від тебе вже голова квадратна", "це не твій рівень, іди тапай у свою хвіртку", "за цими дверями ще один Посад", "я щас як відкрию",
            "Спробуй ще", "тут міг би бути промокод, але нема", "трохи нижче", "єслі шо, це просто двері", "в цьому немає сенсу", "two hours later", "не знаю шо тобі треба, але тут цього точно нема", "Ви знали, шо Валки були засновані у 1646 році як укріплений пункт (фортеця у вигляді дерев'яних зрубів — «валків») для захисту від набігів кочівників?",  "от не стукай", "мда", "я двічі не повторюю. чи повторюю?", "це не кнопка, кнопки внизу", "ну пиши вже шось, шо ти стукаєш", "уже можна починати писати", "тут нічо нема", "може хвате?", "ну ти дайош", "двері не відкриються, серйозно","ну і шо воно ото стукає", "та всьо", "шо нада", "що ви знаєте про Петра Панча?", "а тепер головою", "та..", "хто там?", "ніхто не відкриє", "закрито до завтра", "чо ти ото стукаєш?", "це не тапалка", "шо вам треба?", "нікого нема", "до побачення", "може завтра?", "буває", "шо там?", "хммм 🧐",
            "не в цей раз", "полегшало?", "а ви знали, шо тут можна відправити фото на канал?", "тут все анонімно, але гадості і вигаданий брєд про інших людей публікувати не будемо", "без сюрпризів", "знову ти?", "еххх", "хух",
            "Міша, всьо х*йня, давай по новой", "тут могла бути ваша реклама, але не буде", "шо такоє, хто ето", "та таке", "звідки стільки енергії?",
            "іди пороби шось може, нє?", "знову нє", "та ти шо", "давай, поламай тут все", "астанавітєсь", "це ж було вже"
        ];

        const valkyArtifacts = [
            "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳",
            "артефакт у розробці ⏳", "артефакт у розробці ⏳",
            "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳",
            "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳",
            "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳"
        ];

       const noArtifactsText = "\n\n👀 Ви зможете додавати в додаток власні артефакти починаючи з 3 рівня";

const getArtifactText = (count) => `\n\n📸 **Ти відкрив(ла) можливість додавати власні артефакти! Твій ліміт: ${count} шт.**
Знайди і сфоткай якусь унікальну мікро-деталь Валок. Це може бути стара табличка, лавочка, кущ, квіточка, відпавша від будівлі цеглина, доска, якийсь дурнуватий напис на стіні, дивний пеньок, мусорка, чийсь загублений ключ, чийсь гуляючий котик, декоративний елемент, красива клумба, ну або пакет з Аврори, який епічно застряг на дереві. Короче — будь-який цікавий (або максимально нецікавий) об'єкт нашої локальної цивілізації. 

🛑 **Жорсткі правила:** КАТЕГОРИЧНО не фоткаємо військових, техніку, будь-яку критичну інфраструктуру та обличчя людей. Без винятків, такі фотки одразу йдуть у смітник. Ми збираємо лише дрібні артефакти міста.

Обовʼязково опиши що це, де і коли ти це сфоткав(ла), додай своє імʼя або нік, який буде відображатись. Відправляй фото разом зі скріншотом цієї картки сюди: @valkyshobot 👈🏻 Якщо все ок — ми додамо твій артефакт у додаток, щоб інші теж могли його знайти 🔍`;

    


        const achievements = {
            15: "Досягнення #1:\nЯкийсь підозрілий тіп біля дверей. \nВи постукали у двері Валківської Приймальні 15 разів. Ми вже подзвонили куди треба 🧐" + noArtifactsText,
            50: "Досягнення #2:\nВ розробці 🕑\nВи постукали у двері Валківської Приймальні 50 разів." + noArtifactsText,
            100: "Досягнення #3:\nДятел Вуді, бл*%# \nВи постукали у двері Валківської Приймальні 100 раз." + noArtifactsText,
            200: "Досягнення #4:\nКлінічний випадок \nЦе не досягнення, це діагноз. Ви постукали у двері Валківської Приймальні 200 раз." + getArtifactText(1),
            250: "Досягнення #5:\nСвідок Єгови чи просто на лічильник глянути? 📖\nВи постукали у двері Валківської Приймальні 250 раз." + getArtifactText(2),
            300: "Досягнення #6:\nЗадротіще \nВи постукали у двері Валківської Приймальні 300 раз." + getArtifactText(3),
            523: "Досягнення #7:\nБандіт \n На 523 раз Ви вибили нахер двері Валківської Приймальні. Тепер ставте нові." + getArtifactText(4),
            777: "Досягнення #8:\nЛегенда \nВи легендарно постукали у двері легендарної Валківської Приймальні легендарні 777 раз. Легендарно безглуздо🎰. Нагадаємо на всяк випадок, шо тут нема фріспінів, грошей вам за це ніхто не дасть, джекпоту не буде 👋🏻" + getArtifactText(5),
            888: "Досягнення #9:\nМамин езотерик 🔮\nВи постукали у двері Валківської Приймальні 888 разів — згідно нумерології це число нескінченного багатства і успіху, а також кількість разів, коли можна було вже зупинитись і зайнятись чимось кориснішим." + getArtifactText(6),
            1000: "Досягнення #10:\nТисячник\nВи постукали у двері Валківської Приймальні 1000 разів." + getArtifactText(7),
            2000: "Досягнення #11:\nБотяра якийсь 🤖\nВи постукали у двері Валківської Приймальні 2000 раз. Ну ви або зовсім таво або проходьте капчу." + getArtifactText(8),
            2345: "Досягнення #12:\nПохибка симуляції 👾\nАномалія. Ви абсолютно унікальні. Цього не мало статися. Ви постукали у двері Валківської Приймальні рівно 2345 рази. Ми цього не планували. Доведеться придумувати ще щось." + getArtifactText(9),
            5000: "Досягнення #13:\nHEEEEERE'S JOHNNY! 🪓\nВи постукали у двері Валківської Приймальні 5000 разів. Ви офіційно зловили шизу як Джек Ніколсон у «Сяйві». Візьміть вже сокиру і розрубайте цей фронтенд к хєрам." + getArtifactText(10),
            8000: "Досягнення #14:\nЛисий хомʼяк. Лістинг скасовується 📉\nВи постукали у двері Валківської Приймальні 8000 раз. Бро реально думає, шо це якась тапалка в Телеграмі і зараз з дверей посиплеться кріпта? Дропу не буде, розходимось, ти затапав своє життя в нуль, хомʼячок." + getArtifactText(11),
            9999: "Досягнення #15:\nВиклик санітарів 🚑\nЧо ви до*бались до цих дверей? Ви постукали у двері Валківської Приймальні 9999 раз — це ненормально. За вами вже виїхала бригада. Будь ласка, просто покладіть телефон на підлогу, відійдіть від нього на три кроки і не робіть різких рухів." + getArtifactText(12),
            10000: "Досягнення #16:\nGOAT. Найпотужніша потужність. Рівень наполегливості — БОГ. 👑\nВи постукали у двері Валківської Приймальні 10000 раз. Далі нічого немає, чесно! Ніяких феєрверків, фанфар чи скрімерів — справжня велич завжди тиха і трохи меланхолійна. Це кінець шляху. Хай щастить!" + getArtifactText(15)
        };
       


        const names = ["Юля", "Оля", "Аліна", "Альона", "Яна", "Віка", "Каріна", "Лєна", "Свєта", "ота тьотка", "тьоть Валя", "ота бабуля", "Аня", "Катя", "Настя", "Даша", "Оксана", "Марина"];
        const names2 = ["Саня", "Дімон", "Влад", "Іра", "Льоха", "Оля", "Аліна", "Каріна", "ота дивна дівчина", "отой странний чувак", "Таня", "тьоть Таня", "Макс", "Ігорьок", "дядя Толя", "той тіп з центру", "Настя", "Ріта", "Наташа", "Даша", "Ліза", "Серьога", "Артем", "Денчик", "Жека", "Рома"];
        const predictions = [
"✨🔮✨ Зірки кажуть, що зараз твої плани на цей місяць виглядають так само перспективно, як недобудова ДК в центрі.",
"✨🔮✨ Зірки кажуть, що тобі треба терміново вийти прогулятись через парк Сонечко — там ти обовʼязково побачиш щось, що надихне тебе на щось нове.",
"✨🔮✨ Зірки кажуть, що давно вже пора сфоткати і продати той мотлох на Валківському Базарчику",
"✨🔮✨ Зірки кажуть, що Всесвіту сьогодні глибоко пофіг на твої проблеми, тому просто розслабся і не вий*буйся",
"✨🔮✨ Зірки кажуть, що сьогодні ідеальний день, щоб багатозначно мовчати і дивитись на всіх навколо як на гівно",
"✨🔮✨ Зірки кажуть, що якщо ти планував(ла) сьогодні почати нове життя, то зірки поржали і перенесли це на наступний понеділок",
"✨🔮✨ Зірки кажуть, що сьогодні удача посміхається всім, окрім тебе. Просто змирись, закрий телефон і лягай спати.",
"✨🔮✨ Зірки кажуть, що ти сьогодні випромінюєш вайб людини, яка забула пакет з пакетами вдома і тепер змушена купувати новий на касі",
"✨🔮✨ Зірки кажуть, що єдине, шо тебе сьогодні врятує — піца і роли з Вишні 🍒",
"✨🔮✨ Зірки кажуть, що ретроградний Меркурій на цей раз ні до чого, ти просто сам(а) любиш ускладнювати життя собі й іншим",
"✨🔮✨ Зірки кажуть, що скоро ти порішаєш всі свої проблєми як справжній бос, але не розслабляйся, бо попереду ще багато цікавого",
"✨🔮✨ Зірки кажуть, що Всесвіт посилає тобі знаки, але ти занадто зайнятий(а) якоюсь херньою в інтернеті, щоб їх помітити. Вийди погуляй, подихай свіжим повітрям.",
"✨🔮✨ Зірки кажуть, що єдине твоє досягнення сьогодні — це те, що ти нікого не прибив(ла). Ну, поки що.",
"✨🔮✨ Зірки кажуть, що твої плани на цей тиждень тримаються на суперклеї і фразі «якось воно буде»",
"✨🔮✨ Зірки кажуть, що твоя мотивація сьогодні вийшла з чату і видалила акаунт. Сьогодні краще не змушувати себе робити те, на що не вистачає енергії.",
"✨🔮✨ Зірки кажуть, що сьогодні ти випромінюватимеш вайб людини, яка пожартувала, але ніхто не засміявся 💔",
"✨🔮✨ Зірки кажуть, що краще сьогодні обійти парк Сонечко десятою дорогою, бо там ти стопудово зустрінеш того, кого ти дуже не хочеш побачити",
"✨🔮✨ Зірки нічо не кажуть, сорян",
"✨🔮✨ Зірки кажуть, що на тебе чекає раптова зустріч десь біля Норми, від якої ти не зможеш відмазатись",
"✨🔮✨ Зірки кажуть «боже, який позор»",
"✨🔮✨ Зірки кажуть, що твої плани на вечір обламаються швидше, ніж ти встигнеш дійти до центру",
"✨🔮✨ Зірки радять тобі просто сісти на лавочку біля площі і філософськи споглядати цей тлєн",
"✨🔮✨ Зірки кажуть, що твої спроби бути дорослою і відповідальною людиною сьогодні зазнають нищівного фіаско",
"✨🔮✨ Зірки радять не дуже засмучуватись, якщо сьогодні ти будуть часто казати «не тупі». Просто день такий дурнуватий.",
"✨🔮✨ Зірки кажуть, що сьогодні краще <s>закрити є*ало і не вийо*уватись </s> утриматись від непроханих коментарів в сторону інших людей.",
"✨🔮✨ Зірки кажуть, що якщо ти сьогодні ні в чому не налажаєш, день можна вважати прожитим даремно",
"✨🔮✨ Зірки кажуть, що сьогодні ідеальний день, щоб драматично постояти біля ставка під сумну музику, вдаючи з себе головного героя.",
"✨🔮✨ Зірки кажуть, що сьогодні ти приймеш дуже зважене, логічне і абсолютно неправильне рішення",
"✨🔮✨ Зірки кажуть: якщо сьогодні хтось напише «шо ти?», сміливо відповідай «нічо» — і навіть не думай питати «а ти шо?».",
"✨🔮✨ Зірки кажуть, що {NAME2} вважає, що ти повне єбобо, і зірки, якщо чесно, абсолютно згодні",
"✨🔮✨ Зірки кажуть, що {NAME} скинула твій профіль подружкам у приватний чат в тг з підписом «ПХАХАХАХ»",
"✨🔮✨ Зірки кажуть, що {NAME} оцінила твій сьогоднішній лук на 0/10",
"✨🔮✨ Зірки кажуть: якщо сьогодні ви натрапите на алкаша поблизу музею, уважно прислухайтесь до того, що він намагається сказати — іноді Всесвіт говорить через дуже неочікуваних спікерів.",
"✨🔮✨ Зірки кажуть, що сьогодні хтось біля Посаду подивиться на тебе так, ніби ти винен йому гроші. І знаєш, можливо, ти дійсно винен.",
"✨🔮✨ Зірки кажуть, що хтось щойно балакав про твою прічоску. І повір, це були далеко не компліменти…",
"✨🔮✨ Зірки кажуть, що твоя карма сьогодні в мінусі, тому будь обережним_ою на пішохідних переходах і нікому не хами",
"✨🔮✨ Зірки кажуть, що сьогодні на тебе чекає раптовий прибуток. Може, знайдеш сотку в старій куртці, а може, просто не витратиш зайвого на хєрню, що вже тіпа як перемога",
"✨🔮✨ Зірки кажуть, що ти сьогодні виглядаєш настільки класно, що навіть бабулі-сусідки не знають до чого до*атись",
"✨🔮✨ Зірки кажуть, що сьогодні твій мозок раптом видасть геніальну ідею. Головне — не провтикай її (як завжди).",
"✨🔮✨ Зірки кажуть, що сьогодні тебе ніхто не буде бісити. Це статистична аномалія, тож насолоджуйся.",
"✨🔮✨ Зірки кажуть, що тебе очікує щось дуже романтичне 💖 . Ну або хоча б твій кіт САМ прийде до тебе помурчати на коліна, що об'єктивно набагато краще.",
"✨🔮✨ Зірки кажуть, що ти сьогодні зробиш правильний вибір. Навіть якщо це буде просто вибір між темним по акції в Посаді і світлим, яке продається тільки в Нормі — він буде ідеальним.",
"✨🔮✨ Зірки кажуть, що хтось сьогодні скаже про тебе щось дуже хороше за твоєю спиною. Так, таке теж буває.",
"✨🔮✨ Зірки кажуть: «Ми звідси бачимо твій екранний час, і це тупо клініка»",
"✨🔮✨ Зірки кажуть: «Давай ти просто сьогодні помовчиш, окей?»",
"✨🔮✨ Зірки кажуть: «Сьогодні ідеальний день, щоб перестати драматизувати кожну х**ню і просто розслабитись»",
"✨🔮✨ Зірки кажуть: «Краще б ти сьогодні взагалі з ліжка не вилазило, чесне слово…»",
"✨🔮✨ Зірки кажуть: «Ми бачили твою історію пошуку. МДА….»",
"✨🔮✨ Зірки совєтують попити магній, бо нікому не подобається оцей твій вираз обличчя, ну чесно",
"✨🔮✨ Зірки кажуть: «Ти реально збираєшся вийти в люди з таким виразом обличчя?»",
"✨🔮✨ Зірки кажуть: «Все буде добре ❤️»",
"✨🔮✨ Зірки попереджають: сьогодні не варто довіряти будь-кому, кого звуть Настя або Каріна. Навіть якщо це ви самі. Не довіряйте собі складні рішення.",
"✨🔮✨ Зірки не радять заводити політичні бесіди з таксистами в центрі",
"✨🔮✨ Зірки не радять сьогодні вірити людям, які кажуть, що «та тут пройтись хвилин десять»",
"✨🔮✨ Зірки попереджають: твій внутрішній компас сьогодні зламаний, тому замість світлого майбутнього ти можеш випадково зайти на Коржівку і заблукати",
"✨🔮✨ Зірки не радять сьогодні надягати білі кросовки",
"✨🔮✨ Зірки прогнозують, що твоя аура сьогодні випромінюватиме вайб людини, яка щойно запізнилася на останню маршрутку з Ков'яг",
"✨🔮✨ Зірки кажуть: «сьогодні удача на твоєму боці».",
"✨🔮✨ Зірки кажуть, що охраннік в Посаді реально вважає, що ти якийсь мутний.",
"✨🔮✨ Зірки кажуть, що сьогодні тобі може подзвонити {NAME2}. А може і не подзвоне.",
"✨🔮✨ Зірки кажуть, що хтось з твоїх знайомих, хто зараз постить фотки з Європи, іноді спеціально заходить на твою сторінку, щоб підняти собі самооцінку",
"✨🔮✨ Зірки кажуть, що сьогодні є всі шанси зловити екзистенційну кризу прямо посеред Посаду, обираючи між пєльменями і гречкою",
"✨🔮✨ Зірки радять приготуватися: сьогодні тебе може несподівано пробити на шалену продуктивність.",
"✨🔮✨ Зірки кажуть, що сьогодні доведеться робити вигляд, ніби тебе реально хвилюють проблеми інших людей.",
"✨🔮✨ Зірки кажуть, що {NUM1} — це твоє щасливе число сьогодні.",
"✨🔮✨ Зірки попереджають: є величезна ймовірність почути крутий комплімент, на який доведеться якось адекватно зреагувати. Підготуйтесь!",
"✨🔮✨ Зірки кажуть, що сьогодні твоя інтуїція працює на рівні екстрасенса, тому всі спонтанні рішення будуть абсолютно геніальними",
"✨🔮✨ Зірки радять звернути увагу на дрібниці: сьогодні Всесвіт буде підкидати маленькі приємності і знаки на кожному кроці. Навіть якщо це крок в калюжу.",
"✨🔮✨ Зірки попереджають: твоя харизма сьогодні може випадково розбити чиєсь сердечко 💔✨",
"✨🔮✨ Зірки гарантують, що твої жарти сьогодні залітатимуть на ура, тому не стримуй свого внутрішнього стендапера"
];

        function getPrediction() {
            let text = predictions[Math.floor(Math.random() * predictions.length)];
            text = text.replace('{NAME}', names[Math.floor(Math.random() * names.length)]);
            text = text.replace('{NAME2}', names2[Math.floor(Math.random() * names2.length)]);
            text = text.replace('{NUM1}', Math.floor(Math.random() * 50) + 1);
            return text;
        }

      
      
        let doorClicks = parseInt(localStorage.getItem('valky_door_clicks')) || 0;
        let hasTappedOnce = doorClicks > 0;
        let lastPredictionAt = parseInt(localStorage.getItem('valky_last_pred')) || -10;
        let recentBubbles = []; 
        
        
        if (doorClicks >= 2 && bagBtn) {
            bagBtn.classList.add('visible');
        }

        if (doorBtn && doorClicks >= 523 && doorClicks < 528) {
            doorBtn.innerText = '🚪';
            doorBtn.classList.add('door-broken-hole');
        }

        const fxClasses = [
            'door-glow', 'door-glitch', 'fx-anime', 'fx-glitch', 'fx-upside-down', 
            'fx-black-hole', 'fx-earthquake', 'fx-acid-trip', 'fx-hologram', 'fx-void'
        ];


    doorBtn.addEventListener('click', (event) => {
        const rect = doorBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 6; i++) {
            const splinter = document.createElement('div');
            splinter.className = 'door-splinter';
            document.body.appendChild(splinter);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 20 + Math.random() * 40;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 20;
            
            splinter.style.left = `${centerX}px`;
            splinter.style.top = `${centerY}px`;
            splinter.style.setProperty('--tx', `${tx}px`);
            splinter.style.setProperty('--ty', `${ty}px`);
            splinter.style.animation = 'splinterFly 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            
            setTimeout(() => splinter.remove(), 600);
        }

        if (Math.random() < 0.02) {
            const ghost = document.createElement('div');
            ghost.className = 'door-ghost';
            ghost.innerText = '👻';
            document.body.appendChild(ghost);
            
            ghost.style.left = `${centerX - 15}px`;
            ghost.style.top = `${centerY - 15}px`;
            ghost.style.animation = 'ghostFloat 1.5s ease-out forwards';
            
            setTimeout(() => ghost.remove(), 1500);
        }

        if (!hasTappedOnce) {
            showDoorBubble(event, "тут може випасти передбачення, артефакт або ачівка, але не в цей раз і не тобі, спробуй ще", 6000);
            hasTappedOnce = true;
            return;
        }

        doorClicks++;
        localStorage.setItem('valky_door_clicks', doorClicks);

        if (doorClicks >= 2) {
    bagBtn.classList.add('visible');
}


        if (achievements && achievements[doorClicks]) {
            showAchievementCard(achievements[doorClicks]);
            const achText = achievements[doorClicks];
            const achLines = achText.split('\n');
            addToLoot('achievements', {
                title: achLines[0] || 'Досягнення',
                preview: achLines[1] ? achLines[1].substring(0, 60) + '...' : '',
                full: achLines.slice(1).join('<br>')
            });
        }

        if (doorClicks === 523) {
            doorBtn.classList.add('door-epic-falling');
            setTimeout(() => {
                doorBtn.classList.remove('door-epic-falling');
                doorBtn.innerText = '🚪';
                doorBtn.classList.add('door-broken-hole');
            }, 1200);
            return;
        }

        if (doorClicks > 523 && doorClicks <= 528) {
            if (doorClicks === 528) {
                doorBtn.classList.remove('door-broken-hole');
                doorBtn.innerText = '🚪';
                showDoorBubble(event, "Ці міцніші", 4000);
            } else {
                showDoorBubble(event, "Двері на базу", 2000);
            }
            return;
        }

                const rng = Math.random() * 100;
        const predictionCooldown = 85; 
        if (rng < 1) {
            const randomArtifact = valkyArtifacts[Math.floor(Math.random() * valkyArtifacts.length)];
            showPredictionPopup(`Знайдено артефакт:<br><br><b>${randomArtifact}</b>`);
            
            addToLoot('artifacts', {
                title: randomArtifact,
                preview: 'Валківський артефакт',
                full: `Знайдено: ${randomArtifact}`
            });
        } else if (rng < 15 && (doorClicks - lastPredictionAt) >= predictionCooldown) {

            addToLoot('predictions', {
                title: '🔮 Передбачення',
                preview: predText.substring(0, 60) + '...',
                full: predText
            });

            lastPredictionAt = doorClicks;
            localStorage.setItem('valky_last_pred', lastPredictionAt);

        } else {
            if (Math.random() < 0.40) {
                doorBtn.classList.remove(...fxClasses);
            void doorBtn.offsetWidth; 
            
            const randomFx = fxClasses[Math.floor(Math.random() * fxClasses.length)];
            doorBtn.classList.add(randomFx);
        } else {
                let availableBubbles = bubbles.filter(b => !recentBubbles.includes(b));
            if (availableBubbles.length === 0) availableBubbles = bubbles;
                
                const randomBubbleText = availableBubbles[Math.floor(Math.random() * availableBubbles.length)];
                
                recentBubbles.push(randomBubbleText);
            if (recentBubbles.length > 15) recentBubbles.shift();

            showDoorBubble(event, randomBubbleText);
        }
        }
    });
}




const bagBtn = document.getElementById('bag-btn');
const bagOverlay = document.getElementById('bag-overlay');
const bagClose = document.getElementById('bag-close');
const bagContent = document.getElementById('bag-content');

const lootKey = 'valky_loot_v1';

function getLoot() {
    try {
        const data = JSON.parse(localStorage.getItem(lootKey));
        if (data && Array.isArray(data.achievements) && Array.isArray(data.predictions) && Array.isArray(data.artifacts)) {
            return data;
        }
        return { achievements: [], predictions: [], artifacts: [] };
    } catch {
        return { achievements: [], predictions: [], artifacts: [] };
    }
}

function saveLoot(loot) {
    localStorage.setItem(lootKey, JSON.stringify(loot));
}

function addToLoot(type, item) {
    const loot = getLoot();
    loot[type].push(item);
    saveLoot(loot);
    if (bagBtn) bagBtn.classList.add('has-items');
}

const initialLoot = getLoot();
if (bagBtn && (initialLoot.achievements.length || initialLoot.predictions.length || initialLoot.artifacts.length)) {
    bagBtn.classList.add('has-items');
}


function renderBagTab(tab) {
    const loot = getLoot();
    const items = loot[tab] || [];
    bagContent.innerHTML = '';

    const emptyMessages = {
        achievements: 'Ви ще не отримали жодного досягнення. Стукайте у двері Валківської Приймальні.',
        predictions: 'Немає передбачень для вас. Поки що.',
        artifacts: 'Ви ще не знайшли жодного артефакту. Стукайте у двері Валківської Приймальні.'
    };

    if (items.length === 0) {
        bagContent.innerHTML = `<div class="bag-empty">${emptyMessages[tab]}</div>`;
        return;
    }

    items.slice().reverse().forEach(item => {
        const el = document.createElement('div');
        el.className = 'bag-item';
        el.innerHTML = `
            <div class="bag-item-title">${item.title}</div>
            <div class="bag-item-sub">${item.preview}</div>
            <div class="bag-item-detail">${item.full}</div>
        `;
        el.addEventListener('click', () => el.classList.toggle('expanded'));
        bagContent.appendChild(el);
    });
}

let activeBagTab = 'achievements';


document.querySelectorAll('.bag-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.bag-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeBagTab = tab.dataset.tab;
        renderBagTab(activeBagTab);
    });
});

if (bagBtn) {
    bagBtn.addEventListener('click', () => {
        bagOverlay.classList.add('open');
        renderBagTab(activeBagTab);
    });
}

if (bagClose) {
    bagClose.addEventListener('click', () => bagOverlay.classList.remove('open'));
}

if (bagOverlay) {
    bagOverlay.addEventListener('click', (e) => {
        if (e.target === bagOverlay) bagOverlay.classList.remove('open');
    });
}
//рюкзак всьо//

//  Модалка Правил //
const rulesModal = document.getElementById('rules-modal');
const closeRulesBtn = document.getElementById('close-rules-btn');
const openRulesBtns = document.querySelectorAll('.open-rules-btn');

if (rulesModal && closeRulesBtn) {
    
    openRulesBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rulesModal.style.display = 'flex';
        });
    });

  
    closeRulesBtn.addEventListener('click', () => {
        rulesModal.style.display = 'none';
    });

    
    rulesModal.addEventListener('click', (e) => {
        if (e.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    });
}
setInterval(() => {
    const mainBtn = document.getElementById('submit-action-btn');
    const mainEditor = document.getElementById('submit-editor');
    const attachPreview = document.getElementById('attach-preview-inline');
    
    if (mainBtn && mainEditor) {
        const hasText = mainEditor.innerText.trim().length > 0;
        const hasAttach = attachPreview && attachPreview.innerHTML.trim() !== '';
        const isValid = hasText || hasAttach;
        
        mainBtn.style.opacity = isValid ? '1' : '0.4';
        mainBtn.style.pointerEvents = isValid ? 'auto' : 'none';
    }

    const photoBtn = document.getElementById('photo-action-btn');
    const photoImg = document.getElementById('photo-preview-img');
    if (photoBtn && photoImg) {
        const src = photoImg.getAttribute('src');
        const isValid = photoImg.style.display !== 'none' && src && src.length > 5;
        photoBtn.style.opacity = isValid ? '1' : '0.4';
        photoBtn.style.pointerEvents = isValid ? 'auto' : 'none';
    }

    const atmoBtn = document.getElementById('atmo-action-btn');
    const atmoStage = document.getElementById('atmo-stage');
    if (atmoBtn && atmoStage) {
        let isValid = false;
        
        const imgs = atmoStage.querySelectorAll('img');
        imgs.forEach(img => {
            const src = img.getAttribute('src');
            if (src && src.trim().length > 5) isValid = true;
        });

        const divs = atmoStage.querySelectorAll('div');
        divs.forEach(div => {
            if (div.style.backgroundImage && div.style.backgroundImage !== 'none' && div.style.backgroundImage !== '') {
                isValid = true;
            }
        });

        atmoBtn.style.opacity = isValid ? '1' : '0.4';
        atmoBtn.style.pointerEvents = isValid ? 'auto' : 'none';
    }
}, 300);


});
