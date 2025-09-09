const html = `
        <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <!-- Main Introduction -->
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px;
                border-radius: 16px;
                margin-bottom: 30px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            ">
                <h2 style="margin: 0 0 25px 0; font-size: 28px; font-weight: 700;">
                    How Audit is Done?
                </h2>
                <div style="text-align: left; max-width: 800px; margin: 0 auto;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
                        <strong>1.</strong> Each Test automation project will be assessed against 4 types of standards - (Coding standards, WAF Standards, Execution Standards, Maintenance Standards).
                    </p>
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
                        <strong>2.</strong> Each standard will have again defined check points on which the project/Repo will be assessed.
                    </p>
                    <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                        <strong>3.</strong> At end of audit maturity will be calculated based on points project got divided by Total points.
                    </p>
                </div>
            </div>

            <!-- Standards Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-bottom: 40px;">
                
                <!-- Coding Standards -->
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    border-left: 6px solid #3498db;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)';">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="
                            background: #3498db;
                            color: white;
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                            font-weight: 700;
                            font-size: 18px;
                        ">1</div>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">
                            Coding Standards
                        </h3>
                    </div>
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    ">
                        <strong style="color: #3498db;">Maximum Score: 5 points</strong><br>
                        Assesses code quality, naming conventions, structure, and adherence to programming best practices.
                    </div>
                </div>

                <!-- WAF Standards -->
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    border-left: 6px solid #e74c3c;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)';">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="
                            background: #e74c3c;
                            color: white;
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                            font-weight: 700;
                            font-size: 18px;
                        ">2</div>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">
                            WAF Standards
                        </h3>
                    </div>
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    ">
                        <strong style="color: #e74c3c;">Maximum Score: 16 points</strong><br>
                        Evaluates Web Application Framework compliance, architecture patterns, and framework-specific best practices.
                    </div>
                </div>

                <!-- Execution Standards -->
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    border-left: 6px solid #2ecc71;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)';">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="
                            background: #2ecc71;
                            color: white;
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                            font-weight: 700;
                            font-size: 18px;
                        ">3</div>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">
                            Execution Standards
                        </h3>
                    </div>
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    ">
                        <strong style="color: #2ecc71;">Maximum Score: 5 points</strong><br>
                        Reviews test execution efficiency, parallel execution capabilities, and runtime optimization practices.
                    </div>
                </div>

                <!-- Maintenance Standards -->
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    border-left: 6px solid #f39c12;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)';">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="
                            background: #f39c12;
                            color: white;
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                            font-weight: 700;
                            font-size: 18px;
                        ">4</div>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">
                            Maintenance Standards
                        </h3>
                    </div>
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    ">
                        <strong style="color: #f39c12;">Maximum Score: 6 points</strong><br>
                        Assesses code maintainability, documentation quality, version control practices, and long-term sustainability.
                    </div>
                </div>
            </div>

            <!-- Maturity Calculation Section -->
            <div style="
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                border-top: 4px solid #9b59b6;
                margin-bottom: 30px;
            ">
                <h3 style="
                    margin: 0 0 25px 0;
                    color: #2c3e50;
                    font-size: 24px;
                    font-weight: 700;
                    text-align: center;
                ">Maturity Level Calculation</h3>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 12px;
                        font-size: 16px;
                        color: #2c3e50;
                        display: inline-block;
                        font-weight: 600;
                    ">
                        Maturity Level = (Points Earned ÷ Total Points) × 100
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <!-- Level 1 -->
                    <div style="
                        background: #e74c3c;
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                        <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">1</div>
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">BASIC LEVEL</div>
                        <div style="font-size: 12px; opacity: 0.9;">< 25%</div>
                    </div>
                    
                    <!-- Level 2 -->
                    <div style="
                        background: #f39c12;
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                        <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">2</div>
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">DEVELOPING</div>
                        <div style="font-size: 12px; opacity: 0.9;">25% - 50%</div>
                    </div>
                    
                    <!-- Level 3 -->
                    <div style="
                        background: #3498db;
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                        <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">3</div>
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">PROFICIENT</div>
                        <div style="font-size: 12px; opacity: 0.9;">50% - 75%</div>
                    </div>
                    
                    <!-- Level 4 -->
                    <div style="
                        background: #2ecc71;
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                        <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">4</div>
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">ADVANCED</div>
                        <div style="font-size: 12px; opacity: 0.9;">75% - < 100%</div>
                    </div>
                </div>
            </div>

            <!-- Total Score Information -->
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 16px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            ">
                <h3 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700;">
                    Total Maximum Score: 32 Points
                </h3>
                <p style="margin: 0; font-size: 16px; opacity: 0.9; line-height: 1.6;">
                    Coding (5) + WAF (16) + Execution (5) + Maintenance (6) = 32 Total Points
                </p>
            </div>
        </div>
    `;// Automation Standardization Module - Complete Working Version
let standardizationData = [];
let standardizationCharts = {};

// Register Chart.js plugins
if (typeof Chart !== 'undefined' && Chart.register) {
    Chart.register(ChartDataLabels);
}

// Base options for grouped bar charts
const groupedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    },
    scales: {
        x: {
            ticks: { 
                display: false  // Hide x-axis values
            },
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Value',
                color: '#666',
                font: { weight: 'bold' }
            },
            ticks: {
                display: false  // Hide y-axis values
            },
            grid: {
                color: 'rgba(0,0,0,0.1)'
            }
        }
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#333',
            borderWidth: 1,
            cornerRadius: 6,
            displayColors: true
        },
        datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            color: 'white',
            font: {
                weight: 'bold',
                size: 12
            },
            formatter: function(value) {
                return value;
            },
            textStrokeColor: 'rgba(0,0,0,0.6)',
            textStrokeWidth: 1
        }
    }
};

// Helper function to get chart data for grouped bars with maximum scores
function getGroupedChartData(data, standardType) {
    let labels = [];
    let scoreData = [];
    let repoCountData = [];
    let maxScoreData = [];
    
    // Define maximum scores for each standard type
    const maxScores = {
        'codingStandards': 5,
        'wafStandards': 16,
        'executionStandards': 5,
        'maintenanceStandards': 6
    };
    
    if (filters.group && filters.subGroup) {
        // Show individual repositories
        labels = data.map(d => d.repoName);
        scoreData = data.map(d => d[standardType]);
        repoCountData = data.map(() => 1); // Each repo is 1 repository
        maxScoreData = data.map(() => maxScores[standardType]);
    } else if (filters.group) {
        // Show sub-groups
        const subGroups = [...new Set(data.map(d => d.subGroup))];
        labels = subGroups;
        scoreData = subGroups.map(subGroup => {
            const subGroupData = data.filter(d => d.subGroup === subGroup);
            const avg = subGroupData.reduce((sum, d) => sum + d[standardType], 0) / subGroupData.length;
            return Math.round(avg * 10) / 10;
        });
        repoCountData = subGroups.map(subGroup => {
            const subGroupData = data.filter(d => d.subGroup === subGroup);
            return subGroupData.length;
        });
        maxScoreData = subGroups.map(() => maxScores[standardType]);
    } else {
        // Show groups
        const groups = [...new Set(data.map(d => d.group))];
        labels = groups;
        scoreData = groups.map(group => {
            const groupData = data.filter(d => d.group === group);
            const avg = groupData.reduce((sum, d) => sum + d[standardType], 0) / groupData.length;
            return Math.round(avg * 10) / 10;
        });
        repoCountData = groups.map(group => {
            const groupData = data.filter(d => d.group === group);
            return groupData.length;
        });
        maxScoreData = groups.map(() => maxScores[standardType]);
    }
    
    return { labels, scoreData, repoCountData, maxScoreData };
}

// Load standardization data from JSON
async function loadStandardizationData() {
    console.log('Loading automation standardization data from JSON...');
    
    try {
        const response = await fetch('data/AutomationMaturity.json');
        const jsonData = await response.json();
        
        const flatData = Array.isArray(jsonData) ? jsonData : Object.values(jsonData).flat();
        
        standardizationData = flatData.map(row => ({
            group: row['Group'] || '',
            subGroup: row['Sub Group'] || '',
            repoName: row['Repo Name'] || '',
            codingStandards: parseInt(row['Coding Standards']) || 0,
            wafStandards: parseInt(row['WAF Standards']) || 0,
            executionStandards: parseInt(row['Execution Standards']) || 0,
            maintenanceStandards: parseInt(row['Maintenance Standards']) || 0,
            areaOfFocus1: row['Area of Focus 1'] || '',
            areaOfFocus2: row['Area of Focus 2'] || '',
            areaOfFocus3: row['Area of Focus 3'] || '',
            areaOfFocus4: row['Area of Focus 4'] || '',
            areaOfFocus5: row['Area of Focus 5'] || '',
            overallMaturity: parseInt(row['Overall Maturity']) || 0,
            month: row['Month'] || 'August'
        }));
        
    } catch (error) {
        console.log('Error loading standardization data from JSON, using sample:', error);
        standardizationData = generateStandardizationSampleData();
    }
    
    console.log('Standardization data loaded:', standardizationData.length, 'records');
    updateStandardizationMetrics();
}

// Generate sample data if JSON file is not available
function generateStandardizationSampleData() {
    const groups = ["WIM", "CSBB", "Credit Solutions", "Payments", "London UAT"];
    const subGroups = {
        "WIM": ["AOM", "PMP", "MM"],
        "CSBB": ["CSBB", "Analytics"],
        "Credit Solutions": ["Credit Solutions", "Risk"],
        "Payments": ["Gateway", "Settlement"],
        "London UAT": ["Trading", "Compliance"]
    };
    
    const data = [];
    
    groups.forEach(group => {
        subGroups[group].forEach(subGroup => {
            for (let i = 1; i <= Math.floor(Math.random() * 4) + 2; i++) {
                data.push({
                    group,
                    subGroup,
                    repoName: `${subGroup}${i}`,
                    codingStandards: Math.floor(Math.random() * 6) + 3,
                    wafStandards: Math.floor(Math.random() * 8) + 6,
                    executionStandards: Math.floor(Math.random() * 5) + 4,
                    maintenanceStandards: Math.floor(Math.random() * 6) + 3,
                    areaOfFocus1: 'Code reviews',
                    areaOfFocus2: 'Gradle migration',
                    areaOfFocus3: '',
                    areaOfFocus4: '',
                    areaOfFocus5: '',
                    overallMaturity: Math.floor(Math.random() * 6) + 3,
                    month: 'August'
                });
            }
        });
    });
    
    return data;
}

// Get filtered standardization data
function getFilteredStandardizationData() {
    if (typeof filters !== 'undefined') {
        return standardizationData.filter(d => {
            const matchGroup = !filters.group || d.group === filters.group;
            const matchSubGroup = !filters.subGroup || d.subGroup === filters.subGroup;
            return matchGroup && matchSubGroup;
        });
    }
    return standardizationData;
}

// 1. Coding Standards Chart with grouped bars
function renderCodingStandardsChart() {
    const canvas = document.getElementById('codingStandardsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyStandardizationChart('codingStandards');
    
    const data = getFilteredStandardizationData();
    const { labels, scoreData, repoCountData, maxScoreData } = getGroupedChartData(data, 'codingStandards');
    
    standardizationCharts.codingStandards = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Repositories Audited',
                    data: repoCountData,
                    backgroundColor: '#1abc9c',
                    borderColor: '#16a085',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Coding Standards Score',
                    data: scoreData,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Maximum Possible',
                    data: maxScoreData,
                    backgroundColor: '#ecf0f1',
                    borderColor: '#bdc3c7',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: groupedBarOptions
    });
}

// 2. WAF Standards Chart with grouped bars
function renderWafStandardsChart() {
    const canvas = document.getElementById('wafStandardsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyStandardizationChart('wafStandards');
    
    const data = getFilteredStandardizationData();
    const { labels, scoreData, repoCountData, maxScoreData } = getGroupedChartData(data, 'wafStandards');
    
    standardizationCharts.wafStandards = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Repositories Audited',
                    data: repoCountData,
                    backgroundColor: '#1abc9c',
                    borderColor: '#16a085',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'WAF Standards Score',
                    data: scoreData,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Maximum Possible',
                    data: maxScoreData,
                    backgroundColor: '#ecf0f1',
                    borderColor: '#bdc3c7',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: groupedBarOptions
    });
}

// 3. Execution Standards Chart with grouped bars
function renderExecutionStandardsChart() {
    const canvas = document.getElementById('executionStandardsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyStandardizationChart('executionStandards');
    
    const data = getFilteredStandardizationData();
    const { labels, scoreData, repoCountData, maxScoreData } = getGroupedChartData(data, 'executionStandards');
    
    standardizationCharts.executionStandards = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Repositories Audited',
                    data: repoCountData,
                    backgroundColor: '#1abc9c',
                    borderColor: '#16a085',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Execution Standards Score',
                    data: scoreData,
                    backgroundColor: '#2ecc71',
                    borderColor: '#27ae60',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Maximum Possible',
                    data: maxScoreData,
                    backgroundColor: '#ecf0f1',
                    borderColor: '#bdc3c7',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: groupedBarOptions
    });
}

// 4. Maintenance Standards Chart with grouped bars
function renderMaintenanceStandardsChart() {
    const canvas = document.getElementById('maintenanceStandardsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyStandardizationChart('maintenanceStandards');
    
    const data = getFilteredStandardizationData();
    const { labels, scoreData, repoCountData, maxScoreData } = getGroupedChartData(data, 'maintenanceStandards');
    
    standardizationCharts.maintenanceStandards = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Repositories Audited',
                    data: repoCountData,
                    backgroundColor: '#1abc9c',
                    borderColor: '#16a085',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Maintenance Standards Score',
                    data: scoreData,
                    backgroundColor: '#f39c12',
                    borderColor: '#e67e22',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Maximum Possible',
                    data: maxScoreData,
                    backgroundColor: '#ecf0f1',
                    borderColor: '#bdc3c7',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: groupedBarOptions
    });
}

// Update standardization KPIs
function updateStandardizationKPIs(data) {
    const totalRepos = data.length;
    const avgCodingStandards = data.length > 0 ? 
        Math.round(data.reduce((sum, d) => sum + d.codingStandards, 0) / data.length * 10) / 10 : 0;
    const avgWafStandards = data.length > 0 ?
        Math.round(data.reduce((sum, d) => sum + d.wafStandards, 0) / data.length * 10) / 10 : 0;
    const avgExecutionStandards = data.length > 0 ?
        Math.round(data.reduce((sum, d) => sum + d.executionStandards, 0) / data.length * 10) / 10 : 0;
    const avgMaintenanceStandards = data.length > 0 ?
        Math.round(data.reduce((sum, d) => sum + d.maintenanceStandards, 0) / data.length * 10) / 10 : 0;
    const avgOverallMaturity = data.length > 0 ?
        Math.round(data.reduce((sum, d) => sum + d.overallMaturity, 0) / data.length * 10) / 10 : 0;
    
    const elements = {
        'totalRepos': totalRepos,
        'avgCodingStandards': avgCodingStandards,
        'avgWafStandards': avgWafStandards,
        'avgExecutionStandards': avgExecutionStandards,
        'avgMaintenanceStandards': avgMaintenanceStandards,
        'avgOverallMaturity': avgOverallMaturity
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Utility function to safely destroy charts
function safeDestroyStandardizationChart(chartKey) {
    if (standardizationCharts[chartKey]) {
        try {
            standardizationCharts[chartKey].destroy();
        } catch (error) {
            console.warn(`Error destroying standardization chart ${chartKey}:`, error);
        }
        delete standardizationCharts[chartKey];
    }
}

// Updated render function for overview charts
function renderStandardizationOverviewCharts() {
    console.log('Rendering standardization overview charts...');
    setTimeout(() => renderCodingStandardsChart(), 100);
    setTimeout(() => renderWafStandardsChart(), 200);
    setTimeout(() => renderExecutionStandardsChart(), 300);
    setTimeout(() => renderMaintenanceStandardsChart(), 400);
}

// Global tooltip functions (fixes hover functionality)
function showFocusTooltip(event, tooltipId, content) {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
        tooltip.innerHTML = content;
        tooltip.style.opacity = '1';
        moveFocusTooltip(event, tooltipId);
    }
}

function hideFocusTooltip(tooltipId) {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

function moveFocusTooltip(event, tooltipId) {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
        const x = event.clientX + 15;
        const y = event.clientY - 10;
        
        // Adjust position if tooltip would go off screen
        const rect = tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let adjustedX = x;
        let adjustedY = y;
        
        if (x + rect.width > windowWidth) {
            adjustedX = event.clientX - rect.width - 15;
        }
        
        if (y + rect.height > windowHeight) {
            adjustedY = event.clientY - rect.height - 15;
        }
        
        tooltip.style.left = adjustedX + 'px';
        tooltip.style.top = adjustedY + 'px';
    }
}

// Clean up tooltips when switching tabs or pages
function cleanupFocusTooltips() {
    const tooltips = document.querySelectorAll('[id^="focus-tooltip-"]');
    tooltips.forEach(tooltip => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    });
}

// Area of Focus Analysis (Fixed hover functionality)
function renderAreaOfFocusChart() {
    const container = document.getElementById('areaOfFocusChart');
    if (!container) return;
    
    // Clean up any existing tooltips
    cleanupFocusTooltips();
    
    const data = getFilteredStandardizationData();
    
    // Collect areas of focus with repository details
    const focusDetails = {};
    data.forEach(item => {
        [item.areaOfFocus1, item.areaOfFocus2, item.areaOfFocus3, item.areaOfFocus4, item.areaOfFocus5]
            .filter(focus => focus && focus.trim() !== '')
            .forEach(focus => {
                if (!focusDetails[focus]) {
                    focusDetails[focus] = {
                        count: 0,
                        repositories: []
                    };
                }
                focusDetails[focus].count++;
                
                let repoDetail = '';
                if (filters.group && filters.subGroup) {
                    repoDetail = item.repoName;
                } else if (filters.group) {
                    repoDetail = `${item.subGroup} - ${item.repoName}`;
                } else {
                    repoDetail = `${item.group} → ${item.subGroup} → ${item.repoName}`;
                }
                
                focusDetails[focus].repositories.push(repoDetail);
            });
    });
    
    const allFocusAreas = Object.entries(focusDetails)
        .sort(([,a], [,b]) => b.count - a.count);
    
    if (allFocusAreas.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h4>No focus areas identified</h4>
                <p>No areas of focus data available for the selected filters.</p>
            </div>
        `;
        return;
    }
    
    // Create tooltip container for hover details
    const tooltipId = 'focus-tooltip-' + Date.now();
    const tooltip = document.createElement('div');
    tooltip.id = tooltipId;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-size: 12px;
        max-width: 300px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(tooltip);
    
    // Create cards for focus areas
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">';
    
    allFocusAreas.forEach(([focus, details], index) => {
        const maxCount = Math.max(...allFocusAreas.map(([, d]) => d.count));
        const intensity = details.count / maxCount;
        
        let cardColor, priorityLabel;
        if (intensity >= 0.7) {
            cardColor = '#e74c3c';
            priorityLabel = 'High Priority';
        } else if (intensity >= 0.4) {
            cardColor = '#f39c12';
            priorityLabel = 'Medium Priority';
        } else {
            cardColor = '#3498db';
            priorityLabel = 'Low Priority';
        }
        
        // Create repository list for tooltip
        const repoList = details.repositories
            .sort()
            .map(repo => `• ${repo}`)
            .join('<br>');
        
        html += `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                border-left: 5px solid ${cardColor};
                transition: all 0.3s ease;
                text-align: center;
                cursor: pointer;
                min-height: 160px;
                height: auto;
            "
            onmouseenter="showFocusTooltip(event, '${tooltipId}', '${focus}<br><br><strong>Repositories:</strong><br>${repoList}');"
            onmouseleave="hideFocusTooltip('${tooltipId}');"
            onmousemove="moveFocusTooltip(event, '${tooltipId}');"
            onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)';">
                
                <div style="
                    background: ${cardColor};
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: 700;
                    margin: 0 auto 15px auto;
                ">${details.count}</div>
                
                <h5 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #2c3e50; line-height: 1.3;">
                    ${focus}
                </h5>
                
                <div style="
                    background: ${cardColor}20;
                    color: ${cardColor};
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                    display: inline-block;
                ">${priorityLabel}</div>
                
                <div style="margin-bottom: 8px; font-size: 12px; color: #666;">
                    ${details.count} ${details.count === 1 ? 'repository' : 'repositories'}
                </div>
                
                <div style="margin-bottom: 8px;">
                    <div style="background: #f0f0f0; border-radius: 6px; height: 6px; overflow: hidden;">
                        <div style="
                            width: ${Math.max(10, intensity * 100)}%;
                            height: 100%;
                            background: linear-gradient(90deg, ${cardColor}, ${cardColor}aa);
                            border-radius: 6px;
                            transition: width 0.8s ease;
                        "></div>
                    </div>
                </div>
                
                <div style="font-size: 11px; color: #999; font-style: italic;">
                    Hover for details
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// What They Did Well Analysis
function renderWhatTheyDidWellChart() {
    const container = document.getElementById('whatTheyDidWellChart');
    if (!container) return;
    
    const data = getFilteredStandardizationData();
    
    let analysisLevel = [];
    
    if (filters.group && filters.subGroup) {
        analysisLevel = data.map(d => ({
            name: d.repoName,
            coding: d.codingStandards,
            waf: d.wafStandards,
            execution: d.executionStandards,
            maintenance: d.maintenanceStandards
        }));
    } else if (filters.group) {
        const subGroups = [...new Set(data.map(d => d.subGroup))];
        analysisLevel = subGroups.map(subGroup => {
            const subGroupData = data.filter(d => d.subGroup === subGroup);
            return {
                name: subGroup,
                coding: Math.round(subGroupData.reduce((sum, d) => sum + d.codingStandards, 0) / subGroupData.length * 10) / 10,
                waf: Math.round(subGroupData.reduce((sum, d) => sum + d.wafStandards, 0) / subGroupData.length * 10) / 10,
                execution: Math.round(subGroupData.reduce((sum, d) => sum + d.executionStandards, 0) / subGroupData.length * 10) / 10,
                maintenance: Math.round(subGroupData.reduce((sum, d) => sum + d.maintenanceStandards, 0) / subGroupData.length * 10) / 10
            };
        });
    } else {
        const groups = [...new Set(data.map(d => d.group))];
        analysisLevel = groups.map(group => {
            const groupData = data.filter(d => d.group === group);
            return {
                name: group,
                coding: Math.round(groupData.reduce((sum, d) => sum + d.codingStandards, 0) / groupData.length * 10) / 10,
                waf: Math.round(groupData.reduce((sum, d) => sum + d.wafStandards, 0) / groupData.length * 10) / 10,
                execution: Math.round(groupData.reduce((sum, d) => sum + d.executionStandards, 0) / groupData.length * 10) / 10,
                maintenance: Math.round(groupData.reduce((sum, d) => sum + d.maintenanceStandards, 0) / groupData.length * 10) / 10
            };
        });
    }
    
    const strengthAnalysis = analysisLevel.map(item => {
        const scores = {
            'Coding Standards': item.coding,
            'WAF Standards': item.waf,
            'Execution Standards': item.execution,
            'Maintenance Standards': item.maintenance
        };
        
        const maxScore = Math.max(...Object.values(scores));
        const strengths = Object.entries(scores)
            .filter(([, score]) => score === maxScore)
            .map(([standard]) => standard);
            
        return {
            name: item.name,
            strengths,
            maxScore,
            allScores: scores
        };
    }).sort((a, b) => b.maxScore - a.maxScore);
    
    if (strengthAnalysis.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <h4 style="font-size: 20px; margin-bottom: 10px;">No data available</h4>
                <p style="color: #999; font-size: 14px;">No standardization data found for the selected filters.</p>
            </div>
        `;
        return;
    }
    
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">';
    
    strengthAnalysis.forEach(item => {
        const strengthColor = item.maxScore >= 12 ? '#27ae60' : item.maxScore >= 9 ? '#f39c12' : item.maxScore >= 6 ? '#3498db' : '#e74c3c';
        
        html += `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                border-left: 5px solid ${strengthColor};
                transition: all 0.3s ease;
                min-height: 280px;
                height: auto;
            "
            onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)';">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: #2c3e50;">${item.name}</h4>
                    <div style="
                        background: ${strengthColor};
                        color: white;
                        padding: 8px 12px;
                        border-radius: 16px;
                        font-weight: 700;
                        font-size: 14px;
                        min-width: 40px;
                        text-align: center;
                    ">${item.maxScore}</div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 8px;">STRONGEST AREAS</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${item.strengths.map(strength => `
                            <span style="
                                background: linear-gradient(135deg, ${strengthColor}, ${strengthColor}dd);
                                color: white;
                                padding: 4px 8px;
                                border-radius: 12px;
                                font-size: 11px;
                                font-weight: 600;
                            ">${strength}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 8px;">ALL SCORES</div>
                    ${Object.entries(item.allScores).map(([standard, score]) => {
                        const isHighest = score === item.maxScore;
                        const barColor = isHighest ? strengthColor : '#e0e0e0';
                        const textColor = isHighest ? '#2c3e50' : '#666';
                        const barWidth = Math.max(10, (score / 15) * 100);
                        
                        return `
                            <div style="margin-bottom: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <span style="font-size: 11px; color: ${textColor}; font-weight: ${isHighest ? '700' : '500'};">${standard}</span>
                                    <span style="font-size: 12px; font-weight: 700; color: ${textColor};">${score}</span>
                                </div>
                                <div style="background: #f0f0f0; border-radius: 4px; height: 6px; overflow: hidden;">
                                    <div style="
                                        width: ${barWidth}%;
                                        height: 100%;
                                        background: ${barColor};
                                        border-radius: 4px;
                                        transition: width 0.8s ease;
                                    "></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function switchStandardizationTab(tabName) {
    console.log('Switching to standardization tab:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('#standardizationPage .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`#standardizationPage [data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update tab content
    document.querySelectorAll('#standardizationPage .tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.style.display = 'block';
    }
    
    // Clean up tooltips when switching tabs
    cleanupFocusTooltips();
    
    // Render appropriate charts
    setTimeout(() => {
        if (tabName === 'standardization-audit-process') {
            renderAuditProcessInfo();
        } else if (tabName === 'standardization-overview') {
            renderStandardizationOverviewCharts();
        } else if (tabName === 'standardization-focus') {
            renderAreaOfFocusChart();
        } else if (tabName === 'standardization-excellence') {
            renderWhatTheyDidWellChart();
        }
    }, 300);
}

// New function to render audit process information
function renderAuditProcessInfo() {
    const container = document.getElementById('auditProcessInfo');
    if (!container) return;
    
    const html = `
        <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <!-- Main Introduction -->
            <div style="
                background: linear-gradient(135deg,#c41e3a 0%, #8b0000 100%);
                color: white;
                padding: 40px;
                border-radius: 16px;
                margin-bottom: 30px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            ">
                <h2 style="margin: 0 0 25px 0; font-size: 28px; font-weight: 700;">
                    How Audit is Done?
                </h2>
                <div style="text-align: left; max-width: 800px; margin: 0 auto;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
                        <strong>1.</strong> Each Test automation project will be assessed against 4 types of standards - (Coding standards, WAF Standards, Execution Standards, Maintenance Standards).
                    </p>
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
                        <strong>2.</strong> Each standard will have again defined check points on which the project/Repo will be assessed.
                    </p>
                    <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                        <strong>3.</strong> At end of audit maturity will be calculated based on points project got divided by Total points.
                    </p>
                </div>
            </div>

            <!-- Standards Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-bottom: 40px;">
                
                <!-- Coding Standards -->
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    border-left: 6px solid #3498db;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)';">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="
                            background: #3498db;
                            color: white;
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                            font-weight: 700;
                            font-size: 18px;
                        ">1</div>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">
                            Coding Standards
                        </h3>
                    </div>
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    ">
                        <strong style="color: #3498db;">Maximum Score: 5 points</strong><br>
                        Assesses code quality, naming conventions, structure, and adherence to programming best practices.
                    </div>
                </div>

                <!-- WAF Standards -->
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    border-left: 6px solid #e74c3c;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)';">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="
                            background: #e74c3c;
                            color: white;
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                            font-weight: 700;
                            font-size: 18px;
                        ">2</div>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">
                            WAF Standards
                        </h3>
                    </div>
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    ">
                        <strong style="color: #e74c3c;">Maximum Score: 16 points</strong><br>
                        Evaluates Web Application Framework compliance, architecture patterns, and framework-specific best practices.
                    </div>
                </div>

                <!-- Execution Standards -->
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    border-left: 6px solid #2ecc71;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)';">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="
                            background: #2ecc71;
                            color: white;
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                            font-weight: 700;
                            font-size: 18px;
                        ">3</div>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">
                            Execution Standards
                        </h3>
                    </div>
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    ">
                        <strong style="color: #2ecc71;">Maximum Score: 5 points</strong><br>
                        Reviews test execution efficiency, parallel execution capabilities, and runtime optimization practices.
                    </div>
                </div>

                <!-- Maintenance Standards -->
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    border-left: 6px solid #f39c12;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.08)';">
                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="
                            background: #f39c12;
                            color: white;
                            width: 50px;
                            height: 50px;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 15px;
                            font-weight: 700;
                            font-size: 18px;
                        ">4</div>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 20px; font-weight: 700;">
                            Maintenance Standards
                        </h3>
                    </div>
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    ">
                        <strong style="color: #f39c12;">Maximum Score: 6 points</strong><br>
                        Assesses code maintainability, documentation quality, version control practices, and long-term sustainability.
                    </div>
                </div>
            </div>

            <!-- Maturity Calculation Section -->
            <div style="
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                border-top: 4px solid #9b59b6;
                margin-bottom: 30px;
            ">
                <h3 style="
                    margin: 0 0 25px 0;
                    color: #2c3e50;
                    font-size: 24px;
                    font-weight: 700;
                    text-align: center;
                ">Maturity Level Calculation</h3>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 12px;
                        font-size: 16px;
                        color: #2c3e50;
                        display: inline-block;
                        font-weight: 600;
                    ">
                        Maturity Level = (Points Earned ÷ Total Points) × 100
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <!-- Level 1 -->
                    <div style="
                        background: #e74c3c;
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                        <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">1</div>
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">BASIC LEVEL</div>
                        <div style="font-size: 12px; opacity: 0.9;">< 25%</div>
                    </div>
                    
                    <!-- Level 2 -->
                    <div style="
                        background: #f39c12;
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                        <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">2</div>
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">DEVELOPING</div>
                        <div style="font-size: 12px; opacity: 0.9;">25% - 50%</div>
                    </div>
                    
                    <!-- Level 3 -->
                    <div style="
                        background: #3498db;
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                        <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">3</div>
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">PROFICIENT</div>
                        <div style="font-size: 12px; opacity: 0.9;">50% - 75%</div>
                    </div>
                    
                    <!-- Level 4 -->
                    <div style="
                        background: #2ecc71;
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)';"
                    onmouseout="this.style.transform='scale(1)';">
                        <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">4</div>
                        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">ADVANCED</div>
                        <div style="font-size: 12px; opacity: 0.9;">75% - < 100%</div>
                    </div>
                </div>
            </div>

            <!-- Total Score Information -->
            <div style="
                background: linear-gradient(135deg,#c41e3a 0%, #8b0000 100%);
                color: white;
                padding: 30px;
                border-radius: 16px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            ">
                <h3 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700;">
                    Total Maximum Score: 32 Points
                </h3>
                <p style="margin: 0; font-size: 16px; opacity: 0.9; line-height: 1.6;">
                    Coding (5) + WAF (16) + Execution (5) + Maintenance (6) = 32 Total Points
                </p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}
// Setup filter listeners for standardization
function setupStandardizationFilterListeners() {
    const groupFilter = document.getElementById('groupFilter');
    const subGroupFilter = document.getElementById('subGroupFilter');
    
    if (groupFilter && !groupFilter.hasAttribute('standardization-listener')) {
        groupFilter.setAttribute('standardization-listener', 'true');
        groupFilter.addEventListener('change', function() {
            if (currentPage === 'standardization') {
                filters.group = this.value;
                updateStandardizationSubAreaFilter();
                updateStandardizationMetrics();
            }
        });
    }
    
    if (subGroupFilter && !subGroupFilter.hasAttribute('standardization-listener')) {
        subGroupFilter.setAttribute('standardization-listener', 'true');
        subGroupFilter.addEventListener('change', function() {
            if (currentPage === 'standardization') {
                filters.subGroup = this.value;
                updateStandardizationMetrics();
            }
        });
    }
}

// Populate filters with standardization data
function populateStandardizationFilters() {
    console.log('Populating standardization filters...');
    
    const groups = [...new Set(standardizationData.map(d => d.group))].filter(g => g);
    const groupFilter = document.getElementById('groupFilter');
    
    if (groupFilter) {
        const existingOptions = Array.from(groupFilter.options).map(opt => opt.value);
        
        groups.forEach(group => {
            if (!existingOptions.includes(group)) {
                const option = document.createElement('option');
                option.value = group;
                option.textContent = group;
                groupFilter.appendChild(option);
            }
        });
    }
}

function updateStandardizationSubAreaFilter() {
    const subGroupFilter = document.getElementById('subGroupFilter');
    if (!subGroupFilter) return;
    
    const currentValue = subGroupFilter.value;
    subGroupFilter.innerHTML = '<option value="">All Sub Groups</option>';
    
    if (filters.group) {
        const subGroups = [...new Set(standardizationData
            .filter(d => d.group === filters.group)
            .map(d => d.subGroup))].filter(sg => sg);
        
        subGroups.forEach(subGroup => {
            const option = document.createElement('option');
            option.value = subGroup;
            option.textContent = subGroup;
            if (subGroup === currentValue) {
                option.selected = true;
            }
            subGroupFilter.appendChild(option);
        });
    }
    
    if (filters.group && !subGroupFilter.value) {
        filters.subGroup = '';
    }
}

// Update standardization metrics
function updateStandardizationMetrics() {
    console.log('Updating standardization metrics...');
    
    const filteredData = getFilteredStandardizationData();
    console.log('Filtered standardization data count:', filteredData.length);
    
    updateStandardizationKPIs(filteredData);
    
    const activeTab = document.querySelector('#standardizationPage .tab.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        setTimeout(() => {
            if (tabName === 'standardization-overview') {
                renderStandardizationOverviewCharts();
            } else if (tabName === 'standardization-focus') {
                renderAreaOfFocusChart();
            } else if (tabName === 'standardization-excellence') {
                renderWhatTheyDidWellChart();
            }
        }, 200);
    }
}

// Initialize standardization page
function initializeStandardizationPage() {
    console.log('Initializing Standardization Page...');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupStandardizationPage();
        });
    } else {
        setupStandardizationPage();
    }
}

function setupStandardizationPage() {
    initializeStandardizationTabs();
    loadStandardizationData();
    setupStandardizationFilterListeners();
    populateStandardizationFilters();
}

function initializeStandardizationTabs() {
    const standardizationTabs = document.querySelectorAll('#standardizationPage .tab');
    
    standardizationTabs.forEach(tab => {
        tab.replaceWith(tab.cloneNode(true));
    });
    
    document.querySelectorAll('#standardizationPage .tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchStandardizationTab(tabName);
        });
    });
}

// Export functions for integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadStandardizationData,
        initializeStandardizationPage,
        updateStandardizationMetrics,
        switchStandardizationTab,
        populateStandardizationFilters,
        standardizationCharts
    };
}