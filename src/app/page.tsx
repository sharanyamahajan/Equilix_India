'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const API_KEY = ""; // NOTE: User needs to add their own API key here.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const mainContent = document.querySelector('main');
    const sections = document.querySelectorAll('.fade-in-section');
    const navLinks = document.querySelectorAll('.page-link');
    const pageViews = document.querySelectorAll('.page-view');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input') as HTMLInputElement;
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatLoading = document.getElementById('chat-loading');
    const suggestionsBtn = document.getElementById('get-suggestions-btn');
    const suggestionsTopic = document.getElementById('conversation-topic') as HTMLSelectElement;
    const suggestionsOutput = document.getElementById('suggestions-output');
    const suggestionsLoading = document.getElementById('suggestions-loading');
    const getTipBtn = document.getElementById('get-tip-btn');
    const tipOutput = document.getElementById('wellness-tip-output');
    const tipLoading = document.getElementById('tip-loading');
    const breathingBtn = document.getElementById('breathing-btn');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');
    let chatHistory: any[] = [];
    let breathingInterval: NodeJS.Timeout;
    const surveySection = document.getElementById('survey-section');
    const dashboardContent = document.getElementById('main-dashboard-content');
    const surveyForm = document.getElementById('wellness-survey-form');
    const moodSlider = document.getElementById('user-mood') as HTMLInputElement;
    const moodValueDisplay = document.getElementById('mood-value-display');
    const welcomeHeading = document.getElementById('welcome-heading');
    const ageAdviceContent = document.getElementById('age-advice-content');
    const logMoodBtns = document.querySelectorAll('.log-mood-btn');
    let happinessChartInstance: any = null;

    // Dynamically load Chart.js to avoid SSR issues
    const chartJsScript = document.createElement('script');
    chartJsScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
    chartJsScript.onload = () => {
        // Functions that depend on Chart.js can now be called safely
        if (document.querySelector('.page-view.active')?.id === 'home') {
            const problemSection = document.getElementById('problem');
            if (problemSection?.classList.contains('is-visible') && !problemSection.dataset.animated) {
                animateStatCounter();
                renderStressChart();
                problemSection.dataset.animated = 'true';
            }
        }
        if (document.querySelector('.page-view.active')?.id === 'dashboard') {
            initializeDashboard();
        }
    };
    document.head.appendChild(chartJsScript);


    function switchPage(pageId: string) {
        if (mainContent) mainContent.style.opacity = '0';
        setTimeout(() => {
            pageViews.forEach(view => view.classList.remove('active'));
            const activePage = document.getElementById(pageId);
            if (activePage) activePage.classList.add('active');
            document.querySelectorAll('#main-nav .nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${pageId}`) {
                    link.classList.add('active');
                }
            });
            window.scrollTo(0, 0);
            if (mainContent) mainContent.style.opacity = '1';
            if (pageId === 'dashboard') {
                initializeDashboard();
            }
        }, 300);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href')?.substring(1);
            if(pageId) switchPage(pageId);
        });
    });

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const targetElement = entry.target as HTMLElement;
                if (targetElement.getAttribute('id') === 'problem' && !targetElement.dataset.animated) {
                    animateStatCounter();
                    if (window.Chart) renderStressChart();
                    targetElement.dataset.animated = 'true';
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function loadUserData() {
        const data = localStorage.getItem('equilixUserData');
        return data ? JSON.parse(data) : null;
    }

    function saveUserData(data: any) {
        localStorage.setItem('equilixUserData', JSON.stringify(data));
    }

    function initializeDashboard() {
        const userData = loadUserData();
        if (userData) {
            if (surveySection) surveySection.style.display = 'none';
            if (dashboardContent) dashboardContent.style.display = 'block';
            populateDashboard(userData);
        } else {
            if (surveySection) surveySection.style.display = 'block';
            if (dashboardContent) dashboardContent.style.display = 'none';
        }
    }

    if (moodSlider) {
        moodSlider.addEventListener('input', () => {
            if (moodValueDisplay) moodValueDisplay.textContent = moodSlider.value;
        });
    }

    if (surveyForm) {
        surveyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userName = (document.getElementById('user-name') as HTMLInputElement).value;
            const userAge = parseInt((document.getElementById('user-age') as HTMLInputElement).value);
            const initialMood = parseInt((document.getElementById('user-mood') as HTMLInputElement).value);
            const today = new Date().toISOString().split('T')[0];
            const newUserData = {
                name: userName,
                age: userAge,
                happinessLog: [{ date: today, mood: initialMood }]
            };
            saveUserData(newUserData);
            initializeDashboard();
        });
    }

    function populateDashboard(userData: any) {
        if(welcomeHeading) welcomeHeading.textContent = `Welcome to Your Dashboard, ${userData.name}!`;
        if(ageAdviceContent) ageAdviceContent.textContent = getAgeWiseAdvice(userData.age);
        if(window.Chart) renderHappinessChart(userData.happinessLog);
    }

    function getAgeWiseAdvice(age: number) {
        if (age < 18) {
            return "Navigating school and friendships can be tough. Remember to take breaks for yourself and talk to a trusted adult if you\'re feeling overwhelmed. Your feelings are valid.";
        } else if (age >= 18 && age <= 25) {
            return "This is a time of big changes with college, career, and independence. It\'s okay to feel uncertain. Focus on small, achievable goals and celebrate your progress along the way.";
        } else {
            return "Balancing life\'s responsibilities can be demanding. Make sure to schedule time for self-care, just as you would for any other important appointment. You deserve it.";
        }
    }

    function renderHappinessChart(log: any[]) {
        const ctx = (document.getElementById('happinessChart') as HTMLCanvasElement)?.getContext('2d');
        if (!ctx || !window.Chart) return;
        const labels = log.map(entry => new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
        const data = log.map(entry => entry.mood);

        if (happinessChartInstance) {
            happinessChartInstance.destroy();
        }

        happinessChartInstance = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mood Level',
                    data: data,
                    borderColor: '#60A5FA',
                    backgroundColor: 'rgba(96, 165, 250, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#60A5FA',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 10, ticks: { color: '#4b5563' } },
                    x: { ticks: { color: '#4b5563' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    logMoodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = parseInt((btn as HTMLElement).dataset.mood || '5');
            const userData = loadUserData();
            if (!userData) return;
            const today = new Date().toISOString().split('T')[0];
            const todayEntryIndex = userData.happinessLog.findIndex((entry: any) => entry.date === today);
            if (todayEntryIndex > -1) {
                userData.happinessLog[todayEntryIndex].mood = mood;
            } else {
                userData.happinessLog.push({ date: today, mood: mood });
            }
            if (userData.happinessLog.length > 30) {
                userData.happinessLog.shift();
            }
            saveUserData(userData);
            renderHappinessChart(userData.happinessLog);
        });
    });

    async function callGeminiAPI(prompt: string, loadingElement: HTMLElement | null) {
        if (!API_KEY) {
            return "Please add a valid API key to the script to enable AI features.";
        }
        if (loadingElement) loadingElement.style.display = 'flex';
        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            if (loadingElement) loadingElement.style.display = 'none';
            return result.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("API call failed:", error);
            if (loadingElement) loadingElement.style.display = 'none';
            return "There was an error connecting to the AI. Please check the console for details.";
        }
    }

    function appendMessage(sender: string, message: string) {
        if(!chatWindow) return;
        const messageDiv = document.createElement('div');
        const bubbleDiv = document.createElement('div');
        messageDiv.classList.add('flex');
        bubbleDiv.classList.add('p-3', 'rounded-lg', 'max-w-xs');

        if (sender === 'user') {
            messageDiv.classList.add('justify-end');
            bubbleDiv.classList.add('bg-gray-200', 'text-gray-800');
        } else {
            messageDiv.classList.add('justify-start');
            bubbleDiv.classList.add('bg-blue-100', 'text-gray-800');
        }

        bubbleDiv.innerText = message;
        messageDiv.appendChild(bubbleDiv);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function handleChat() {
        if(!chatInput || !chatWindow) return;
        const userInput = chatInput.value.trim();
        if (!userInput) return;
        appendMessage('user', userInput);
        chatInput.value = '';
        chatHistory.push({ role: "user", parts: [{ text: userInput }] });
        const prompt = `You are Aura, a caring, empathetic listening companion for a young person in India. Your personality is gentle, supportive, and non-judgmental. Do NOT give medical advice. Keep responses concise (2-3 sentences). The user\'s message history is: ${JSON.stringify(chatHistory)}. The user just said: "${userInput}". Respond with warmth and understanding.`;
        const aiResponse = await callGeminiAPI(prompt, chatLoading);
        chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
        appendMessage('aura', aiResponse);
    }
    
    if(chatSendBtn) chatSendBtn.addEventListener('click', handleChat);
    if(chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    if(suggestionsBtn){
        suggestionsBtn.addEventListener('click', async () => {
            if(!suggestionsTopic || !suggestionsOutput) return;
            const topic = suggestionsTopic.value;
            const prompt = `You are a helpful assistant. Generate 3 simple, non-judgmental conversation starters for a young person in India to talk to ${topic}. Phrase them as "You could try saying...". Keep them very short and simple.`;
            const response = await callGeminiAPI(prompt, suggestionsLoading);
            suggestionsOutput.innerText = response;
        });
    }

    if(getTipBtn){
        getTipBtn.addEventListener('click', async () => {
            if(!tipOutput) return;
            const prompt = "Give me one short, actionable mental wellness tip suitable for a young adult. Make it encouraging and easy to do today.";
            const response = await callGeminiAPI(prompt, tipLoading);
            tipOutput.innerText = response;
        });
    }

    function animateStatCounter() {
        const counter = document.getElementById('stat-counter');
        if (!counter) return;
        const target = 91; let current = 0; const increment = target / 100;
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = `${Math.ceil(current)}%`;
                requestAnimationFrame(updateCounter);
            } else { counter.textContent = `${target}%`; }
        };
        updateCounter();
    }

    function renderStressChart() {
        const ctx = (document.getElementById('stressChart') as HTMLCanvasElement)?.getContext('2d');
        if (!ctx || !window.Chart) return;
        new window.Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Suffer from Stress & Anxiety', 'Others'],
                datasets: [{ data: [91, 9], backgroundColor: ['#60A5FA', '#E5E7EB'], borderColor: ['#FFFFFF'], borderWidth: 4, hoverOffset: 8 }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }}, animation: { animateScale: true, animateRotate: true }}
        });
    }

    function animateHeadlines() {
        const h1Text = "Your Space to Feel,"; const h2Text = "Your Guide to Grow.";
        const h1 = document.querySelector('#hero h1'); const h2 = document.querySelector('#hero h2');
        if (!h1 || !h2) return;
        h1.innerHTML = ''; h2.innerHTML = '';
        h1Text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 0.05}s`;
            h1.appendChild(span);
        });
        h2Text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${(h1Text.length + index) * 0.05}s`;
            h2.appendChild(span);
        });
    }

    function startBreathingExercise() {
        if (!breathingCircle || !breathingText) return;
        breathingBtn?.setAttribute('disabled', 'true');
        breathingCircle.classList.add('animate');
        const phases = [
            { text: 'Breathe In...', duration: 4000 },
            { text: 'Hold', duration: 4000 },
            { text: 'Breathe Out...', duration: 8000 }
        ];
        let currentPhase = 0;
        const runPhase = () => {
            breathingText.innerText = phases[currentPhase].text;
            breathingInterval = setTimeout(() => {
                currentPhase = (currentPhase + 1) % phases.length;
                runPhase();
            }, phases[currentPhase].duration);
        };
        runPhase();
    }

    if(breathingBtn) {
        breathingBtn.addEventListener('click', startBreathingExercise);
    }

    switchPage('home');
    animateHeadlines();

    return () => {
        if (breathingInterval) clearInterval(breathingInterval);
        document.head.removeChild(chartJsScript);
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        body {
            background-color: #ccd8f1;
            background-image:
                radial-gradient(circle 50px at 20% 20%, rgba(255, 255, 255, 0.3), transparent 70%),
                radial-gradient(circle 40px at 80% 30%, rgba(255, 255, 255, 0.25), transparent 70%),
                radial-gradient(circle 60px at 50% 80%, rgba(255, 255, 255, 0.2), transparent 70%);
            background-repeat: no-repeat;
            background-size: cover;
            min-height: 100vh;
            margin: 0;
        }

        .nav-link {
            transition: color 0.3s ease;
        }

        .nav-link.active {
            color: #60A5FA;
            font-weight: 500;
        }

        .fade-in-section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .fade-in-section.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .chart-container {
            position: relative;
            width: 100%;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            height: 300px;
            max-height: 400px;
        }

        @media (min-width: 640px) {
            .chart-container {
                height: 400px;
            }
        }

        .spinner {
            border: 2px solid rgba(0, 0, 0, 0.1);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border-left-color: #60A5FA;
            animation: spin 1s ease infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .page-view {
            display: none;
        }

        .page-view.active {
            display: block;
            animation: fadeIn 0.5s ease-in-out;
        }

        .breathing-circle {
            width: 150px;
            height: 150px;
            transition: transform 4s ease-in-out;
        }

        .breathing-circle.animate {
            animation: breathe 16s infinite ease-in-out;
        }

        .animated-headline span {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            animation: revealText 0.8s forwards;
        }

        @keyframes breathe {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.2); }
            50% { transform: scale(1.2); }
            75% { transform: scale(1); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes revealText {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        header {
            background: rgba(255, 255, 255, 0.18) !important;
            backdrop-filter: blur(14px) saturate(120%);
            -webkit-backdrop-filter: blur(14px) saturate(120%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.35) !important;
            box-shadow: 0 8px 30px rgba(31, 38, 135, 0.08);
        }

        .card-style {
            background: rgba(255, 255, 255, 0.16) !important;
            backdrop-filter: blur(12px) saturate(120%);
            -webkit-backdrop-filter: blur(12px) saturate(120%);
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
            transition: transform .3s ease, background .3s ease, box-shadow .3s ease, border-color .3s ease;
        }

        .card-style:hover {
            transform: translateY(-6px);
            background: rgba(255, 255, 255, 0.24) !important;
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
            border-color: rgba(255, 255, 255, 0.5);
        }

        .bg-blue-500,
        .bg-teal-500 {
            position: relative;
            box-shadow: 0 8px 22px rgba(59, 130, 246, 0.18);
            transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
        }

        .bg-teal-500 {
            box-shadow: 0 8px 22px rgba(45, 212, 191, 0.18);
        }

        .bg-blue-500:hover,
        .bg-teal-500:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
            filter: saturate(1.05);
        }
      `}</style>
      <div className="scroll-smooth">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">🪐</span>
                    <span className="text-xl font-bold text-gray-800">Equilix</span>
                </div>
                <div className="hidden md:flex space-x-8" id="main-nav">
                    <a href="#home" className="nav-link page-link active">Home</a>
                    <a href="#dashboard" className="nav-link page-link">Dashboard</a>
                    <a href="#about" className="nav-link page-link">About Us</a>
                    <a href="#resources" className="nav-link page-link">Resources</a>
                    <a href="motion.html" className="nav-link">Emotion Detector</a>
                    <a href="ai-videocall.html" className="text-gray-700 hover:text-blue-600 mx-3">AI VideoCall</a>
                </div>
                <a href="https://whatsapp.com/channel/0029VbBaJPm9WtCA6IKA6a1u" target="_blank" className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105">
                    Get Involved
                </a>
            </nav>
        </header>

        <main>
            <div id="home" className="page-view active">
                <section id="hero" className="py-20 md:py-32">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="animated-headline text-4xl md:text-6xl font-bold text-gray-800 leading-tight"></h1>
                        <h2 className="animated-headline text-4xl md:text-6xl font-bold text-blue-500 leading-tight mt-2"></h2>
                        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto fade-in-section">
                            Project Equilix is a confidential wellness companion for the youth of India, providing an anonymous, empathetic space to navigate the pressures of daily life.
                        </p>
                    </div>
                </section>
                <section id="problem" className="py-16 md:py-24 bg-white card-style fade-in-section">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">The Silent Pressure Cooker</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Millions of students are in a high-stakes race for academic success, but the conversation around the mental toll is silent.</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            <div className="w-full md:w-1/2">
                                <div className="chart-container">
                                    <canvas id="stressChart"></canvas>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <div className="text-7xl md:text-8xl font-bold text-blue-500 mb-4" id="stat-counter">0%</div>
                                <h3 className="text-2xl font-bold text-gray-800">of Indian students suffer from stress and anxiety related to their future.</h3>
                                <p className="mt-4 text-gray-600 text-lg">The pressure is immense, but showing vulnerability is often seen as a weakness. This leads to a critical, unspoken question they face every day:
                                </p>
                                <p className="mt-4 text-xl font-semibold text-gray-700 italic">"Who can I talk to without being judged?"</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="consequence" className="py-16 md:py-24 fade-in-section">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">The Wall of Silence</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">When students have nowhere to turn, they face significant barriers. We're providing tools to help break them down.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="card-style p-8">
                                <h3 className="text-2xl font-bold text-gray-800">Stigma</h3>
                                <p className="mt-4 text-gray-600">The fear of "Log kya kahenge?" ("What will people say?") is a powerful barrier, preventing open conversations with family and friends.</p>
                            </div>
                            <div className="card-style p-8">
                                <h3 className="text-2xl font-bold text-gray-800">Isolation</h3>
                                <p className="mt-4 text-gray-600">They feel like they are the only ones struggling, even when surrounded by peers facing the exact same pressures.</p>
                            </div>
                            <div className="card-style p-8 flex flex-col">
                                <h3 className="text-2xl font-bold text-gray-800">Inaction</h3>
                                <p className="mt-4 text-gray-600 flex-grow">The path to professional help is often confusing, and starting a conversation is hard. Let's make it easier.</p>
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <label htmlFor="conversation-topic" className="font-semibold text-gray-700">✨ Get AI Conversation Starters</label>
                                    <select id="conversation-topic" className="mt-2 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                        <option value="parents about stress">Talking to parents about stress</option>
                                        <option value="a friend that I'm not okay">Telling a friend I'm not okay</option>
                                        <option value="a teacher about academic pressure">Asking a teacher for help</option>
                                    </select>
                                    <button id="get-suggestions-btn" className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center justify-center">
                                        Get Suggestions
                                    </button>
                                    <div id="suggestions-loading" className="hidden mt-4 flex justify-center">
                                        <div className="spinner"></div>
                                    </div>
                                    <div id="suggestions-output" className="mt-4 text-sm text-gray-600"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="solution" className="py-16 md:py-24 bg-white card-style fade-in-section">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">A Private Space to Talk. 24/7.</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            This isn't a demo. It's a real, AI-powered companion. Talk to Equilibrium, and see for yourself.
                        </p>
                        <div className="mt-12 max-w-2xl mx-auto bg-gray-300 rounded-2xl p-4 shadow-2xl">
                            <div className="bg-white rounded-lg p-6">
                                <div id="chat-window" className="h-80 overflow-y-auto flex flex-col space-y-4 text-left pr-2">
                                    <div className="flex justify-start">
                                        <div className="bg-blue-100 text-gray-800 p-3 rounded-lg max-w-xs">
                                            Hey, I'm Equilibrium. Thanks for reaching out. What's on your mind today?
                                        </div>
                                    </div>
                                </div>
                                <div id="chat-loading" className="hidden my-4 flex justify-start">
                                    <div className="spinner ml-4"></div>
                                </div>
                                <div className="mt-4 flex">
                                    <input type="text" id="chat-input" className="flex-grow bg-gray-100 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Type your message..."/>
                                    <button id="chat-send-btn" className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition-all transform hover:scale-105">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            
            <div id="dashboard" className="page-view">
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-6">
                        <div id="survey-section" className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome to Your Wellness Hub</h2>
                            <p className="mt-4 text-lg text-gray-600">Let's personalize your experience. Just a couple of quick questions.</p>
                            <form id="wellness-survey-form" className="card-style p-8 mt-8 text-left space-y-6">
                                <div>
                                    <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">What should we call you?</label>
                                    <input type="text" id="user-name" required className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="user-age" className="block text-sm font-medium text-gray-700">How old are you?</label>
                                    <input type="number" id="user-age" required min="10" max="100" className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="user-mood" className="block text-sm font-medium text-gray-700">On a scale of 1 to 10, how are you feeling today?</label>
                                    <input type="range" id="user-mood" min="1" max="10" defaultValue="5" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"/>
                                    <div className="text-center font-semibold text-blue-600 mt-1" id="mood-value-display">5</div>
                                </div>
                                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105">
                                    Save & Start My Journey
                                </button>
                            </form>
                        </div>
                        <div id="main-dashboard-content" className="hidden">
                            <div className="text-center mb-12">
                                <h2 id="welcome-heading" className="text-3xl md:text-4xl font-bold text-gray-800"></h2>
                                <p className="mt-4 text-lg text-gray-600">Here are your personalized tools and insights for today.</p>
                            </div>
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1 space-y-8">
                                    <div className="card-style p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">⭐ Age-Wise Advice</h3>
                                        <p id="age-advice-content" className="text-gray-600"></p>
                                    </div>
                                    <div className="card-style p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">🎯 Happiness Goals</h3>
                                        <ul id="happiness-goals-list" className="space-y-2 text-gray-600 list-disc list-inside">
                                            <li>Practice 5 minutes of mindfulness.</li>
                                            <li>Connect with a friend or family member.</li>
                                            <li>Spend 15 minutes on a hobby you enjoy.</li>
                                            <li>Get at least 20 minutes of physical activity.</li>
                                            <li>Write down one thing you're grateful for.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 card-style p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Happiness Tracker</h3>
                                    <div className="relative h-64 md:h-96">
                                        <canvas id="happinessChart"></canvas>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <p className="text-gray-700 font-semibold mb-3">How are you feeling right now?</p>
                                        <div className="flex justify-center items-center gap-4">
                                            <button className="log-mood-btn bg-red-500 text-white w-12 h-12 rounded-full font-bold text-lg hover:bg-red-600 transform hover:scale-110 transition" data-mood="2">😥</button>
                                            <button className="log-mood-btn bg-yellow-500 text-white w-12 h-12 rounded-full font-bold text-lg hover:bg-yellow-600 transform hover:scale-110 transition" data-mood="5">😐</button>
                                            <button className="log-mood-btn bg-green-500 text-white w-12 h-12 rounded-full font-bold text-lg hover:bg-green-600 transform hover:scale-110 transition" data-mood="8">😊</button>
                                            <button className="log-mood-btn bg-blue-500 text-white w-12 h-12 rounded-full font-bold text-lg hover:bg-blue-600 transform hover:scale-110 transition" data-mood="10">😁</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div id="about" className="page-view">
                <section className="py-16 md:py-24 fade-in-section">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">About Project Equilibrium</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Our mission is to empower youth with a confidential and empathetic guide to wellness.</p>
                        </div>
                        <div className="max-w-4xl mx-auto card-style p-8 md:p-12 mb-12">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                            <p className="text-gray-600 mb-8">We aim to destigmatize mental health struggles by providing immediate, anonymous emotional support. Aura is designed as a proactive bridge to professional resources and self-care strategies, making the first step towards wellness less daunting for young people across India.</p>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Core Principles</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xl font-semibold mb-2 text-teal-600">Absolute Confidentiality</h4>
                                    <p className="text-gray-600">Your privacy is our highest priority. All conversations are anonymous and encrypted. We have a zero-knowledge policy, meaning not even our team can see what you share. Trust is our foundation.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-2 text-teal-600">Proactive Empathy</h4>
                                    <p className="text-gray-600">Aura's AI is trained on the principles of active listening and non-judgment. It's designed to validate feelings and offer gentle, supportive guidance, not to give orders or medical advice.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-2 text-teal-600">A Bridge, Not a Replacement</h4>
                                    <p className="text-gray-600">We are firm believers in the power of human connection. Aura is a tool to help you feel heard and to build the confidence to seek help from qualified professionals when you're ready.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-2 text-teal-600">Ethical and Safe</h4>
                                    <p className="text-gray-600">Our system includes a robust safety layer to detect crisis situations and provide immediate links to human support, such as national helplines. We are committed to responsible innovation.</p>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-2xl text-center font-bold text-gray-800 mb-8">Meet the Team</h3>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center ring-4 ring-white shadow-lg"><span className="text-4xl text-amber-600">👤👤</span></div>
                                    <h4 className="text-xl font-bold">Sharanya Mahajan & Anannya Mahajan</h4>
                                    <p className="text-gray-600">Founder & Visionary</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div id="resources" className="page-view">
                <section className="py-16 md:py-24 fade-in-section">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Wellness Resources</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">A curated list of tools and information to support your mental wellness journey.</p>
                        </div>
                        <div className="max-w-4xl mx-auto space-y-12">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-teal-400 pb-2">Daily Wellness Tip</h3>
                                <div className="card-style p-6">
                                    <p id="wellness-tip-output" className="text-gray-600 italic mb-4">Click the button to get a fresh wellness tip!</p>
                                    <button id="get-tip-btn" className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all transform hover:scale-105 flex items-center justify-center">
                                        Get a Wellness Tip
                                    </button>
                                    <div id="tip-loading" className="hidden mt-4 flex justify-center"><div className="spinner"></div></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-teal-400 pb-2">Immediate Help</h3>
                                <p className="text-gray-600 mb-4">If you are in distress and need to speak with someone immediately, please reach out to these confidential helplines.</p>
                                <div className="card-style p-6">
                                    <h4 className="font-semibold text-lg">Childline India</h4>
                                    <p className="text-gray-600">A helpline for children in need of aid and assistance.</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">Dial: 1098</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-teal-400 pb-2">Guided Exercises</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="card-style p-6 flex flex-col items-center text-center">
                                        <h4 className="font-semibold text-lg mb-4">Interactive Box Breathing</h4>
                                        <div id="breathing-circle" className="breathing-circle bg-blue-200 rounded-full flex items-center justify-center mb-4">
                                            <span id="breathing-text" className="text-blue-800 font-semibold">Start</span>
                                        </div>
                                        <button id="breathing-btn" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105">Begin Exercise</button>
                                    </div>
                                    <div className="card-style p-6">
                                        <h4 className="font-semibold text-lg">5-4-3-2-1 Grounding</h4>
                                        <p className="text-gray-600 mt-4">A simple technique to bring you back to the present moment. Acknowledge the following:</p>
                                        <ul className="text-gray-600 list-disc list-inside mt-2 space-y-1">
                                            <li><strong>5</strong> things you can see</li>
                                            <li><strong>4</strong> things you can feel</li>
                                            <li><strong>3</strong> things you can hear</li>
                                            <li><strong>2</strong> things you can smell</li>
                                            <li><strong>1</strong> thing you can taste</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>

        <footer id="contact" className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold">Join us in empowering the next generation.</h2>
                <p className="mt-4 max-w-xl mx-auto">
                    If you're a developer, mental health professional, or investor who shares our vision, we'd love to hear from you.
                </p>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sharanyamahajan9@gmail.com" target="_blank" className="mt-8 inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                    Contact Us
                </a>
                <p className="mt-8 text-gray-400">&copy; 2025 Equilix. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </>
  );
}
