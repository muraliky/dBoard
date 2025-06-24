// Automation Metrics JavaScript - Fixed for Chart Display and Responsiveness
let automationData = [];
let automationCharts = {};

// Chart.js defaults for automation charts
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Base chart options for automation charts
const automationBaseOptions = {
   responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 25, // Increased for data labels
            bottom: 10,
            left: 10,
            right: 10
        }
    },
    plugins: {
        legend: {
            labels: {
                usePointStyle: true,
                padding: 15,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            titleFont: {
                size: 14
            },
            bodyFont: {
                size: 12
            },
            padding: 12,
            cornerRadius: 8
        },
        customDataLabels: {
            enabled: true
        }
    },
    scales: {
        x: {
            ticks: {
                maxRotation: 45,
                font: {
                    size: 11
                }
            },
            grid: {
                display: false
            }
        },
        y: {
            display: false, // Hide Y-axis
            beginAtZero: true,
            ticks: {
                display: false
            },
            grid: {
                display: false
            }
        }
    }
};

// Utility function for responsive font sizes
function getAutomationResponsiveFontSize() {
    const width = window.innerWidth;
    if (width < 480) return 10;
    if (width < 768) return 11;
    if (width < 1200) return 12;
    return 12;
}

// Utility function to safely destroy automation charts
function safeDestroyAutomationChart(chartKey) {
    if (automationCharts[chartKey]) {
        try {
            automationCharts[chartKey].destroy();
        } catch (error) {
            console.warn(`Error destroying automation chart ${chartKey}:`, error);
        }
        delete automationCharts[chartKey];
    }
}

// Initialize Automation Page - Called when switching to automation page
function initializeAutomationPage() {
    console.log('Initializing Automation Page...');
    
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupAutomationPage();
        });
    } else {
        setupAutomationPage();
    }
}

function setupAutomationPage() {
    // Initialize tabs
    initializeAutomationTabs();
    
    // Load automation data
    loadAutomationData();
    
    // Set up filter listeners for automation page
    setupAutomationFilterListeners();
}

// Initialize automation tabs
function initializeAutomationTabs() {
    const automationTabs = document.querySelectorAll('#automationPage .tab');
    
    automationTabs.forEach(tab => {
        // Remove existing listeners
        tab.replaceWith(tab.cloneNode(true));
    });
    
    // Add fresh listeners
    document.querySelectorAll('#automationPage .tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchAutomationTab(tabName);
        });
    });
}

// Switch automation tabs
function switchAutomationTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('#automationPage .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`#automationPage [data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update tab content
    document.querySelectorAll('#automationPage .tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.style.display = 'block';
    }
    
    // Force chart rendering with a delay to ensure DOM is ready
    setTimeout(() => {
        renderChartsForTab(tabName);
    }, 300);
}

// Render charts based on active tab
function renderChartsForTab(tabName) {
    console.log('Rendering charts for tab:', tabName);
    
    // Destroy all existing automation charts first
    Object.keys(automationCharts).forEach(key => {
        safeDestroyAutomationChart(key);
    });
    
    if (tabName === 'automation-overview') {
        renderAutomationOverviewCharts();
    } else if (tabName === 'automation-efficiency') {
        renderAutomationEfficiencyCharts();
    } else if (tabName === 'automation-insights') {
        renderAutomationInsightsCharts();
    }
}

// Setup filter listeners specifically for automation page
function setupAutomationFilterListeners() {
    const groupFilter = document.getElementById('groupFilter');
    const subGroupFilter = document.getElementById('subGroupFilter');
    const monthFilter = document.getElementById('monthFilter');
    
    if (groupFilter && !groupFilter.hasAttribute('automation-listener')) {
        groupFilter.setAttribute('automation-listener', 'true');
        groupFilter.addEventListener('change', function() {
            if (currentPage === 'automation') {
                updateAutomationMetrics();
            }
        });
    }
    
    if (subGroupFilter && !subGroupFilter.hasAttribute('automation-listener')) {
        subGroupFilter.setAttribute('automation-listener', 'true');
        subGroupFilter.addEventListener('change', function() {
            if (currentPage === 'automation') {
                updateAutomationMetrics();
            }
        });
    }
    
    if (monthFilter && !monthFilter.hasAttribute('automation-listener')) {
        monthFilter.setAttribute('automation-listener', 'true');
        monthFilter.addEventListener('change', function() {
            if (currentPage === 'automation') {
                updateAutomationMetrics();
            }
        });
    }
}

// Load automation data
async function loadAutomationData() {
    console.log('Loading automation data...');
    
    try {
        const res = await fetch('data/Automation.json');
        const jsonData = await res.json();

        // Optional: flatten if jsonData is an object with sheets
        const flatData = Array.isArray(jsonData)
        ? jsonData
        : Object.values(jsonData).flat();

        automationData = flatData.map(row => ({
            group: row.Group || '',
            subGroup: row['Sub Group'] || '',
            application: (row[' Application name'] || '').trim(),
            month: row.Month || '',
            totalManualCases: parseInt(row['Total Manual Regression Cases']) || 0,
            totalAutomated: parseInt(row['Toatl Automated']) || 0,
            newScriptsAutomated: parseInt(row['New scripts Automated']) || 0,
            targetAutomation: parseInt(row['Target % Automation 2025']) || 90,
            actualAutomation: parseInt(row['Actual % of cases automated']) || 0,
            effortsSaved: parseInt(row['Efforts Saved (.hrs)']) || 0
        }));
    } catch (error) {
        console.log('Error loading data, using sample:', error);
        automationData = generateAutomationSampleData();
    }
    
    console.log('Automation data loaded:', automationData.length, 'records');
    updateAutomationMetrics();
}

// Generate sample data
function generateAutomationSampleData() {
    const groups = ['WIM', 'CSBB', 'Credit Solutions', 'Payments', 'London UAT'];
    const subGroups = {
        'WIM': ['PMP', 'MM', 'AOM', 'AgentDesktop'],
        'CSBB': ['CSBB1.0', 'CSBB2.0', 'CSBB3.0', 'CSBB4.0'],
        'Credit Solutions': ['1view', '1Click', 'Data', 'Test4'],
        'Payments': ['Pega', 'Payment Gateway', 'Settlement'],
        'London UAT': ['London1', 'London2']
    };
    
    const data = [];
    const months = ['June'];
    
    groups.forEach(group => {
        if (subGroups[group]) {
            subGroups[group].forEach(subGroup => {
                months.forEach(month => {
                    const totalManual = Math.floor(Math.random() * 200) + 150;
                    const totalAutomated = Math.floor(Math.random() * totalManual * 0.7);
                    data.push({
                        group: group,
                        subGroup: subGroup,
                        application: `${subGroup}App`,
                        month: month,
                        totalManualCases: totalManual,
                        totalAutomated: totalAutomated,
                        newScriptsAutomated: Math.floor(Math.random() * 10) + 1,
                        targetAutomation: 90,
                        actualAutomation: Math.round((totalAutomated / totalManual) * 100),
                        effortsSaved: Math.floor(totalAutomated * 5.5)
                    });
                });
            });
        }
    });
    
    return data;
}

// Get filtered automation data
function getFilteredAutomationData() {
    if (typeof filters !== 'undefined') {
        return automationData.filter(d => {
            const matchGroup = !filters.group || d.group === filters.group;
            const matchSubGroup = !filters.subGroup || d.subGroup === filters.subGroup;
            const matchMonth = !filters.month || d.month === filters.month;
            return matchGroup && matchSubGroup && matchMonth;
        });
    }
    return automationData;
}

// Update automation metrics
function updateAutomationMetrics() {
    console.log('Updating automation metrics...');
    
    const filteredData = getFilteredAutomationData();
    console.log('Filtered data count:', filteredData.length);
    
    // Update KPIs
    updateAutomationKPIs(filteredData);
    
    // Get current active tab
    const activeTab = document.querySelector('#automationPage .tab.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        setTimeout(() => {
            renderChartsForTab(tabName);
        }, 200);
    }
}

// Update KPIs
function updateAutomationKPIs(data) {
    const totalManual = data.reduce((sum, d) => sum + d.totalManualCases, 0);
    const totalAutomated = data.reduce((sum, d) => sum + d.totalAutomated, 0);
    const totalEffortsSaved = data.reduce((sum, d) => sum + d.effortsSaved, 0);
    const totalNewScripts = data.reduce((sum, d) => sum + d.newScriptsAutomated, 0);
    const coverageRate = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
    
    const elements = {
        'totalTestCases': totalManual.toLocaleString(),
        'automatedCases': totalAutomated.toLocaleString(),
        'coverageRate': coverageRate + '%',
        'newScripts': totalNewScripts,
        'hoursSaved': totalEffortsSaved.toLocaleString()
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Overview Charts
function renderAutomationOverviewCharts() {
    console.log('Rendering overview charts...');
    
    // Add delay between charts to ensure proper rendering
    setTimeout(() => renderCoverageByGroupChart(), 100);
    setTimeout(() => renderProgressToTargetChart(), 200);
    setTimeout(() => renderNewScriptsDistChart(), 300);
}

function renderCoverageByGroupChart() {
    const canvas = document.getElementById('coverageByGroupChart');
    if (!canvas) {
        console.error('Coverage chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context for coverage chart');
        return;
    }
    
    safeDestroyAutomationChart('coverageByGroup');
    
    const data = getFilteredAutomationData();
    
    let labels;
    if (typeof filters !== 'undefined' && filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))];
    } else if (typeof filters !== 'undefined' && filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
    const coverageData = labels.map(label => {
        const labelData = data.filter(d => {
            if (typeof filters !== 'undefined' && filters.subGroup) return d.application === label;
            if (typeof filters !== 'undefined' && filters.group) return d.subGroup === label;
            return d.group === label;
        });
        const totalManual = labelData.reduce((sum, d) => sum + d.totalManualCases, 0);
        const totalAutomated = labelData.reduce((sum, d) => sum + d.totalAutomated, 0);
        return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
    });
    
    const fontSize = getAutomationResponsiveFontSize();
    
    try {
        automationCharts.coverageByGroup = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Coverage %',
                    data: coverageData,
                    backgroundColor: coverageData.map(value => {
                        if (value >= 80) return '#27ae60';
                        if (value >= 60) return '#3498db';
                        if (value >= 40) return '#f39c12';
                        return '#e74c3c';
                    }),
                    borderRadius: 5
                }]
            },
            options: {
                ...automationBaseOptions,
                plugins: {
                    ...automationBaseOptions.plugins,
                    legend: {
                        display: false
                    }
                },
                scales: {
                    ...automationBaseOptions.scales,
                    x: {
                        ...automationBaseOptions.scales.x,
                        ticks: {
                            ...automationBaseOptions.scales.x.ticks,
                            maxRotation: window.innerWidth < 768 ? 45 : 30,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    y: {
                        ...automationBaseOptions.scales.y,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: fontSize
                            }
                        }
                    }
                }
            }
        });
        console.log('Coverage chart created successfully');
    } catch (error) {
        console.error('Error creating coverage chart:', error);
    }
}

function renderProgressToTargetChart() {
    const canvas = document.getElementById('progressToTargetChart');
    if (!canvas) {
        console.error('Progress chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context for progress chart');
        return;
    }
    
    safeDestroyAutomationChart('progressToTarget');
    
    const data = getFilteredAutomationData();
    
    let labels, actualCoverage;
    if (typeof filters !== 'undefined' && filters.subGroup) {
        // Show applications when subgroup is selected
        labels = [...new Set(data.map(d => d.application))];
        actualCoverage = labels.map(app => {
            const appData = data.filter(d => d.application === app);
            const totalManual = appData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = appData.reduce((sum, d) => sum + d.totalAutomated, 0);
            return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
        });
    } else if (typeof filters !== 'undefined' && filters.group) {
        // Show subgroups when group is selected
        labels = [...new Set(data.map(d => d.subGroup))];
        actualCoverage = labels.map(subGroup => {
            const subGroupData = data.filter(d => d.subGroup === subGroup);
            const totalManual = subGroupData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = subGroupData.reduce((sum, d) => sum + d.totalAutomated, 0);
            return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
        });
    } else {
        // Show groups by default
        labels = [...new Set(data.map(d => d.group))];
        actualCoverage = labels.map(group => {
            const groupData = data.filter(d => d.group === group);
            const totalManual = groupData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = groupData.reduce((sum, d) => sum + d.totalAutomated, 0);
            return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
        });
    }
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
    const fontSize = getAutomationResponsiveFontSize();
    
    try {
        automationCharts.progressToTarget = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Actual Coverage',
                    data: actualCoverage,
                    backgroundColor: actualCoverage.map(value => {
                        if (value >= 90) return '#27ae60';
                        if (value >= 70) return '#3498db';
                        if (value >= 50) return '#f39c12';
                        return '#e74c3c';
                    }),
                    borderRadius: 5
                }, {
                    label: 'Target (90%)',
                    data: labels.map(() => 90),
                    type: 'line',
                    borderColor: '#c41e3a',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#c41e3a',
                    pointBorderColor: '#c41e3a',
                    pointRadius: 4,
                    tension: 0
                }]
            },
            options: {
                ...automationBaseOptions,
                plugins: {
                    ...automationBaseOptions.plugins,
                    legend: {
                        ...automationBaseOptions.plugins.legend,
                        position: window.innerWidth < 768 ? 'bottom' : 'top',
                        labels: {
                            ...automationBaseOptions.plugins.legend.labels,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    tooltip: {
                        ...automationBaseOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    const gap = 90 - context.parsed.y;
                                    return [
                                        'Actual: ' + context.parsed.y + '%',
                                        'Gap: ' + gap + '%'
                                    ];
                                }
                                return 'Target: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    ...automationBaseOptions.scales,
                    x: {
                        ...automationBaseOptions.scales.x,
                        ticks: {
                            ...automationBaseOptions.scales.x.ticks,
                            maxRotation: window.innerWidth < 768 ? 45 : 30,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    y: {
                        ...automationBaseOptions.scales.y,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: fontSize
                            }
                        }
                    }
                }
            }
        });
        console.log('Progress chart created successfully');
    } catch (error) {
        console.error('Error creating progress chart:', error);
    }
}

function renderNewScriptsDistChart() {
    const canvas = document.getElementById('newScriptsDistChart');
    if (!canvas) {
        console.error('New scripts chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    safeDestroyAutomationChart('newScriptsDist');
    
    const data = getFilteredAutomationData();
    
    let labels, newScriptsData;
    if (typeof filters !== 'undefined' && filters.subGroup) {
        // Show applications when subgroup is selected
        labels = [...new Set(data.map(d => d.application))];
        newScriptsData = labels.map(app => {
            return data.filter(d => d.application === app)
                .reduce((sum, d) => sum + d.newScriptsAutomated, 0);
        });
    } else if (typeof filters !== 'undefined' && filters.group) {
        // Show subgroups when group is selected
        labels = [...new Set(data.map(d => d.subGroup))];
        newScriptsData = labels.map(subGroup => {
            return data.filter(d => d.subGroup === subGroup)
                .reduce((sum, d) => sum + d.newScriptsAutomated, 0);
        });
    } else {
        // Show groups by default
        labels = [...new Set(data.map(d => d.group))];
        newScriptsData = labels.map(group => {
            return data.filter(d => d.group === group)
                .reduce((sum, d) => sum + d.newScriptsAutomated, 0);
        });
    }
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
    const fontSize = getAutomationResponsiveFontSize();
    
    try {
        automationCharts.newScriptsDist = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'New Scripts Automated',
                    data: newScriptsData,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                ...automationBaseOptions,
                plugins: {
                    ...automationBaseOptions.plugins,
                    legend: {
                        display: false
                    },
                    tooltip: {
                        ...automationBaseOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const scripts = context.parsed.y;
                                const estimatedHours = scripts * 40; // Assume 40 hours per script
                                return [
                                    'Scripts: ' + scripts,
                                    'Est. Effort: ' + estimatedHours + ' hours'
                                ];
                            }
                        }
                    }
                },
                scales: {
                    ...automationBaseOptions.scales,
                    x: {
                        ...automationBaseOptions.scales.x,
                        ticks: {
                            ...automationBaseOptions.scales.x.ticks,
                            maxRotation: window.innerWidth < 768 ? 45 : 30,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    y: {
                        ...automationBaseOptions.scales.y,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: fontSize
                            }
                        }
                    }
                }
            }
        });
        console.log('New script distribution chart created successfully');
    } catch (error) {
        console.error('Error creating new scripts chart:', error);
    }
}

// Efficiency Charts
function renderAutomationEfficiencyCharts() {
    console.log('Rendering efficiency charts...');
    
    setTimeout(() => renderEffortsByGroupChart(), 100);
    setTimeout(() => renderEfficiencyMatrix(), 200);
}

function renderEffortsByGroupChart() {
    const canvas = document.getElementById('effortsByGroupChart');
    if (!canvas) {
        console.error('Efforts chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Completely destroy existing chart
    if (automationCharts.effortsByGroup) {
        automationCharts.effortsByGroup.destroy();
        delete automationCharts.effortsByGroup;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const data = getFilteredAutomationData();
    const groups = [...new Set(data.map(d => d.group))];
    const effortsData = groups.map(group => {
        return data.filter(d => d.group === group)
            .reduce((sum, d) => sum + d.effortsSaved, 0);
    });
    
    const totalHours = effortsData.reduce((sum, hours) => sum + hours, 0);
    const fontSize = getAutomationResponsiveFontSize();
    
    try {
        automationCharts.effortsByGroup = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: groups.map((group, index) => {
                    const hours = effortsData[index];
                    const displayHours = hours >= 1000 ? (hours/1000).toFixed(1) + 'K' : hours.toLocaleString();
                    return `${group} (${displayHours}h)`;
                }),
                datasets: [{
                    data: effortsData,
                    backgroundColor: ['#c41e3a', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // Disable animations
                plugins: {
                    legend: {
                        position: window.innerWidth < 768 ? 'bottom' : 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: fontSize }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const hours = context.parsed;
                                const cost = hours * 50;
                                const percentage = ((hours / totalHours) * 100).toFixed(1);
                                return [
                                    context.label + ' (' + percentage + '%)',
                                    'Cost Saved: $' + cost.toLocaleString()
                                ];
                            }
                        }
                    },
                    // DISABLE ALL CENTER TEXT PLUGINS
                    datalabels: false,
                    centerText: false,
                    chartCenterText: false,
                    pieceLabel: false,
                    customDataLabels: false,
                    enhancedDataLabels: false
                },
                layout: { padding: 20 }
            },
            plugins: [{
                id: 'preventCenterText',
                beforeDraw: function(chart) {
                    const ctx = chart.ctx;
                    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                    const radius = chart.innerRadius;
                    
                    ctx.save();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.restore();
                },
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                    const radius = chart.innerRadius * 0.95;
                    
                    ctx.save();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.restore();
                }
            }]
        });
        console.log('Efforts chart created successfully');
    } catch (error) {
        console.error('Error creating efforts chart:', error);
    }
}


function renderEfficiencyMatrix() {
    console.log('Starting renderEfficiencyMatrix...');
    
    // First, try to find existing canvas
    let canvas = document.getElementById('efficiencyMatrixChart');
    
    // If canvas doesn't exist, create it in the existing div
    if (!canvas) {
        console.log('Canvas not found, creating it...');
        const container = document.getElementById('efficiencyMatrix');
        if (!container) {
            console.error('Neither canvas nor container found');
            return;
        }
        
        // Clear the container and add canvas
        container.innerHTML = '<canvas id="efficiencyMatrixChart" style="width: 100%; height: 400px;"></canvas>';
        canvas = document.getElementById('efficiencyMatrixChart');
    }
    
    if (!canvas) {
        console.error('Failed to create canvas');
        return;
    }
    
    console.log('Canvas ready:', canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context from canvas');
        return;
    }
    
    // Destroy existing chart if it exists
    safeDestroyAutomationChart('efficiencyMatrix');
    
    // Get filtered data
    const data = getFilteredAutomationData();
    console.log('Filtered data:', data.length, 'records');
    
    if (data.length === 0) {
        console.warn('No data available for efficiency matrix');
        return;
    }
    
    let items;
    try {
        // Determine what to show based on filters
        if (typeof filters !== 'undefined' && filters.subGroup) {
            console.log('Showing applications for subGroup:', filters.subGroup);
            const apps = [...new Set(data.map(d => d.application))];
            items = apps.map(app => {
                const appData = data.filter(d => d.application === app);
                const totalManual = appData.reduce((sum, d) => sum + (d.totalManualCases || 0), 0);
                const totalAutomated = appData.reduce((sum, d) => sum + (d.totalAutomated || 0), 0);
                const totalHours = appData.reduce((sum, d) => sum + (d.effortsSaved || 0), 0);
                const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
                const efficiency = totalAutomated > 0 ? parseFloat((totalHours / totalAutomated).toFixed(1)) : 0;
                
                return { 
                    name: app, 
                    coverage, 
                    efficiency, 
                    totalAutomated, 
                    totalHours,
                    totalManual 
                };
            });
        } else if (typeof filters !== 'undefined' && filters.group) {
            console.log('Showing subgroups for group:', filters.group);
            const subGroups = [...new Set(data.map(d => d.subGroup))];
            items = subGroups.map(subGroup => {
                const subGroupData = data.filter(d => d.subGroup === subGroup);
                const totalManual = subGroupData.reduce((sum, d) => sum + (d.totalManualCases || 0), 0);
                const totalAutomated = subGroupData.reduce((sum, d) => sum + (d.totalAutomated || 0), 0);
                const totalHours = subGroupData.reduce((sum, d) => sum + (d.effortsSaved || 0), 0);
                const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
                const efficiency = totalAutomated > 0 ? parseFloat((totalHours / totalAutomated).toFixed(1)) : 0;
                
                return { 
                    name: subGroup, 
                    coverage, 
                    efficiency, 
                    totalAutomated, 
                    totalHours,
                    totalManual 
                };
            });
        } else {
            console.log('Showing all groups');
            const groups = [...new Set(data.map(d => d.group))];
            items = groups.map(group => {
                const groupData = data.filter(d => d.group === group);
                const totalManual = groupData.reduce((sum, d) => sum + (d.totalManualCases || 0), 0);
                const totalAutomated = groupData.reduce((sum, d) => sum + (d.totalAutomated || 0), 0);
                const totalHours = groupData.reduce((sum, d) => sum + (d.effortsSaved || 0), 0);
                const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
                const efficiency = totalAutomated > 0 ? parseFloat((totalHours / totalAutomated).toFixed(1)) : 0;
                
                return { 
                    name: group, 
                    coverage, 
                    efficiency, 
                    totalAutomated, 
                    totalHours,
                    totalManual 
                };
            });
        }
        
        console.log('Processed items:', items);
        
        if (items.length === 0) {
            console.warn('No items to display in efficiency matrix');
            return;
        }
        
        const labels = items.map(item => item.name);
        const coverageData = items.map(item => item.coverage);
        const efficiencyData = items.map(item => item.efficiency);
        
        // Truncate labels for mobile
        const truncateLength = window.innerWidth < 768 ? 8 : 15;
        const displayLabels = labels.map(label => 
            label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
        );
        
        console.log('Chart data prepared:', {
            labels: displayLabels,
            coverageData,
            efficiencyData
        });
        
        const fontSize = getAutomationResponsiveFontSize();
        
        // Create the chart
        automationCharts.efficiencyMatrix = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Coverage %',
                    data: coverageData,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1,
                    yAxisID: 'y'
                }, {
                    label: 'Efficiency (hrs/case)',
                    data: efficiencyData,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }]
            },
            options: {
                ...automationBaseOptions,
                plugins: {
                    ...automationBaseOptions.plugins,
                    legend: {
                        ...automationBaseOptions.plugins.legend,
                        position: window.innerWidth < 768 ? 'bottom' : 'top',
                        labels: {
                            ...automationBaseOptions.plugins.legend.labels,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    tooltip: {
                        ...automationBaseOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const item = items[context.dataIndex];
                                if (context.datasetIndex === 0) {
                                    return [
                                        'Coverage: ' + context.parsed.y + '%',
                                        'Automated Cases: ' + item.totalAutomated,
                                        'Total Cases: ' + item.totalManual
                                    ];
                                } else {
                                    return [
                                        'Efficiency: ' + context.parsed.y + ' hrs/case',
                                        'Total Hours Saved: ' + item.totalHours,
                                        'Cost Saved: '  + (item.totalHours * 50).toLocaleString()
                                    ];
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: window.innerWidth < 768 ? 45 : 30,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        max: 100,
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: fontSize
                            }
                        },
                        title: {
                            display: true,
                            text: 'Coverage %',
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value + ' hrs';
                            },
                            font: {
                                size: fontSize
                            }
                        },
                        title: {
                            display: true,
                            text: 'Efficiency (hrs/case)',
                            font: {
                                size: fontSize
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Efficiency matrix chart created successfully');
        
    } catch (error) {
        console.error('Error creating efficiency matrix chart:', error);
        console.error('Error stack:', error.stack);
    }
}

// Insights Charts
function renderAutomationInsightsCharts() {
    console.log('Rendering insights charts...');
    
    setTimeout(() => renderCoverageGapChart(), 100);
    setTimeout(() => renderAutomationMatrix(), 200);
}

function renderCoverageGapChart() {
    const canvas = document.getElementById('coverageGapChart');
    if (!canvas) {
        console.error('Coverage gap chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    safeDestroyAutomationChart('coverageGap');
    
    const data = getFilteredAutomationData();
    
    let labels, gaps, actualCoverage;
    if (typeof filters !== 'undefined' && filters.subGroup) {
        // Show applications when subgroup is selected
        labels = [...new Set(data.map(d => d.application))];
        gaps = labels.map(app => {
            const appData = data.filter(d => d.application === app);
            const totalManual = appData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = appData.reduce((sum, d) => sum + d.totalAutomated, 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            return Math.max(0, 90 - coverage);
        });
        actualCoverage = labels.map(app => {
            const appData = data.filter(d => d.application === app);
            const totalManual = appData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = appData.reduce((sum, d) => sum + d.totalAutomated, 0);
            return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
        });
    } else if (typeof filters !== 'undefined' && filters.group) {
        // Show subgroups when group is selected
        labels = [...new Set(data.map(d => d.subGroup))];
        gaps = labels.map(subGroup => {
            const subGroupData = data.filter(d => d.subGroup === subGroup);
            const totalManual = subGroupData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = subGroupData.reduce((sum, d) => sum + d.totalAutomated, 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            return Math.max(0, 90 - coverage);
        });
        actualCoverage = labels.map(subGroup => {
            const subGroupData = data.filter(d => d.subGroup === subGroup);
            const totalManual = subGroupData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = subGroupData.reduce((sum, d) => sum + d.totalAutomated, 0);
            return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
        });
    } else {
        // Show groups by default
        labels = [...new Set(data.map(d => d.group))];
        gaps = labels.map(group => {
            const groupData = data.filter(d => d.group === group);
            const totalManual = groupData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = groupData.reduce((sum, d) => sum + d.totalAutomated, 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            return Math.max(0, 90 - coverage);
        });
        actualCoverage = labels.map(group => {
            const groupData = data.filter(d => d.group === group);
            const totalManual = groupData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = groupData.reduce((sum, d) => sum + d.totalAutomated, 0);
            return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
        });
    }
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
    const fontSize = getAutomationResponsiveFontSize();
    
    try {
        automationCharts.coverageGap = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Current Coverage',
                    data: actualCoverage,
                    backgroundColor: actualCoverage.map(coverage => {
                        if (coverage >= 80) return '#27ae60';
                        if (coverage >= 60) return '#3498db';
                        if (coverage >= 40) return '#f39c12';
                        return '#e74c3c';
                    }),
                    borderRadius: 5,
                    order: 2
                }, {
                    label: 'Gap to Target (90%)',
                    data: gaps,
                    backgroundColor: gaps.map(gap => {
                        if (gap <= 10) return 'rgba(39, 174, 96, 0.3)';
                        if (gap <= 30) return 'rgba(52, 152, 219, 0.3)';
                        if (gap <= 50) return 'rgba(243, 156, 18, 0.3)';
                        return 'rgba(231, 76, 60, 0.3)';
                    }),
                    borderColor: gaps.map(gap => {
                        if (gap <= 10) return '#27ae60';
                        if (gap <= 30) return '#3498db';
                        if (gap <= 50) return '#f39c12';
                        return '#e74c3c';
                    }),
                    borderWidth: 2,
                    borderRadius: 5,
                    order: 1
                }]
            },
            options: {
                ...automationBaseOptions,
                plugins: {
                    ...automationBaseOptions.plugins,
                    legend: {
                        ...automationBaseOptions.plugins.legend,
                        position: window.innerWidth < 768 ? 'bottom' : 'top',
                        labels: {
                            ...automationBaseOptions.plugins.legend.labels,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    tooltip: {
                        ...automationBaseOptions.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    return 'Current Coverage: ' + context.parsed.y + '%';
                                } else {
                                    const totalCases = data.filter(d => {
                                        if (typeof filters !== 'undefined' && filters.subGroup) return d.application === labels[context.dataIndex];
                                        if (typeof filters !== 'undefined' && filters.group) return d.subGroup === labels[context.dataIndex];
                                        return d.group === labels[context.dataIndex];
                                    }).reduce((sum, d) => sum + d.totalManualCases, 0);
                                    const potentialCases = Math.round(totalCases * (context.parsed.y / 100));
                                    return [
                                        'Gap: ' + context.parsed.y + '%',
                                        'Potential Cases: ' + potentialCases,
                                        'Est. Hours: ' + (potentialCases * 5.5).toFixed(0)
                                    ];
                                }
                            }
                        }
                    }
                },
                scales: {
                    ...automationBaseOptions.scales,
                    x: {
                        ...automationBaseOptions.scales.x,
                        ticks: {
                            ...automationBaseOptions.scales.x.ticks,
                            maxRotation: window.innerWidth < 768 ? 45 : 30,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    y: {
                        ...automationBaseOptions.scales.y,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: fontSize
                            }
                        }
                    }
                }
            }
        });
        console.log('Coverage gap chart created successfully');
    } catch (error) {
        console.error('Error creating coverage gap chart:', error);
    }
    
    // Update summary with more detailed insights
    const avgGap = gaps.length > 0 ? gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length : 0;
    const appsNeedingWork = gaps.filter(gap => gap > 30).length;
    const totalPotentialCases = data.reduce((sum, d) => {
        const coverage = d.actualAutomation || 0;
        const gap = Math.max(0, 90 - coverage);
        return sum + Math.round(d.totalManualCases * (gap / 100));
    }, 0);
    const potentialHours = totalPotentialCases * 5.5;
    const potentialSavings = potentialHours * 50;
    
    const summaryElement = document.getElementById('coverageGapSummary');
    if (summaryElement) {
        const isMobile = window.innerWidth < 768;
        summaryElement.innerHTML = `
            <div class="gap-summary-grid" style="${isMobile ? 'grid-template-columns: 1fr 1fr;' : ''}">
                <div class="gap-summary-item">
                    <div class="gap-summary-label">Average Gap</div>
                    <div class="gap-summary-value">${avgGap.toFixed(1)}%</div>
                </div>
                <div class="gap-summary-item">
                    <div class="gap-summary-label">Items Needing Focus</div>
                    <div class="gap-summary-value">${appsNeedingWork}</div>
                </div>
                <div class="gap-summary-item">
                    <div class="gap-summary-label">Potential Cases</div>
                    <div class="gap-summary-value">${totalPotentialCases}</div>
                </div>
                <div class="gap-summary-item">
                    <div class="gap-summary-label">Potential Savings</div>
                    <div class="gap-summary-value">${potentialSavings.toLocaleString()}</div>
                </div>
            </div>
        `;
    }
}

function renderAutomationMatrix() {
    console.log('Rendering automation opportunity areas...');
    
    const canvas = document.getElementById('coverageGapChart1');
    if (!canvas) {
        console.error('Automation opportunity areas canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    safeDestroyAutomationChart('opportunity');
    
    const data = getFilteredAutomationData();
    
    // Filter for coverage < 50%
    const lowCoverageData = data.filter(d => {
        const coverage = d.actualAutomation || 0;
        return coverage < 50;
    });
    
    console.log(`Found ${lowCoverageData.length} opportunity areas`);
    
    if (lowCoverageData.length === 0) {
        const container = canvas.parentElement;
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #27ae60;">
                <h3>Excellent Coverage!</h3>
                <p>All areas have ≥50% automation coverage</p>
            </div>
        `;
        return;
    }
    
    let items;
    
    // Group data based on current filters
    if (typeof filters !== 'undefined' && filters.subGroup) {
        // Show applications
        const apps = [...new Set(lowCoverageData.map(d => d.application))];
        items = apps.map(app => {
            const appData = lowCoverageData.filter(d => d.application === app);
            const totalManual = appData.reduce((sum, d) => sum + (d.totalManualCases || 0), 0);
            const totalAutomated = appData.reduce((sum, d) => sum + (d.totalAutomated || 0), 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            const potentialCases = totalManual - totalAutomated;
            
            return {
                name: app,
                coverage,
                potentialCases,
                totalManual
            };
        });
    } else if (typeof filters !== 'undefined' && filters.group) {
        // Show subgroups
        const subGroups = [...new Set(lowCoverageData.map(d => d.subGroup))];
        items = subGroups.map(subGroup => {
            const subGroupData = lowCoverageData.filter(d => d.subGroup === subGroup);
            const totalManual = subGroupData.reduce((sum, d) => sum + (d.totalManualCases || 0), 0);
            const totalAutomated = subGroupData.reduce((sum, d) => sum + (d.totalAutomated || 0), 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            const potentialCases = totalManual - totalAutomated;
            
            return {
                name: subGroup,
                coverage,
                potentialCases,
                totalManual
            };
        });
    } else {
        // Show groups
        const groups = [...new Set(lowCoverageData.map(d => d.group))];
        items = groups.map(group => {
            const groupData = lowCoverageData.filter(d => d.group === group);
            const totalManual = groupData.reduce((sum, d) => sum + (d.totalManualCases || 0), 0);
            const totalAutomated = groupData.reduce((sum, d) => sum + (d.totalAutomated || 0), 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            const potentialCases = totalManual - totalAutomated;
            
            return {
                name: group,
                coverage,
                potentialCases,
                totalManual
            };
        });
    }
    
    // Sort by lowest coverage first (biggest opportunities)
    items.sort((a, b) => a.coverage - b.coverage);
    
    if (items.length === 0) {
        const container = canvas.parentElement;
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #27ae60;">
                <h3>Great Coverage!</h3>
                <p>No opportunity areas in current selection</p>
            </div>
        `;
        return;
    }
    
    const labels = items.map(item => item.name);
    const coverageData = items.map(item => item.coverage);
    const potentialData = items.map(item => item.potentialCases);
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
    const fontSize = getAutomationResponsiveFontSize();
    
    try {
        automationCharts.opportunity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Current Coverage %',
                    data: coverageData,
                    backgroundColor: coverageData.map(coverage => {
                        if (coverage < 20) return '#e74c3c'; // Critical - Red
                        if (coverage < 35) return '#f39c12'; // High opportunity - Orange
                        return '#3498db'; // Moderate opportunity - Blue
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                ...automationBaseOptions,
                plugins: {
                    ...automationBaseOptions.plugins,
                    legend: {
                        display: false
                    },
                    tooltip: {
                        ...automationBaseOptions.plugins.tooltip,
                        callbacks: {
                            title: function(context) {
                                return labels[context[0].dataIndex] + ' - Opportunity Area';
                            },
                            label: function(context) {
                                const item = items[context.dataIndex];
                                const potentialSavings = item.potentialCases * 5.5 * 50; // 5.5 hrs/case * $50/hr
                                return [
                                    'Current Coverage: ' + context.parsed.y + '%',
                                    'Potential Cases: ' + item.potentialCases,
                                    'Total Cases: ' + item.totalManual
                                ];
                            }
                        }
                    }
                },
                scales: {
                    ...automationBaseOptions.scales,
                    x: {
                        ...automationBaseOptions.scales.x,
                        ticks: {
                            ...automationBaseOptions.scales.x.ticks,
                            maxRotation: window.innerWidth < 768 ? 45 : 30,
                            font: {
                                size: fontSize
                            }
                        }
                    },
                    y: {
                        ...automationBaseOptions.scales.y,
                        max: 50,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: fontSize
                            }
                        },
                        title: {
                            display: true,
                            text: 'Current Automation Coverage %',
                            font: {
                                size: fontSize
                            }
                        }
                    }
                }
            }
        });
        
        // Add simple summary below chart
        const totalPotential = items.reduce((sum, item) => sum + item.potentialCases, 0);
        const totalSavings = totalPotential * 5.5 * 50;
        
        const container = canvas.parentElement;
        const existingSummary = container.querySelector('.opportunity-summary');
        if (existingSummary) {
            existingSummary.remove();
        }
        
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'opportunity-summary';
        summaryDiv.innerHTML = `
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                <strong style="color: #c41e3a;">${items.length} Opportunity Areas Found</strong><br>
                <span style="color: #666; font-size: 14px;">
                    ${totalPotential.toLocaleString()} potential cases • 
                    ${totalSavings.toLocaleString()} potential savings
                </span>
            </div>
        `;
        container.appendChild(summaryDiv);
        
        console.log('Opportunity areas chart created successfully');
        
    } catch (error) {
        console.error('Error creating opportunity chart:', error);
    }
}

// Resize handler for automation charts
function handleAutomationChartResize() {
    // Update font sizes based on current window size
    const fontSize = getAutomationResponsiveFontSize();
    
    // Get current active tab
    const activeTab = document.querySelector('#automationPage .tab.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        
        // Add a small delay to ensure DOM has updated
        setTimeout(() => {
            renderChartsForTab(tabName);
        }, 100);
    }
}

// Add resize listener for automation charts
if (typeof window !== 'undefined') {
    window.addEventListener('resize', debounce(handleAutomationChartResize, 300));
}

// Function to update all visible automation charts
function updateVisibleAutomationCharts() {
    Object.keys(automationCharts).forEach(key => {
        const canvas = document.getElementById(key + 'Chart') || document.getElementById(key);
        if (canvas && isElementVisible(canvas) && automationCharts[key]) {
            try {
                automationCharts[key].update('none'); // Update without animation for performance
            } catch (error) {
                console.warn(`Error updating automation chart ${key}:`, error);
            }
        }
    });
}

// Function to check if element is visible (reuse from main charts)
function isElementVisible(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for resize events (reuse from main charts)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAutomationPage,
        updateAutomationMetrics,
        renderChartsForTab,
        handleAutomationChartResize,
        updateVisibleAutomationCharts,
        automationCharts
    };
} 