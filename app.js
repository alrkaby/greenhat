document.addEventListener('DOMContentLoaded', () => {
    // ---- State & Data ----
    const defaultColors = ['#ef4444', '#10b981', '#3b82f6', '#f97316'];
    
    let state = {
        settings: {
            prepTime: 5,
            answerTime: 30,
            teamsCount: 2,
            teams: [
                { id: 't0', name: 'الفريق الأحمر', color: '#ef4444', score: 0 },
                { id: 't1', name: 'الفريق الأخضر', color: '#10b981', score: 0 }
            ]
        },
        askedQuestions: [],
        isSettingsConfigured: false
    };

    // قاعدة بيانات الأسئلة
    let questionsDB = [
        { id: 1, subject: 'اللغة الإنجليزية', text: 'ما معنى ( exoskeleton technology )', answer: 'تكنولوجيا الهيكل الخارجي' },
        { id: 2, subject: 'اللغة الإنجليزية', text: 'اختر الإجابة الصحيحة :<br><div dir="ltr" style="color: #34d399; margin-top: 15px;">I ( used to / didn\'t use to ) watch action films, but now I prefer documentaries.</div>', answer: 'used to' },
        { id: 3, subject: 'اللغة الإنجليزية', text: 'اجب على السؤال التالي:<br><div dir="ltr" style="color: #34d399; margin-top: 15px;">Where do pickpockets often commit crimes?</div>', answer: '<div dir="ltr">in crowded places</div>' },
        { id: 4, subject: 'اللغة الإنجليزية', text: 'ضع الكلمات بالترتيب الصحيح :<br><div dir="ltr" style="color: #34d399; margin-top: 15px; font-size: 2.4rem;">( you / your bag, / take / Could / out of / please / your laptop / ? )</div>', answer: '<div dir="ltr">Could you take your laptop out of your bag, please?</div>' },
        { id: 5, subject: 'اللغة الإنجليزية', text: 'اجب على السؤال التالي:<br><div dir="ltr" style="color: #34d399; margin-top: 15px;">How did Samira translate the phrase \'Aklil-inab-habba-habba\'?</div>', answer: '<div dir="ltr">One step at a time.</div>' },
        { id: 6, subject: 'اللغة الإنجليزية', text: 'ما نوع الجملة الشرطية<br><div dir="ltr" style="color: #34d399; margin-top: 15px;">If I were you, I would study hard.</div><div dir="ltr" style="margin-top: 15px; font-size: 2.4rem; color: #fff;">( Zero / First / Second / Third ? )</div>', answer: 'Second' },
        { id: 7, subject: 'اللغة الإنجليزية', text: 'حول الجملة من كلام مباشر إلى كلام منقول:<br><div dir="ltr" style="color: #34d399; margin-top: 15px;">Why don\'t you apply for the job? Hazem ......</div>', answer: '<div dir="ltr">Hazem suggested applying for the job.</div>' },
        
        // أسئلة علم الأحياء
        { id: 8, subject: 'علم الأحياء', text: 'من المسؤول عن إفراز السكريات المتعددة؟', answer: 'البلاستيدات عديمة اللون.' },
        { id: 9, subject: 'علم الأحياء', text: 'النسيج الذي يغلف الأعضاء اللمفاوية هو..', answer: 'النسيج الضام الأصيل المفكك الشبكي.' },
        { id: 10, subject: 'علم الأحياء', text: 'ما نوع النسيج في بشرة الجلد؟', answer: 'النسيج الظهاري الحرشفي المطبق المتقرن.' },
        { id: 11, subject: 'علم الأحياء', text: 'ما موقع ووظيفة خيوط المغزل؟', answer: 'الموقع: سايتوبلازم الخلية الحيوانية.<br><br>الوظيفة:<br>1- تتعلق عليها الكروموسومات والكروماتيدات.<br>2- يعتقد أنها تعمل طريقاً تنزلق عليها الكروموسومات نحو أقطاب الخلية (تساهم في حركة الكروموسومات نحو القطبين).' },
        { id: 12, subject: 'علم الأحياء', text: 'المسؤول عن إعادة النمو السريع في الأوراق الناضجة هو..', answer: 'النسيج المرستيمي البيني.' },
        { id: 13, subject: 'علم الأحياء', text: 'ما نوع النسيج في بطانة الرغامي؟', answer: 'النسيج الظهاري العمودي المطبق الكاذب المهدب.' },
        { id: 14, subject: 'علم الأحياء', text: 'المسؤول عن تجمع البروتين هو..', answer: 'حبيبات النسل.' },
        
        // أسئلة الرياضيات
        { id: 15, subject: 'الرياضيات', text: 'ما هو نوع القطع المخروطي الذي إختلافه المركزي يساوي √3/2 ؟<div style="display: flex; gap: 35px; justify-content: center; flex-wrap: wrap; margin-top: 25px; font-size: 2.2rem; color: #34d399; direction: rtl;"><span>1) قطع مكافئ</span><span>2) قطع ناقص</span><span>3) قطع زائد</span></div>', answer: 'قطع ناقص' },
        { id: 16, subject: 'الرياضيات', text: 'ما هو مرافق العدد المركب ω - i ؟<div style="display: flex; gap: 45px; justify-content: center; flex-wrap: wrap; margin-top: 25px; font-size: 2.4rem; color: #34d399; direction: ltr;"><span>1) ω + i</span><span>2) -ω + i</span><span>3) ω² + i</span></div>', answer: '<div dir="ltr">ω² + i</div>' },
        { id: 17, subject: 'الرياضيات', text: 'جد معادلة القطع الزائد القائم الذي مركزه نقطة الأصل وبؤرتاه تنتميان لمحور الصادات والمسافة بين بؤرتيه تساوي 8 وحدات .<div style="display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; margin-top: 25px; font-size: 2.4rem; color: #34d399; direction: ltr;"><span>1) y²/3 - x²/3 = 1</span><span>2) 2y² - 2x² = 16</span><span>3) y²/4 - x²/4 = 1</span></div>', answer: '<div dir="ltr">2y² - 2x² = 16</div>' },
        { id: 18, subject: 'الرياضيات', text: 'جد x, y ∈ R إذا كان xi⁸ + yi⁷ = 3 - 2ωi - 2ω²i<div style="display: flex; gap: 45px; justify-content: center; flex-wrap: wrap; margin-top: 25px; font-size: 2.4rem; color: #34d399; direction: ltr;"><span>1) x=-3 , y=2</span><span>2) x=-3 , y=-2</span><span>3) x=3 , y=-2</span></div>', answer: '<div dir="ltr">x = 3 , y = -2</div>' },
        { id: 19, subject: 'الرياضيات', text: 'ما هي معادلة المحور للقطع المكافئ الذي معادلته هي y² = 12x ؟<div style="display: flex; gap: 45px; justify-content: center; flex-wrap: wrap; margin-top: 25px; font-size: 2.4rem; color: #34d399; direction: ltr;"><span>1) x = 3</span><span>2) y = 0</span><span>3) y = 3</span></div>', answer: '<div dir="ltr">y = 0</div>' },
        
        // أسئلة قواعد اللغة العربية
        { id: 20, subject: 'قواعد اللغة العربية', text: 'وَمَنْ ذَا الَّذِي تُرْضَى سَجَايَاهُ كُلُّهَا ... كَفَى المَرْءَ نُبْلاً أَنْ تُعَدَّ مَعَايِبُه<br><div style="color: #34d399; margin-top: 15px;">ما اعراب اسم الاستفهام معللا؟</div>', answer: 'اسم استفهام مبني على السكون في محل رفع مبتدأ أو خبر مقدم جوازاً، تلاه اسم معرفة (الذي).' },
        { id: 21, subject: 'قواعد اللغة العربية', text: 'قال الشاعر : متى يستقيم الظل والعود أعوج ... وهل ذهب صرف يساويه بهرج<br><div style="color: #34d399; margin-top: 15px;">استبدل بحرف الاستفهام حرفا اخر؟</div>', answer: 'أيذهب صرف يساويه بهرج؟ (الهمزة بدل هل).' },
        { id: 22, subject: 'قواعد اللغة العربية', text: 'قال الشاعر : أ نعذر ليلى بالنوى أم نلومهــــا ... و ليلى فدى نفسي التي لا الومها<br><div style="color: #34d399; margin-top: 15px;">1. أيصح ان نستبدل (هل) بالهمزة معللاً؟<br>2. اذا حذفت (أم) وما بعدها من النص، فما جوابك عن الاستفهام؟</div>', answer: '1- لا يصح، لأن الاستفهام تصور بوجود "أم" المعادلة، وهل تأتي للتصديق فقط.<br>2- الجواب يكون بالحرف: نعم (في حالة الإثبات) أو لا (في حالة النفي).' },
        { id: 23, subject: 'قواعد اللغة العربية', text: 'قال تعالى : ﴿ أَوَلَمْ نُعَمِّرْكُم مَّا يَتَذَكَّرُ فِيهِ مَن تَذَكَّرَ وَجَاءَكُمُ النَّذِيرُ ۖ فَذُوقُوا فَمَا لِلظَّالِمِينَ مِن نَّصِيرٍ ﴾.<br><div style="color: #34d399; margin-top: 15px;">1- وردت ما مرتين فأين تجدها مهملة ؟ ولماذا ؟<br>2- بم تميزت الهمزة في النص الكريم؟</div>', answer: '1- "فما للظالمين من نصير": (ما) مهملة، لتقدم الخبر على المبتدأ.<br>2- الدخول على الجملة المنفية (أولم)، ولها الصدارة في الكلام حيث سبقت حرف العطف.' },
        { id: 24, subject: 'قواعد اللغة العربية', text: 'قال الشاعر : لا ييأس الانسان من عفو كمثل الغيث يسكب<br><div style="color: #34d399; margin-top: 15px;">ما الزمن الذي نفته (لا) ثم اجعل نفيها للحاضر</div>', answer: 'الزمن الذي نفته: الحاضر والمستقبل.<br>لجعلها للحاضر: ما ييأس الإنسان.' },
        { id: 25, subject: 'قواعد اللغة العربية', text: 'قال الشاعر : لله درك كيف تؤمنُ محنقًا ... تغلي عداوة صدره في مرجل<br><div style="color: #34d399; margin-top: 15px;">ما إعراب (كيف)؟ ثم اجعلها في محل رفع</div>', answer: 'إعراب (كيف): اسم استفهام مبني في محل نصب حال، تلاه فعل تام.<br>في محل رفع: كيف الإيمانُ؟ (مبتدأ أو خبر مقدم).' },
        { id: 26, subject: 'قواعد اللغة العربية', text: 'قال تعالى : ﴿ فَنَادَوْا وَلاتَ حِينَ مَنَاصٍ ﴾.<br><div style="color: #34d399; margin-top: 15px;">دل على معمولي أداة النفي ؟</div>', answer: 'أداة النفي "لات". اسمها محذوف تقديره (الحينُ)، وخبرها المذكور (حينَ) مضاف.' },
        
        // أسئلة أدب اللغة العربية
        { id: 27, subject: 'أدب اللغة العربية', text: 'ماذا يوحي لك عام 1798م في أدبنا العربي ؟', answer: 'حملة نابليون على مصر، وهي تعتبر بداية العصر الحديث في الأدب العربي ونهضته.' },
        { id: 28, subject: 'أدب اللغة العربية', text: 'تحدَّثْ عَنْ نُشُوءِ مَدْرسةِ الإحياءِ .؟', answer: 'نشأت أواخر القرن التاسع عشر لإيقاظ الشعر العربي من سباته، ودعت للعودة لتقاليد الشعر العربي القديم (العباسي والأموي) في الرصانة وقوة اللغة.' },
        { id: 29, subject: 'أدب اللغة العربية', text: 'ماذا يَقصد بـ ( الموشَّح ) أو ( الموشَّحة ) ؟ وأين نَشَأَ وتَطوَرَ؟', answer: 'فن شعري مستحدث يختلف عن القصيدة بتعدد قوافيه وتكونه من مقاطع. نشأ وتطور في الأندلس أواخر القرن الثالث الهجري لتلبية متطلبات الغناء والموسيقى.' },
        { id: 30, subject: 'أدب اللغة العربية', text: 'ما سببُ نظمِ علي الشَّرقي لقصيدتهِ ( السَّيْفُ والقَلَمُ ) ؟ وفي أي عامٍ نشرها ؟ وأين ؟ وما مناسبتها ؟', answer: 'مناسبتها: الاحتفال بالذكرى الألفية لوفاة الشريف الرضي في بغداد.<br>نشرها عام: 1937م، في مجلة العرفان.' },
        { id: 31, subject: 'أدب اللغة العربية', text: 'هلْ وظَّفَ الجواهريُّ المكانَ في قصيدتِهِ (دجلة الخير) ؟ وكيفَ ؟', answer: 'نعم، جعل نهر دجلة رمزاً للعراق، وناجاه (يا دجلة الخير) في كل مقاطع القصيدة ليعكس حنينه وشوقه لوطنه وهو في الغربة.' },
        { id: 32, subject: 'أدب اللغة العربية', text: 'تنوّعتِ كتاباتُ مخائيل نعيمة ما أبرزُ هذه الكتاباتِ؟', answer: 'ديوان (همس الجفون)، كتاب النقد (الغربال)، مسرحية (الآباء والبنون)، والعديد من المقالات والقصص.' },
        { id: 33, subject: 'أدب اللغة العربية', text: 'ارجع الكلمات الآتية إلى أبياتها ثم اكتب اسم شاعرها:<br><div style="color: #34d399; margin-top: 15px;">المآقي / اليراع/ الروح / عياء</div>', answer: 'المآقي وعياء: للشاعر الجواهري (دجلة الخير).<br>اليراع والروح: للشاعر علي الشرقي (السيف والقلم).' }
        
        /* 
        ================================================================================
        [خطة المستقبل: قوالب الكيمياء والفيزياء]
        ================================================================================
        انسخ هذه القوالب عند إضافة أسئلة الكيمياء والفيزياء للحصول على مظهر خرافي!
        
        // 1. قالب الكيمياء (استخدم <sub> للأرقام السفلية و <sup> للأسس)
        ,{ 
            id: 34, 
            subject: 'الكيمياء', 
            text: 'ما هو ناتج التفاعل الكيميائي التالي؟<br><div style="color: #34d399; margin-top: 15px; font-size: 2.8rem; letter-spacing: 3px;" dir="ltr">2H<sub>2</sub> + O<sub>2</sub> ⟶ ?</div>', 
            answer: '<div dir="ltr">2H<sub>2</sub>O</div>' 
        }

        // 2. قالب الفيزياء (استخدم Flexbox لترتيب المعطيات بشكل أنيق جداً)
        ,{ 
            id: 35, 
            subject: 'الفيزياء', 
            text: 'احسب القوة (F) إذا علمت المعطيات التالية:<br><div style="display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; margin-top: 20px; font-size: 2.4rem; color: #34d399; direction: ltr;"><span>m = 5 kg</span><span>a = 2 m/s<sup>2</sup></span></div>', 
            answer: '<div dir="ltr" style="font-size: 2.5rem;">F = m × a<br>F = 10 N</div>' 
        }
        
        // 3. قالب الخيارات المتعددة للمعادلات المعقدة
        ,{ 
            id: 36, 
            subject: 'الفيزياء', 
            text: 'أي من المعادلات التالية تمثل قانون نيوتن الثاني؟<div style="display: flex; gap: 45px; justify-content: center; flex-wrap: wrap; margin-top: 25px; font-size: 2.4rem; color: #34d399; direction: ltr;"><span>1) E = mc<sup>2</sup></span><span>2) F = ma</span><span>3) v = d/t</span></div>', 
            answer: '<div dir="ltr">F = ma</div>' 
        }
        ================================================================================
        */
    ];

    let currentQuestion = null;
    let prepTimerInterval = null;
    let qTimerInterval = null;
    let globalTickInterval = null;

    function startGlobalTick() {
        clearInterval(globalTickInterval);
        const tick = document.getElementById('sfx-tick');
        if (tick) tick.volume = 0.15; // Lower volume

        function playTick() {
            if (tick) {
                tick.currentTime = 0;
                tick.play().catch(e => console.log('Audio error:', e));
            }
        }
        
        playTick();
        globalTickInterval = setInterval(playTick, 1000);
    }

    function stopGlobalTick() {
        clearInterval(globalTickInterval);
        const tick = document.getElementById('sfx-tick');
        if (tick) {
            tick.pause();
            tick.currentTime = 0;
        }
    }

    // ---- DOM Elements ----
    const screens = document.querySelectorAll('.screen');
    
    // ---- Initialization ----
    function init() {
        loadData();
        showScreen('screen-welcome');
        bindEvents();
    }

    function loadData() {
        const saved = localStorage.getItem('greenHatQuizState');
        if (saved) {
            state = JSON.parse(saved);
        }
    }

    function saveData() {
        localStorage.setItem('greenHatQuizState', JSON.stringify(state));
    }

    function showScreen(id) {
        screens.forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    // ---- Events Binding ----
    function bindEvents() {
        // Welcome
        document.getElementById('btn-start').addEventListener('click', () => {
            if (!state.isSettingsConfigured) {
                openSettings();
            } else {
                startNextQuestionFlow();
            }
        });
        
        document.getElementById('btn-settings').addEventListener('click', openSettings);

        // Settings
        document.getElementById('btn-cancel-settings').addEventListener('click', () => showScreen('screen-welcome'));
        document.getElementById('btn-save-settings').addEventListener('click', saveSettings);
        
        document.getElementById('btn-hard-reset').addEventListener('click', () => {
            if(confirm('هل أنت متأكد أنك تريد تصفير المسابقة بالكامل؟ (سيتم مسح جميع النقاط وإعادة جميع الأسئلة المحروقة)')) {
                localStorage.removeItem('greenHatQuizState');
                location.reload();
            }
        });
        
        document.querySelectorAll('.team-count-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.team-count-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderTeamsConfig(parseInt(e.target.dataset.count));
            });
        });

        // Question screen
        document.getElementById('btn-show-answer').addEventListener('click', () => {
            document.getElementById('q-answer-text').classList.remove('blurred');
            document.getElementById('btn-show-answer').classList.add('hidden');
        });

        document.getElementById('btn-end-question').addEventListener('click', () => {
            endQuestionFlow();
        });

        // Award screen
        document.getElementById('btn-nobody').addEventListener('click', () => {
            showScoreboard();
        });

        // Scoreboard
        document.getElementById('btn-next-q').addEventListener('click', startNextQuestionFlow);
        document.getElementById('btn-reset-game').addEventListener('click', () => {
            if(confirm('هل أنت متأكد من تصفير النقاط وبدء مسابقة جديدة كلياً؟')) {
                state.settings.teams.forEach(t => t.score = 0);
                state.askedQuestions = [];
                saveData();
                showScreen('screen-welcome');
            }
        });
    }

    // ---- Settings Logic ----
    function openSettings() {
        document.getElementById('set-prep-time').value = state.settings.prepTime;
        document.getElementById('set-ans-time').value = state.settings.answerTime;
        
        document.querySelectorAll('.team-count-btn').forEach(b => {
            b.classList.toggle('active', parseInt(b.dataset.count) === state.settings.teamsCount);
        });
        
        renderTeamsConfig(state.settings.teamsCount);
        showScreen('screen-settings');
    }

    function renderTeamsConfig(count) {
        const container = document.getElementById('teams-config');
        container.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const team = state.settings.teams[i] || { name: `فريق ${i+1}`, color: defaultColors[i] };
            container.innerHTML += `
                <div class="team-config-card" style="border-color: ${team.color}">
                    <input type="color" id="team-color-${i}" value="${team.color}" title="لون الفريق">
                    <input type="text" id="team-name-${i}" value="${team.name}" placeholder="اسم الفريق">
                </div>
            `;
        }
    }

    function saveSettings() {
        const count = parseInt(document.querySelector('.team-count-btn.active').dataset.count);
        state.settings.prepTime = parseInt(document.getElementById('set-prep-time').value) || 5;
        state.settings.answerTime = parseInt(document.getElementById('set-ans-time').value) || 0;
        state.settings.teamsCount = count;
        
        let newTeams = [];
        for (let i = 0; i < count; i++) {
            newTeams.push({
                id: `t${i}`,
                name: document.getElementById(`team-name-${i}`).value || `فريق ${i+1}`,
                color: document.getElementById(`team-color-${i}`).value,
                score: (state.settings.teams[i] ? state.settings.teams[i].score : 0) // Preserve score if exists
            });
        }
        state.settings.teams = newTeams;
        state.isSettingsConfigured = true;
        saveData();
        
        startNextQuestionFlow();
    }

    // ---- Game Flow ----
    function getNextQuestion() {
        const available = questionsDB.filter(q => !state.askedQuestions.includes(q.id));
        if (available.length === 0) return null;
        
        // Find all remaining unique subjects
        const availableSubjects = [...new Set(available.map(q => q.subject))];
        
        // Find the next subject in rotation
        let nextSubject = availableSubjects[0];
        
        // Look at the last asked question's subject to pick a different one if possible
        if (state.askedQuestions.length > 0) {
            const lastAskedId = state.askedQuestions[state.askedQuestions.length - 1];
            const lastAskedQuestion = questionsDB.find(q => q.id === lastAskedId);
            if (lastAskedQuestion) {
                const lastSubjectIndex = availableSubjects.indexOf(lastAskedQuestion.subject);
                if (lastSubjectIndex !== -1 && availableSubjects.length > 1) {
                    // Pick the next subject in the array
                    nextSubject = availableSubjects[(lastSubjectIndex + 1) % availableSubjects.length];
                } else if (lastSubjectIndex === -1 && availableSubjects.length > 0) {
                    nextSubject = availableSubjects[0];
                }
            }
        }
        
        // Filter questions by the selected subject
        const subjectQuestions = available.filter(q => q.subject === nextSubject);
        const randIndex = Math.floor(Math.random() * subjectQuestions.length);
        return subjectQuestions[randIndex];
    }

    function startNextQuestionFlow() {
        currentQuestion = getNextQuestion();
        
        if (!currentQuestion) {
            alert('انتهت جميع الأسئلة المتوفرة! قم بإضافة المزيد من الأسئلة أو تصفير المسابقة.');
            showScoreboard();
            return;
        }
        
        // Burn question immediately upon appearance
        state.askedQuestions.push(currentQuestion.id);
        saveData();

        // Prep Screen Setup
        document.getElementById('prep-subject').innerText = 'مادة: ' + currentQuestion.subject;
        let timeLeft = state.settings.prepTime;
        const prepTimerEl = document.getElementById('prep-timer-val');
        const timerCircle = document.querySelector('.timer-circle');
        prepTimerEl.innerText = timeLeft;
        timerCircle.style.setProperty('--pct', '100%');
        
        showScreen('screen-countdown');
        
        clearInterval(prepTimerInterval);
        
        startGlobalTick(); // Start continuous low-volume tick
        
        prepTimerInterval = setInterval(() => {
            timeLeft--;
            prepTimerEl.innerText = timeLeft;
            timerCircle.style.setProperty('--pct', `${(timeLeft / state.settings.prepTime) * 100}%`);
            
            if (timeLeft <= 0) {
                clearInterval(prepTimerInterval);
                showQuestionScreen();
            }
        }, 1000);
    }

    function showQuestionScreen() {
        document.getElementById('q-subject-display').innerHTML = `<i class="fa-solid fa-book"></i> ${currentQuestion.subject}`;
        document.getElementById('q-text').innerHTML = currentQuestion.text;
        
        const ansEl = document.getElementById('q-answer-text');
        ansEl.innerHTML = currentQuestion.answer;
        ansEl.classList.add('blurred');
        
        const btnShow = document.getElementById('btn-show-answer');
        btnShow.classList.remove('hidden');

        let ansTime = state.settings.answerTime;
        const timerContainer = document.getElementById('q-timer-display');
        const timerVal = document.getElementById('q-time-val');
        
        timerContainer.classList.remove('danger');
        
        if (ansTime > 0) {
            timerContainer.style.display = 'flex';
            timerVal.innerText = ansTime;
            clearInterval(qTimerInterval);
            
            qTimerInterval = setInterval(() => {
                ansTime--;
                timerVal.innerText = ansTime;
                
                if(ansTime <= 10) timerContainer.classList.add('danger');
                
                if (ansTime <= 0) {
                    clearInterval(qTimerInterval);
                    endQuestionFlow();
                }
            }, 1000);
        } else {
            // Infinite time
            timerContainer.style.display = 'none';
        }
        
        showScreen('screen-question');
    }

    function endQuestionFlow() {
        clearInterval(qTimerInterval);
        stopGlobalTick(); // Stop the tick sound
        
        // Show award screen
        const container = document.getElementById('award-teams-list');
        container.innerHTML = '';
        
        state.settings.teams.forEach(team => {
            const btn = document.createElement('button');
            btn.className = 'btn-team-award';
            btn.style.backgroundColor = team.color;
            btn.innerHTML = `<i class="fa-solid fa-users"></i> ${team.name}`;
            
            btn.addEventListener('click', () => {
                awardPoints(team.id);
            });
            container.appendChild(btn);
        });
        
        showScreen('screen-award');
    }

    function awardPoints(teamId) {
        const team = state.settings.teams.find(t => t.id === teamId);
        if (team) {
            team.score += 10; // Fixed 10 points per answer
            saveData();
        }
        showScoreboard();
    }

    function showScoreboard() {
        const container = document.getElementById('scoreboard-list');
        container.innerHTML = '';
        
        // Sort teams by score descending
        const sortedTeams = [...state.settings.teams].sort((a, b) => b.score - a.score);
        
        sortedTeams.forEach(team => {
            container.innerHTML += `
                <div class="score-row" style="border-color: ${team.color}">
                    <div class="team-name" style="color: ${team.color}">${team.name}</div>
                    <div class="team-score">${team.score} نقطة</div>
                </div>
            `;
        });
        
        showScreen('screen-scoreboard');
    }

    // Start App
    init();
});
