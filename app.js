// // Mock Data Store
// const databaseSchema = [
//     {
//         name: 'users_dim',
//         summary: 'Primary dimension table for user profiles. Contains PII including email and hashed passwords. Verified by Data Governance.',
//         stats: { completeness: '99.8%', freshness: '2h ago', uniqueness: '100%' },
//         chartData: [400, 450, 430, 480, 520, 510, 550]
//     },
//     {
//         name: 'order_fact',
//         summary: 'Transactional records for all completed purchases. Use this for revenue reporting and seasonal trend analysis.',
//         stats: { completeness: '94.2%', freshness: '5m ago', uniqueness: '98.5%' },
//         chartData: [120, 200, 150, 300, 450, 380, 500]
//     }
// ];

// let myChart = null;

// // Initialize Table List
// const listContainer = document.getElementById('table-list');
// databaseSchema.forEach(table => {
//     const li = document.createElement('li');
//     li.className = "px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-md cursor-pointer transition-colors flex items-center gap-2";
//     li.innerHTML = `<i class="ri-table-2 text-slate-400"></i> ${table.name}`;
//     li.onclick = () => loadTableDetail(table);
//     listContainer.appendChild(li);
// });

// function loadTableDetail(table) {
//     document.getElementById('welcome-screen').classList.add('hidden');
//     document.getElementById('table-detail').classList.remove('hidden');
    
//     document.getElementById('active-table-name').innerText = table.name;
//     document.getElementById('ai-summary').innerText = table.summary;
//     document.getElementById('stat-completeness').innerText = table.stats.completeness;
//     document.getElementById('stat-freshness').innerText = table.stats.freshness;
//     document.getElementById('stat-uniqueness').innerText = table.stats.uniqueness;

//     renderChart(table.chartData);
// }

// function renderChart(data) {
//     const ctx = document.getElementById('qualityChart').getContext('2d');
    
//     if (myChart) myChart.destroy(); // Clear old chart

//     myChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//             datasets: [{
//                 label: 'Record Count (Growth)',
//                 data: data,
//                 borderColor: '#6366f1',
//                 backgroundColor: 'rgba(99, 102, 241, 0.1)',
//                 fill: true,
//                 tension: 0.4
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: { legend: { display: false } },
//             scales: { y: { display: false }, x: { grid: { display: false } } }
//         }
//     });
// }

// // Simple AI Chat Mockup
// const chatInput = document.getElementById('chat-input');
// const chatMessages = document.getElementById('chat-messages');

// chatInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter' && chatInput.value.trim() !== "") {
//         const userMsg = chatInput.value;
//         appendMessage('user', userMsg);
//         chatInput.value = '';

//         // Simulate AI Thinking
//         setTimeout(() => {
//             appendMessage('ai', `I've analyzed the schema. Based on your question about "${userMsg}", you should look at the 'order_fact' table, specifically the 'revenue' column.`);
//         }, 1000);
//     }
// });

// function appendMessage(role, text) {
//     const div = document.createElement('div');
//     div.className = role === 'ai' ? 'bg-slate-100 p-3 rounded-lg leading-snug' : 'bg-indigo-600 text-white p-3 rounded-lg leading-snug self-end ml-8';
//     div.innerText = text;
//     chatMessages.appendChild(div);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }





// Initial Mock Data Store
let databaseSchema = [
    {
        name: 'users_dim',
        summary: 'Primary dimension table for user profiles. Contains PII including email and hashed passwords. Verified by Data Governance.',
        stats: { completeness: '99.8%', freshness: '2h ago', uniqueness: '100%' },
        chartData: [400, 450, 430, 480, 520, 510, 550]
    },
    {
        name: 'order_fact',
        summary: 'Transactional records for all completed purchases. Use this for revenue reporting and seasonal trend analysis.',
        stats: { completeness: '94.2%', freshness: '5m ago', uniqueness: '98.5%' },
        chartData: [120, 200, 150, 300, 450, 380, 500]
    }
];

let myChart = null;

// Initialize and Render the Sidebar Table List
function renderSidebar() {
    const listContainer = document.getElementById('table-list');
    listContainer.innerHTML = ''; // Clear existing
    
    databaseSchema.forEach(table => {
        const li = document.createElement('li');
        li.className = "px-3 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg cursor-pointer transition-colors flex items-center gap-3 font-medium";
        li.innerHTML = `<i class="ri-table-2 text-slate-400"></i> ${table.name}`;
        li.onclick = () => loadTableDetail(table);
        listContainer.appendChild(li);
    });
}

// Load specific table details into the main view
function loadTableDetail(table) {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('table-detail').classList.remove('hidden');
    
    document.getElementById('active-table-name').innerText = table.name;
    document.getElementById('ai-summary').innerText = table.summary;
    document.getElementById('stat-completeness').innerText = table.stats.completeness;
    document.getElementById('stat-freshness').innerText = table.stats.freshness;
    document.getElementById('stat-uniqueness').innerText = table.stats.uniqueness;

    renderChart(table.chartData);
}

// Render the Chart.js Line Chart
function renderChart(data) {
    const ctx = document.getElementById('qualityChart').getContext('2d');
    
    if (myChart) myChart.destroy(); // Clear old chart instance

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Record Growth',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#6366f1',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                y: { display: false, beginAtZero: true }, 
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } } 
            }
        }
    });
}

// --- Hackathon Dataset Ingestion Logic ---
async function fetchHackfestDataset() {
    const btn = document.getElementById('sync-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="ri-loader-4-line animate-spin text-sm"></i> Syncing...`;
    
    const rawDatasetUrl = "https://raw.githubusercontent.com/GDG-Cloud-New-Delhi/hackfest-2.0-dataset/main/Internal_Recommendation_Doc.md";
    
    try {
        const response = await fetch(rawDatasetUrl);
        if (!response.ok) throw new Error('Network response failed');
        const markdownContent = await response.text();
        
        // Simulate an AI Agent parsing the unstructured markdown into structured JSON
        setTimeout(() => {
            const aiGeneratedSchema = {
                name: 'recommendation_engine_data',
                summary: 'AI Extracted: Dataset parsed directly from GDG Cloud New Delhi HackFest 2.0 repository. Contains parameters for internal recommendation modeling.',
                stats: { completeness: '100%', freshness: 'Just now', uniqueness: '99%' },
                chartData: [500, 600, 550, 700, 850, 800, 1000]
            };
            
            // Add to schema and re-render
            databaseSchema.push(aiGeneratedSchema);
            renderSidebar();
            loadTableDetail(aiGeneratedSchema); // Auto-load the new data
            
            // Notify in chat
            appendMessage('ai', 'I have successfully ingested and parsed the Internal Recommendation document from the HackFest repo!');
            btn.innerHTML = `<i class="ri-check-line text-sm"></i> Synced`;
            
        }, 1500); // Simulated AI processing delay
        
    } catch (error) {
        console.error("Failed to load dataset:", error);
        btn.innerHTML = `<i class="ri-error-warning-line text-sm"></i> Error`;
        setTimeout(() => btn.innerHTML = originalText, 3000);
    }
}

// --- AI Chat Logic ---
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

function handleChat() {
    if (chatInput.value.trim() === "") return;
    
    const userMsg = chatInput.value;
    appendMessage('user', userMsg);
    chatInput.value = '';

    // Simulate AI Response
    setTimeout(() => {
        appendMessage('ai', `Analyzing your query regarding "${userMsg}"... Based on the metadata, I recommend joining the 'users_dim' table to get the full context.`);
    }, 1000);
}

function appendMessage(role, text) {
    const div = document.createElement('div');
    if (role === 'ai') {
        div.className = 'bg-slate-100 text-slate-800 p-3.5 rounded-xl rounded-tl-sm leading-relaxed shadow-sm w-11/12';
    } else {
        div.className = 'bg-indigo-600 text-white p-3.5 rounded-xl rounded-tr-sm leading-relaxed shadow-sm w-11/12 self-end';
    }
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}

// Initial render on load
renderSidebar();