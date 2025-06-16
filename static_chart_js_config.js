// SIMPLE STATIC CHART.JS CONFIGURATION
// Add this to the top of your dashboard-charts.js file

// ============================================
// STATIC CHART CONFIGURATION
// ============================================

// Universal static options for ALL charts
const staticChartOptions = {
    responsive: false,        // DISABLE responsive behavior
    maintainAspectRatio: false, // DISABLE aspect ratio maintenance
    
    // FORCE STATIC DIMENSIONS
    layout: {
        padding: 0
    },
    
    // Disable animations for consistent sizing
    animation: {
        duration: 0
    },
    
    // Standard plugins
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 12,
                padding: 10,
                font: {
                    size: 11
                }
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { size: 12 },
            bodyFont: { size: 11 }
        }
    }
};

// ============================================
// CHART RENDERING WITH STATIC DIMENSIONS
// ============================================

// Set canvas size BEFORE creating chart
function setCanvasSize(canvasId, width = null, height = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Default sizes
    const defaultWidth = canvas.parentElement.offsetWidth || 800;
    const defaultHeight = 400;
    
    // Set explicit dimensions
    canvas.width = width || defaultWidth;
    canvas.height = height || defaultHeight;
    canvas.style.width = (width || defaultWidth) + 'px';
    canvas.style.height = (height || defaultHeight) + 'px';
}

// Enhanced chart creation function
function createStaticChart(canvasId, config, width = null, height = null) {
    // Set canvas size first
    setCanvasSize(canvasId, width, height);
    
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    // Merge static options with chart config
    const staticConfig = {
        ...config,
        options: {
            ...staticChartOptions,
            ...config.options
        }
    };
    
    return new Chart(ctx, staticConfig);
}

// ============================================
// UPDATED CHART RENDERING FUNCTIONS
// ============================================

// Example: Static Release Status Chart
function renderReleaseStatusChart(data) {
    const canvasId = 'releaseStatusChart';
    
    // Destroy existing chart
    if (charts.releaseStatus) {
        charts.releaseStatus.destroy();
    }
    
    // Set static canvas size (800x400)
    setCanvasSize(canvasId, 800, 400);
    
    // Get limited data
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))].slice(0, 10);
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))].slice(0, 10);
    } else {
        labels = [...new Set(data.map(d => d.group))].slice(0, 10);
    }
    
    // Calculate data
    const goLiveCompleted = labels.map(label => {
        return data.filter(d => {
            const matchLabel = filters.subGroup ? d.application === label :
                             filters.group ? d.subGroup === label :
                             d.group === label;
            return matchLabel && d.goLiveStatus === 'Completed';
        }).length;
    });
    
    const goLiveDelayed = labels.map(label => {
        return data.filter(d => {
            const matchLabel = filters.subGroup ? d.application === label :
                             filters.group ? d.subGroup === label :
                             d.group === label;
            return matchLabel && d.goLiveStatus === 'Deferred';
        }).length;
    });

    const goLivePlanned = labels.map(label => {
        return data.filter(d => {
            const matchLabel = filters.subGroup ? d.application === label :
                             filters.group ? d.subGroup === label :
                             d.group === label;
            return matchLabel && d.goLiveStatus === 'Planned';
        }).length;
    });
    
    // Create static chart
    charts.releaseStatus = createStaticChart(canvasId, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Completed',
                    data: goLiveCompleted,
                    backgroundColor: '#27ae60',
                    borderRadius: 5
                },
                {
                    label: 'Deferred',
                    data: goLiveDelayed,
                    backgroundColor: '#e74c3c',
                    borderRadius: 5
                },
                {
                    label: 'Planned',
                    data: goLivePlanned,
                    backgroundColor: '#3498db',
                    borderRadius: 5
                }
            ]
        },
        options: {
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        maxRotation: 45,
                        font: { size: 10 }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

// Example: Static UAT Status Chart
function renderUATStatusChart(data) {
    const canvasId = 'uatStatusChart';
    
    if (charts.uatStatus) {
        charts.uatStatus.destroy();
    }
    
    // Set static canvas size
    setCanvasSize(canvasId, 800, 400);
    
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))].slice(0, 10);
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))].slice(0, 10);
    } else {
        labels = [...new Set(data.map(d => d.group))].slice(0, 10);
    }
    
    const uatCompleted = labels.map(label => {
        return data.filter(d => {
            const matchLabel = filters.subGroup ? d.application === label :
                             filters.group ? d.subGroup === label :
                             d.group === label;
            return matchLabel && d.uatStatus === 'Completed';
        }).length;
    });
    
    const uatYetToStart = labels.map(label => {
        return data.filter(d => {
            const matchLabel = filters.subGroup ? d.application === label :
                             filters.group ? d.subGroup === label :
                             d.group === label;
            return matchLabel && d.uatStatus === 'Yet to start';
        }).length;
    });

    const uatInProgress = labels.map(label => {
        return data.filter(d => {
            const matchLabel = filters.subGroup ? d.application === label :
                             filters.group ? d.subGroup === label :
                             d.group === label;
            return matchLabel && d.uatStatus === 'In progress';
        }).length;
    });
    
    charts.uatStatus = createStaticChart(canvasId, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Completed',
                    data: uatCompleted,
                    backgroundColor: '#27ae60',
                    borderRadius: 5
                },
                {
                    label: 'Yet to start',
                    data: uatYetToStart,
                    backgroundColor: '#e74c3c',
                    borderRadius: 5
                },
                {
                    label: 'In progress',
                    data: uatInProgress,
                    backgroundColor: '#3498db',
                    borderRadius: 5
                }
            ]
        },
        options: {
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        maxRotation: 45,
                        font: { size: 10 }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

// Example: Static Doughnut Chart
function renderOverallTestSummaryChart(data) {
    const canvasId = 'overallTestSummaryChart';
    
    if (charts.overallTestSummary) {
        charts.overallTestSummary.destroy();
    }
    
    // Set static canvas size for doughnut
    setCanvasSize(canvasId, 400, 400);
    
    const totals = data.reduce((acc, d) => {
        acc.passed += d.functionalTestPassed + d.regressionTestPassed;
        acc.failed += d.functionalTestFailed + d.regressionTestFailed;
        acc.blocked += d.functionalTestBlocked + d.regressionTestBlocked;
        acc.na += d.functionalTestNA + d.regressionTestNA;
        return acc;
    }, { passed: 0, failed: 0, blocked: 0, na: 0 });
    
    charts.overallTestSummary = createStaticChart(canvasId, {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed', 'Blocked', 'Not Applicable'],
            datasets: [{
                data: [totals.passed, totals.failed, totals.blocked, totals.na],
                backgroundColor: ['#27ae60', '#e74c3c', '#f39c12', '#95a5a6'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// ============================================
// AUTOMATION CHARTS WITH STATIC DIMENSIONS
// ============================================

// Static automation chart function
function renderCoverageByGroupChart() {
    const canvasId = 'coverageByGroupChart';
    
    if (automationCharts && automationCharts.coverageByGroup) {
        automationCharts.coverageByGroup.destroy();
    }
    
    // Set static size for automation charts
    setCanvasSize(canvasId, 800, 380);
    
    const data = getFilteredAutomationData();
    
    let labels;
    if (typeof filters !== 'undefined' && filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))].slice(0, 8);
    } else if (typeof filters !== 'undefined' && filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))].slice(0, 8);
    } else {
        labels = [...new Set(data.map(d => d.group))].slice(0, 8);
    }
    
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
    
    if (typeof automationCharts === 'undefined') {
        window.automationCharts = {};
    }
    
    automationCharts.coverageByGroup = createStaticChart(canvasId, {
        type: 'bar',
        data: {
            labels: labels,
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
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// UTILITY FUNCTIONS FOR STATIC CHARTS
// ============================================

// Resize all charts to static dimensions
function resizeAllChartsToStatic() {
    // Quality charts
    setCanvasSize('releaseStatusChart', 800, 400);
    setCanvasSize('uatStatusChart', 800, 400);
    setCanvasSize('overallTestSummaryChart', 400, 400);
    setCanvasSize('testCaseDistributionChart', 800, 400);
    setCanvasSize('newTestCasesProgressChart', 800, 400);
    setCanvasSize('topProblemAreasChart', 800, 400);
    setCanvasSize('defectSeverityMiniChart', 300, 200);
    
    // Automation charts
    setCanvasSize('coverageByGroupChart', 800, 380);
    setCanvasSize('progressToTargetChart', 800, 380);
    setCanvasSize('newScriptsDistChart', 800, 380);
    setCanvasSize('effortsByGroupChart', 400, 380);
    setCanvasSize('coverageGapChart', 800, 380);
    setCanvasSize('efficiencyMatrixChart', 800, 380);
}

// Call this function when page loads or data changes
function initializeStaticDimensions() {
    // Set Chart.js global defaults for static behavior
    Chart.defaults.responsive = false;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.animation.duration = 0;
    
    // Resize all existing charts
    resizeAllChartsToStatic();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeStaticDimensions);