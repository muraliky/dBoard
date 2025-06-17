// Chart Resize Functions for Large Screens

// Force chart expansion on large screens
function resizeChartsForLargeScreens() {
    const screenWidth = window.innerWidth;
    
    // Only apply to large screens
    if (screenWidth < 1400) return;
    
    console.log('Resizing charts for large screen:', screenWidth);
    
    // Resize Overall Test Summary Chart
    if (charts.overallTestSummary) {
        const canvas = document.getElementById('overallTestSummaryChart');
        if (canvas) {
            let height = 480;
            if (screenWidth >= 1920) height = 560;
            else if (screenWidth >= 1600) height = 520;
            
            canvas.style.height = height + 'px';
            canvas.style.width = '100%';
            
            setTimeout(() => {
                charts.overallTestSummary.resize();
                console.log('Overall test summary chart resized to:', height);
            }, 100);
        }
    }
    
    // Resize Test Case Distribution Chart
    if (charts.testCaseDistribution) {
        const canvas = document.getElementById('testCaseDistributionChart');
        if (canvas) {
            let height = 480;
            if (screenWidth >= 1920) height = 560;
            else if (screenWidth >= 1600) height = 520;
            
            canvas.style.height = height + 'px';
            canvas.style.width = '100%';
            
            setTimeout(() => {
                charts.testCaseDistribution.resize();
                console.log('Test case distribution chart resized to:', height);
            }, 100);
        }
    }
    
    // Resize Top Problem Areas Chart
    if (charts.topProblemAreas) {
        const canvas = document.getElementById('topProblemAreasChart');
        if (canvas) {
            let height = 480;
            if (screenWidth >= 1920) height = 560;
            else if (screenWidth >= 1600) height = 520;
            
            canvas.style.height = height + 'px';
            canvas.style.width = '100%';
            
            setTimeout(() => {
                charts.topProblemAreas.resize();
                console.log('Top problem areas chart resized to:', height);
            }, 100);
        }
    }
}

// Enhanced chart configuration for large screens
function getLargeScreenChartOptions(baseOptions = {}) {
    const screenWidth = window.innerWidth;
    
    let fontSize = 12;
    let padding = 20;
    let legendSpacing = 15;
    
    if (screenWidth >= 1920) {
        fontSize = 16;
        padding = 30;
        legendSpacing = 20;
    } else if (screenWidth >= 1600) {
        fontSize = 14;
        padding = 25;
        legendSpacing = 18;
    } else if (screenWidth >= 1400) {
        fontSize = 13;
        padding = 22;
        legendSpacing = 16;
    }
    
    return {
        ...baseOptions,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: padding,
                bottom: padding,
                left: padding,
                right: padding
            }
        },
        plugins: {
            ...baseOptions.plugins,
            legend: {
                ...baseOptions.plugins?.legend,
                labels: {
                    ...baseOptions.plugins?.legend?.labels,
                    font: {
                        size: fontSize
                    },
                    padding: legendSpacing,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                ...baseOptions.plugins?.tooltip,
                titleFont: {
                    size: fontSize + 1
                },
                bodyFont: {
                    size: fontSize
                },
                padding: padding / 2
            }
        },
        scales: baseOptions.scales ? {
            ...baseOptions.scales,
            x: {
                ...baseOptions.scales.x,
                ticks: {
                    ...baseOptions.scales.x?.ticks,
                    font: {
                        size: fontSize - 1
                    }
                }
            },
            y: {
                ...baseOptions.scales.y,
                ticks: {
                    ...baseOptions.scales.y?.ticks,
                    font: {
                        size: fontSize - 1
                    }
                }
            }
        } : undefined
    };
}

// Update Overall Test Summary Chart for large screens
function renderOverallTestSummaryChart(data) {
    const canvas = document.getElementById('overallTestSummaryChart');
    if (!canvas) return;
    
    // Destroy existing chart
    safeDestroyChart('overallTestSummary');
    
    // Set canvas size for large screens
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1400) {
        let height = 480;
        if (screenWidth >= 1920) height = 560;
        else if (screenWidth >= 1600) height = 520;
        
        canvas.style.height = height + 'px';
        canvas.style.width = '100%';
    }
    
    // Calculate totals
    const totals = data.reduce((acc, d) => {
        acc.passed += d.functionalTestPassed || 0;
        acc.failed += d.functionalTestFailed || 0;
        acc.blocked += d.functionalTestBlocked || 0;
        acc.notApplicable += d.functionalTestNotApplicable || 0;
        return acc;
    }, { passed: 0, failed: 0, blocked: 0, notApplicable: 0 });
    
    const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) {
        // Handle empty state
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No test data available', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    const baseOptions = {
        plugins: {
            legend: {
                position: screenWidth < 768 ? 'bottom' : 'right'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return context.label + ': ' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                    }
                }
            }
        }
    };
    
    const chartConfig = {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed', 'Blocked', 'Not Applicable'],
            datasets: [{
                data: [totals.passed, totals.failed, totals.blocked, totals.notApplicable],
                backgroundColor: ['#27ae60', '#e74c3c', '#f39c12', '#95a5a6'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: getLargeScreenChartOptions(baseOptions)
    };
    
    try {
        charts.overallTestSummary = new Chart(canvas.getContext('2d'), chartConfig);
        console.log('Overall test summary chart created for screen width:', screenWidth);
    } catch (error) {
        console.error('Error creating overall test summary chart:', error);
    }
}

// Update Test Case Distribution Chart for large screens
function renderTestCaseDistributionChart(data) {
    const canvas = document.getElementById('testCaseDistributionChart');
    if (!canvas) return;
    
    // Destroy existing chart
    safeDestroyChart('testCaseDistribution');
    
    // Set canvas size for large screens
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1400) {
        let height = 480;
        if (screenWidth >= 1920) height = 560;
        else if (screenWidth >= 1600) height = 520;
        
        canvas.style.height = height + 'px';
        canvas.style.width = '100%';
    }
    
    // Prepare data for stacked bar chart
    const projects = [...new Set(data.map(d => d.Project || d.project || 'Unknown'))].slice(0, 10);
    
    const datasets = [
        {
            label: 'Functional Tests',
            data: projects.map(project => {
                const projectData = data.filter(d => (d.Project || d.project) === project);
                return projectData.reduce((sum, d) => sum + (d.functionalTestTotal || 0), 0);
            }),
            backgroundColor: '#3498db'
        },
        {
            label: 'Regression Tests',
            data: projects.map(project => {
                const projectData = data.filter(d => (d.Project || d.project) === project);
                return projectData.reduce((sum, d) => sum + (d.regressionTestTotal || 0), 0);
            }),
            backgroundColor: '#2ecc71'
        }
    ];
    
    const baseOptions = {
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    maxRotation: 45
                }
            },
            y: {
                stacked: true,
                beginAtZero: true
            }
        }
    };
    
    const chartConfig = {
        type: 'bar',
        data: {
            labels: projects,
            datasets: datasets
        },
        options: getLargeScreenChartOptions(baseOptions)
    };
    
    try {
        charts.testCaseDistribution = new Chart(canvas.getContext('2d'), chartConfig);
        console.log('Test case distribution chart created for screen width:', screenWidth);
    } catch (error) {
        console.error('Error creating test case distribution chart:', error);
    }
}

// Debounced resize handler
let resizeTimeout;
function handleChartResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeChartsForLargeScreens();
    }, 300);
}

// Add resize listener
window.addEventListener('resize', handleChartResize);

// Initialize large screen adjustments on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        resizeChartsForLargeScreens();
    }, 1000);
});