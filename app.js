document.addEventListener('DOMContentLoaded', () => {
    // Load local CSV file
    const csvFilePath = 'tech_scores.csv';

    fetch(csvFilePath)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            // 한글 깨짐 방지를 위해 UTF-8-SIG 고려
            const decoder = new TextDecoder('utf-8');
            const csvData = decoder.decode(buffer);
            Papa.parse(csvData, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function (results) {
                    processData(results.data);
                }
            });
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
            document.body.innerHTML += `<div style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background: rgba(220, 38, 38, 0.9); padding: 2rem; border-radius: 1rem; color: white; text-align: center;">
                <h2>오류 발생</h2>
                <p>CSV 파일을 불러올 수 없습니다. 로컬 서버(Live Server 등)를 통해 실행해주세요.</p>
                <p>${error.message}</p>
            </div>`;
        });
});

function processData(data) {
    // Basic Stats
    const totalStudents = data.length;
    const scores = data.map(d => d['총점(100점)']);
    const avgTotal = (scores.reduce((a, b) => a + b, 0) / totalStudents).toFixed(2);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    document.getElementById('total-students').textContent = `${totalStudents}명`;
    document.getElementById('avg-total').textContent = `${avgTotal}점`;
    document.getElementById('max-score').textContent = `${maxScore}점`;
    document.getElementById('min-score').textContent = `${minScore}점`;

    // Prepare Classes Data
    const classes = [...new Set(data.map(d => d['학급']))].sort();
    const classAverages = classes.map(cls => {
        const classStudents = data.filter(d => d['학급'] === cls);
        const avg = classStudents.reduce((sum, d) => sum + d['총점(100점)'], 0) / classStudents.length;
        return avg.toFixed(2);
    });

    // Populate Class Filter
    const classFilter = document.getElementById('class-filter');
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        classFilter.appendChild(option);
    });

    // Render Charts
    renderClassAvgChart(classes, classAverages);
    renderDistributionChart(scores);
    renderCategoryAvgChart(data);

    // Initial Table Render
    renderTable(data);

    // Event Listeners
    classFilter.addEventListener('change', (e) => {
        const selectedClass = e.target.value;
        const filteredData = selectedClass === 'all' ? data : data.filter(d => d['학급'] === selectedClass);
        renderTable(filteredData);
    });
}

function renderClassAvgChart(labels, values) {
    const ctx = document.getElementById('classAvgChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '학급별 평균 점수',
                data: values,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(99, 102, 241, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderDistributionChart(scores) {
    const bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const distribution = new Array(bins.length - 1).fill(0);

    scores.forEach(s => {
        for (let i = 0; i < bins.length - 1; i++) {
            if (s >= bins[i] && s < bins[i + 1]) {
                distribution[i]++;
                break;
            }
            if (s === 100) { distribution[bins.length - 2]++; break; }
        }
    });

    const ctx = document.getElementById('distributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: bins.slice(1).map(b => `${b}점 이하`),
            datasets: [{
                label: '학생 수',
                data: distribution,
                fill: true,
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                borderColor: 'rgba(236, 72, 153, 1)',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: 'rgba(236, 72, 153, 1)',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderCategoryAvgChart(data) {
    const finalAvg = data.reduce((sum, d) => sum + d['기말고사(100점/60%)'], 0) / data.length;
    const p1Avg = data.reduce((sum, d) => sum + d['수행1(15점)'], 0) / data.length;
    const p2Avg = data.reduce((sum, d) => sum + d['수행2(15점)'], 0) / data.length;
    const p3Avg = data.reduce((sum, d) => sum + d['수행3(10점)'], 0) / data.length;

    // Normalize to 100% scale for radial chart
    const categories = ['기말고사', '수행1', '수행2', '수행3'];
    const values = [
        (finalAvg).toFixed(1),
        (p1Avg / 15 * 100).toFixed(1),
        (p2Avg / 15 * 100).toFixed(1),
        (p3Avg / 10 * 100).toFixed(1)
    ];

    const ctx = document.getElementById('categoryAvgChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: '점수 비율 (%)',
                data: values,
                backgroundColor: 'rgba(6, 182, 212, 0.3)',
                borderColor: 'rgba(6, 182, 212, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(6, 182, 212, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#94a3b8', font: { size: 12 } },
                    ticks: { display: false },
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderTable(data) {
    const tbody = document.querySelector('#scores-table tbody');
    tbody.innerHTML = '';

    data.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d['학급']}</td>
            <td>${d['번호']}</td>
            <td>${d['기말고사(100점/60%)']}</td>
            <td>${d['수행1(15점)']}</td>
            <td>${d['수행2(15점)']}</td>
            <td>${d['수행3(10점)']}</td>
            <td style="font-weight: 700; color: var(--primary-bright)">${d['총점(100점)']}</td>
        `;
        tbody.appendChild(tr);
    });
}
