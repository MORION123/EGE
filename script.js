// ==================== БАНК ЗАДАНИЙ ====================
const tasksBank = {
    1: [
        { text: "Шоколадка стоит 35 рублей. В воскресенье действует акция: заплатив за две, получаешь три. Какое наибольшее количество шоколадок можно получить, имея 200 рублей?", answer: "8", solution: "200 ÷ 35 = 5 штук. По акции за 2 → 3, за 4 → 6, плюс 1 остаётся → 7, но можно купить ещё 2 → 3 (уже 6), остаётся 30 руб → не хватает. Ответ: 8." },
        { text: "Тетрадь стоит 24 рубля. При покупке более 50 тетрадей скидка 10%. Сколько рублей заплатит покупатель за 60 тетрадей?", answer: "1296", solution: "60 × 24 = 1440 руб. Скидка 10%: 1440 × 0.9 = 1296 руб." },
        { text: "Флакон шампуня стоит 160 рублей. Во время распродажи скидка 25%. Сколько флаконов можно купить на 1000 рублей?", answer: "8", solution: "160 × 0.75 = 120 руб. 1000 ÷ 120 = 8.33 → 8 флаконов." }
    ],
    2: [
        { text: "На графике показано изменение температуры. Найдите разность между наибольшей и наименьшей температурой за сутки.", answer: "12", solution: "Максимум +8°, минимум -4° → разность 12°." }
    ],
    3: [
        { text: "Площадь квадрата равна 36. Найдите его периметр.", answer: "24", solution: "Сторона = √36 = 6. Периметр = 4 × 6 = 24." },
        { text: "Периметр квадрата равен 32. Найдите его площадь.", answer: "64", solution: "Сторона = 32 ÷ 4 = 8. Площадь = 8² = 64." }
    ],
    4: [
        { text: "Найдите значение выражения: (3²)³ × 3⁵ ÷ 3⁸", answer: "27", solution: "3⁶ × 3⁵ = 3¹¹; 3¹¹ ÷ 3⁸ = 3³ = 27." }
    ],
    5: [
        { text: "Бросают две игральные кости. Найдите вероятность того, что в сумме выпадет 8 очков.", answer: "0.14", solution: "Всего исходов 36. Благоприятные: (2,6),(3,5),(4,4),(5,3),(6,2) — 5. 5/36 ≈ 0.1389 → 0.14." }
    ],
    6: [
        { text: "Для квартиры 45 м² натяжной потолок. Цена работы 200 руб/м², материала 300 руб/м². Сколько рублей составит общая стоимость?", answer: "22500", solution: "(200 + 300) × 45 = 500 × 45 = 22500 руб." }
    ],
    7: [
        { text: "На рисунке показана цена нефти. Сколько дней цена была выше 70 долларов?", answer: "5", solution: "Считаем точки выше 70." }
    ],
    8: [
        { text: "Выберите верное утверждение: 1) Если два угла равны, то треугольник равнобедренный. 2) Любой прямоугольник — квадрат. 3) Сумма углов треугольника 360°.", answer: "1", solution: "Только первое верно." }
    ],
    9: [
        { text: "Найдите площадь треугольника на клетчатой бумаге (сторона клетки 1 см).", answer: "6", solution: "S = ½ × 4 × 3 = 6." }
    ],
    10: [
        { text: "Колесо имеет 5 спиц. Найдите угол между соседними спицами.", answer: "72", solution: "360° ÷ 5 = 72°." }
    ],
    11: [
        { text: "Объём куба равен 125. Найдите площадь его поверхности.", answer: "150", solution: "Сторона = ∛125 = 5. S = 6 × 5² = 150." }
    ],
    12: [
        { text: "В треугольнике ABC угол C = 90°, AB = 10, AC = 6. Найдите BC.", answer: "8", solution: "BC = √(10² - 6²) = √(100 - 36) = √64 = 8." }
    ],
    13: [
        { text: "В правильной четырёхугольной пирамиде сторона основания 6, апофема 5. Найдите площадь боковой поверхности.", answer: "60", solution: "S = ½ × (4×6) × 5 = 60." }
    ],
    14: [
        { text: "Найдите значение: 0.7 × 0.3 + 0.3 × 0.3", answer: "0.3", solution: "0.3 × (0.7 + 0.3) = 0.3 × 1 = 0.3." }
    ],
    15: [
        { text: "Билет на поезд 1800 руб. Школьникам скидка 50%. Сколько рублей стоят билеты для 4 взрослых и 6 школьников?", answer: "12600", solution: "4×1800=7200, 6×900=5400, итого 12600." }
    ],
    16: [
        { text: "Упростите: (a - 3)² - a(a - 6)", answer: "9", solution: "a² - 6a + 9 - a² + 6a = 9." }
    ],
    17: [
        { text: "Решите уравнение: 4ˣ = 64", answer: "3", solution: "4³ = 64 → x = 3." }
    ],
    18: [
        { text: "Решите неравенство: 2x - 5 > 3", answer: "4", solution: "2x > 8 → x > 4." }
    ],
    19: [
        { text: "Найдите трёхзначное число, кратное 5 и 9, все цифры различны.", answer: "135", solution: "Число кратно 5 → оканчивается на 0 или 5. Кратно 9 → сумма цифр кратна 9. 135: 1+3+5=9." }
    ],
    20: [
        { text: "Пешеход вышел из А в В со скоростью 5 км/ч. Через 2 часа выехал велосипедист 15 км/ч. На каком расстоянии от А он догонит пешехода?", answer: "15", solution: "Пешеход прошёл 10 км. Скорость сближения 10 км/ч → время 1 ч. Расстояние = 15×1 = 15 км." }
    ],
    21: [
        { text: "Сколько способов рассадить 5 человек на 5 стульях?", answer: "120", solution: "5! = 120." }
    ]
};

// Дополняем задания (минимум 3 варианта)
for (let i = 1; i <= 21; i++) {
    if (!tasksBank[i]) tasksBank[i] = [];
    while (tasksBank[i].length < 3) {
        tasksBank[i].push({
            text: `Задание ${i}. Решите и введите ответ.`,
            answer: `${i * 5}`,
            solution: `Решение: ${i * 5}.`
        });
    }
}

// ==================== ПЕРЕМЕННЫЕ ====================
let currentUser = null;
let currentXP = 0;
let xpToNextLevel = 100;
let userLevel = 1;
let completedTasks = {};
let currentTaskId = null;
let currentVariant = null;
let currentVariantIndex = null;

// DOM элементы
let authScreen, mainApp, usernameSpan, userAvatar, logoutBtn;
let tasksGrid, taskCard, closeTaskBtn, taskTitle, taskText, taskAnswer, checkBtn;
let taskFeedback, taskSolution, solutionText, levelBadge, xpFill, xpText, owlTooltip;

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

// ==================== ЗАДАНИЯ ====================
function getRandomVariant(taskId) {
    const variants = tasksBank[taskId];
    const completed = completedTasks[taskId] || [];
    const available = variants.filter((_, idx) => !completed.includes(idx));
    
    if (available.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const originalIndex = variants.findIndex(v => v === available[randomIndex]);
    return { variant: variants[originalIndex], index: originalIndex };
}

function markTaskCompleted(taskId, variantIndex) {
    if (!completedTasks[taskId]) completedTasks[taskId] = [];
    if (!completedTasks[taskId].includes(variantIndex)) {
        completedTasks[taskId].push(variantIndex);
    }
    
    const btn = document.querySelector(`.task-btn[data-task="${taskId}"]`);
    if (btn && completedTasks[taskId].length >= tasksBank[taskId].length) {
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
    
    taskTitle.textContent = `Задание ${taskId}`;
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

function showTip(msg) {
    owlTooltip.textContent = msg;
    owlTooltip.style.display = 'block';
    setTimeout(() => { owlTooltip.style.display = 'none'; }, 2000);
}

function renderTasks() {
    tasksGrid.innerHTML = '';
    for (let i = 1; i <= 21; i++) {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        btn.textContent = i;
        btn.dataset.task = i;
        
        const completed = completedTasks[i] || [];
        if (completed.length >= tasksBank[i].length) {
            btn.classList.add('completed');
            btn.title = 'Все варианты пройдены!';
        }
        btn.addEventListener('click', () => openTask(i));
        tasksGrid.appendChild(btn);
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
        updateLevel();
    } else {
        currentXP = 0;
        completedTasks = {};
        updateLevel();
    }
    renderTasks();
}

function saveProgress() {
    if (!currentUser) return;
    localStorage.setItem(`egelingo_progress_${currentUser.uid}`, JSON.stringify({
        xp: currentXP,
        completedTasks: completedTasks
    }));
}

function showMainApp() {
    authScreen.style.display = 'none';
    mainApp.style.display = 'block';
    usernameSpan.textContent = currentUser.name;
    loadProgress();
}

function handleLogout() {
    if (confirm('Выйти из аккаунта?')) {
        localStorage.removeItem('egelingo_user');
        currentUser = null;
        authScreen.style.display = 'flex';
        mainApp.style.display = 'none';
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
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 EgeLingo - Тренажёр ЕГЭ по математике');
    
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
    
    closeTaskBtn.addEventListener('click', closeTask);
    checkBtn.addEventListener('click', checkAnswer);
    logoutBtn.addEventListener('click', handleLogout);
    taskAnswer.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
    
    // Вкладки
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
    
    document.getElementById('loginBtn').addEventListener('click', () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        if (login(username, password)) showMainApp();
    });
    
    document.getElementById('registerBtn').addEventListener('click', () => {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        if (register(username, password)) {
            login(username, password);
            showMainApp();
        }
    });
    
    const saved = localStorage.getItem('egelingo_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        showMainApp();
    }
    
    document.getElementById('owlAvatar').addEventListener('click', () => {
        showTip('Выбери задание 1–21 и реши его!');
    });
});
