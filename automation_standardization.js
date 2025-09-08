// Automation Standardization Module - Updated for JSON Data Loading
let standardizationData = [];
let standardizationCharts = {};

//Chart.register(ChartDataLabels);

// Base options for bar charts with centered labels
if (typeof Chart !== 'undefined' && Chart.register) {
    Chart.register(ChartDataLabels);
}

// Clean base options for all bar charts
const cleanBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    },
    scales: {
        x: {
            ticks: { 
                maxRotation: 45,
                font: { size: 11 },
                color: '#666'
            },
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Score',
                color: '#666',
                font: { weight: 'bold' }
            },
            ticks: {
                font: { size: 11 },
                color: '#666'
            },
            grid: {
                color: 'rgba(0,0,0,0.1)'
            }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: false  // Completely disable tooltips
        },
        datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            color: 'white',
            font: {
                weight: 'bold',
                size: 13
            },
            formatter: function(value) {
                return value;
            },
            textStrokeColor: 'rgba(0,0,0,0.5)',
            textStrokeWidth: 1
        }
    }
};

// Helper function to get chart data based on filters
function getChartData(data, standardType) {
    let labels = [];
    let chartData = [];
    
    if (filters.group && filters.subGroup) {
        // Show individual repositories
        labels = data.map(d => d.repoName);
        chartData = data.map(d => d[standardType]);
    } else if (filters.group) {
        // Show sub-groups
        const subGroups = [...new Set(data.map(d => d.subGroup))];
        labels = subGroups;
        chartData = subGroups.map(subGroup => {
            const subGroupData = data.filter(d => d.subGroup === subGroup);
            const avg = subGroupData.reduce((sum, d) => sum + d[standardType], 0) / subGroupData.length;
            return Math.round(avg * 10) / 10;
        });
    } else {
        // Show groups
        const groups = [...new Set(data.map(d => d.group))];
        labels = groups;
        chartData = groups.map(group => {
            const groupData = data.filter(d => d.group === group);
            const avg = groupData.reduce((sum, d) => sum + d[standardType], 0) / groupData.length;
            return Math.round(avg * 10) / 10;
        });
    }
    
    return { labels, chartData };
}
// Load standardization data from JSON
async function loadStandardizationData() {
    console.log('Loading automation standardization data from JSON...');
    
    try {
        // Load from JSON file (converted from Excel)
        const response = await fetch('data/AutomationMaturity.json');
        const jsonData = await response.json();
        
        // Handle both array and object formats
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
    
    const areasOfFocus = [
        "Code reviews", "Gradle migration", "Latest version of Snapshots",
        "Automated Code reviews", "Test framework standardization",
        "CI/CD pipeline optimization", "Security scanning", "Performance testing"
    ];
    
    const data = [];
    
    groups.forEach(group => {
        subGroups[group].forEach(subGroup => {
            for (let i = 1; i <= Math.floor(Math.random() * 4) + 2; i++) {
                const codingScore = Math.floor(Math.random() * 6) + 3; // 3-8
                const wafScore = Math.floor(Math.random() * 8) + 6; // 6-13
                const executionScore = Math.floor(Math.random() * 5) + 4; // 4-8
                const maintenanceScore = Math.floor(Math.random() * 6) + 3; // 3-8
                
                const focusAreas = areasOfFocus
                    .sort(() => 0.5 - Math.random())
                    .slice(0, Math.floor(Math.random() * 4) + 1);
                
                data.push({
                    group,
                    subGroup,
                    repoName: `${subGroup}${i}`,
                    codingStandards: codingScore,
                    wafStandards: wafScore,
                    executionStandards: executionScore,
                    maintenanceStandards: maintenanceScore,
                    areaOfFocus1: focusAreas[0] || '',
                    areaOfFocus2: focusAreas[1] || '',
                    areaOfFocus3: focusAreas[2] || '',
                    areaOfFocus4: focusAreas[3] || '',
                    areaOfFocus5: focusAreas[4] || '',
                    overallMaturity: Math.floor((codingScore + wafScore + executionScore + maintenanceScore) / 4),
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

// 1. Standards Overview - Radar Chart
//1. Coding Standards Bar Chart
function renderCodingStandardsChart() {
    const canvas = document.getElementById('codingStandardsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyStandardizationChart('codingStandards');
    
    const data = getFilteredStandardizationData();
    const { labels, chartData } = getChartData(data, 'codingStandards');
    
    standardizationCharts.codingStandards = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: chartData,
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: cleanBarOptions
    });
}

// 2. WAF Standards Chart
function renderWafStandardsChart() {
    const canvas = document.getElementById('wafStandardsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyStandardizationChart('wafStandards');
    
    const data = getFilteredStandardizationData();
    const { labels, chartData } = getChartData(data, 'wafStandards');
    
    standardizationCharts.wafStandards = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: chartData,
                backgroundColor: '#e74c3c',
                borderColor: '#c0392b',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: cleanBarOptions
    });
}

// 3. Execution Standards Chart
function renderExecutionStandardsChart() {
    const canvas = document.getElementById('executionStandardsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyStandardizationChart('executionStandards');
    
    const data = getFilteredStandardizationData();
    const { labels, chartData } = getChartData(data, 'executionStandards');
    
    standardizationCharts.executionStandards = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: chartData,
                backgroundColor: '#2ecc71',
                borderColor: '#27ae60',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: cleanBarOptions
    });
}

// 4. Maintenance Standards Chart
function renderMaintenanceStandardsChart() {
    const canvas = document.getElementById('maintenanceStandardsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyStandardizationChart('maintenanceStandards');
    
    const data = getFilteredStandardizationData();
    const { labels, chartData } = getChartData(data, 'maintenanceStandards');
    
    standardizationCharts.maintenanceStandards = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: chartData,
                backgroundColor: '#f39c12',
                borderColor: '#e67e22',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: cleanBarOptions
    });
}


// Updated render function for overview charts
function renderStandardizationOverviewCharts() {
    console.log('Rendering standardization overview charts...');
    setTimeout(() => renderCodingStandardsChart(), 100);
    setTimeout(() => renderWafStandardsChart(), 200);
    setTimeout(() => renderExecutionStandardsChart(), 300);
    setTimeout(() => renderMaintenanceStandardsChart(), 400);
}
// 4. Area of Focus Analysis
function renderAreaOfFocusChart() {
    const container = document.getElementById('areaOfFocusChart');
    if (!container) return;
    
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
                
                // Add repository details based on filter level
                let repoDetail = '';
                if (filters.group && filters.subGroup) {
                    // Show just repo name when both filters are applied
                    repoDetail = item.repoName;
                } else if (filters.group) {
                    // Show subgroup and repo name when only group filter is applied
                    repoDetail = `${item.subGroup} - ${item.repoName}`;
                } else {
                    // Show full hierarchy when no filters are applied
                    repoDetail = `${item.group} → ${item.subGroup} → ${item.repoName}`;
                }
                
                focusDetails[focus].repositories.push(repoDetail);
            });
    });
    
    // Sort by count and show ALL focus areas (not just top 8)
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
    
    // Render ALL focus areas as cards
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">';
    
    allFocusAreas.forEach(([focus, details], index) => {
        // Color coding based on frequency (high frequency = higher priority)
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
            onmouseenter="showFocusTooltip(event, '${tooltipId}', \`${focus}<br><br><strong>Repositories:</strong><br>${repoList}\`);"
            onmouseleave="hideFocusTooltip('${tooltipId}');"
            onmousemove="moveFocusTooltip(event, '${tooltipId}');"
            onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)';">
                
                <!-- Count Badge -->
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
                
                <!-- Focus Area Title -->
                <h5 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #2c3e50; line-height: 1.3;">
                    ${focus}
                </h5>
                
                <!-- Priority Badge -->
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
                
                <!-- Repository Count -->
                <div style="margin-bottom: 8px; font-size: 12px; color: #666;">
                    ${details.count} ${details.count === 1 ? 'repository' : 'repositories'}
                </div>
                
                <!-- Progress Bar showing relative frequency -->
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
                
                <!-- Hover Instruction -->
                <div style="font-size: 11px; color: #999; font-style: italic;">
                    Hover for details
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Keep the existing global tooltip functions
window.showFocusTooltip = function(event, tooltipId, content) {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
        tooltip.innerHTML = content;
        tooltip.style.opacity = '1';
        moveFocusTooltip(event, tooltipId);
    }
};

window.hideFocusTooltip = function(tooltipId) {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
};

window.moveFocusTooltip = function(event, tooltipId) {
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
};

// Clean up tooltips when switching tabs or pages (keep existing function)
function cleanupFocusTooltips() {
    const tooltips = document.querySelectorAll('[id^="focus-tooltip-"]');
    tooltips.forEach(tooltip => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    });
}


// 5. What They Did Well Analysis (using inline styles like the opportunity matrix)
function renderWhatTheyDidWellChart() {
    const container = document.getElementById('whatTheyDidWellChart');
    if (!container) return;
    
    const data = getFilteredStandardizationData();
    
    // Analyze what each group/subgroup does well
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
    
    // Find strengths for each item
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
    }).sort((a, b) => b.maxScore - a.maxScore); // Sort by highest score first
    
    if (strengthAnalysis.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <h4 style="font-size: 20px; margin-bottom: 10px;">No data available</h4>
                <p style="color: #999; font-size: 14px;">No standardization data found for the selected filters.</p>
            </div>
        `;
        return;
    }
    
    // Render ALL items as cards with inline CSS
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">';
    
    strengthAnalysis.forEach(item => {
        const strengthColor = item.maxScore >= 12 ? '#27ae60' : item.maxScore >= 9 ? '#f39c12' : item.maxScore >= 6 ? '#3498db' : '#e74c3c';
        
        // Determine display context based on filter level
        let displayContext = '';
        if (filters.group && filters.subGroup) {
            displayContext = `Repository in ${filters.group} → ${filters.subGroup}`;
        } else if (filters.group) {
            displayContext = `Sub-group in ${filters.group}`;
        } else {
            displayContext = `Business Group`;
        }
        
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
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: #2c3e50;">${item.name}</h4>
                        <div style="font-size: 11px; color: #666; background: #f8f9fa; padding: 3px 8px; border-radius: 8px; display: inline-block; margin-top: 4px;">
                            ${displayContext}
                        </div>
                    </div>
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
                
                <!-- Strengths Section -->
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
                
                <!-- All Scores Section -->
                <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 8px;">ALL SCORES</div>
                    ${Object.entries(item.allScores).map(([standard, score]) => {
                        const isHighest = score === item.maxScore;
                        const barColor = isHighest ? strengthColor : '#e0e0e0';
                        const textColor = isHighest ? '#2c3e50' : '#666';
                        const barWidth = Math.max(10, (score / 15) * 100); // Assuming max score is 15
                        
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


function renderStandardizationInsightsCharts() {
    cleanupFocusTooltips();
    console.log('Rendering standardization insights charts...');
    setTimeout(() => renderAreaOfFocusChart(), 100);
    setTimeout(() => renderWhatTheyDidWellChart(), 200);
}

// Update standardization metrics
function updateStandardizationMetrics() {
    console.log('Updating standardization metrics...');
    
    const filteredData = getFilteredStandardizationData();
    console.log('Filtered standardization data count:', filteredData.length);
    
    updateStandardizationKPIs(filteredData);
    
    // Re-render charts for active tab
    const activeTab = document.querySelector('#standardizationPage .tab.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        setTimeout(() => {
            if (tabName === 'standardization-overview') {
                renderStandardizationOverviewCharts();
            } else if (tabName === 'standardization-insights') {
                renderStandardizationInsightsCharts();
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
    
    // Render appropriate charts
    setTimeout(() => {
        if (tabName === 'standardization-overview') {
            renderStandardsOverviewChart();
            renderStandardsDistributionChart();
            renderMaturityCorrelationChart();
        } else if (tabName === 'standardization-insights') {
            renderAreaOfFocusChart();
            renderWhatTheyDidWellChart();
        }
    }, 300);
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