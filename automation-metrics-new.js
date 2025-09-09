// automation-json.js - Enhanced Automation Metrics for JSON Data
let automationData = [];
let automationCharts = {};

// Chart.js defaults
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Base chart options
const automationBaseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: { top: 25, bottom: 10, left: 10, right: 10 }
    },
    plugins: {
        legend: {
            labels: { usePointStyle: true, padding: 15, font: { size: 12 } }
        },
        tooltip: {
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 8
        }
    }
};

// Load automation data from JSON
async function loadAutomationData() {
    console.log('Loading automation metrics data from JSON...');
    
    try {
        const res = await fetch('data/Automation.json');
        const jsonData = await res.json();

        const flatData = Array.isArray(jsonData) ? jsonData : Object.values(jsonData).flat();

        automationData = flatData.map(row => ({
            // Basic Information
            serialNo: parseInt(row['S.No']) || 0,
            area: row['Area'] || '',
            subArea: row['Sub Area'] || '',
            applicationName: (row['Application Name'] || '').trim(),
            typeOfApplication: row['Type of Application'] || '',
            
            // Readiness Indicators
            regressionSuiteAvailable: row['Functional Regression Suite Available?'] || 'No',
            automationStarted: row['Is Regression Test Automation Started? '] || 'No',
            vulcanIntegration: row['Vulcan Integration'] || 'No',
            
            // Manual Test Cases by Priority
            manualCritical: parseInt(row['Number of Manual Regression Test Cases Critical']) || 0,
            manualHigh: parseInt(row['Number of Manual Regression Test Cases High']) || 0,
            manualMedium: parseInt(row['Number of Manual Regression Test Cases Medium']) || 0,
            manualLow: parseInt(row['Number of Manual Regression Test Cases Low']) || 0,
            
            // Automated Test Cases by Priority
            automatedCritical: parseInt(row['Number of Automation Test Cases Critical ']) || 0,
            automatedHigh: parseInt(row['Number of Automation Test Cases High ']) || 0,
            automatedMedium: parseInt(row['Number of Automation Test Cases Medium ']) || 0,
            automatedLow: parseInt(row['Number of Automation Test Cases Low ']) || 0,
            
            // Summary Metrics
            totalManualCases: parseInt(row['Total Manual Cases']) || 0,
            totalAutomatableCases: parseInt(row['Total Automatable Cases']) || 0,
            totalAutomatedTillDate: parseInt(row['Total automated till date']) || 0,
            automationCoverage: parseInt(row['% Automation Coverage']) || 0,
            
            // Time and Cost Metrics
            manualExecutionHours: parseFloat(row['Manual Execution in hours']) || 0,
            automationExecutionHours: parseFloat(row['Automation Execution in Hours']) || 0,
            saveInHours: parseFloat(row['Save in hours']) || 0
        }));

    } catch (error) {
        console.log('Error loading automation data, using sample:', error);
        automationData = generateAutomationSampleData();
    }
    
    console.log('Automation data loaded:', automationData.length, 'records');
    updateAutomationMetrics();
}

// Generate sample data matching Excel structure
function generateAutomationSampleData() {
    const areas = ["WIM", "CSBB", "Credit Solutions", "Payments", "London UAT"];
    const subAreas = {
        "WIM": ["Digital", "Legacy", "Mobile", "API"],
        "CSBB": ["Core Banking", "Customer Portal", "Analytics", "Reporting"],
        "Credit Solutions": ["Loan Processing", "Risk Assessment", "Collections"],
        "Payments": ["Gateway", "Settlement", "Reconciliation"],
        "London UAT": ["Trading", "Compliance"]
    };
    
    const data = [];
    let serialNo = 1;
    
    areas.forEach(area => {
        subAreas[area].forEach(subArea => {
            for (let i = 1; i <= 3; i++) {
                const criticalManual = Math.floor(Math.random() * 50) + 20;
                const highManual = Math.floor(Math.random() * 80) + 40;
                const mediumManual = Math.floor(Math.random() * 120) + 60;
                const lowManual = Math.floor(Math.random() * 100) + 50;
                const totalManual = criticalManual + highManual + mediumManual + lowManual;
                
                const criticalAuto = Math.floor(criticalManual * (0.6 + Math.random() * 0.3));
                const highAuto = Math.floor(highManual * (0.5 + Math.random() * 0.4));
                const mediumAuto = Math.floor(mediumManual * (0.3 + Math.random() * 0.4));
                const lowAuto = Math.floor(lowManual * (0.2 + Math.random() * 0.3));
                const totalAutomated = criticalAuto + highAuto + mediumAuto + lowAuto;
                
                const manualHours = Math.floor(totalManual * 0.5);
                const autoHours = Math.floor(totalAutomated * 0.1);
                
                data.push({
                    serialNo: serialNo++,
                    area,
                    subArea,
                    applicationName: `${subArea} ${['Core', 'Portal', 'API', 'Mobile'][i-1] || 'System'}`,
                    typeOfApplication: ["Web/Desktop", "Mobile", "API", "Batch"][Math.floor(Math.random() * 4)],
                    regressionSuiteAvailable: Math.random() > 0.2 ? "Yes" : "No",
                    automationStarted: Math.random() > 0.3 ? "Yes" : "No",
                    vulcanIntegration: Math.random() > 0.4 ? "Yes" : "No",
                    manualCritical: criticalManual,
                    manualHigh: highManual,
                    manualMedium: mediumManual,
                    manualLow: lowManual,
                    automatedCritical: criticalAuto,
                    automatedHigh: highAuto,
                    automatedMedium: mediumAuto,
                    automatedLow: lowAuto,
                    totalManualCases: totalManual,
                    totalAutomatableCases: Math.floor(totalManual * 0.8),
                    totalAutomatedTillDate: totalAutomated,
                    automationCoverage: Math.round((totalAutomated / totalManual) * 100),
                    manualExecutionHours: manualHours,
                    automationExecutionHours: autoHours,
                    saveInHours: manualHours - autoHours
                });
            }
        });
    });
    
    return data;
}

// Get filtered data
function getFilteredAutomationData() {
    if (typeof filters !== 'undefined') {
        return automationData.filter(d => {
            const matchGroup = !filters.group || d.area === filters.group;
            const matchSubGroup = !filters.subGroup || d.subArea === filters.subGroup;
            return matchGroup && matchSubGroup;
        });
    }
    return automationData;
}

// Update KPIs
function updateAutomationKPIs(data) {
    const totalManual = data.reduce((sum, d) => sum + d.totalManualCases, 0);
    const totalAutomated = data.reduce((sum, d) => sum + d.totalAutomatedTillDate, 0);
    const totalHoursSaved = data.reduce((sum, d) => sum + d.saveInHours, 0);
    const automationStarted = data.filter(d => d.automationStarted === 'Yes').length;
    const averageCoverage = data.length > 0 ? 
        Math.round(data.reduce((sum, d) => sum + d.automationCoverage, 0) / data.length) : 0;
    
    const elements = {
        'totalTestCases': totalManual.toLocaleString(),
        'automatedCases': totalAutomated.toLocaleString(),
        'coverageRate': averageCoverage + '%',
        'newScripts': automationStarted,
        'hoursSaved': totalHoursSaved.toLocaleString()
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// 1. Automation Readiness by Area - STACKED BAR CHART
function renderAutomationReadinessMatrix() {
    const canvas = document.getElementById('coverageByGroupChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyAutomationChart('automationReadiness');
    
    const data = getFilteredAutomationData();
    const areas = [...new Set(data.map(d => d.area))];
    
    // Calculate readiness counts for each area
    const regressionSuiteData = areas.map(area => {
        const areaData = data.filter(d => d.area === area);
        return areaData.filter(d => d.regressionSuiteAvailable === 'Yes').length;
    });
    
    const automationStartedData = areas.map(area => {
        const areaData = data.filter(d => d.area === area);
        return areaData.filter(d => d.automationStarted === 'Yes').length;
    });
    
    const vulcanIntegratedData = areas.map(area => {
        const areaData = data.filter(d => d.area === area);
        return areaData.filter(d => d.vulcanIntegration === 'Yes').length;
    });
    
    const notReadyData = areas.map(area => {
        const areaData = data.filter(d => d.area === area);
        const total = areaData.length;
        const ready = areaData.filter(d => 
            d.regressionSuiteAvailable === 'Yes' || 
            d.automationStarted === 'Yes' || 
            d.vulcanIntegration === 'Yes'
        ).length;
        return Math.max(0, total - ready);
    });
    
    automationCharts.automationReadiness = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: areas,
            datasets: [{
                label: 'Regression Suite Available',
                data: regressionSuiteData,
                backgroundColor: '#3498db',
                borderRadius: 5,
                borderSkipped: false
            }, {
                label: 'Automation Started',
                data: automationStartedData,
                backgroundColor: '#27ae60',
                borderRadius: 5,
                borderSkipped: false
            }, {
                label: 'Vulcan Integration',
                data: vulcanIntegratedData,
                backgroundColor: '#9b59b6',
                borderRadius: 5,
                borderSkipped: false
            }, {
                label: 'Not Ready',
                data: notReadyData,
                backgroundColor: '#e74c3c',
                borderRadius: 5,
                borderSkipped: false
            }]
        },
        options: {
            ...automationBaseOptions,
            scales: {
                x: {
                    stacked: true,
                    ticks: { font: { size: 11 } }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Applications'
                    },
                    ticks: {
                        stepSize: 1,
                        font: { size: 11 }
                    }
                }
            },
            plugins: {
                ...automationBaseOptions.plugins,
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `${context[0].label} - Readiness Status`;
                        },
                        label: function(context) {
                            const area = areas[context.dataIndex];
                            const areaData = data.filter(d => d.area === area);
                            const total = areaData.length;
                            const percentage = total > 0 ? Math.round((context.parsed.y / total) * 100) : 0;
                            
                            return [
                                `${context.dataset.label}: ${context.parsed.y}`,
                                `${percentage}% of ${total} applications`
                            ];
                        },
                        footer: function(context) {
                            const area = areas[context[0].dataIndex];
                            const areaData = data.filter(d => d.area === area);
                            const readyCount = areaData.filter(d => 
                                d.regressionSuiteAvailable === 'Yes' && 
                                d.automationStarted === 'Yes'
                            ).length;
                            const readyPercentage = areaData.length > 0 ? 
                                Math.round((readyCount / areaData.length) * 100) : 0;
                            
                            return `Fully Ready: ${readyCount} (${readyPercentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 2. Priority Coverage Analysis
function renderPriorityCoverageChart() {
    const canvas = document.getElementById('progressToTargetChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyAutomationChart('priorityCoverage');
    
    const data = getFilteredAutomationData();
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    
    const priorityData = priorities.map(priority => {
        const manualKey = `manual${priority}`;
        const automatedKey = `automated${priority}`;
        
        const totalManual = data.reduce((sum, d) => sum + (d[manualKey] || 0), 0);
        const totalAutomated = data.reduce((sum, d) => sum + (d[automatedKey] || 0), 0);
        const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
        
        return {
            priority,
            coverage,
            manualCount: totalManual,
            automatedCount: totalAutomated
        };
    });
    
    automationCharts.priorityCoverage = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: priorities,
            datasets: [{
                label: 'Coverage %',
                data: priorityData.map(d => d.coverage),
                backgroundColor: priorityData.map(d => {
                    if (d.coverage >= 80) return '#27ae60';
                    if (d.coverage >= 60) return '#3498db';
                    if (d.coverage >= 40) return '#f39c12';
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const priority = priorityData[context.dataIndex];
                            return [
                                `Coverage: ${context.parsed.y}%`,
                                `Automated: ${priority.automatedCount}`,
                                `Manual: ${priority.manualCount}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    max: 100,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) { return value + '%'; }
                    }
                }
            }
        }
    });
}

function renderManualVsAutomatedChart() {
    const canvas = document.getElementById('newScriptsDistChart1');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyAutomationChart('manualVsAutomated');
    
    const data = getFilteredAutomationData();
    
    let labels = [];
    if (filters.group && filters.subGroup) {
        labels = [...new Set(data.map(d => d.applicationName))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subArea))];
    } else {
        labels = [...new Set(data.map(d => d.area))];
    }
    
    const manualCases = labels.map(label => {
        return data.filter(d => {
            if (filters.group && filters.subGroup) return d.applicationName === label;
            if (filters.group) return d.subArea === label;
            return d.area === label;
        }).reduce((sum, d) => sum + d.totalManualCases, 0);
    });
    
    const automatedCases = labels.map(label => {
        return data.filter(d => {
            if (filters.group && filters.subGroup) return d.applicationName === label;
            if (filters.group) return d.subArea === label;
            return d.area === label;
        }).reduce((sum, d) => sum + d.totalAutomatedTillDate, 0);
    });
    
    automationCharts.manualVsAutomated = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Manual Cases',
                data: manualCases,
                backgroundColor: '#e74c3c',
                borderRadius: 5
            }, {
                label: 'Total Automated Cases',
                data: automatedCases,
                backgroundColor: '#27ae60',
                borderRadius: 5
            }]
        },
        options: {
            ...automationBaseOptions,
            plugins: {
                ...automationBaseOptions.plugins,
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const manual = manualCases[context.dataIndex];
                            const automated = automatedCases[context.dataIndex];
                            const coverage = manual > 0 ? Math.round((automated / manual) * 100) : 0;
                            
                            if (context.datasetIndex === 0) {
                                return [
                                    `Manual Cases: ${context.parsed.y.toLocaleString()}`,
                                    `Coverage: ${coverage}%`
                                ];
                            } else {
                                return [
                                    `Automated Cases: ${context.parsed.y.toLocaleString()}`,
                                    `Coverage: ${coverage}%`
                                ];
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { maxRotation: 45, font: { size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Test Cases'
                    },
                    ticks: {
                        callback: function(value) {
                            return value >= 1000 ? (value/1000).toFixed(1) + 'K' : value;
                        }
                    }
                }
            }
        }
    });
}

// 3. Time Savings Analysis
function renderTimeSavingsAnalysis() {
    const canvas = document.getElementById('newScriptsDistChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyAutomationChart('timeSavings');
    
    const data = getFilteredAutomationData();
    
    let labels = [];
    if (filters.group && filters.subGroup) {
        labels = [...new Set(data.map(d => d.applicationName))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subArea))];
    } else {
        labels = [...new Set(data.map(d => d.area))];
    }
    
    const manualHours = labels.map(label => {
        return data.filter(d => {
            if (filters.group && filters.subGroup) return d.applicationName === label;
            if (filters.group) return d.subArea === label;
            return d.area === label;
        }).reduce((sum, d) => sum + d.manualExecutionHours, 0);
    });
    
    const automationHours = labels.map(label => {
        return data.filter(d => {
            if (filters.group && filters.subGroup) return d.applicationName === label;
            if (filters.group) return d.subArea === label;
            return d.area === label;
        }).reduce((sum, d) => sum + d.automationExecutionHours, 0);
    });
    
    const hoursSaved = labels.map(label => {
        return data.filter(d => {
            if (filters.group && filters.subGroup) return d.applicationName === label;
            if (filters.group) return d.subArea === label;
            return d.area === label;
        }).reduce((sum, d) => sum + d.saveInHours, 0);
    });
    
    automationCharts.timeSavings = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Manual Hours',
                data: manualHours,
                backgroundColor: '#e74c3c',
                borderRadius: 5
            }, {
                label: 'Automation Hours',
                data: automationHours,
                backgroundColor: '#3498db',
                borderRadius: 5
            }, {
                label: 'Hours Saved',
                data: hoursSaved,
                type: 'line',
                borderColor: '#27ae60',
                backgroundColor: 'transparent',
                borderWidth: 3,
                pointBackgroundColor: '#27ae60',
                pointRadius: 5,
                yAxisID: 'y1'
            }]
        },
        options: {
            ...automationBaseOptions,
            scales: {
                x: {
                    ticks: { maxRotation: 45, font: { size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Execution Hours' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    title: { display: true, text: 'Hours Saved' },
                    grid: { drawOnChartArea: false }
                }
            },
            plugins: {
                ...automationBaseOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const hours = context.parsed.y;
                            const cost = hours * 50;
                            return [
                                `${context.dataset.label}: ${hours} hours`,
                                `Cost Impact: $${cost.toLocaleString()}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// 4. ROI Efficiency Analysis
function renderROIEfficiencyChart() {
    const canvas = document.getElementById('effortsByGroupChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyAutomationChart('roiEfficiency');
    
    const data = getFilteredAutomationData();
    
    // Determine what level to show based on filters
    let labels = [];
    if (filters.group && filters.subGroup) {
        // Show individual applications when both filters are selected
        labels = [...new Set(data.map(d => d.applicationName))];
    } else if (filters.group) {
        // Show sub areas when only group is selected
        labels = [...new Set(data.map(d => d.subArea))];
    } else {
        // Show areas when no filters are selected
        labels = [...new Set(data.map(d => d.area))];
    }
    
    const labelData = labels.map(label => {
        const labelApps = data.filter(d => {
            if (filters.group && filters.subGroup) return d.applicationName === label;
            if (filters.group) return d.subArea === label;
            return d.area === label;
        });
        
        return {
            label,
            totalSaved: labelApps.reduce((sum, d) => sum + d.saveInHours, 0),
            totalCost: labelApps.reduce((sum, d) => sum + d.saveInHours, 0) * 50
        };
    });
    
    automationCharts.roiEfficiency = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map((label, index) => {
                const hours = labelData[index].totalSaved;
                const displayHours = hours >= 1000 ? (hours/1000).toFixed(1) + 'K' : hours.toLocaleString();
                return `${label} (${displayHours}h)`;
            }),
            datasets: [{
                data: labelData.map(d => d.totalSaved),
                backgroundColor: ['#c41e3a', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#e67e22', '#1abc9c', '#8e44ad'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            ...automationBaseOptions,
            plugins: {
                ...automationBaseOptions.plugins,
                legend: {
                    position: 'right',
                    labels: { usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = labelData[context.dataIndex];
                            return [
                                `${item.label}: ${item.totalSaved} hours`,
                                `Cost Saved: ${item.totalCost.toLocaleString()}`
                            ];
                        }
                    }
                }
            }
        }
    });
}
// 5. Automation Efficiency Matrix
function renderAutomationEfficiencyMatrix() {
    const canvas = document.getElementById('efficiencyMatrixChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyAutomationChart('efficiencyMatrix');
    
    const data = getFilteredAutomationData();
    
    let labels = [];
    if (filters.group && filters.subGroup) {
        labels = [...new Set(data.map(d => d.applicationName))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subArea))];
    } else {
        labels = [...new Set(data.map(d => d.area))];
    }
    
    const coverageData = labels.map(label => {
        const labelData = data.filter(d => {
            if (filters.group && filters.subGroup) return d.applicationName === label;
            if (filters.group) return d.subArea === label;
            return d.area === label;
        });
        
        const totalManual = labelData.reduce((sum, d) => sum + d.totalManualCases, 0);
        const totalAutomated = labelData.reduce((sum, d) => sum + d.totalAutomatedTillDate, 0);
        return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
    });
    
    const totalHoursSavedData = labels.map(label => {
        const labelData = data.filter(d => {
            if (filters.group && filters.subGroup) return d.applicationName === label;
            if (filters.group) return d.subArea === label;
            return d.area === label;
        });
        
        return labelData.reduce((sum, d) => sum + d.saveInHours, 0);
    });
    
    automationCharts.efficiencyMatrix = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Coverage %',
                data: coverageData,
                backgroundColor: '#3498db',
                borderRadius: 5,
                yAxisID: 'y'
            }, {
                label: 'Total Hours Saved',
                data: totalHoursSavedData,
                backgroundColor: '#e74c3c',
                borderRadius: 5,
                yAxisID: 'y1'
            }]
        },
        options: {
            ...automationBaseOptions,
            scales: {
                x: {
                    ticks: { maxRotation: 45 }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    position: 'left',
                    title: { display: true, text: 'Coverage %' },
                    ticks: {
                        callback: function(value) { return value + '%'; }
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: { display: true, text: 'Total Hours Saved' },
                    grid: { drawOnChartArea: false },
                    ticks: {
                        callback: function(value) {
                            return value >= 1000 ? (value/1000).toFixed(1) + 'K' : value;
                        }
                    }
                }
            },
            plugins: {
                ...automationBaseOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Coverage: ${context.parsed.y}%`;
                            } else {
                                const cost = context.parsed.y * 50;
                                return [
                                    `Hours Saved: ${context.parsed.y.toLocaleString()}`,
                                    `Cost Saved: ${cost.toLocaleString()}`
                                ];
                            }
                        }
                    }
                }
            }
        }
    });
}


// 6. Coverage Gap Analysis
function renderCoverageGapChart() {
    const canvas = document.getElementById('coverageGapChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyAutomationChart('coverageGap');
    
    const data = getFilteredAutomationData();
    
    // Determine grouping level based on active filters
    let groupedData = [];
    
    if (filters.group && filters.subGroup) {
        // Show individual applications when both area and sub-area are selected
        groupedData = data
            .filter(d => d.area === filters.group && d.subArea === filters.subGroup)
            .map(d => ({
                name: d.applicationName,
                coverage: d.automationCoverage,
                totalManual: d.totalManualCases,
                totalAutomated: d.totalAutomatedTillDate,
                area: d.area,
                subArea: d.subArea
            }));
    } else if (filters.group) {
        // Show sub-areas when only area is selected
        const subAreas = [...new Set(data.filter(d => d.area === filters.group).map(d => d.subArea))];
        
        groupedData = subAreas.map(subArea => {
            const subAreaData = data.filter(d => d.area === filters.group && d.subArea === subArea);
            const totalManual = subAreaData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = subAreaData.reduce((sum, d) => sum + d.totalAutomatedTillDate, 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            
            return {
                name: subArea,
                coverage,
                totalManual,
                totalAutomated,
                area: filters.group,
                subArea: subArea,
                applicationsCount: subAreaData.length
            };
        });
    } else {
        // Show areas when no filters are selected
        const areas = [...new Set(data.map(d => d.area))];
        
        groupedData = areas.map(area => {
            const areaData = data.filter(d => d.area === area);
            const totalManual = areaData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = areaData.reduce((sum, d) => sum + d.totalAutomatedTillDate, 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            
            return {
                name: area,
                coverage,
                totalManual,
                totalAutomated,
                area: area,
                applicationsCount: areaData.length
            };
        });
    }
    
    // Filter items with coverage gaps (below 90% target)
    const itemsWithGaps = groupedData.filter(d => d.coverage < 90);
    
    if (itemsWithGaps.length === 0) {
        // Display success message when all items meet the 90% target
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#27ae60';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        
        let successMessage = 'All ';
        if (filters.group && filters.subGroup) {
            successMessage += 'applications';
        } else if (filters.group) {
            successMessage += 'sub-areas';
        } else {
            successMessage += 'areas';
        }
        successMessage += ' meet 90% coverage target!';
        
        ctx.fillText(successMessage, canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Sort by coverage (lowest first) and take top 8 for better visibility
    itemsWithGaps.sort((a, b) => a.coverage - b.coverage);
    const displayItems = itemsWithGaps.slice(0, 8);
    
    const labels = displayItems.map(d => d.name);
    const currentCoverage = displayItems.map(d => d.coverage);
    const gaps = displayItems.map(d => Math.max(0, 90 - d.coverage));
    
    automationCharts.coverageGap = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Current Coverage',
                data: currentCoverage,
                backgroundColor: currentCoverage.map(coverage => {
                    if (coverage >= 70) return '#3498db';
                    if (coverage >= 50) return '#f39c12';
                    return '#e74c3c';
                }),
                borderRadius: 5
            }, {
                label: 'Gap to 90% Target',
                data: gaps,
                backgroundColor: 'rgba(231, 76, 60, 0.3)',
                borderColor: '#e74c3c',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            ...automationBaseOptions,
            scales: {
                x: {
                    ticks: { 
                        maxRotation: 45,
                        font: { size: 11 }
                    }
                },
                y: {
                    max: 100,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Coverage Percentage'
                    },
                    ticks: {
                        callback: function(value) { return value + '%'; }
                    }
                }
            },
            plugins: {
                ...automationBaseOptions.plugins,
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const item = displayItems[context[0].dataIndex];
                            let title = item.name;
                            
                            // Add contextual information based on filter level
                            if (filters.group && filters.subGroup) {
                                title += ` (${item.subArea})`;
                            } else if (filters.group) {
                                title += ` (${item.applicationsCount} apps)`;
                            } else {
                                title += ` (${item.applicationsCount} apps)`;
                            }
                            
                            return title;
                        },
                        label: function(context) {
                            const item = displayItems[context.dataIndex];
                            const gapCases = Math.round(item.totalManual * ((90 - item.coverage) / 100));
                            const potentialSavings = gapCases * 0.5 * 50; // Estimated savings per case
                            
                            if (context.datasetIndex === 0) {
                                return [
                                    `Current Coverage: ${context.parsed.y}%`,
                                    `Automated: ${item.totalAutomated.toLocaleString()} cases`,
                                    `Manual: ${item.totalManual.toLocaleString()} cases`
                                ];
                            } else {
                                return [
                                    `Gap to Target: ${context.parsed.y}%`,
                                    `Cases to Automate: ${gapCases.toLocaleString()}`,
                                    `Potential Savings: $${potentialSavings.toLocaleString()}/month`
                                ];
                            }
                        },
                        footer: function(context) {
                            const item = displayItems[context[0].dataIndex];
                            
                            // Add different footer info based on filter level
                            if (filters.group && filters.subGroup) {
                                return `Application in ${item.area} → ${item.subArea}`;
                            } else if (filters.group) {
                                return `Sub-area in ${item.area}`;
                            } else {
                                return `Business Area`;
                            }
                        }
                    }
                }
            }
        }
    });
}


// 7. Simple Card View for Automation Opportunities - With Inline CSS

function renderAutomationOpportunityMatrix() {
    const container = document.getElementById('priorityAreasList');
    if (!container) return;
    
    const data = getFilteredAutomationData();
    let groupedData = getGroupedAutomationData(data);
    
    if (groupedData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No data available for selected filters.</p>';
        return;
    }
    
    let html = `
        <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <!-- Table Controls -->
            <div style="padding: 20px; border-bottom: 1px solid #e0e0e0; background: #f8f9fa;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                    <h4 style="margin: 0; color: #2c3e50;">Analysis</h4>
                    <div style="display: flex; gap: 10px;">
                        <select id="sortBy" onchange="sortAutomationTable(this.value)" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="gap">Sort by Gap</option>
                            <option value="coverage">Sort by Coverage</option>
                            <option value="totalManual">Sort by Test Count</option>
                            <option value="saveInHours">Sort by Hours Saved</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Table Content with Scrolling -->
            <div style="overflow-x: auto; max-height: 600px; overflow-y: auto;">
                <table id="automationOpportunityTable" style="width: 100%; border-collapse: collapse; min-width: 800px;">
                    <thead style="position: sticky; top: 0; background: #f1f3f4; z-index: 10;">
                        <tr>
                            <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd; font-weight: 600; background: #f1f3f4;">Area/Application</th>
                            <th style="text-align: center; padding: 12px; border-bottom: 2px solid #ddd; font-weight: 600; background: #f1f3f4;">Coverage</th>
                            <th style="text-align: center; padding: 12px; border-bottom: 2px solid #ddd; font-weight: 600; background: #f1f3f4;">Gap to 90%</th>
                            <th style="text-align: center; padding: 12px; border-bottom: 2px solid #ddd; font-weight: 600; background: #f1f3f4;">Priority Tests</th>
                            <th style="text-align: center; padding: 12px; border-bottom: 2px solid #ddd; font-weight: 600; background: #f1f3f4;">Total Manual</th>
                            <th style="text-align: center; padding: 12px; border-bottom: 2px solid #ddd; font-weight: 600; background: #f1f3f4;">Hours Saved</th>
                            <th style="text-align: center; padding: 12px; border-bottom: 2px solid #ddd; font-weight: 600; background: #f1f3f4;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="automationTableBody">
    `;
    
    // Sort data by gap (highest first)
    groupedData.sort((a, b) => b.gap - a.gap);
    
    groupedData.forEach((item, index) => {
        const statusColor = item.coverage >= 90 ? '#27ae60' : 
                           item.coverage >= 50 ? '#f39c12' : '#e74c3c';
        
        const statusText = item.coverage >= 90 ? 'Excellent' : 
                          item.coverage >= 50 ? 'Moderate' : 'Needs Focus';
        
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
        
        html += `
            <tr style="background: ${rowBg};" onmouseover="this.style.background='#f0f8ff'" onmouseout="this.style.background='${rowBg}'">
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: 600; color: #2c3e50;">${item.name}</div>
                    <div style="font-size: 12px; color: #666; margin-top: 2px;">${getContextInfo(item)}</div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <div style="width: 60px; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${item.coverage}%; height: 100%; background: ${statusColor}; border-radius: 4px;"></div>
                        </div>
                        <span style="font-weight: 600; color: ${statusColor};">${item.coverage}%</span>
                    </div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <span style="font-weight: 600; color: ${item.gap > 20 ? '#e74c3c' : item.gap > 10 ? '#f39c12' : '#27ae60'};">
                        ${item.gap}%
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600;">
                    ${item.highPriorityTests.toLocaleString()}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600;">
                    ${item.totalManual.toLocaleString()}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600;">
                    ${item.saveInHours.toLocaleString()}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <span style="
                        padding: 4px 12px; 
                        border-radius: 12px; 
                        font-size: 12px; 
                        font-weight: 600; 
                        background: ${statusColor}20; 
                        color: ${statusColor};
                        border: 1px solid ${statusColor}40;
                    ">
                        ${statusText}
                    </span>
                </td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
            
            <!-- Summary Footer -->
            <div style="padding: 15px 20px; background: #f8f9fa; border-top: 1px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #666;">
                    <span>Total Items: ${groupedData.length}</span>
                    <span>Average Coverage: ${Math.round(groupedData.reduce((sum, d) => sum + d.coverage, 0) / groupedData.length)}%</span>
                    <span>Items Below Target: ${groupedData.filter(d => d.coverage < 90).length}</span>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Store data for sorting
    window.currentAutomationData = groupedData;
}

// Sorting function for the table
function sortAutomationTable(sortBy) {
    const data = window.currentAutomationData;
    if (!data) return;
    
    // Sort the data
    data.sort((a, b) => {
        switch(sortBy) {
            case 'coverage':
                return b.coverage - a.coverage;
            case 'totalManual':
                return b.totalManual - a.totalManual;
            case 'saveInHours':
                return b.saveInHours - a.saveInHours;
            case 'gap':
            default:
                return b.gap - a.gap;
        }
    });
    
    // Re-render table body
    const tbody = document.getElementById('automationTableBody');
    if (!tbody) return;
    
    let html = '';
    data.forEach((item, index) => {
        const statusColor = item.coverage >= 90 ? '#27ae60' : 
                           item.coverage >= 50 ? '#f39c12' : '#e74c3c';
        
        const statusText = item.coverage >= 90 ? 'Excellent' : 
                          item.coverage >= 50 ? 'Moderate' : 'Needs Focus';
        
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
        
        html += `
            <tr style="background: ${rowBg};" onmouseover="this.style.background='#f0f8ff'" onmouseout="this.style.background='${rowBg}'">
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: 600; color: #2c3e50;">${item.name}</div>
                    <div style="font-size: 12px; color: #666; margin-top: 2px;">${getContextInfo(item)}</div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <div style="width: 60px; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${item.coverage}%; height: 100%; background: ${statusColor}; border-radius: 4px;"></div>
                        </div>
                        <span style="font-weight: 600; color: ${statusColor};">${item.coverage}%</span>
                    </div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <span style="font-weight: 600; color: ${item.gap > 20 ? '#e74c3c' : item.gap > 10 ? '#f39c12' : '#27ae60'};">
                        ${item.gap}%
                    </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600;">
                    ${item.highPriorityTests.toLocaleString()}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600;">
                    ${item.totalManual.toLocaleString()}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: 600;">
                    ${item.saveInHours.toLocaleString()}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    <span style="
                        padding: 4px 12px; 
                        border-radius: 12px; 
                        font-size: 12px; 
                        font-weight: 600; 
                        background: ${statusColor}20; 
                        color: ${statusColor};
                        border: 1px solid ${statusColor}40;
                    ">
                        ${statusText}
                    </span>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Helper function to get grouped data based on current filters
function getGroupedAutomationData(data) {
    if (filters.group && filters.subGroup) {
        return data
            .filter(d => d.area === filters.group && d.subArea === filters.subGroup)
            .map(d => ({
                name: d.applicationName,
                area: d.area,
                subArea: d.subArea,
                coverage: d.automationCoverage,
                gap: Math.max(0, 90 - d.automationCoverage),
                highPriorityTests: d.manualCritical + d.manualHigh,
                totalManual: d.totalManualCases,
                totalAutomated: d.totalAutomatedTillDate,
                readiness: d.regressionSuiteAvailable === 'Yes' ? 'Ready' : 'Not Ready',
                saveInHours: d.saveInHours
            }));
    } else if (filters.group) {
        const subAreas = [...new Set(data.filter(d => d.area === filters.group).map(d => d.subArea))];
        return subAreas.map(subArea => {
            const subAreaData = data.filter(d => d.area === filters.group && d.subArea === subArea);
            const totalManual = subAreaData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = subAreaData.reduce((sum, d) => sum + d.totalAutomatedTillDate, 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            
            return {
                name: subArea,
                area: filters.group,
                subArea: subArea,
                coverage,
                gap: Math.max(0, 90 - coverage),
                highPriorityTests: subAreaData.reduce((sum, d) => sum + d.manualCritical + d.manualHigh, 0),
                totalManual,
                totalAutomated,
                readiness: subAreaData.every(d => d.regressionSuiteAvailable === 'Yes') ? 'Ready' : 'Partial',
                saveInHours: subAreaData.reduce((sum, d) => sum + d.saveInHours, 0),
                applicationsCount: subAreaData.length
            };
        });
    } else {
        const areas = [...new Set(data.map(d => d.area))];
        return areas.map(area => {
            const areaData = data.filter(d => d.area === area);
            const totalManual = areaData.reduce((sum, d) => sum + d.totalManualCases, 0);
            const totalAutomated = areaData.reduce((sum, d) => sum + d.totalAutomatedTillDate, 0);
            const coverage = totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
            
            return {
                name: area,
                area: area,
                subArea: '',
                coverage,
                gap: Math.max(0, 90 - coverage),
                highPriorityTests: areaData.reduce((sum, d) => sum + d.manualCritical + d.manualHigh, 0),
                totalManual,
                totalAutomated,
                readiness: areaData.every(d => d.regressionSuiteAvailable === 'Yes') ? 'Ready' : 'Partial',
                saveInHours: areaData.reduce((sum, d) => sum + d.saveInHours, 0),
                applicationsCount: areaData.length
            };
        });
    }
}

// Helper function to get context info for display
function getContextInfo(item) {
    if (filters.group && filters.subGroup) {
        return `Application in ${item.area} → ${item.subArea}`;
    } else if (filters.group) {
        return `Sub-area in ${item.area} (${item.applicationsCount || 1} apps)`;
    } else {
        return `Business Area (${item.applicationsCount || 1} apps)`;
    }
}
// 8. ROI Summary
function renderROISummary() {
    const container = document.getElementById('roiSummaryGrid');
    if (!container) return;
    
    const data = getFilteredAutomationData();
    
    const totalInvestment = data.reduce((sum, d) => sum + (d.totalAutomatedTillDate * 100), 0);
    const totalSavings = data.reduce((sum, d) => sum + (d.saveInHours * 50), 0);
    const overallROI = totalInvestment > 0 ? Math.round(((totalSavings - totalInvestment) / totalInvestment) * 100) : 0;
    const paybackMonths = totalSavings > 0 ? Math.round(totalInvestment / (totalSavings / 12)) : 0;
    
    container.innerHTML = `
        <div class="summary-item">
            <div class="summary-label">Total Investment</div>
            <div class="summary-value">${(totalInvestment).toLocaleString()}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Annual Savings</div>
            <div class="summary-value">${totalSavings.toLocaleString()}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Overall ROI</div>
            <div class="summary-value">${overallROI}%</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Payback Period</div>
            <div class="summary-value">${paybackMonths} months</div>
        </div>
    `;
}

// 9. Strategic Recommendations
function renderStrategicRecommendations() {
    const container = document.getElementById('strategicRecommendations');
    if (!container) return;
    
    const data = getFilteredAutomationData();
    
    const lowCoverage = data.filter(d => d.automationCoverage < 50).length;
    const notStarted = data.filter(d => d.automationStarted === 'No').length;
    const highROI = data.filter(d => d.saveInHours > 100).length;
    const criticalGaps = data.filter(d => d.manualCritical > d.automatedCritical + 5).length;
    
    let recommendations = [];
    
    if (lowCoverage > 0) {
        recommendations.push({
            priority: 'High',
            title: 'Address Low Coverage Applications',
            description: `${lowCoverage} applications have <50% automation coverage. Focus on these first.`,
            action: 'Prioritize automation for critical and high-priority test cases'
        });
    }
    
    if (notStarted > 0) {
        recommendations.push({
            priority: 'Medium',
            title: 'Kickstart Automation Initiative',
            description: `${notStarted} applications haven't started automation yet.`,
            action: 'Establish regression test suites and begin pilot automation'
        });
    }
    
    if (criticalGaps > 0) {
        recommendations.push({
            priority: 'High',
            title: 'Critical Test Priority',
            description: `${criticalGaps} applications have significant critical test gaps.`,
            action: 'Immediate focus on automating critical severity test cases'
        });
    }
    
    if (highROI > 0) {
        recommendations.push({
            priority: 'Low',
            title: 'Scale High-ROI Applications',
            description: `${highROI} applications show excellent ROI potential.`,
            action: 'Increase automation investment in these areas'
        });
    }
    
    if (recommendations.length === 0) {
        recommendations.push({
            priority: 'Low',
            title: 'Optimization Focus',
            description: 'Overall automation strategy is performing well.',
            action: 'Focus on fine-tuning existing automation and maintenance'
        });
    }
    
    let html = '<div class="recommendations-list">';
    
    recommendations.forEach(rec => {
        const priorityClass = rec.priority.toLowerCase();
        html += `
            <div class="recommendation-item ${priorityClass}">
                <div class="rec-header">
                    <h4>${rec.title}</h4>
                    <span class="priority-badge priority-${priorityClass}">${rec.priority}</span>
                </div>
                <p class="rec-description">${rec.description}</p>
                <div class="rec-action">
                    <strong>Recommended Action:</strong> ${rec.action}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Main render functions for tabs
function renderAutomationOverviewCharts() {
    console.log('Rendering automation overview charts...');
    setTimeout(() => renderAutomationReadinessMatrix(), 100);
    setTimeout(() => renderPriorityCoverageChart(), 200);
    setTimeout(() => renderManualVsAutomatedChart(), 300);
}

function renderAutomationEfficiencyCharts() {
    console.log('Rendering automation efficiency charts...');
    setTimeout(() => renderROIEfficiencyChart(), 100);
    setTimeout(() => renderAutomationEfficiencyMatrix(), 200);
    setTimeout(() => renderTimeSavingsAnalysis(), 300);
    //setTimeout(() => renderROISummary(), 300);
}

function renderAutomationInsightsCharts() {
    console.log('Rendering automation insights charts...');
    setTimeout(() => renderCoverageGapChart(), 100);
    setTimeout(() => renderAutomationOpportunityMatrix(), 200);
    setTimeout(() => renderStrategicRecommendations(), 300);
}

// Update main automation metrics
function updateAutomationMetrics() {
    console.log('Updating automation metrics...');
    
    const filteredData = getFilteredAutomationData();
    console.log('Filtered automation data count:', filteredData.length);
    
    updateAutomationKPIs(filteredData);
    
    // Re-render charts for active tab
    const activeTab = document.querySelector('#automationPage .tab.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        setTimeout(() => {
            if (tabName === 'automation-overview') {
                renderAutomationOverviewCharts();
            } else if (tabName === 'automation-efficiency') {
                renderAutomationEfficiencyCharts();
            } else if (tabName === 'automation-insights') {
                renderAutomationInsightsCharts();
            }
        }, 200);
    }
}

// Initialize automation page
function initializeAutomationPage() {
    console.log('Initializing Automation Page with JSON data...');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setupAutomationPage();
        });
    } else {
        setupAutomationPage();
    }
}

function setupAutomationPage() {
    initializeAutomationTabs();
    loadAutomationData();
    setupAutomationFilterListeners();
    populateAutomationFilters();
}

function initializeAutomationTabs() {
    const automationTabs = document.querySelectorAll('#automationPage .tab');
    
    automationTabs.forEach(tab => {
        tab.replaceWith(tab.cloneNode(true));
    });
    
    document.querySelectorAll('#automationPage .tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchAutomationTab(tabName);
        });
    });
}

function switchAutomationTab(tabName) {
    console.log('Switching to automation tab:', tabName);
    
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
    
    // Render appropriate charts
    setTimeout(() => {
        if (tabName === 'automation-overview') {
            renderAutomationReadinessMatrix();
            renderPriorityCoverageChart();
            renderManualVsAutomatedChart();
        } else if (tabName === 'automation-efficiency') {
            renderROIEfficiencyChart();
            renderAutomationEfficiencyMatrix();
            renderTimeSavingsAnalysis();
            //renderROISummary();
        } else if (tabName === 'automation-insights') {
            renderCoverageGapChart();
            renderAutomationOpportunityMatrix();
            renderStrategicRecommendations();
        }
    }, 300);
}

// Setup filter listeners
function setupAutomationFilterListeners() {
    const groupFilter = document.getElementById('groupFilter');
    const subGroupFilter = document.getElementById('subGroupFilter');
    
    if (groupFilter && !groupFilter.hasAttribute('automation-listener')) {
        groupFilter.setAttribute('automation-listener', 'true');
        groupFilter.addEventListener('change', function() {
            if (currentPage === 'automation') {
                filters.group = this.value;
                updateSubAreaFilter();
                updateAutomationMetrics();
            }
        });
    }
    
    if (subGroupFilter && !subGroupFilter.hasAttribute('automation-listener')) {
        subGroupFilter.setAttribute('automation-listener', 'true');
        subGroupFilter.addEventListener('change', function() {
            if (currentPage === 'automation') {
                filters.subGroup = this.value;
                updateAutomationMetrics();
            }
        });
    }
}

// Populate filters with automation data
function populateAutomationFilters() {
    console.log('Populating automation filters...');
    
    const areas = [...new Set(automationData.map(d => d.area))].filter(a => a);
    const groupFilter = document.getElementById('groupFilter');
    
    if (groupFilter) {
        const existingOptions = Array.from(groupFilter.options).map(opt => opt.value);
        
        areas.forEach(area => {
            if (!existingOptions.includes(area)) {
                const option = document.createElement('option');
                option.value = area;
                option.textContent = area;
                groupFilter.appendChild(option);
            }
        });
    }
}

function updateSubAreaFilter() {
    const subGroupFilter = document.getElementById('subGroupFilter');
    if (!subGroupFilter) return;
    
    const currentValue = subGroupFilter.value;
    subGroupFilter.innerHTML = '<option value="">All Sub Areas</option>';
    
    if (filters.group) {
        const subAreas = [...new Set(automationData
            .filter(d => d.area === filters.group)
            .map(d => d.subArea))].filter(sa => sa);
        
        subAreas.forEach(subArea => {
            const option = document.createElement('option');
            option.value = subArea;
            option.textContent = subArea;
            if (subArea === currentValue) {
                option.selected = true;
            }
            subGroupFilter.appendChild(option);
        });
    }
    
    if (filters.group && !subGroupFilter.value) {
        filters.subGroup = '';
    }
}

// Utility functions
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

// Export functions for integration with main dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadAutomationData,
        initializeAutomationPage,
        updateAutomationMetrics,
        switchAutomationTab,
        populateAutomationFilters,
        automationCharts
    };
}