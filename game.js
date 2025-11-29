// =============================================
// ACTUARIAL QUEST - EXAM FM RPG
// =============================================

const Game = {
    // ==========================================
    // STATE
    // ==========================================
    state: {
        player: {
            name: 'Hero',
            avatar: '🧙‍♂️',
            class: 'scholar',
            level: 1,
            xp: 0,
            xpToLevel: 100,
            hp: 100,
            maxHp: 100,
            gold: 50,
            stats: {
                problemsSolved: 0,
                correctAnswers: 0,
                totalAttempts: 0,
                maxCombo: 0,
                totalXp: 0,
                totalGold: 0
            },
            completedLevels: {}
        },
        battle: null,
        currentScreen: 'title'
    },

    // ==========================================
    // ZONE DATA
    // ==========================================
    zones: {
        1: {
            name: 'Time Value Temple',
            topic: 'tvm',
            enemies: [
                { name: 'Interest Imp', sprite: '👹', hp: 40, xp: 30, gold: 15 },
                { name: 'Discount Devil', sprite: '👿', hp: 55, xp: 45, gold: 20 },
                { name: 'Compound Creature', sprite: '👾', hp: 70, xp: 60, gold: 30 },
                { name: 'TVM Titan', sprite: '🐲', hp: 120, xp: 120, gold: 60, boss: true }
            ]
        },
        2: {
            name: 'Annuity Abyss',
            topic: 'annuity',
            enemies: [
                { name: 'Payment Phantom', sprite: '👻', hp: 60, xp: 50, gold: 25 },
                { name: 'Perpetuity Ghost', sprite: '💀', hp: 80, xp: 70, gold: 35 },
                { name: 'Annuity Specter', sprite: '🎃', hp: 100, xp: 90, gold: 45 },
                { name: 'Annuity Archon', sprite: '🐙', hp: 180, xp: 180, gold: 90, boss: true }
            ]
        },
        3: {
            name: 'Bond Peaks',
            topic: 'bond',
            enemies: [
                { name: 'Coupon Cyclops', sprite: '👁️', hp: 85, xp: 75, gold: 40 },
                { name: 'Yield Yeti', sprite: '🦍', hp: 110, xp: 100, gold: 50 },
                { name: 'Premium Predator', sprite: '🦅', hp: 140, xp: 130, gold: 65 },
                { name: 'Bond Baron', sprite: '🦖', hp: 250, xp: 250, gold: 125, boss: true }
            ]
        },
        4: {
            name: 'Duration Sanctum',
            topic: 'duration',
            enemies: [
                { name: 'Macaulay Monster', sprite: '🤖', hp: 120, xp: 110, gold: 55 },
                { name: 'Modified Menace', sprite: '🦾', hp: 150, xp: 140, gold: 70 },
                { name: 'Convexity Beast', sprite: '🗿', hp: 180, xp: 170, gold: 85 },
                { name: 'Duration Dragon', sprite: '🐉', hp: 320, xp: 320, gold: 160, boss: true }
            ]
        },
        5: {
            name: 'Final Exam',
            topic: 'mixed',
            enemies: [
                { name: 'The Exam Overlord', sprite: '👑', hp: 500, xp: 500, gold: 300, boss: true }
            ]
        }
    },

    // ==========================================
    // FORMULAS
    // ==========================================
    formulas: {
        tvm: [
            { name: 'Future Value', eq: 'FV = PV × (1 + i)ⁿ', desc: 'Compound interest accumulation' },
            { name: 'Present Value', eq: 'PV = FV × (1 + i)⁻ⁿ', desc: 'Discount future cash flow' },
            { name: 'Effective Rate', eq: 'i_eff = (1 + i/m)^m - 1', desc: 'Nominal to effective conversion' },
            { name: 'Discount Factor', eq: 'v = 1/(1 + i)', desc: 'One-period discount factor' },
            { name: 'Force of Interest', eq: 'δ = ln(1 + i)', desc: 'Continuous compounding rate' },
            { name: 'Discount Rate', eq: 'd = i/(1 + i)', desc: 'Rate of discount' }
        ],
        annuity: [
            { name: 'Annuity Immediate PV', eq: 'a_n| = (1 - vⁿ)/i', desc: 'PV of n end-of-period payments' },
            { name: 'Annuity Due PV', eq: 'ä_n| = (1 - vⁿ)/d', desc: 'PV of n beginning-of-period payments' },
            { name: 'Annuity FV', eq: 's_n| = ((1+i)ⁿ - 1)/i', desc: 'Accumulated value' },
            { name: 'Perpetuity Immediate', eq: 'a_∞| = 1/i', desc: 'PV of infinite payments' },
            { name: 'Growing Perpetuity', eq: 'PV = C/(i - g)', desc: 'With growth rate g' }
        ],
        bond: [
            { name: 'Bond Price', eq: 'P = Fr × a_n| + C × vⁿ', desc: 'PV of coupons + redemption' },
            { name: 'Premium/Discount', eq: 'P - C = (Fr - Ci) × a_n|', desc: 'Difference from par' },
            { name: 'Current Yield', eq: 'CY = Coupon/Price', desc: 'Annual income return' },
            { name: 'Book Value', eq: 'BV_t = Fr × a_(n-t)| + C × v^(n-t)', desc: 'Amortized value at time t' }
        ],
        duration: [
            { name: 'Macaulay Duration', eq: 'D = Σ(t × PV_t)/P', desc: 'Weighted average time' },
            { name: 'Modified Duration', eq: 'D_mod = D/(1 + i)', desc: 'Price sensitivity' },
            { name: 'Price Change', eq: 'ΔP ≈ -D_mod × P × Δi', desc: 'Duration approximation' },
            { name: 'Convexity', eq: 'C = Σ(t(t+1) × PV_t × v²)/P', desc: 'Second-order sensitivity' }
        ]
    },

    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        this.setupParticles();
        this.setupEventListeners();
        this.loadGame();
    },

    setupParticles() {
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },

    setupEventListeners() {
        // Avatar selection
        document.querySelectorAll('.avatar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.player.avatar = btn.dataset.avatar;
            });
        });

        // Class selection
        document.querySelectorAll('.class-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.state.player.class = card.dataset.class;
            });
        });

        // Zone/Level clicks
        document.querySelectorAll('.zone').forEach(zone => {
            zone.addEventListener('click', (e) => {
                const zoneNum = parseInt(zone.dataset.zone);
                const marker = zone.querySelector('.zone-marker');
                if (marker.classList.contains('locked')) return;

                // Check if clicked on a specific level dot
                if (e.target.classList.contains('dot')) {
                    const levelNum = parseInt(e.target.dataset.level);
                    this.startBattle(zoneNum, levelNum);
                }
            });
        });

        // Formula tabs
        document.querySelectorAll('.formula-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.formula-tabs .tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderFormulas(tab.dataset.tab);
            });
        });
    },

    // ==========================================
    // SCREEN MANAGEMENT
    // ==========================================
    showScreen(name) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`screen-${name}`).classList.add('active');
        this.state.currentScreen = name;
    },

    // ==========================================
    // GAME FLOW
    // ==========================================
    newGame() {
        this.state.player = {
            name: 'Hero',
            avatar: '🧙‍♂️',
            class: 'scholar',
            level: 1,
            xp: 0,
            xpToLevel: 100,
            hp: 100,
            maxHp: 100,
            gold: 50,
            stats: {
                problemsSolved: 0,
                correctAnswers: 0,
                totalAttempts: 0,
                maxCombo: 0,
                totalXp: 0,
                totalGold: 0
            },
            completedLevels: {}
        };
        this.showScreen('character');
    },

    continueGame() {
        if (localStorage.getItem('actuarialQuest')) {
            this.showScreen('map');
            this.updateMapUI();
        }
    },

    startAdventure() {
        const nameInput = document.getElementById('player-name');
        this.state.player.name = nameInput.value.trim() || 'Hero';
        this.saveGame();
        this.showScreen('map');
        this.updateMapUI();
    },

    returnToMap() {
        this.hideAllOverlays();
        this.showScreen('map');
        this.updateMapUI();
        this.saveGame();
    },

    // ==========================================
    // MAP UI
    // ==========================================
    updateMapUI() {
        const p = this.state.player;

        // Header
        document.getElementById('header-avatar').textContent = p.avatar;
        document.getElementById('header-name').textContent = p.name;
        document.getElementById('header-level').textContent = p.level;
        document.getElementById('header-gold').textContent = p.gold;

        // Bars
        const hpPct = (p.hp / p.maxHp) * 100;
        const xpPct = (p.xp / p.xpToLevel) * 100;
        document.getElementById('bar-hp').style.width = `${hpPct}%`;
        document.getElementById('bar-xp').style.width = `${xpPct}%`;
        document.getElementById('text-hp').textContent = `${p.hp}/${p.maxHp}`;
        document.getElementById('text-xp').textContent = `${p.xp}/${p.xpToLevel}`;

        // Zone unlocks
        this.updateZoneStates();

        // Enable continue button
        if (p.stats.problemsSolved > 0) {
            document.getElementById('btn-continue').disabled = false;
        }
    },

    updateZoneStates() {
        const p = this.state.player;

        for (let z = 1; z <= 5; z++) {
            const zoneEl = document.querySelector(`.zone[data-zone="${z}"]`);
            const marker = zoneEl.querySelector('.zone-marker');
            const dots = zoneEl.querySelectorAll('.dot');

            // Check if zone is unlocked
            const prevBossKey = `${z-1}-4`;
            const isUnlocked = z === 1 || p.completedLevels[prevBossKey];

            marker.classList.remove('locked', 'unlocked', 'completed');
            if (isUnlocked) {
                marker.classList.add('unlocked');

                // Check if all levels completed
                const zone = this.zones[z];
                const allDone = zone.enemies.every((_, i) => p.completedLevels[`${z}-${i+1}`]);
                if (allDone) marker.classList.add('completed');
            } else {
                marker.classList.add('locked');
            }

            // Update level dots
            dots.forEach((dot, i) => {
                const levelKey = `${z}-${i+1}`;
                dot.classList.remove('completed', 'current');

                if (p.completedLevels[levelKey]) {
                    dot.classList.add('completed');
                } else if (isUnlocked) {
                    // First incomplete level in unlocked zone
                    const prevKey = `${z}-${i}`;
                    if (i === 0 || p.completedLevels[prevKey]) {
                        dot.classList.add('current');
                    }
                }
            });
        }
    },

    // ==========================================
    // BATTLE SYSTEM
    // ==========================================
    startBattle(zoneNum, levelNum) {
        const zone = this.zones[zoneNum];
        const enemy = zone.enemies[levelNum - 1];

        this.state.battle = {
            zone: zoneNum,
            level: levelNum,
            zoneName: zone.name,
            topic: zone.topic,
            enemy: { ...enemy, currentHp: enemy.hp },
            problemIndex: 0,
            totalProblems: enemy.boss ? 7 : 5,
            combo: 0,
            maxCombo: 0,
            correct: 0,
            wrong: 0,
            currentProblem: null,
            timer: null,
            timeLeft: enemy.boss ? 75 : 60,
            maxTime: enemy.boss ? 75 : 60
        };

        this.showScreen('battle');
        this.updateBattleUI();
        this.loadProblem();
    },

    updateBattleUI() {
        const p = this.state.player;
        const b = this.state.battle;

        // HUD
        document.getElementById('battle-zone').textContent = b.zoneName;
        document.getElementById('battle-level').textContent = `Level ${b.level}`;
        document.getElementById('problem-num').textContent = b.problemIndex + 1;
        document.getElementById('problem-total').textContent = b.totalProblems;

        // Player
        document.getElementById('player-sprite').textContent = p.avatar;
        document.getElementById('player-battle-name').textContent = p.name;
        document.getElementById('player-hp-bar').style.width = `${(p.hp / p.maxHp) * 100}%`;
        document.getElementById('player-hp-text').textContent = `${p.hp}/${p.maxHp}`;

        // Enemy
        document.getElementById('enemy-sprite').textContent = b.enemy.sprite;
        document.getElementById('enemy-name').textContent = b.enemy.name;
        document.getElementById('enemy-hp-bar').style.width = `${(b.enemy.currentHp / b.enemy.hp) * 100}%`;
        document.getElementById('enemy-hp-text').textContent = `${b.enemy.currentHp}/${b.enemy.hp}`;

        // Combo
        document.getElementById('combo-value').textContent = b.combo;
    },

    loadProblem() {
        const b = this.state.battle;

        // Check win/loss conditions
        if (b.enemy.currentHp <= 0 || b.problemIndex >= b.totalProblems) {
            this.endBattle(true);
            return;
        }

        // Generate problem
        const topic = b.topic === 'mixed' ?
            ['tvm', 'annuity', 'bond', 'duration'][Math.floor(Math.random() * 4)] :
            b.topic;

        const problem = Problems.generate(topic);
        b.currentProblem = problem;

        // Update UI
        document.getElementById('problem-type').textContent = problem.type;
        document.getElementById('problem-text').textContent = problem.text;

        // Render answer options
        const optionsEl = document.getElementById('answer-options');
        optionsEl.innerHTML = '';
        problem.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-answer';
            btn.textContent = this.formatNumber(opt);
            btn.onclick = () => this.submitAnswer(i);
            optionsEl.appendChild(btn);
        });

        // Start timer
        this.startTimer();
    },

    startTimer() {
        const b = this.state.battle;
        b.timeLeft = b.maxTime;

        const timerBar = document.getElementById('timer-bar');
        timerBar.style.width = '100%';
        timerBar.classList.remove('warning');

        if (b.timer) clearInterval(b.timer);

        b.timer = setInterval(() => {
            b.timeLeft--;
            const pct = (b.timeLeft / b.maxTime) * 100;
            timerBar.style.width = `${pct}%`;

            if (pct <= 30) timerBar.classList.add('warning');

            if (b.timeLeft <= 0) {
                clearInterval(b.timer);
                this.handleWrongAnswer();
            }
        }, 1000);
    },

    stopTimer() {
        if (this.state.battle?.timer) {
            clearInterval(this.state.battle.timer);
        }
    },

    submitAnswer(index) {
        const b = this.state.battle;
        if (!b.currentProblem) return;

        this.stopTimer();

        const correct = index === b.currentProblem.correctIndex;
        const buttons = document.querySelectorAll('.btn-answer');

        // Highlight answers
        buttons[b.currentProblem.correctIndex].classList.add('correct');
        if (!correct) buttons[index].classList.add('wrong');

        setTimeout(() => {
            if (correct) {
                this.handleCorrectAnswer();
            } else {
                this.handleWrongAnswer();
            }
        }, 500);
    },

    handleCorrectAnswer() {
        const p = this.state.player;
        const b = this.state.battle;

        b.combo++;
        b.maxCombo = Math.max(b.maxCombo, b.combo);
        b.correct++;

        // Calculate damage
        let baseDamage = 10 + p.level * 2;
        if (p.class === 'warrior') baseDamage *= 1.2;
        const comboDamage = Math.floor(baseDamage * (1 + b.combo * 0.15));

        b.enemy.currentHp = Math.max(0, b.enemy.currentHp - comboDamage);

        // XP earned
        let xpGain = 10 + b.combo * 3;
        if (p.class === 'scholar') xpGain = Math.floor(xpGain * 1.15);

        // Visual effects
        this.shakeElement('.enemy-side');
        this.floatText(`-${comboDamage}`, 'damage', document.querySelector('.enemy-side'));
        this.floatText(`+${xpGain} XP`, 'xp', document.querySelector('.player-side'));

        if (b.combo >= 3) {
            this.floatText(`${b.combo}x COMBO!`, 'combo', document.querySelector('.battle-arena'));
        }

        this.updateBattleUI();

        // Show result
        this.showResult(true, comboDamage, xpGain, b.currentProblem.explanation);
    },

    handleWrongAnswer() {
        const p = this.state.player;
        const b = this.state.battle;

        b.combo = 0;
        b.wrong++;

        // Player takes damage
        const damage = 10 + b.zone * 5;
        p.hp = Math.max(0, p.hp - damage);

        // Visual effects
        this.shakeElement('.player-side');
        this.floatText(`-${damage}`, 'damage', document.querySelector('.player-side'));

        this.updateBattleUI();

        // Check for defeat
        if (p.hp <= 0) {
            this.endBattle(false);
            return;
        }

        this.showResult(false, damage, 0, b.currentProblem.explanation);
    },

    showResult(correct, damage, xp, explanation) {
        const overlay = document.getElementById('overlay-result');
        const icon = document.getElementById('result-icon');
        const title = document.getElementById('result-title');
        const explEl = document.getElementById('result-explanation');
        const rewards = document.getElementById('result-rewards');

        icon.textContent = correct ? '✓' : '✗';
        icon.className = `result-icon ${correct ? 'correct' : 'wrong'}`;
        title.textContent = correct ? 'Correct!' : 'Wrong!';
        title.className = `result-title ${correct ? 'correct' : 'wrong'}`;
        explEl.textContent = explanation;

        if (correct) {
            rewards.innerHTML = `
                <span class="reward-badge damage">-${damage} Enemy HP</span>
                <span class="reward-badge xp">+${xp} XP</span>
            `;
        } else {
            rewards.innerHTML = `<span class="reward-badge damage">-${damage} HP</span>`;
        }

        overlay.classList.remove('hidden');
    },

    nextProblem() {
        document.getElementById('overlay-result').classList.add('hidden');

        this.state.battle.problemIndex++;
        this.loadProblem();
    },

    endBattle(victory) {
        this.stopTimer();
        const p = this.state.player;
        const b = this.state.battle;

        if (victory) {
            // Calculate rewards
            let xpReward = b.enemy.xp;
            let goldReward = b.enemy.gold;

            if (p.class === 'scholar') xpReward = Math.floor(xpReward * 1.15);
            if (p.class === 'merchant') goldReward = Math.floor(goldReward * 1.15);

            // Accuracy bonus
            const accuracy = b.correct / (b.correct + b.wrong);
            const accuracyBonus = Math.floor(xpReward * accuracy * 0.5);
            xpReward += accuracyBonus;

            // Combo bonus
            xpReward += b.maxCombo * 5;

            // Award rewards
            this.addXP(xpReward);
            p.gold += goldReward;

            // Update stats
            p.stats.problemsSolved += b.correct;
            p.stats.correctAnswers += b.correct;
            p.stats.totalAttempts += b.correct + b.wrong;
            p.stats.maxCombo = Math.max(p.stats.maxCombo, b.maxCombo);
            p.stats.totalXp += xpReward;
            p.stats.totalGold += goldReward;

            // Mark level complete
            const levelKey = `${b.zone}-${b.level}`;
            p.completedLevels[levelKey] = {
                stars: this.calculateStars(accuracy, b.maxCombo),
                accuracy: Math.round(accuracy * 100),
                maxCombo: b.maxCombo
            };

            this.showLevelComplete(accuracy, b.maxCombo, xpReward, goldReward);
        } else {
            // Defeat - restore half HP
            p.hp = Math.floor(p.maxHp * 0.5);
            document.getElementById('overlay-gameover').classList.remove('hidden');
        }

        this.saveGame();
    },

    calculateStars(accuracy, combo) {
        if (accuracy >= 0.9 && combo >= 4) return 3;
        if (accuracy >= 0.7 && combo >= 2) return 2;
        return 1;
    },

    showLevelComplete(accuracy, maxCombo, xp, gold) {
        const b = this.state.battle;

        document.getElementById('stat-accuracy').textContent = `${Math.round(accuracy * 100)}%`;
        document.getElementById('stat-combo').textContent = maxCombo;
        document.getElementById('stat-xp').textContent = xp;
        document.getElementById('stat-gold').textContent = gold;

        // Stars
        const stars = this.calculateStars(accuracy, maxCombo);
        const starsEl = document.getElementById('complete-stars');
        starsEl.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('span');
            star.className = `star ${i < stars ? 'earned' : ''}`;
            star.textContent = '⭐';
            starsEl.appendChild(star);
        }

        document.getElementById('overlay-complete').classList.remove('hidden');
    },

    // ==========================================
    // XP & LEVELING
    // ==========================================
    addXP(amount) {
        const p = this.state.player;
        p.xp += amount;

        while (p.xp >= p.xpToLevel) {
            p.xp -= p.xpToLevel;
            this.levelUp();
        }
    },

    levelUp() {
        const p = this.state.player;
        p.level++;
        p.xpToLevel = Math.floor(p.xpToLevel * 1.4);
        p.maxHp += 20;
        p.hp = p.maxHp;

        document.getElementById('levelup-num').textContent = p.level;
        document.getElementById('overlay-levelup').classList.remove('hidden');
    },

    closeLevelUp() {
        document.getElementById('overlay-levelup').classList.add('hidden');
    },

    // ==========================================
    // HINTS & FORMULAS
    // ==========================================
    useHint() {
        const p = this.state.player;
        const b = this.state.battle;

        if (p.gold < 10) {
            this.floatText('Not enough gold!', 'damage', document.querySelector('.battle-tools'));
            return;
        }

        p.gold -= 10;
        this.floatText(b.currentProblem.hint, 'gold', document.querySelector('.problem-panel'));
        this.updateMapUI();
    },

    showFormulas() {
        document.getElementById('modal-formulas').classList.remove('hidden');
        this.renderFormulas('tvm');
    },

    closeFormulas() {
        document.getElementById('modal-formulas').classList.add('hidden');
    },

    renderFormulas(topic) {
        const formulas = this.formulas[topic] || [];
        const container = document.getElementById('formula-list');

        container.innerHTML = formulas.map(f => `
            <div class="formula-item">
                <div class="formula-name">${f.name}</div>
                <div class="formula-eq">${f.eq}</div>
                <div class="formula-desc">${f.desc}</div>
            </div>
        `).join('');
    },

    // ==========================================
    // STATS
    // ==========================================
    showStats() {
        const p = this.state.player;
        const container = document.getElementById('stats-grid');

        const accuracy = p.stats.totalAttempts > 0
            ? Math.round((p.stats.correctAnswers / p.stats.totalAttempts) * 100)
            : 0;

        container.innerHTML = `
            <div class="stat-card">
                <span class="stat-card-value">${p.stats.problemsSolved}</span>
                <span class="stat-card-label">Problems Solved</span>
            </div>
            <div class="stat-card">
                <span class="stat-card-value">${accuracy}%</span>
                <span class="stat-card-label">Accuracy</span>
            </div>
            <div class="stat-card">
                <span class="stat-card-value">${p.stats.maxCombo}</span>
                <span class="stat-card-label">Best Combo</span>
            </div>
            <div class="stat-card">
                <span class="stat-card-value">${p.stats.totalXp}</span>
                <span class="stat-card-label">Total XP</span>
            </div>
            <div class="stat-card">
                <span class="stat-card-value">${p.stats.totalGold}</span>
                <span class="stat-card-label">Total Gold</span>
            </div>
            <div class="stat-card">
                <span class="stat-card-value">${Object.keys(p.completedLevels).length}</span>
                <span class="stat-card-label">Levels Completed</span>
            </div>
        `;

        document.getElementById('modal-stats').classList.remove('hidden');
    },

    closeStats() {
        document.getElementById('modal-stats').classList.add('hidden');
    },

    // ==========================================
    // UTILITIES
    // ==========================================
    hideAllOverlays() {
        document.querySelectorAll('.overlay').forEach(o => o.classList.add('hidden'));
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    },

    shakeElement(selector) {
        const el = document.querySelector(selector);
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = 'shake 0.3s ease';
    },

    floatText(text, type, anchor) {
        const container = document.getElementById('floating-texts');
        const el = document.createElement('div');
        el.className = `float-text ${type}`;
        el.textContent = text;

        const rect = anchor.getBoundingClientRect();
        el.style.left = `${rect.left + rect.width / 2}px`;
        el.style.top = `${rect.top}px`;

        container.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    },

    formatNumber(num) {
        if (Math.abs(num) >= 1000) {
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        if (Math.abs(num) >= 1) {
            return num.toFixed(2);
        }
        return num.toFixed(4);
    },

    // ==========================================
    // SAVE/LOAD
    // ==========================================
    saveGame() {
        localStorage.setItem('actuarialQuest', JSON.stringify(this.state.player));
    },

    loadGame() {
        const saved = localStorage.getItem('actuarialQuest');
        if (saved) {
            this.state.player = JSON.parse(saved);
            document.getElementById('btn-continue').disabled = false;
        }
    }
};

// =============================================
// PROBLEM GENERATOR
// =============================================
const Problems = {
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    choice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    generateOptions(correct) {
        const options = [correct];
        const variations = [0.85, 0.92, 1.08, 1.15, 0.95, 1.05];

        while (options.length < 4) {
            const v = this.choice(variations);
            let wrong = correct * v;

            // Round appropriately
            if (Math.abs(correct) > 100) {
                wrong = Math.round(wrong * 100) / 100;
            } else if (Math.abs(correct) > 1) {
                wrong = Math.round(wrong * 1000) / 1000;
            } else {
                wrong = Math.round(wrong * 10000) / 10000;
            }

            if (!options.some(o => Math.abs(o - wrong) < 0.0001)) {
                options.push(wrong);
            }
        }

        // Shuffle
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return {
            options,
            correctIndex: options.indexOf(correct)
        };
    },

    generate(topic) {
        const generators = this[topic];
        const gen = this.choice(generators);
        const problem = gen.call(this);
        const { options, correctIndex } = this.generateOptions(problem.answer);

        return {
            ...problem,
            options,
            correctIndex
        };
    },

    // ==========================================
    // TVM PROBLEMS
    // ==========================================
    tvm: [
        function() {
            const pv = this.random(1000, 10000);
            const rate = this.choice([0.04, 0.05, 0.06, 0.07, 0.08]);
            const years = this.random(3, 12);
            const fv = pv * Math.pow(1 + rate, years);

            return {
                type: 'Time Value of Money',
                text: `You invest $${pv.toLocaleString()} at ${(rate * 100).toFixed(0)}% annual effective interest. What is the accumulated value after ${years} years?`,
                answer: fv,
                hint: 'Use FV = PV × (1 + i)ⁿ',
                explanation: `FV = ${pv} × (1.${(rate*100).toFixed(0)})^${years} = $${fv.toFixed(2)}`
            };
        },
        function() {
            const fv = this.random(5000, 30000);
            const rate = this.choice([0.04, 0.05, 0.06, 0.07, 0.08]);
            const years = this.random(5, 15);
            const pv = fv * Math.pow(1 + rate, -years);

            return {
                type: 'Time Value of Money',
                text: `What is the present value of $${fv.toLocaleString()} to be received in ${years} years at ${(rate * 100).toFixed(0)}% annual effective interest?`,
                answer: pv,
                hint: 'Use PV = FV × (1 + i)⁻ⁿ',
                explanation: `PV = ${fv} × (1.${(rate*100).toFixed(0)})^(-${years}) = $${pv.toFixed(2)}`
            };
        },
        function() {
            const nominal = this.choice([0.06, 0.08, 0.10, 0.12]);
            const m = this.choice([2, 4, 12]);
            const names = { 2: 'semi-annually', 4: 'quarterly', 12: 'monthly' };
            const effective = Math.pow(1 + nominal / m, m) - 1;

            return {
                type: 'Time Value of Money',
                text: `A bank offers ${(nominal * 100).toFixed(0)}% nominal interest compounded ${names[m]}. What is the annual effective rate (as a percentage)?`,
                answer: effective * 100,
                hint: 'Use i_eff = (1 + i/m)^m - 1',
                explanation: `i_eff = (1 + ${nominal}/${m})^${m} - 1 = ${(effective * 100).toFixed(4)}%`
            };
        },
        function() {
            const rate = this.choice([0.04, 0.05, 0.06, 0.08, 0.10]);
            const v = 1 / (1 + rate);

            return {
                type: 'Time Value of Money',
                text: `If the annual effective interest rate is ${(rate * 100).toFixed(0)}%, what is the discount factor v?`,
                answer: v,
                hint: 'v = 1/(1 + i)',
                explanation: `v = 1/(1 + ${rate}) = ${v.toFixed(6)}`
            };
        },
        function() {
            const rate = this.choice([0.04, 0.05, 0.06, 0.08]);
            const delta = Math.log(1 + rate);

            return {
                type: 'Time Value of Money',
                text: `The annual effective rate is ${(rate * 100).toFixed(0)}%. Calculate the force of interest δ.`,
                answer: delta,
                hint: 'δ = ln(1 + i)',
                explanation: `δ = ln(1 + ${rate}) = ${delta.toFixed(6)}`
            };
        },
        function() {
            const pv = this.random(1000, 5000);
            const rate = this.choice([0.05, 0.06, 0.07, 0.08]);
            const years = this.random(4, 10);
            const fv = pv * Math.pow(1 + rate, years);

            return {
                type: 'Time Value of Money',
                text: `$${pv.toLocaleString()} grows to $${fv.toFixed(2)} in ${years} years. What is the annual effective rate (as %)?`,
                answer: rate * 100,
                hint: 'Solve i = (FV/PV)^(1/n) - 1',
                explanation: `i = (${fv.toFixed(2)}/${pv})^(1/${years}) - 1 = ${(rate * 100).toFixed(2)}%`
            };
        }
    ],

    // ==========================================
    // ANNUITY PROBLEMS
    // ==========================================
    annuity: [
        function() {
            const pmt = this.random(100, 500);
            const rate = this.choice([0.04, 0.05, 0.06, 0.07]);
            const n = this.random(8, 20);
            const pv = pmt * (1 - Math.pow(1 + rate, -n)) / rate;

            return {
                type: 'Annuities',
                text: `Find the PV of an annuity-immediate with ${n} annual payments of $${pmt} at ${(rate * 100).toFixed(0)}% interest.`,
                answer: pv,
                hint: 'PV = PMT × a_n| = PMT × (1 - vⁿ)/i',
                explanation: `PV = ${pmt} × (1 - v^${n})/${rate} = $${pv.toFixed(2)}`
            };
        },
        function() {
            const pmt = this.random(100, 400);
            const rate = this.choice([0.04, 0.05, 0.06]);
            const n = this.random(10, 20);
            const fv = pmt * (Math.pow(1 + rate, n) - 1) / rate;

            return {
                type: 'Annuities',
                text: `You deposit $${pmt} at the end of each year for ${n} years at ${(rate * 100).toFixed(0)}%. What is the accumulated value?`,
                answer: fv,
                hint: 'FV = PMT × s_n| = PMT × ((1+i)ⁿ - 1)/i',
                explanation: `FV = ${pmt} × s_${n}| = $${fv.toFixed(2)}`
            };
        },
        function() {
            const pmt = this.random(100, 300);
            const rate = this.choice([0.04, 0.05, 0.06, 0.08]);
            const pv = pmt / rate;

            return {
                type: 'Annuities',
                text: `A perpetuity-immediate pays $${pmt} annually forever. At ${(rate * 100).toFixed(0)}% interest, what is its PV?`,
                answer: pv,
                hint: 'PV of perpetuity = PMT/i',
                explanation: `PV = ${pmt}/${rate} = $${pv.toFixed(2)}`
            };
        },
        function() {
            const pv = this.random(10000, 50000);
            const rate = this.choice([0.05, 0.06, 0.07, 0.08]);
            const n = this.random(10, 30);
            const a_n = (1 - Math.pow(1 + rate, -n)) / rate;
            const pmt = pv / a_n;

            return {
                type: 'Annuities',
                text: `A $${pv.toLocaleString()} loan at ${(rate * 100).toFixed(0)}% is repaid with ${n} annual level payments. Find the payment amount.`,
                answer: pmt,
                hint: 'PMT = PV / a_n|',
                explanation: `PMT = ${pv} / a_${n}| = $${pmt.toFixed(2)}`
            };
        },
        function() {
            const pmt = this.random(100, 300);
            const rate = this.choice([0.05, 0.06, 0.07]);
            const n = this.random(10, 15);
            const defer = this.random(3, 6);
            const a_n = (1 - Math.pow(1 + rate, -n)) / rate;
            const pv = pmt * a_n * Math.pow(1 + rate, -defer);

            return {
                type: 'Annuities',
                text: `Find the PV of a ${n}-year annuity-immediate of $${pmt}/year, deferred ${defer} years at ${(rate * 100).toFixed(0)}%.`,
                answer: pv,
                hint: 'PV = PMT × a_n| × v^(defer)',
                explanation: `PV = ${pmt} × a_${n}| × v^${defer} = $${pv.toFixed(2)}`
            };
        },
        function() {
            const pmt = this.random(100, 250);
            const rate = this.choice([0.07, 0.08, 0.09, 0.10]);
            const growth = this.choice([0.02, 0.03, 0.04]);
            const pv = pmt / (rate - growth);

            return {
                type: 'Annuities',
                text: `A growing perpetuity pays $${pmt} at year-end, growing ${(growth * 100).toFixed(0)}%/year. At ${(rate * 100).toFixed(0)}%, find PV.`,
                answer: pv,
                hint: 'PV = C/(i - g)',
                explanation: `PV = ${pmt}/(${rate} - ${growth}) = $${pv.toFixed(2)}`
            };
        }
    ],

    // ==========================================
    // BOND PROBLEMS
    // ==========================================
    bond: [
        function() {
            const face = 1000;
            const couponRate = this.choice([0.05, 0.06, 0.07, 0.08]);
            const yieldRate = this.choice([0.04, 0.05, 0.06, 0.07, 0.08, 0.09]);
            const n = this.random(5, 15);
            const coupon = face * couponRate;
            const a_n = (1 - Math.pow(1 + yieldRate, -n)) / yieldRate;
            const price = coupon * a_n + face * Math.pow(1 + yieldRate, -n);

            return {
                type: 'Bonds',
                text: `A ${n}-year $1,000 bond pays ${(couponRate * 100).toFixed(0)}% annual coupons. Find price to yield ${(yieldRate * 100).toFixed(0)}%.`,
                answer: price,
                hint: 'P = Fr × a_n| + F × vⁿ',
                explanation: `P = ${coupon} × a_${n}| + 1000 × v^${n} = $${price.toFixed(2)}`
            };
        },
        function() {
            const face = 1000;
            const couponRate = this.choice([0.06, 0.07, 0.08]);
            const yieldRate = this.choice([0.04, 0.05, 0.09, 0.10]);
            const n = 10;
            const coupon = face * couponRate;
            const a_n = (1 - Math.pow(1 + yieldRate, -n)) / yieldRate;
            const price = coupon * a_n + face * Math.pow(1 + yieldRate, -n);
            const diff = Math.abs(price - face);
            const type = price > face ? 'premium' : 'discount';

            return {
                type: 'Bonds',
                text: `A 10-year $1,000 bond with ${(couponRate * 100).toFixed(0)}% coupons yields ${(yieldRate * 100).toFixed(0)}%. Calculate the ${type}.`,
                answer: diff,
                hint: 'Premium/Discount = |Price - Face|',
                explanation: `Price = $${price.toFixed(2)}, ${type} = $${diff.toFixed(2)}`
            };
        },
        function() {
            const face = 1000;
            const couponRate = this.choice([0.05, 0.06, 0.07, 0.08]);
            const price = this.random(900, 1150);
            const coupon = face * couponRate;
            const cy = (coupon / price) * 100;

            return {
                type: 'Bonds',
                text: `A $1,000 bond with ${(couponRate * 100).toFixed(0)}% annual coupons trades at $${price}. What is the current yield (%)?`,
                answer: cy,
                hint: 'Current Yield = Annual Coupon / Price × 100',
                explanation: `CY = ${coupon}/${price} × 100 = ${cy.toFixed(2)}%`
            };
        },
        function() {
            const face = 1000;
            const couponRate = 0.08;
            const yieldRate = 0.06;
            const n = 10;
            const t = this.random(2, 5);
            const coupon = face * couponRate;
            const remaining = n - t;
            const a_r = (1 - Math.pow(1 + yieldRate, -remaining)) / yieldRate;
            const bv = coupon * a_r + face * Math.pow(1 + yieldRate, -remaining);

            return {
                type: 'Bonds',
                text: `A 10-year $1,000 bond (8% coupons) bought at 6% yield. Book value after coupon ${t}?`,
                answer: bv,
                hint: 'BV = Fr × a_(n-t)| + F × v^(n-t)',
                explanation: `BV_${t} = ${coupon} × a_${remaining}| + 1000 × v^${remaining} = $${bv.toFixed(2)}`
            };
        }
    ],

    // ==========================================
    // DURATION PROBLEMS
    // ==========================================
    duration: [
        function() {
            const macD = this.choice([5.5, 6.2, 7.5, 8.3, 9.1]);
            const rate = this.choice([0.04, 0.05, 0.06, 0.07]);
            const modD = macD / (1 + rate);

            return {
                type: 'Duration',
                text: `A bond has Macaulay duration ${macD} years at ${(rate * 100).toFixed(0)}% yield. Find modified duration.`,
                answer: modD,
                hint: 'Modified Duration = Macaulay Duration / (1 + i)',
                explanation: `D_mod = ${macD}/(1 + ${rate}) = ${modD.toFixed(3)}`
            };
        },
        function() {
            const price = this.random(950, 1100);
            const modD = this.choice([5, 6, 7, 8]);
            const dY = this.choice([0.005, 0.01, -0.005, -0.01]);
            const dP = -modD * price * dY;
            const newPrice = price + dP;
            const direction = dY > 0 ? 'increase' : 'decrease';

            return {
                type: 'Duration',
                text: `Bond at $${price}, modified duration ${modD}. If yield ${direction}s by ${Math.abs(dY * 100).toFixed(1)}%, estimate new price.`,
                answer: newPrice,
                hint: 'ΔP ≈ -D_mod × P × Δi',
                explanation: `New Price ≈ ${price} + (-${modD} × ${price} × ${dY}) = $${newPrice.toFixed(2)}`
            };
        },
        function() {
            const n = this.random(5, 20);

            return {
                type: 'Duration',
                text: `What is the Macaulay duration of a ${n}-year zero-coupon bond?`,
                answer: n,
                hint: 'Zero-coupon bond duration = maturity',
                explanation: `Duration of zero-coupon = ${n} years (single CF at maturity)`
            };
        },
        function() {
            const rate = this.choice([0.04, 0.05, 0.06, 0.08]);
            const duration = (1 + rate) / rate;

            return {
                type: 'Duration',
                text: `What is the Macaulay duration of a perpetuity-immediate at ${(rate * 100).toFixed(0)}%?`,
                answer: duration,
                hint: 'Duration of perpetuity = (1 + i)/i',
                explanation: `D = (1 + ${rate})/${rate} = ${duration.toFixed(2)} years`
            };
        },
        function() {
            const face = 1000;
            const couponRate = 0.06;
            const yieldRate = this.choice([0.05, 0.06, 0.07]);
            const n = this.choice([5, 10]);
            const coupon = face * couponRate;

            // Calculate duration
            let price = 0;
            let weightedTime = 0;
            for (let t = 1; t <= n; t++) {
                const cf = t === n ? coupon + face : coupon;
                const pvcf = cf * Math.pow(1 + yieldRate, -t);
                price += pvcf;
                weightedTime += t * pvcf;
            }
            const duration = weightedTime / price;

            return {
                type: 'Duration',
                text: `A ${n}-year $1,000 bond pays 6% annual coupons. At ${(yieldRate * 100).toFixed(0)}% yield, find Macaulay duration.`,
                answer: duration,
                hint: 'D = Σ(t × PV_t) / P',
                explanation: `Macaulay Duration = ${duration.toFixed(3)} years`
            };
        }
    ]
};

// =============================================
// START GAME
// =============================================
document.addEventListener('DOMContentLoaded', () => Game.init());
