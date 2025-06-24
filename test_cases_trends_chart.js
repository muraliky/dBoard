// TEST CASES EXECUTION TRENDS CHART
// Add this to your dashboard-charts.js file

// Helper function to get previous months
function getPreviousMonths(currentMonth, count = 3) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (!currentMonth) {
        // If no month selected, use current month
        const now = new Date();
        currentMonth = months[now.getMonth()];
    }
    
    const currentIndex = months.indexOf(currentMonth);
    if (currentIndex === -1) return [currentMonth]; // Invalid month, return as is
    
    const result = [];
    for (let i = count - 1; i >= 0; i--) {
        let monthIndex = (currentIndex - i + 12) % 12;
        result.push(months[monthIndex]);
    }
    
    return result;
}

// Function to get data for specific month
function getDataForMonth(data, targetMonth) {
    return data.filter(d => {
        const recordMonth = getMonthFromDate(d.goLiveDate);
        return recordMonth === targetMonth;
    });
}

// Main function to render test cases trends chart
function renderTestCasesTrendsChart(data) {
    const ctx = document.getElementById('testCasesTrendsChart');
    if (!ctx) {
        console.error('Test cases trends chart canvas not found');
        return;
    }
    
    safeDestroyChart('testCasesTrends');
    
    // Get the last 3 months including current selected month
    const currentMonth = filters.month || new Date().toLocaleString('default', { month: 'long' });
    const monthsToShow = getPreviousMonths(currentMonth, 3);
    
    console.log('Showing trends for months:', monthsToShow);
    console.log('Current filters:', filters);
    
    // Calculate data for each month
    const trendsData = monthsToShow.map(month => {
        // Filter data for this specific month
        const monthData = data.filter(d => {
            const recordMonth = getMonthFromDate(d.goLiveDate);
            const matchMonth = recordMonth === month;
            
            // Apply current filters for group/subgroup/application
            const matchGroup = !filters.group || d.group === filters.group;
            const matchSubGroup = !filters.subGroup || d.subGroup === filters.subGroup;
            
            return matchMonth && matchGroup && matchSubGroup;
        });
        
        // Calculate totals for this month
        const functionalTotal = monthData.reduce((sum, d) => sum + (d.functionalTestTotal || 0), 0);
        const regressionTotal = monthData.reduce((sum, d) => sum + (d.regressionTestTotal || 0), 0);
        const totalTestCases = functionalTotal + regressionTotal;
        
        // Calculate pass rates
        const functionalPassed = monthData.reduce((sum, d) => sum + (d.functionalTestPassed || 0), 0);
        const regressionPassed = monthData.reduce((sum, d) => sum + (d.regressionTestPassed || 0), 0);
        const totalPassed = functionalPassed + regressionPassed;
        const passRate = totalTestCases > 0 ? ((totalPassed / totalTestCases) * 100).toFixed(1) : 0;
        
        return {
            month,
            totalTestCases,
            functionalTotal,
            regressionTotal,
            passRate: parseFloat(passRate),
            recordsCount: monthData.length
        };
    });
    
    console.log('Trends data calculated:', trendsData);
    
    const fontSize = getResponsiveFontSize();
    
    charts.testCasesTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthsToShow,
            datasets: [
                {
                    label: 'Total Test Cases',
                    data: trendsData.map(d => d.totalTestCases),
                    borderColor: '#c41e3a',
                    backgroundColor: 'rgba(196, 30, 58, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#c41e3a',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    yAxisID: 'y'
                },
                {
                    label: 'Pass Rate %',
                    data: trendsData.map(d => d.passRate),
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#27ae60',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: fontSize
                        }
                    }
                },
                tooltip: {
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            const monthIndex = context[0].dataIndex;
                            const monthData = trendsData[monthIndex];
                            return `${context[0].label} (${monthData.recordsCount} releases)`;
                        },
                        label: function(context) {
                            const monthIndex = context.dataIndex;
                            const monthData = trendsData[monthIndex];
                            
                            if (context.datasetIndex === 0) {
                                return [
                                    `Total Test Cases: ${context.parsed.y.toLocaleString()}`,
                                    `Functional: ${monthData.functionalTotal.toLocaleString()}`,
                                    `Regression: ${monthData.regressionTotal.toLocaleString()}`
                                ];
                            } else {
                                return `Pass Rate: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                customDataLabels: {
                    enabled: false // Disable for line charts
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: fontSize
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        font: {
                            size: fontSize
                        },
                        callback: function(value) {
                            return value >= 1000 ? (value/1000).toFixed(1) + 'K' : value;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Number of Test Cases',
                        font: {
                            size: fontSize,
                            weight: 'bold'
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        font: {
                            size: fontSize
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Pass Rate %',
                        font: {
                            size: fontSize,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
    
    console.log('Test cases trends chart created successfully');
}

// Enhanced version with breakdown by test type
function renderDetailedTestCasesTrendsChart(data) {
    const ctx = document.getElementById('testCasesTrendsChart');
    if (!ctx) return;
    
    safeDestroyChart('testCasesTrends');
    
    const currentMonth = filters.month || new Date().toLocaleString('default', { month: 'long' });
    const monthsToShow = getPreviousMonths(currentMonth, 3);
    
    // Calculate detailed data for each month
    const trendsData = monthsToShow.map(month => {
        const monthData = data.filter(d => {
            const recordMonth = getMonthFromDate(d.goLiveDate);
            const matchMonth = recordMonth === month;
            const matchGroup = !filters.group || d.group === filters.group;
            const matchSubGroup = !filters.subGroup || d.subGroup === filters.subGroup;
            return matchMonth && matchGroup && matchSubGroup;
        });
        
        const functionalTotal = monthData.reduce((sum, d) => sum + (d.functionalTestTotal || 0), 0);
        const regressionTotal = monthData.reduce((sum, d) => sum + (d.regressionTestTotal || 0), 0);
        
        return {
            month,
            functionalTotal,
            regressionTotal,
            recordsCount: monthData.length
        };
    });
    
    const fontSize = getResponsiveFontSize();
    
    charts.testCasesTrends = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthsToShow,
            datasets: [
                {
                    label: 'Functional Tests',
                    data: trendsData.map(d => d.functionalTotal),
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Regression Tests',
                    data: trendsData.map(d => d.regressionTotal),
                    backgroundColor: '#9b59b6',
                    borderColor: '#8e44ad',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: fontSize }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const monthIndex = context[0].dataIndex;
                            const monthData = trendsData[monthIndex];
                            return `${context[0].label} (${monthData.recordsCount} releases)`;
                        },
                        afterBody: function(context) {
                            const monthIndex = context[0].dataIndex;
                            const monthData = trendsData[monthIndex];
                            const total = monthData.functionalTotal + monthData.regressionTotal;
                            return `Total: ${total.toLocaleString()} test cases`;
                        }
                    }
                },
                customDataLabels: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: { font: { size: fontSize } }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        font: { size: fontSize },
                        callback: function(value) {
                            return value >= 1000 ? (value/1000).toFixed(1) + 'K' : value;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Number of Test Cases',
                        font: { size: fontSize, weight: 'bold' }
                    }
                }
            }
        }
    });
}

// Function to add trends chart to a specific tab
function addTrendsChartToTab(tabId, chartTitle = 'Test Cases Execution Trends') {
    const tabContainer = document.getElementById(tabId);
    if (!tabContainer) {
        console.error(`Tab container ${tabId} not found`);
        return;
    }
    
    // Check if chart already exists
    if (document.getElementById('testCasesTrendsChart')) {
        console.log('Trends chart already exists');
        return;
    }
    
    // Create chart container HTML
    const chartHTML = `
        <div class="chart-container">
            <div class="chart-header">${chartTitle}</div>
            <div class="chart-wrapper">
                <canvas id="testCasesTrendsChart"></canvas>
            </div>
        </div>
    `;
    
    // Add to the beginning of the tab content
    tabContainer.insertAdjacentHTML('afterbegin', chartHTML);
    
    console.log(`Trends chart added to ${tabId}`);
}

// Function to update trends when filters change
function updateTestCasesTrends() {
    const filteredData = getFilteredData();
    
    // Show current filter context in console
    console.log('Updating trends with filters:', filters);
    console.log('Filtered data count:', filteredData.length);
    
    // Check if we have enough data for trends
    if (filteredData.length === 0) {
        console.log('No data available for trends');
        
        // Show empty state
        const canvas = document.getElementById('testCasesTrendsChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available for selected filters', canvas.width / 2, canvas.height / 2);
        }
        return;
    }
    
    // Render the appropriate chart type
    renderTestCasesTrendsChart(filteredData);
}

// Integration function - Call this from your existing code
function integrateTrendsChart() {
    console.log('Integrating trends chart...');
    
    // Add chart to the execution tab (you can change this to any tab)
    addTrendsChartToTab('execution', 'Test Cases Execution Trends (Last 3 Months)');
    
    // Update the existing updateQualityMetrics function to include trends
    const originalUpdateQualityMetrics = window.updateQualityMetrics;
    if (originalUpdateQualityMetrics) {
        window.updateQualityMetrics = function() {
            originalUpdateQualityMetrics();
            updateTestCasesTrends();
        };
    }
    
    // Update the existing tab switching to refresh trends
    const originalSwitchTab = window.switchTab;
    if (originalSwitchTab) {
        window.switchTab = function(tabName) {
            originalSwitchTab(tabName);
            if (tabName === 'execution') {
                setTimeout(() => {
                    updateTestCasesTrends();
                }, 200);
            }
        };
    }
    
    console.log('Trends chart integration complete');
}

// Call this function after your page loads to add the trends chart
// Add this line to your DOMContentLoaded event or call it manually:
// integrateTrendsChart();
