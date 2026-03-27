// ==================== КОНФИГУРАЦИЯ ====================
const CLOUD_CONFIG = {
    API_KEY: '$2a$10$Vxl9lZUaGmUANs2JQBixL.O37Ot8zteKKSAR98p.eP6.aTeQ4Brwu',
    BASE_URL: 'https://api.jsonbin.io/v3/b'
};

// ФИКСИРОВАННЫЙ ID бина для хранения всех пользователей
const USERS_BIN_ID = '69c60d616887921da853c0a2';

// Банк заданий (остаётся без изменений)
const questionBank = {
    orthoepy: [
        {
            text: "В каком слове ударение падает на первый слог?",
            answers: ["красивЕе", "тортЫ", "бАнты", "звонИт"],
            correct: 2,
            explanation: "В слове «бАнты» ударение падает на первый слог."
        },
        {
            text: "В каком слове ударение падает на последний слог?",
            answers: ["клАла", "создалА", "нАчал", "понЯв"],
            correct: 1,
            explanation: "В глаголах женского рода ударение падает на окончание."
        },
        {
            text: "В каком слове ударение падает на второй слог?",
            answers: ["докумЕнт", "каталОг", "красИвее", "квартАл"],
            correct: 2,
            explanation: "В слове «красИвее» ударение падает на второй слог."
        }
    ],
    paronyms: [
        {
            text: "В каком предложении вместо слова ДЛИННЫЙ нужно употребить ДЛИТЕЛЬНЫЙ?",
            answers: [
                "ДЛИННЫЙ хвост павлина переливался.",
                "Нам предстоял ДЛИННЫЙ путь.",
                "После ДЛИННОГО совещания все разошлись.",
                "ДЛИННЫЙ свисток разбудил округу."
            ],
            correct: 2,
            explanation: "ДЛИТЕЛЬНЫЙ — о времени, ДЛИННЫЙ — о размере."
        },
        {
            text: "В каком предложении вместо слова ВЕЧНЫЙ нужно употребить ВЕКОВЕЧНЫЙ?",
            answers: [
                "ВЕЧНЫЙ лес охраняется государством.",
                "Это был ВЕЧНЫЙ спор.",
                "ВЕЧНЫЕ ценности остаются неизменными.",
                "ВЕЧНАЯ мерзлота встречается в Сибири."
            ],
            correct: 0,
            explanation: "ВЕКОВЕЧНЫЙ — очень старый (о лесе)."
        }
    ],
    grammar: [
        {
            text: "Укажите пример с ошибкой в образовании формы слова",
            answers: [
                "пара ТУФЕЛЬ",
                "пять АПЕЛЬСИНОВ",
                "ИХНИЙ портфель",
                "более КРАСИВЫЙ"
            ],
            correct: 2,
            explanation: "Правильно: ИХ портфель."
        },
        {
            text: "Укажите пример с ошибкой в образовании формы слова",
            answers: [
                "ЛЯГТЕ на пол",
                "ЕДЬТЕ быстрее",
                "КЛАДИ на место",
                "ПОЕЗЖАЙ в город"
            ],
            correct: 1,
            explanation: "Правильно: ПОЕЗЖАЙ."
        }
    ],
    roots: [
        {
            text: "В каком ряду во всех словах пропущена безударная проверяемая гласная корня?",
            answers: [
                "ст...рожил, ум...лчать, р...сток",
                "зар...сли, пок...сившийся, оп...здание",
                "п...стух, к...залось, уд...вление",
                "пл...вец, выр...щенный, р...внина"
            ],
            correct: 2,
            explanation: "Пастух (пас), казалось (кажется), удивление (диво)."
        },
        {
            text: "В каком ряду во всех словах пропущена чередующаяся гласная корня?",
            answers: [
                "прик...сновение, выр...сти, з...ря",
                "отр...сль, р...сток, к...сание",
                "прил...жение, предл...жить, сл...гать",
                "все варианты верны"
            ],
            correct: 3,
            explanation: "Во всех словах чередующиеся гласные."
        }
    ],
    punctuation: [
        {
            text: "В каком варианте ответа правильно указаны все цифры, на месте которых должны стоять запятые? «Солнце (1) выглянувшее из-за туч (2) осветило лес (3) и (4) заиграло.»",
            answers: ["1,2", "1,2,3", "1,2,3,4", "2,3,4"],
            correct: 0,
            explanation: "Причастный оборот выделяется запятыми (1 и 2)."
        },
        {
            text: "В каком варианте ответа правильно указаны все цифры, на месте которых должны стоять запятые? «Дождь (1) усиливающийся с каждой минутой (2) превратился в ливень (3) и (4) затопил улицы.»",
            answers: ["1,2", "1,2,3", "1,2,4", "1,2,3,4"],
            correct: 0,
            explanation: "Причастный оборот выделяется запятыми (1 и 2)."
        }
    ]
};

const allQuestions = [
    ...questionBank.orthoepy,
    ...questionBank.paronyms,
    ...questionBank.grammar,
    ...questionBank.roots,
    ...questionBank.punctuation
];

const lessons = [
    { id: 0, title: "Орфоэпия (ударения)", completed: false, unlocked: true, questionIndices: [0, 1, 2] },
    { id: 1, title: "Паронимы", completed: false, unlocked: false, questionIndices: [3, 4] },
    { id: 2, title: "Грамматические нормы", completed: false, unlocked: false, questionIndices: [5, 6] },
    { id: 3, title: "Правописание корней", completed: false, unlocked: false, questionIndices: [7, 8] },
    { id: 4, title: "Пунктуация", completed: false, unlocked: false, questionIndices: [9, 10] }
];

let currentUser = null;
let currentXP = 0;
let lives = 3;
let currentLesson = null;
let currentQuestionIndex = 0;
let waitingForNext = false;
let reviveTimeout = null;
let reviveCountdown = null;
let isSyncing = false;
let syncQueue = [];

let lessonsPath, xpFill, xpText, livesContainer, owlTooltip;
let lessonModal, closeModal, lessonTitle, currentQuestionNum, totalQuestions;
let questionText, answersGrid, explanationDiv, explanationText;
let reviveModal, reviveBtn, reviveTimerText;
let completeModal, continueBtn, completeTitle, completeText;
let authScreen, mainApp, usernameSpan, userAvatar, logoutBtn, syncStatus;

// ==================== ОБЛАЧНОЕ ХРАНЕНИЕ ПОЛЬЗОВАТЕЛЕЙ ====================
async function getUsersFromCloud() {
    try {
        const response = await fetch(`${CLOUD_CONFIG.BASE_URL}/${USERS_BIN_ID}/latest`, {
            headers: { 'X-Master-Key': CLOUD_CONFIG.API_KEY }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.record.users || {};
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
    return {};
}

async function saveUsersToCloud(users) {
    try {
        const response = await fetch(`${CLOUD_CONFIG.BASE_URL}/${USERS_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': CLOUD_CONFIG.API_KEY
            },
            body: JSON.stringify({ users: users })
        });
        return response.ok;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
    }
}

async function register(email, password, name) {
    email = email.toLowerCase().trim();
    
    const users = await getUsersFromCloud();
    
    if (users[email]) {
        showAuthError('Пользователь с таким email уже существует');
        return false;
    }
    
    if (password.length < 6) {
        showAuthError('Пароль должен быть не менее 6 символов');
        return false;
    }
    
    users[email] = {
        password: btoa(password),
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
    };
    
    const saved = await saveUsersToCloud(users);
    
    if (saved) {
        return true;
    } else {
        showAuthError('Ошибка подключения. Проверьте интернет.');
        return false;
    }
}

async function login(email, password) {
    email = email.toLowerCase().trim();
    
    const users = await getUsersFromCloud();
    const user = users[email];
    
    if (!user) {
        showAuthError('Пользователь не найден');
        return false;
    }
    
    if (user.password !== btoa(password)) {
        showAuthError('Неверный пароль');
        return false;
    }
    
    currentUser = {
        uid: email,
        name: user.name,
        email: email
    };
    
    localStorage.setItem('egelingo_user', JSON.stringify(currentUser));
    return true;
}

function showAuthError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.textContent = message;
    
    const activeForm = document.querySelector('.auth-form:not([style*="display: none"])');
    const existingError = activeForm?.querySelector('.auth-error');
    if (existingError) existingError.remove();
    if (activeForm) activeForm.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 3000);
}

// ==================== ОБЛАЧНОЕ ХРАНЕНИЕ ПРОГРЕССА ====================
async function saveToCloud() {
    if (!currentUser) return;
    if (isSyncing) {
        syncQueue.push(saveToCloud);
        return;
    }
    
    updateSyncStatus('syncing', 'Синхронизация...');
    isSyncing = true;
    
    const progress = {
        userId: currentUser.uid,
        email: currentUser.email,
        name: currentUser.name,
        lastSync: new Date().toISOString(),
        xp: currentXP,
        lives: lives,
        lessons: lessons.map(l => ({
            id: l.id,
            completed: l.completed,
            unlocked: l.unlocked
        }))
    };
    
    try {
        let binId = localStorage.getItem(`egelingo_progress_bin_${currentUser.uid}`);
        
        if (binId) {
            await fetch(`${CLOUD_CONFIG.BASE_URL}/${binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': CLOUD_CONFIG.API_KEY
                },
                body: JSON.stringify(progress)
            });
        } else {
            const response = await fetch(CLOUD_CONFIG.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': CLOUD_CONFIG.API_KEY,
                    'X-Bin-Private': 'false',
                    'X-Bin-Name': `progress_${currentUser.uid.replace(/[^a-zA-Z0-9]/g, '_')}`
                },
                body: JSON.stringify(progress)
            });
            const data = await response.json();
            binId = data.metadata.id;
            localStorage.setItem(`egelingo_progress_bin_${currentUser.uid}`, binId);
        }
        
        updateSyncStatus('success', 'Синхронизировано');
        setTimeout(() => {
            if (syncStatus) syncStatus.style.opacity = '0';
        }, 2000);
        
    } catch (error) {
        console.error('Cloud save error:', error);
        updateSyncStatus('error', 'Офлайн-режим');
    } finally {
        isSyncing = false;
        if (syncQueue.length) {
            setTimeout(syncQueue.shift(), 1000);
        }
    }
}

async function loadFromCloud() {
    if (!currentUser) return;
    
    updateSyncStatus('syncing', 'Загрузка...');
    
    const binId = localStorage.getItem(`egelingo_progress_bin_${currentUser.uid}`);
    
    if (binId) {
        try {
            const response = await fetch(`${CLOUD_CONFIG.BASE_URL}/${binId}/latest`, {
                headers: {
                    'X-Master-Key': CLOUD_CONFIG.API_KEY
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const progress = data.record;
                
                currentXP = progress.xp || 0;
                lives = progress.lives !== undefined ? progress.lives : 3;
                
                progress.lessons?.forEach(savedLesson => {
                    const lesson = lessons.find(l => l.id === savedLesson.id);
                    if (lesson) {
                        lesson.completed = savedLesson.completed;
                        lesson.unlocked = savedLesson.unlocked;
                    }
                });
                
                updateSyncStatus('success', 'Загружено из облака');
            } else {
                loadLocalData();
            }
        } catch (error) {
            console.error('Cloud load error:', error);
            loadLocalData();
            updateSyncStatus('error', 'Офлайн-режим');
        }
    } else {
        loadLocalData();
    }
    
    saveProgress();
    renderLessons();
    updateUI();
}

function loadLocalData() {
    const saved = localStorage.getItem(`egelingo_progress_${currentUser?.uid}`);
    if (saved) {
        const progress = JSON.parse(saved);
        currentXP = progress.xp || 0;
        lives = progress.lives !== undefined ? progress.lives : 3;
        
        progress.lessons?.forEach(savedLesson => {
            const lesson = lessons.find(l => l.id === savedLesson.id);
            if (lesson) {
                lesson.completed = savedLesson.completed;
                lesson.unlocked = savedLesson.unlocked;
            }
        });
    } else {
        currentXP = 0;
        lives = 3;
        lessons.forEach((lesson, idx) => {
            lesson.completed = false;
            lesson.unlocked = idx === 0;
        });
    }
}

function saveProgress() {
    if (!currentUser) return;
    
    const progress = {
        xp: currentXP,
        lives: lives,
        lessons: lessons.map(lesson => ({
            id: lesson.id,
            completed: lesson.completed,
            unlocked: lesson.unlocked
        }))
    };
    localStorage.setItem(`egelingo_progress_${currentUser.uid}`, JSON.stringify(progress));
    
    if (window.cloudSaveTimeout) clearTimeout(window.cloudSaveTimeout);
    window.cloudSaveTimeout = setTimeout(() => {
        saveToCloud();
    }, 3000);
}

function updateSyncStatus(status, text) {
    if (!syncStatus) return;
    syncStatus.className = 'sync-status';
    if (status === 'syncing') syncStatus.classList.add('syncing');
    if (status === 'error') syncStatus.classList.add('error');
    
    const textSpan = syncStatus.querySelector('.sync-text');
    if (textSpan) textSpan.textContent = text;
    syncStatus.style.opacity = '1';
}

// ==================== ОСНОВНАЯ ЛОГИКА ====================
function showMainApp() {
    if (authScreen) authScreen.style.display = 'none';
    if (mainApp) mainApp.style.display = 'block';
    if (usernameSpan) usernameSpan.textContent = currentUser?.name || 'Ученик';
    
    renderLessons();
    updateUI();
}

function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('egelingo_user');
        currentUser = null;
        if (authScreen) authScreen.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
    }
}

function renderLessons() {
    if (!lessonsPath) return;
    lessonsPath.innerHTML = '';
    lessons.forEach((lesson, index) => {
        const lessonDiv = document.createElement('div');
        lessonDiv.className = 'lesson-item';
        if (lesson.completed) lessonDiv.classList.add('completed');
        if (!lesson.unlocked) lessonDiv.classList.add('locked');
        if (lesson.unlocked && !lesson.completed) lessonDiv.classList.add('active');
        
        lessonDiv.innerHTML = `
            <div class="lesson-number">${index + 1}</div>
            <div class="lesson-info">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-status ${lesson.completed ? 'completed' : ''}">
                    ${lesson.completed ? '✅ Пройдено' : (lesson.unlocked ? `🔓 ${lesson.questionIndices.length} заданий` : '🔒 Заблокировано')}
                </div>
            </div>
        `;
        
        if (lesson.unlocked) {
            lessonDiv.addEventListener('click', () => startLesson(lesson.id));
        }
        
        lessonsPath.appendChild(lessonDiv);
    });
}

function startLesson(lessonId) {
    if (waitingForNext) return;
    if (lives <= 0) {
        showReviveModal();
        return;
    }
    
    currentLesson = lessonId;
    currentQuestionIndex = 0;
    const lesson = lessons[currentLesson];
    
    lessonTitle.textContent = lesson.title;
    totalQuestions.textContent = lesson.questionIndices.length;
    lessonModal.classList.add('active');
    loadQuestion();
}

function loadQuestion() {
    const lesson = lessons[currentLesson];
    const questionIdx = lesson.questionIndices[currentQuestionIndex];
    const question = allQuestions[questionIdx];
    
    if (!question) return;
    
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    questionText.textContent = question.text;
    explanationDiv.style.display = 'none';
    
    answersGrid.innerHTML = '';
    question.answers.forEach((answer, idx) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.addEventListener('click', () => checkAnswer(idx, btn, question));
        answersGrid.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, buttonElement, question) {
    if (waitingForNext) return;
    
    const isCorrect = selectedIndex === question.correct;
    
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    if (isCorrect) {
        buttonElement.classList.add('correct');
        currentXP += 10;
        saveProgress();
        updateUI();
        
        owlTooltip.textContent = 'Правильно! +10 XP 🎉';
        owlTooltip.style.display = 'block';
        setTimeout(() => {
            owlTooltip.style.display = 'none';
        }, 1500);
        
        waitingForNext = true;
        setTimeout(() => {
            nextQuestion();
            waitingForNext = false;
        }, 1000);
    } else {
        buttonElement.classList.add('wrong');
        explanationText.textContent = question.explanation;
        explanationDiv.style.display = 'block';
        
        lives--;
        updateUI();
        
        owlTooltip.textContent = 'Неправильно! -1 жизнь 😢';
        owlTooltip.style.display = 'block';
        setTimeout(() => {
            owlTooltip.style.display = 'none';
        }, 1500);
        
        if (lives <= 0) {
            waitingForNext = true;
            setTimeout(() => {
                closeLessonModal();
                showReviveModal();
                waitingForNext = false;
            }, 2000);
        } else {
            waitingForNext = true;
            setTimeout(() => {
                nextQuestion();
                waitingForNext = false;
            }, 2000);
        }
    }
    
    saveProgress();
}

function nextQuestion() {
    const lesson = lessons[currentLesson];
    
    if (currentQuestionIndex + 1 < lesson.questionIndices.length) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        completeLesson();
    }
}

function completeLesson() {
    const lesson = lessons[currentLesson];
    lesson.completed = true;
    
    if (currentLesson + 1 < lessons.length) {
        lessons[currentLesson + 1].unlocked = true;
    }
    
    const bonusXP = 30;
    currentXP += bonusXP;
    saveProgress();
    updateUI();
    
    closeLessonModal();
    
    completeTitle.textContent = `🎉 Урок пройден! 🎉`;
    completeText.textContent = `+${bonusXP} XP`;
    completeModal.classList.add('active');
    
    owlTooltip.textContent = `Урок пройден! +${bonusXP} XP 🌟`;
    owlTooltip.style.display = 'block';
    setTimeout(() => {
        owlTooltip.style.display = 'none';
    }, 2000);
    
    renderLessons();
}

function updateUI() {
    if (xpText) xpText.textContent = `${currentXP} XP`;
    if (xpFill) {
        const xpPercent = Math.min((currentXP % 100) / 100 * 100, 100);
        xpFill.style.width = `${xpPercent}%`;
    }
    
    if (livesContainer) {
        const livesElements = livesContainer.querySelectorAll('.life');
        livesElements.forEach((life, idx) => {
            if (idx >= lives) {
                life.classList.add('lost');
            } else {
                life.classList.remove('lost');
            }
        });
    }
}

function showReviveModal() {
    reviveModal.classList.add('active');
    startReviveTimer();
}

function startReviveTimer() {
    let timeLeft = 30;
    reviveBtn.disabled = true;
    
    if (reviveCountdown) clearInterval(reviveCountdown);
    if (reviveTimeout) clearTimeout(reviveTimeout);
    
    reviveCountdown = setInterval(() => {
        timeLeft--;
        reviveTimerText.textContent = `Подождите ${timeLeft} секунд`;
        
        if (timeLeft <= 0) {
            clearInterval(reviveCountdown);
            reviveBtn.disabled = false;
            reviveTimerText.textContent = 'Жизни восстановлены!';
        }
    }, 1000);
    
    reviveTimeout = setTimeout(() => {
        clearInterval(reviveCountdown);
    }, 30000);
}

function reviveLives() {
    if (reviveBtn.disabled) return;
    
    lives = 3;
    updateUI();
    saveProgress();
    reviveModal.classList.remove('active');
    
    if (reviveCountdown) clearInterval(reviveCountdown);
    if (reviveTimeout) clearTimeout(reviveTimeout);
    
    owlTooltip.textContent = 'Жизни восстановлены! Продолжай учиться! 💪';
    owlTooltip.style.display = 'block';
    setTimeout(() => {
        owlTooltip.style.display = 'none';
    }, 2000);
}

function closeLessonModal() {
    lessonModal.classList.remove('active');
    waitingForNext = false;
    explanationDiv.style.display = 'none';
}

function showError(message) {
    owlTooltip.textContent = message;
    owlTooltip.style.display = 'block';
    setTimeout(() => {
        owlTooltip.style.display = 'none';
    }, 3000);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 App initializing...');
    console.log('📀 Using users bin:', USERS_BIN_ID);
    
    authScreen = document.getElementById('authScreen');
    mainApp = document.getElementById('mainApp');
    usernameSpan = document.getElementById('username');
    userAvatar = document.getElementById('userAvatar');
    logoutBtn = document.getElementById('logoutBtn');
    syncStatus = document.getElementById('syncStatus');
    
    lessonsPath = document.getElementById('lessonsPath');
    xpFill = document.getElementById('xpFill');
    xpText = document.getElementById('xpText');
    livesContainer = document.getElementById('livesContainer');
    owlTooltip = document.getElementById('owlTooltip');
    lessonModal = document.getElementById('lessonModal');
    closeModal = document.getElementById('closeModal');
    lessonTitle = document.getElementById('lessonTitle');
    currentQuestionNum = document.getElementById('currentQuestionNum');
    totalQuestions = document.getElementById('totalQuestions');
    questionText = document.getElementById('questionText');
    answersGrid = document.getElementById('answersGrid');
    explanationDiv = document.getElementById('explanation');
    explanationText = document.getElementById('explanationText');
    reviveModal = document.getElementById('reviveModal');
    reviveBtn = document.getElementById('reviveBtn');
    reviveTimerText = document.getElementById('reviveTimerText');
    completeModal = document.getElementById('completeModal');
    continueBtn = document.getElementById('continueBtn');
    completeTitle = document.getElementById('completeTitle');
    completeText = document.getElementById('completeText');
    
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.tab === 'login') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            }
        });
    });
    
    document.getElementById('loginBtn').addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showAuthError('Заполните все поля');
            return;
        }
        
        const success = await login(email, password);
        if (success) {
            await loadFromCloud();
            showMainApp();
        }
    });
    
    document.getElementById('registerBtn').addEventListener('click', async () => {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        if (!email || !password) {
            showAuthError('Заполните все поля');
            return;
        }
        
        const success = await register(email, password, name);
        if (success) {
            const loginSuccess = await login(email, password);
            if (loginSuccess) {
                await loadFromCloud();
                showMainApp();
            }
        }
    });
    
    const savedUser = localStorage.getItem('egelingo_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        await loadFromCloud();
        showMainApp();
    }
    
    closeModal.addEventListener('click', closeLessonModal);
    reviveBtn.addEventListener('click', reviveLives);
    continueBtn.addEventListener('click', () => {
        completeModal.classList.remove('active');
    });
    logoutBtn.addEventListener('click', handleLogout);
    
    window.addEventListener('click', (e) => {
        if (e.target === lessonModal) closeLessonModal();
        if (e.target === reviveModal) reviveModal.classList.remove('active');
        if (e.target === completeModal) completeModal.classList.remove('active');
    });
    
    const owlAvatar = document.getElementById('owlAvatar');
    if (owlAvatar) {
        owlAvatar.addEventListener('click', () => {
            if (lessons[0]?.unlocked && !lessons[0]?.completed) {
                owlTooltip.textContent = 'Нажми на первый урок, чтобы начать!';
            } else if (lessons[0]?.completed) {
                owlTooltip.textContent = 'Отлично! Продолжай в том же духе! 🎯';
            } else {
                owlTooltip.textContent = 'Начни с первого урока!';
            }
            setTimeout(() => {
                owlTooltip.style.display = 'none';
            }, 2000);
        });
    }
    
    window.addEventListener('online', () => {
        updateSyncStatus('syncing', 'Восстановление связи...');
        saveToCloud();
    });
    
    window.addEventListener('offline', () => {
        updateSyncStatus('error', 'Офлайн-режим');
    });
    
    console.log('✅ App ready');
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/EGE/sw.js')
        .catch(err => console.log('SW not available'));
}
