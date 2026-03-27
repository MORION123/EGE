// ==================== ЗАГРУЗКА ЗАДАНИЙ ИЗ ФАЙЛА ====================
let subjectsBank = {};

async function loadTasks() {
    try {
        const response = await fetch('/EGE/tasks_math.json');
        subjectsBank = await response.json();
        
        for (let subject in subjectsBank) {
            for (let i = 1; i <= 21; i++) {
                if (!subjectsBank[subject].tasks[i]) {
                    subjectsBank[subject].tasks[i] = [
                        { text: `Задание ${i}. Решите и введите ответ.`, answer: `${i}`, solution: `Ответ: ${i}.` }
                    ];
                }
                while (subjectsBank[subject].tasks[i].length < 2) {
                    subjectsBank[subject].tasks[i].push({
                        text: `Задание ${i}. Введите ответ.`,
                        answer: `${i}`,
                        solution: `Ответ: ${i}.`
                    });
                }
            }
        }
        
        if (currentUser) {
            renderTasks();
            renderAchievements();
        }
        
        console.log('✅ Задания загружены');
    } catch (error) {
        console.error('Ошибка загрузки заданий:', error);
    }
}

// ==================== ДОСТИЖЕНИЯ ====================
const achievementsList = [
    { id: "first_task", name: "Первое задание", icon: "🎯", condition: (stats) => stats.totalSolved >= 1 },
    { id: "ten_tasks", name: "10 заданий", icon: "📚", condition: (stats) => stats.totalSolved >= 10 },
    { id: "fifty_tasks", name: "50 заданий", icon: "🏅", condition: (stats) => stats.totalSolved >= 50 },
    { id: "hundred_tasks", name: "100 заданий", icon: "🎖️", condition: (stats) => stats.totalSolved >= 100 },
    { id: "perfect_math", name: "Математик", icon: "📐", condition: (stats) => stats.subjectMath >= 20 },
    { id: "streak_5", name: "Серия 5", icon: "🔥", condition: (stats) => stats.streak >= 5 },
    { id: "streak_10", name: "Серия 10", icon: "⚡", condition: (stats) => stats.streak >= 10 }
];

// ==================== ПЕРЕМЕННЫЕ ====================
let currentUser = null;
let currentXP = 0;
let xpToNextLevel = 100;
let userLevel = 1;
let currentSubject = "math";
let completedTasks = {};
let userStats = {
    totalSolved: 0,
    correctAnswers: 0,
    streak: 0,
    subjectMath: 0,
    subjectRussian: 0,
    subjectPhysics: 0,
    subjectInformatics: 0,
    achievements: []
};
let currentTaskId = null;
let currentVariant = null;
let currentVariantIndex = null;

// DOM элементы
let authScreen, mainApp, usernameSpan, userAvatar, logoutBtn;
let tasksGrid, taskCard, closeTaskBtn, taskTitle, taskText, taskAnswer, checkBtn;
let taskFeedback, taskSolution, solutionText, levelBadge, xpFill, xpText, owlTooltip;
let statsBar, totalTasksSpan, correctPercentSpan, streakSpan;
let subjectTitle, achievementsGrid;

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
    
    if (currentSubject === "math") userStats.subjectMath++;
    if (currentSubject === "russian") userStats.subjectRussian++;
    if (currentSubject === "physics") userStats.subjectPhysics++;
    if (currentSubject === "informatics") userStats.subjectInformatics++;
    
    updateStats();
    checkAchievements();
    saveProgress();
}

// ==================== ДОСТИЖЕНИЯ ====================
function checkAchievements() {
    const stats = {
        totalSolved: userStats.totalSolved,
        streak: userStats.streak,
        subjectMath: userStats.subjectMath,
        subjectRussian: userStats.subjectRussian
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

// ==================== ЗАДАНИЯ ====================
function getRandomVariant(taskId) {
    if (!subjectsBank[currentSubject]) return null;
    const tasks = subjectsBank[currentSubject].tasks;
    const variants = tasks[taskId];
    if (!variants) return null;
    
    if (!completedTasks[currentSubject]) completedTasks[currentSubject] = {};
    const completed = completedTasks[currentSubject][taskId] || [];
    const available = variants.filter((_, idx) => !completed.includes(idx));
    
    if (available.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const originalIndex = variants.findIndex(v => v === available[randomIndex]);
    return { variant: variants[originalIndex], index: originalIndex };
}

function markTaskCompleted(taskId, variantIndex) {
    if (!completedTasks[currentSubject]) completedTasks[currentSubject] = {};
    if (!completedTasks[currentSubject][taskId]) completedTasks[currentSubject][taskId] = [];
    if (!completedTasks[currentSubject][taskId].includes(variantIndex)) {
        completedTasks[currentSubject][taskId].push(variantIndex);
    }
    
    const btn = document.querySelector(`.task-btn[data-task="${taskId}"]`);
    const tasks = subjectsBank[currentSubject].tasks;
    if (btn && completedTasks[currentSubject][taskId].length >= tasks[taskId].length) {
        btn.classList.add('completed');
        btn.title = 'Все варианты пройдены!';
    }
    saveProgress();
}

function openTask(taskId) {
    currentTaskId = taskId;
    const result = getRandomVariant(taskId);
    
    if (!result) {
        showTip('🎉 Все варианты этого задания пройдены!');
        return;
    }
    
    currentVariant = result.variant;
    currentVariantIndex = result.index;
    
    taskTitle.textContent = `${subjectsBank[currentSubject].name} - Задание ${taskId}`;
    taskText.textContent = currentVariant.text;
    taskAnswer.value = '';
    taskFeedback.className = 'task-feedback';
    taskFeedback.style.display = 'none';
    taskFeedback.innerHTML = '';
    taskSolution.style.display = 'none';
    taskCard.style.display = 'block';
    taskCard.scrollIntoView({ behavior: 'smooth' });
}

function checkAnswer() {
    if (!currentVariant) return;
    
    const userAnswer = taskAnswer.value.trim();
    const isCorrect = userAnswer === currentVariant.answer;
    
    if (isCorrect) {
        taskFeedback.innerHTML = '✅ Правильно! +50 XP';
        taskFeedback.className = 'task-feedback correct';
        taskFeedback.style.display = 'block';
        
        markTaskCompleted(currentTaskId, currentVariantIndex);
        addXP(50);
        recordAnswer(true);
        
        solutionText.textContent = currentVariant.solution;
        taskSolution.style.display = 'block';
        
        checkBtn.disabled = true;
        setTimeout(() => { checkBtn.disabled = false; }, 2000);
        
        setTimeout(() => {
            const result = getRandomVariant(currentTaskId);
            if (result) {
                currentVariant = result.variant;
                currentVariantIndex = result.index;
                taskText.textContent = currentVariant.text;
                taskAnswer.value = '';
                taskFeedback.style.display = 'none';
                taskSolution.style.display = 'none';
                showTip('Новое задание! Решай дальше! 🚀');
            } else {
                taskFeedback.innerHTML = '🎉 Поздравляю! Ты прошёл все варианты этого задания!';
                taskFeedback.style.display = 'block';
            }
        }, 2000);
    } else {
        taskFeedback.innerHTML = `❌ Неправильно. Правильный ответ: ${currentVariant.answer}`;
        taskFeedback.className = 'task-feedback wrong';
        taskFeedback.style.display = 'block';
        recordAnswer(false);
        
        solutionText.textContent = currentVariant.solution;
        taskSolution.style.display = 'block';
    }
    saveProgress();
}

function closeTask() {
    taskCard.style.display = 'none';
    currentTaskId = null;
    currentVariant = null;
}

function renderTasks() {
    if (!tasksGrid || !subjectsBank[currentSubject]) return;
    tasksGrid.innerHTML = '';
    const tasks = subjectsBank[currentSubject].tasks;
    
    for (let i = 1; i <= 21; i++) {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        btn.textContent = i;
        btn.dataset.task = i;
        
        const completed = completedTasks[currentSubject]?.[i] || [];
        if (completed.length >= tasks[i]?.length) {
            btn.classList.add('completed');
            btn.title = 'Все варианты пройдены!';
        }
        btn.addEventListener('click', () => openTask(i));
        tasksGrid.appendChild(btn);
    }
    
    subjectTitle.textContent = `📌 ${subjectsBank[currentSubject].name} - Выбери задание`;
}

function changeSubject(subject) {
    if (!subjectsBank[subject]) return;
    currentSubject = subject;
    renderTasks();
    
    document.querySelectorAll('.subject-btn').forEach(btn => {
        if (btn.dataset.subject === subject) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    closeTask();
    saveProgress();
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
        completedTasks = data.completedTasks || {};
        userStats = data.userStats || {
            totalSolved: 0, correctAnswers: 0, streak: 0,
            subjectMath: 0, subjectRussian: 0, subjectPhysics: 0, subjectInformatics: 0,
            achievements: []
        };
        currentSubject = data.currentSubject || "math";
        updateLevel();
        updateStats();
    } else {
        currentXP = 0;
        completedTasks = {};
        userStats = {
            totalSolved: 0, correctAnswers: 0, streak: 0,
            subjectMath: 0, subjectRussian: 0, subjectPhysics: 0, subjectInformatics: 0,
            achievements: []
        };
        updateLevel();
        updateStats();
    }
    renderTasks();
    renderAchievements();
    
    document.querySelectorAll('.subject-btn').forEach(btn => {
        if (btn.dataset.subject === currentSubject) {
            btn.classList.add('active');
        }
    });
}

function saveProgress() {
    if (!currentUser) return;
    localStorage.setItem(`egelingo_progress_${currentUser.uid}`, JSON.stringify({
        xp: currentXP,
        completedTasks: completedTasks,
        userStats: userStats,
        currentSubject: currentSubject
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
    console.log('📱 EgeLingo v3.0 - Мультипредметный тренажёр ЕГЭ');
    
    authScreen = document.getElementById('authScreen');
    mainApp = document.getElementById('mainApp');
    usernameSpan = document.getElementById('username');
    userAvatar = document.getElementById('userAvatar');
    logoutBtn = document.getElementById('logoutBtn');
    tasksGrid = document.getElementById('tasksGrid');
    taskCard = document.getElementById('taskCard');
    closeTaskBtn = document.getElementById('closeTaskBtn');
    taskTitle = document.getElementById('taskTitle');
    taskText = document.getElementById('taskText');
    taskAnswer = document.getElementById('taskAnswer');
    checkBtn = document.getElementById('checkBtn');
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
    subjectTitle = document.getElementById('subjectTitle');
    achievementsGrid = document.getElementById('achievementsGrid');
    
    if (closeTaskBtn) closeTaskBtn.addEventListener('click', closeTask);
    if (checkBtn) checkBtn.addEventListener('click', checkAnswer);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (taskAnswer) taskAnswer.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
    
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', () => changeSubject(btn.dataset.subject));
    });
    
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
            showTip('Выбери предмет и задание для тренировки!');
        });
    }
    
    // Загружаем задания из файла
    await loadTasks();
    
    console.log('✅ Приложение готово!');
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/EGE/sw.js').catch(err => console.log('SW not available'));
}
