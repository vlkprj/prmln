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

document.getElementById('builder-next-btn').addEventListener('click', () => {
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
