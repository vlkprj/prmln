document.addEventListener("DOMContentLoaded", () => {
    let bagBtn, bagOverlay, bagClose, bagContent;

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
        }
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

        const valkyArtifacts = ["артефакт у розробці ⏳"];

        const achievements = {
            15: "Досягнення #1:\nЯкийсь підозрілий тіп біля дверей. \nВи постукали у двері Валківської Приймальні 15 разів. Ми вже подзвонили куди треба 🧐"
        };

        let doorClicks = parseInt(localStorage.getItem('valky_door_clicks')) || 0;
        let hasTappedOnce = doorClicks > 0;
        let recentBubbles = []; 

        bagBtn = document.getElementById('bag-btn');
        if (doorClicks >= 2 && bagBtn) {
            bagBtn.classList.add('visible');
        }

        if (doorClicks >= 523 && doorClicks < 528) {
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

            if (doorClicks >= 2 && bagBtn) {
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
            if (rng < 1) {
                const randomArtifact = valkyArtifacts[0];
                showPredictionPopup(`Знайдено артефакт:<br><br><b>${randomArtifact}</b>`);
                
                addToLoot('artifacts', {
                    title: randomArtifact,
                    preview: 'Валківський артефакт',
                    full: `Знайдено: ${randomArtifact}`
                });
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

    bagBtn = document.getElementById('bag-btn');
    bagOverlay = document.getElementById('bag-overlay');
    bagClose = document.getElementById('bag-close');
    bagContent = document.getElementById('bag-content');

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

    const triggers = document.querySelectorAll('.category-trigger');
    const masterOverlay = document.getElementById('master-editor-overlay');
    const closeBtn = document.getElementById('close-editor-btn');
    const dynamicTitle = document.getElementById('editor-dynamic-title');
    const videoBg = document.getElementById('master-video-bg');
    const workspace = document.getElementById('editor-workspace');

    let currentMode = '';
    let currentCardType = '';

    triggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-mode');
            const title = btn.getAttribute('data-title');
            const placeholder = btn.getAttribute('data-placeholder');
            const font = btn.getAttribute('data-font');
            const cardType = btn.getAttribute('data-card-type');

            currentMode = mode;
            currentCardType = cardType;

            dynamicTitle.innerText = title;

                    if (mode === 'skrynka') {
            videoBg.src = 'assets/vids/skrynka.mp4';
            masterOverlay.className = 'submit-overlay mailbox-mode';
        } else if (mode === 'blackhole') {
            videoBg.src = 'assets/vids/BlackHole.mp4';
            masterOverlay.className = 'submit-overlay hole-mode';
        }

            masterOverlay.style.display = 'flex';
            document.body.classList.add('submit-open');

            videoBg.load();
            videoBg.play().catch(e => console.error(e));

                        // Генеруємо HTML редактора залежно від типу картки
            if (cardType === 'basic') {
                workspace.innerHTML = `
                    <div class="prmln-card-wrap">
                        <div class="prmln-card" id="active-prmln-card" style="font-family: '${font}', sans-serif; background: #FAF8F4; color: #222221;">
                            
                            <div class="valky-card-header-pill" style="transform: scale(0.85); margin-bottom: 14px; margin-top: -8px; transform-origin: left top;">
                                <img src="assets/images/anonfacelogo.PNG" alt="Анонім">
                                <span class="pill-yellow">ВАЛКІВСЬКА</span>
                                <span class="pill-white">ПРИЙМАЛЬНЯ</span>
                            </div>
                            
                            <div class="prmln-editor-body" id="prmln-editor" contenteditable="true" data-placeholder="${placeholder}"></div>
                            
                            <div id="prmln-photo-preview" style="display:none; width: 100%; margin-top: 10px; border-radius: 8px; overflow: hidden;"></div>
                        </div>
                    </div>
                    
                    <div class="prmln-toolbar">
                        <div class="prmln-toolbar-group">
                            <span class="material-symbols-outlined" style="color: white; cursor: pointer; font-size: 26px;" id="btn-attach">add_photo_alternate</span>
                        </div>
                        <div class="prmln-toolbar-group" id="bg-color-picker">
                            <div class="color-dot active" data-bg="#FAF8F4" data-color="#222221" style="background: #FAF8F4;"></div>
                            <div class="color-dot" data-bg="#262624" data-color="#FAF8F4" style="background: #262624;"></div>
                            <div class="color-dot" data-bg="#B24A3B" data-color="#FAF8F4" style="background: #B24A3B;"></div>
                        </div>
                    </div>

                    <button class="submit-action-btn sticky-next-btn" id="btn-next-step">ДАЛІ ➔</button>
                `;

                // Автоматично ставимо фокус на редактор, щоб можна було зразу писати
                setTimeout(() => {
                    document.getElementById('prmln-editor').focus();
                }, 300);
                
                // Логіка перемикання кольорів
                const colorDots = workspace.querySelectorAll('.color-dot');
                const card = document.getElementById('active-prmln-card');
                
                colorDots.forEach(dot => {
                    dot.addEventListener('click', () => {
                        colorDots.forEach(d => d.classList.remove('active'));
                        dot.classList.add('active');
                        card.style.background = dot.getAttribute('data-bg');
                        card.style.color = dot.getAttribute('data-color');
                    });
                });
            } else {
                workspace.innerHTML = `<div style="color: white;">Конструктор для ${cardType} ще в розробці.</div>`;
            }

        });
    });

    closeBtn.addEventListener('click', () => {
        masterOverlay.style.display = 'none';
        document.body.classList.remove('submit-open');
        
        videoBg.pause();
        videoBg.src = '';
        workspace.innerHTML = '';
    });
});
