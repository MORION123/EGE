// ==================== ЗАГРУЗКА ЗАДАНИЙ ====================
let subjectsBank = {};

// 15 вариантов по 21 заданию
const variantsCount = 15;
const tasksPerVariant = 21;

async function loadTasks() {
    try {
        const response = await fetch('/EGE/tasks_math.json');
        const fullBank = await response.json();
        
        // Создаём 15 вариантов
        subjectsBank = {};
        for (let v = 1; v <= variantsCount; v++) {
            subjectsBank[v] = {
                name: `Вариант ${v}`,
                tasks: {}
            };
            
            for (let t = 1; t <= tasksPerVariant; t++) {
                // Берём задания из общего банка или создаём заглушки
                const sourceTasks = fullBank.math?.tasks[t];
                if (sourceTasks && sourceTasks.length > 0) {
                    subjectsBank[v].tasks[t] = [...sourceTasks];
                } else {
                    subjectsBank[v].tasks[t] = [
                        { text: `Вариант ${v}, задание ${t}. Решите и введите ответ.`, answer: `${t}`, solution: `Ответ: ${t}.` }
                    ];
                }
                // Перемешиваем варианты внутри задания
                for (let i = subjectsBank[v].tasks[t].length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [subjectsBank[v].tasks[t][i], subjectsBank[v].tasks[t][j]] = [subjectsBank[v].tasks[t][j], subjectsBank[v].tasks[t][i]];
                }
            }
        }
        
        if (currentUser) {
            renderVariants();
            renderAchievements();
        }
        
        console.log(`✅ Загружено ${variantsCount} вариантов`);
    } catch (error) {
        console.error('Ошибка загрузки заданий:', error);
        // Создаём заглушки
        for (let v = 1; v <= variantsCount; v++) {
            subjectsBank[v] = { name: `Вариант ${v}`, tasks: {} };
            for (let t = 1; t <= tasksPerVariant; t++) {
                subjectsBank[v].tasks[t] = [
                    { text: `Вариант ${v}, задание ${t}. Решите и введите ответ.`, answer: `${t}`, solution: `Ответ: ${t}.` }
                ];
            }
        }
    }
}

// ==================== ДОСТИЖЕНИЯ ====================
const achievementsList = [
    { id: "first_task", name: "Первое задание", icon: "🎯", condition: (stats) => stats.totalSolved >= 1 },
    { id: "ten_tasks", name: "10 заданий", icon: "📚", condition: (stats) => stats.totalSolved >= 10 },
    { id: "fifty_tasks", name: "50 заданий", icon: "🏅", condition: (stats) => stats.totalSolved >= 50 },
    { id: "hundred_tasks", name: "100 заданий", icon: "🎖️", condition: (stats) => stats.totalSolved >= 100 },
    { id: "variant_master", name: "Мастер вариантов", icon: "📋", condition: (stats) => stats.completedVariants >= 5 },
    { id: "streak_5", name: "Серия 5", icon: "🔥", condition: (stats) => stats.streak >= 5 },
    { id: "streak_10", name: "Серия 10", icon: "⚡", condition: (stats) => stats.streak >= 10 }
];

// ==================== ПЕРЕМЕННЫЕ ====================
let currentUser = null;
let currentXP = 0;
let xpToNextLevel = 100;
let userLevel = 1;
let currentVariant = 1;
let completedVariants = {}; // { variant: { taskId: [completedIndices] } }
let currentTaskId = null;
let currentTaskVariants = [];
let currentVariantIndex = 0;
let currentVariantData = null;
let currentTaskResults = [];
let isAnswered = false;

let userStats = {
    totalSolved: 0,
    correctAnswers: 0,
    streak: 0,
    completedVariants: 0,
    achievements: []
};

// DOM элементы
let authScreen, mainApp, usernameSpan, userAvatar, logoutBtn;
let variantsGrid, taskSelector, tasksGrid, taskCard, closeTaskBtn;
let variantTitle, backToVariantsBtn, taskTitle, taskText, taskAnswer;
let checkBtn, nextBtn, taskFeedback, taskSolution, solutionText;
let levelBadge, xpFill, xpText, owlTooltip, statsBar;
let totalTasksSpan, correctPercentSpan, streakSpan;
let achievementsGrid, taskProgressSpan;

// ==================== СИСТЕМА УРОВНЕЙ ====================
function updateLevel() {
    let newLevel = 1;
    let neededXP = 100;
    let tempXP = currentXP;
    
    while (tempXP >= neededXP && newLevel < 100) {
        tempXP -= neededXP;
        newLevel++;
        neededXP = Math.floor(neededXP * 1.2);
    }
    
    userLevel = newLevel;
    xpToNextLevel = neededXP;
    currentXP = tempXP;
    
    if (levelBadge) levelBadge.textContent = `📊 Уровень ${userLevel}`;
    if (xpFill) {
        const percent = (currentXP / xpToNextLevel) * 100;
        xpFill.style.width = `${Math.min(percent, 100)}%`;
    }
    if (xpText) xpText.textContent = `${currentXP} / ${xpToNextLevel} XP`;
}

function addXP(amount) {
    currentXP += amount;
    updateLevel();
    saveProgress();
}

// ==================== СТАТИСТИКА ====================
function updateStats() {
    if (totalTasksSpan) totalTasksSpan.textContent = userStats.totalSolved;
    if (correctPercentSpan) {
        const percent = userStats.totalSolved > 0 
            ? Math.round((userStats.correctAnswers / userStats.totalSolved) * 100) 
            : 0;
        correctPercentSpan.textContent = `${percent}%`;
    }
    if (streakSpan) streakSpan.textContent = userStats.streak;
}

function recordAnswer(isCorrect) {
    if (isCorrect) {
        userStats.correctAnswers++;
        userStats.streak++;
    } else {
        userStats.streak = 0;
    }
    userStats.totalSolved++;
    updateStats();
    checkAchievements();
    saveProgress();
}

// ==================== ДОСТИЖЕНИЯ ====================
function checkAchievements() {
    const stats = {
        totalSolved: userStats.totalSolved,
        streak: userStats.streak,
        completedVariants: userStats.completedVariants
    };
    
    let newUnlocked = false;
    
    achievementsList.forEach(achievement => {
        if (!userStats.achievements.includes(achievement.id) && achievement.condition(stats)) {
            userStats.achievements.push(achievement.id);
            newUnlocked = true;
            showTip(`🏆 Новое достижение: ${achievement.name}!`);
        }
    });
    
    if (newUnlocked) renderAchievements();
}

function renderAchievements() {
    if (!achievementsGrid) return;
    achievementsGrid.innerHTML = '';
    
    achievementsList.forEach(achievement => {
        const unlocked = userStats.achievements.includes(achievement.id);
        const badge = document.createElement('div');
        badge.className = `achievement-badge ${unlocked ? 'unlocked' : ''}`;
        badge.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <span class="achievement-name">${achievement.name}</span>
        `;
        achievementsGrid.appendChild(badge);
    });
}

// ==================== ОТОБРАЖЕНИЕ ВАРИАНТОВ ====================
function renderVariants() {
    if (!variantsGrid) return;
    variantsGrid.innerHTML = '';
    
    for (let v = 1; v <= variantsCount; v++) {
        const btn = document.createElement('button');
        btn.className = 'variant-btn';
        btn.textContent = `Вариант ${v}`;
        btn.dataset.variant = v;
        
        // Проверяем, пройден ли вариант
        const variantCompleted = completedVariants[v] && 
            Object.keys(completedVariants[v]).length >= tasksPerVariant;
        if (variantCompleted) {
            btn.classList.add('completed');
        }
        
        btn.addEventListener('click', () => selectVariant(v));
        variantsGrid.appendChild(btn);
    }
}

function selectVariant(variant) {
    currentVariant = variant;
    currentTaskId = null;
    
    variantTitle.textContent = subjectsBank[variant].name;
    taskSelector.style.display = 'block';
    variantTitle.scrollIntoView({ behavior: 'smooth' });
    
    renderTasksForVariant(variant);
}

function renderTasksForVariant(variant) {
    if (!tasksGrid) return;
    tasksGrid.innerHTML = '';
    const tasks = subjectsBank[variant].tasks;
    
    for (let t = 1; t <= tasksPerVariant; t++) {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        btn.textContent = t;
        btn.dataset.task = t;
        
        const completed = completedVariants[variant]?.[t] || [];
        const totalCount = tasks[t]?.length || 0;
        if (completed.length >= totalCount && totalCount > 0) {
            btn.classList.add('completed');
            btn.title = 'Все варианты задания пройдены!';
        }
        btn.addEventListener('click', () => startTask(t));
        tasksGrid.appendChild(btn);
    }
}

// ==================== ЗАДАНИЯ ====================
function startTask(taskId) {
    const variants = subjectsBank[currentVariant].tasks[taskId];
    if (!variants || variants.length === 0) {
        showTip('Нет заданий');
        return;
    }
    
    currentTaskId = taskId;
    currentTaskVariants = [...variants];
    currentTaskResults = [];
    currentVariantIndex = 0;
    isAnswered = false;
    
    // Перемешиваем
    for (let i = currentTaskVariants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentTaskVariants[i], currentTaskVariants[j]] = [currentTaskVariants[j], currentTaskVariants[i]];
    }
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (checkBtn) checkBtn.style.display = 'flex';
    if (checkBtn) checkBtn.disabled = false;
    
    loadNextVariant();
    
    taskTitle.textContent = `${subjectsBank[currentVariant].name} - Задание ${taskId}`;
    taskCard.style.display = 'block';
    taskCard.scrollIntoView({ behavior: 'smooth' });
    
    const oldMistakesBtn = document.getElementById('mistakesBtn');
    if (oldMistakesBtn) oldMistakesBtn.remove();
}

function loadNextVariant() {
    if (currentVariantIndex >= currentTaskVariants.length) {
        finishTask();
        return;
    }
    
    currentVariantData = currentTaskVariants[currentVariantIndex];
    isAnswered = false;
    
    taskText.textContent = currentVariantData.text;
    taskAnswer.value = '';
    taskAnswer.disabled = false;
    taskFeedback.className = 'task-feedback';
    taskFeedback.style.display = 'none';
    taskFeedback.innerHTML = '';
    taskSolution.style.display = 'none';
    
    if (checkBtn) checkBtn.disabled = false;
    if (nextBtn) nextBtn.style.display = 'none';
    if (taskProgressSpan) taskProgressSpan.textContent = `${currentVariantIndex + 1} / ${currentTaskVariants.length}`;
}

function checkAnswer() {
    if (isAnswered) return;
    if (!currentVariantData) return;
    
    const userAnswer = taskAnswer.value.trim();
    const isCorrect = userAnswer === currentVariantData.answer;
    
    currentTaskResults.push({
        variant: currentVariantData,
        userAnswer: userAnswer,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        taskFeedback.innerHTML = '✅ Правильно! +10 XP';
        taskFeedback.className = 'task-feedback correct';
        taskFeedback.style.display = 'block';
        
        addXP(10);
        recordAnswer(true);
        
        solutionText.textContent = currentVariantData.solution;
        taskSolution.style.display = 'block';
        
        isAnswered = true;
        taskAnswer.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.textContent = '➡️ Далее';
        }
    } else {
        taskFeedback.innerHTML = `❌ Неправильно. Правильный ответ: ${currentVariantData.answer}`;
        taskFeedback.className = 'task-feedback wrong';
        taskFeedback.style.display = 'block';
        
        solutionText.textContent = currentVariantData.solution;
        taskSolution.style.display = 'block';
        
        recordAnswer(false);
        
        isAnswered = true;
        taskAnswer.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.textContent = '➡️ Далее';
        }
    }
    
    saveProgress();
}

function nextVariant() {
    if (!isAnswered) return;
    
    currentVariantIndex++;
    loadNextVariant();
}

function finishTask() {
    const mistakes = currentTaskResults.filter(r => !r.isCorrect);
    const correctCount = currentTaskResults.filter(r => r.isCorrect).length;
    
    // Сохраняем прогресс по заданию
    if (!completedVariants[currentVariant]) completedVariants[currentVariant] = {};
    completedVariants[currentVariant][currentTaskId] = currentTaskResults.map(r => r.isCorrect);
    saveProgress();
    
    taskFeedback.innerHTML = `🎉 Задание завершено! Правильных: ${correctCount} из ${currentTaskVariants.length}`;
    taskFeedback.className = 'task-feedback correct';
    taskFeedback.style.display = 'block';
    
    if (checkBtn) checkBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    
    if (mistakes.length > 0) {
        taskFeedback.innerHTML += `<br>❌ Ошибок: ${mistakes.length}`;
        
        const mistakesBtn = document.createElement('button');
        mistakesBtn.id = 'mistakesBtn';
        mistakesBtn.textContent = '📋 Показать ошибки с решениями';
        mistakesBtn.className = 'check-btn';
        mistakesBtn.style.marginTop = '15px';
        mistakesBtn.style.background = '#f59e0b';
        mistakesBtn.onclick = () => showMistakes(mistakes);
        taskCard.appendChild(mistakesBtn);
    }
    
    // Кнопка выбора другого задания
    const chooseBtn = document.createElement('button');
    chooseBtn.textContent = '🏠 Выбрать другое задание';
    chooseBtn.className = 'check-btn';
    chooseBtn.style.marginTop = '15px';
    chooseBtn.style.marginLeft = '10px';
    chooseBtn.style.background = '#4a6cf7';
    chooseBtn.onclick = () => closeTask();
    taskCard.appendChild(chooseBtn);
    
    taskAnswer.disabled = true;
    
    // Обновляем кнопку варианта
    const allTasksCompleted = Object.keys(completedVariants[currentVariant] || {}).length >= tasksPerVariant;
    if (allTasksCompleted && !userStats.achievements.includes('variant_master')) {
        userStats.completedVariants++;
        checkAchievements();
    }
    
    renderTasksForVariant(currentVariant);
}

function showMistakes(mistakes) {
    const modal = document.createElement('div');
    modal.className = 'mistakes-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 30px;
        max-width: 550px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        padding: 25px;
    `;
    
    content.innerHTML = '<h2 style="margin-bottom: 20px; color: #c53030;">❌ Задания с ошибками</h2>';
    
    mistakes.forEach((mistake, idx) => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 15px;
            margin-bottom: 15px;
            background: #f7fafc;
            border-radius: 20px;
            border-left: 4px solid #f56565;
        `;
        item.innerHTML = `
            <p style="font-weight: 700; margin-bottom: 10px;">${mistake.variant.text}</p>
            <p style="color: #c53030; margin-bottom: 5px;">❌ Ваш ответ: ${mistake.userAnswer}</p>
            <p style="color: #276749; margin-bottom: 10px;">✅ Правильный ответ: ${mistake.variant.answer}</p>
            <details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: #4a6cf7; font-weight: 600;">📖 Показать решение</summary>
                <p style="margin-top: 10px; padding: 10px; background: #ebf4ff; border-radius: 12px;">${mistake.variant.solution}</p>
            </details>
        `;
        content.appendChild(item);
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 12px 24px;
        background: #4a6cf7;
        color: white;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        width: 100%;
        font-size: 16px;
        font-weight: 600;
    `;
    closeBtn.onclick = () => modal.remove();
    content.appendChild(closeBtn);
    
    modal.appendChild(content);
    document.body.appendChild(modal);
}

function closeTask() {
    taskCard.style.display = 'none';
    currentTaskId = null;
    currentTaskVariants = [];
    currentTaskResults = [];
    currentVariantData = null;
    isAnswered = false;
    
    if (checkBtn) checkBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'none';
    if (taskProgressSpan) taskProgressSpan.textContent = '';
    
    const mistakesBtn = document.getElementById('mistakesBtn');
    if (mistakesBtn) mistakesBtn.remove();
}

function backToVariants() {
    taskSelector.style.display = 'none';
    closeTask();
}

function showTip(msg) {
    if (owlTooltip) {
        owlTooltip.textContent = msg;
        owlTooltip.style.display = 'block';
        setTimeout(() => { owlTooltip.style.display = 'none'; }, 2000);
    }
}

// ==================== АВТОРИЗАЦИЯ ====================
function loadUsers() {
    const saved = localStorage.getItem('egelingo_users');
    return saved ? JSON.parse(saved) : {};
}

function saveUsers(users) {
    localStorage.setItem('egelingo_users', JSON.stringify(users));
}

function register(username, password) {
    username = username.trim();
    const users = loadUsers();
    
    if (users[username]) {
        showAuthError('Пользователь уже существует');
        return false;
    }
    if (password.length < 4) {
        showAuthError('Пароль минимум 4 символа');
        return false;
    }
    
    users[username] = {
        password: btoa(password),
        name: username,
        createdAt: new Date().toISOString()
    };
    saveUsers(users);
    return true;
}

function login(username, password) {
    username = username.trim();
    const users = loadUsers();
    const user = users[username];
    
    if (!user || user.password !== btoa(password)) {
        showAuthError('Неверное имя или пароль');
        return false;
    }
    
    currentUser = { uid: username, name: username };
    localStorage.setItem('egelingo_user', JSON.stringify(currentUser));
    return true;
}

function loadProgress() {
    const saved = localStorage.getItem(`egelingo_progress_${currentUser.uid}`);
    if (saved) {
        const data = JSON.parse(saved);
        currentXP = data.xp || 0;
        completedVariants = data.completedVariants || {};
        userStats = data.userStats || {
            totalSolved: 0, correctAnswers: 0, streak: 0, completedVariants: 0, achievements: []
        };
        updateLevel();
        updateStats();
    } else {
        currentXP = 0;
        completedVariants = {};
        userStats = {
            totalSolved: 0, correctAnswers: 0, streak: 0, completedVariants: 0, achievements: []
        };
        updateLevel();
        updateStats();
    }
    renderVariants();
    renderAchievements();
    taskSelector.style.display = 'none';
}

function saveProgress() {
    if (!currentUser) return;
    localStorage.setItem(`egelingo_progress_${currentUser.uid}`, JSON.stringify({
        xp: currentXP,
        completedVariants: completedVariants,
        userStats: userStats
    }));
}

function showMainApp() {
    authScreen.style.display = 'none';
    mainApp.style.display = 'block';
    usernameSpan.textContent = currentUser.name;
    statsBar.style.display = 'flex';
    loadProgress();
}

function handleLogout() {
    if (confirm('Выйти из аккаунта?')) {
        localStorage.removeItem('egelingo_user');
        currentUser = null;
        authScreen.style.display = 'flex';
        mainApp.style.display = 'none';
        statsBar.style.display = 'none';
    }
}

function showAuthError(msg) {
    const err = document.createElement('div');
    err.className = 'auth-error';
    err.textContent = msg;
    const activeForm = document.querySelector('.auth-form:not([style*="display: none"])');
    if (activeForm) activeForm.appendChild(err);
    setTimeout(() => err.remove(), 3000);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 EgeLingo v5.0 - Варианты ЕГЭ');
    
    authScreen = document.getElementById('authScreen');
    mainApp = document.getElementById('mainApp');
    usernameSpan = document.getElementById('username');
    userAvatar = document.getElementById('userAvatar');
    logoutBtn = document.getElementById('logoutBtn');
    variantsGrid = document.getElementById('variantsGrid');
    taskSelector = document.getElementById('taskSelector');
    tasksGrid = document.getElementById('tasksGrid');
    variantTitle = document.getElementById('variantTitle');
    backToVariantsBtn = document.getElementById('backToVariantsBtn');
    taskCard = document.getElementById('taskCard');
    closeTaskBtn = document.getElementById('closeTaskBtn');
    taskTitle = document.getElementById('taskTitle');
    taskText = document.getElementById('taskText');
    taskAnswer = document.getElementById('taskAnswer');
    checkBtn = document.getElementById('checkBtn');
    nextBtn = document.getElementById('nextBtn');
    taskFeedback = document.getElementById('taskFeedback');
    taskSolution = document.getElementById('taskSolution');
    solutionText = document.getElementById('solutionText');
    levelBadge = document.getElementById('levelBadge');
    xpFill = document.getElementById('xpFill');
    xpText = document.getElementById('xpText');
    owlTooltip = document.getElementById('owlTooltip');
    statsBar = document.getElementById('statsBar');
    totalTasksSpan = document.getElementById('totalTasks');
    correctPercentSpan = document.getElementById('correctPercent');
    streakSpan = document.getElementById('streak');
    achievementsGrid = document.getElementById('achievementsGrid');
    taskProgressSpan = document.getElementById('taskProgress');
    
    if (backToVariantsBtn) backToVariantsBtn.addEventListener('click', backToVariants);
    if (closeTaskBtn) closeTaskBtn.addEventListener('click', closeTask);
    if (checkBtn) checkBtn.addEventListener('click', checkAnswer);
    if (nextBtn) nextBtn.addEventListener('click', nextVariant);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (taskAnswer) taskAnswer.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
    
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tabs.length) {
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
    }
    
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const registerUsername = document.getElementById('registerUsername');
    const registerPassword = document.getElementById('registerPassword');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (login(loginUsername.value, loginPassword.value)) showMainApp();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (register(registerUsername.value, registerPassword.value)) {
                login(registerUsername.value, registerPassword.value);
                showMainApp();
            }
        });
    }
    
    const saved = localStorage.getItem('egelingo_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        showMainApp();
    }
    
    const owlAvatar = document.getElementById('owlAvatar');
    if (owlAvatar) {
        owlAvatar.addEventListener('click', () => {
            showTip('Выбери вариант и решай задания по порядку!');
        });
    }
    
    await loadTasks();
    
    console.log('✅ Приложение готово!');
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/EGE/sw.js').catch(err => console.log('SW not available'));
}
