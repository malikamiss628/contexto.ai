/**
 * Contexto AI Logic Engine
 * Securely handles Gemini API Integration and UI Simulation
 */

let geminiKey = "";
let chartInstance = null;

// Simulated DB Inventory (The "Technical" source)
const rawDatabase = [
    { raw: "USR_SUBS_MAIN_01", rows: "1,240,550", health: "99.4%", fresh: "12s ago" },
    { raw: "REV_FIN_Q4_ADJ", rows: "842,000", health: "97.1%", fresh: "4m ago" },
    { raw: "LOG_AUTH_FAIL_PROD", rows: "45,201", health: "100%", fresh: "1s ago" }
];

// 1. INITIALIZE & SCAN
async function initializeAI() {
    geminiKey = document.getElementById('api-key').value;
    if (!geminiKey) return alert("Please enter your API Key.");

    const laser = document.getElementById('laser');
    const overlay = document.getElementById('plug-overlay');
    
    // UI Visual Sequence
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.style.display = 'none', 500);
    laser.classList.add('scanning-active');

    await addLog("> Establishing encrypted handshake...", "text-zinc-500");
    await addLog("> Scanning Schema: 3 root tables found.", "text-indigo-400");
    await addLog("> Triggering AI Discovery...", "text-amber-500");

    renderTableList();
    
    setTimeout(() => {
        laser.classList.remove('scanning-active');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('active-db').innerText = document.getElementById('db-uri').value;
    }, 2000);
}

// 2. CALL GEMINI API (LIVE)
async function fetchAIResponse(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        return "I encountered a connection error. Please verify your API Key.";
    }
}

// 3. UI RENDERING
function renderTableList() {
    const list = document.getElementById('table-list');
    list.innerHTML = rawDatabase.map(t => `
        <li onclick="loadTable('${t.raw}')" class="p-3 rounded-xl cursor-pointer border border-transparent hover:border-zinc-800">
            <div class="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">${t.raw}</div>
            <div class="text-sm font-bold text-zinc-300">Awaiting AI Translation...</div>
        </li>
    `).join('');
    loadTable(rawDatabase[0].raw);
}

async function loadTable(rawName) {
    const tableData = rawDatabase.find(t => t.raw === rawName);
    
    // Update basic stats immediately
    document.getElementById('view-raw').innerText = `Source: ${tableData.raw}`;
    document.getElementById('stat-rows').innerText = tableData.rows;
    document.getElementById('stat-health').innerText = tableData.health;
    document.getElementById('stat-fresh').innerText = tableData.fresh;

    // AI Translation Prompt
    const prompt = `Translate this technical database table name into a friendly 3-word business name and give a 1-sentence summary of what it likely contains. Table name: ${rawName}. Format: Name | Summary`;
    
    document.getElementById('ai-description').innerText = "AI is analyzing metadata...";
    document.getElementById('view-title').innerText = "Analyzing...";

    const aiResult = await fetchAIResponse(prompt);
    const [name, summary] = aiResult.split('|');
    
    document.getElementById('view-title').innerText = name || rawName;
    document.getElementById('ai-description').innerText = summary || aiResult;
    
    initChart();
}

// 4. CHAT SYSTEM
async function sendChat() {
    const input = document.getElementById('chat-input');
    const chatArea = document.getElementById('chat-area');
    const msg = input.value;
    if(!msg) return;

    chatArea.innerHTML += `<div class="bg-zinc-800 p-3 rounded-xl ml-6 text-white">${msg}</div>`;
    input.value = "";
    
    const loadingId = `load-${Date.now()}`;
    chatArea.innerHTML += `<div id="${loadingId}" class="text-indigo-400 animate-pulse italic">Thinking...</div>`;
    chatArea.scrollTop = chatArea.scrollHeight;

    const aiResp = await fetchAIResponse(`You are a data librarian. Answer this question about database schemas: ${msg}`);
    
    document.getElementById(loadingId).remove();
    chatArea.innerHTML += `<div class="bg-indigo-900/20 p-3 rounded-xl mr-6 border border-indigo-500/20 text-indigo-100">${aiResp}</div>`;
    chatArea.scrollTop = chatArea.scrollHeight;
}

// UTILITIES
async function addLog(text, color) {
    const logs = document.getElementById('scanner-logs');
    const div = document.createElement('div');
    div.className = color;
    div.innerText = text;
    logs.prepend(div);
    await new Promise(r => setTimeout(r, 600));
}

function initChart() {
    const ctx = document.getElementById('healthChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
            datasets: [{
                data: [98, 99, 97, 91, 98, 99],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                fill: true, tension: 0.4, pointRadius: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#3f3f46', font: { size: 9 } } } }
        }
    });
}