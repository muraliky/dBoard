function getPreviousMonthsForTrends(selectedMonth, count = 3) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (!selectedMonth || selectedMonth === '') {
        const now = new Date();
        selectedMonth = months[now.getMonth()];
    }
    
    const selectedIndex = months.indexOf(selectedMonth);
    if (selectedIndex === -1) {
        console.warn('Invalid month:', selectedMonth);
        return [];
    }
    
    const result = [];
    for (let i = count; i >= 1; i--) {
        let previousIndex = selectedIndex - i;
        if (previousIndex < 0) {
            previousIndex += 12;
        }
        result.push(months[previousIndex]);
    }
    
    return result;
}

// Function to find months that actually have test case data
function findMonthsWithTestData(data, maxMonths = 6) {
    const monthsWithData = [];
    
    data.forEach(record => {
        const month = getMonthFromDate(record.goLiveDate);
        const functionalTotal = parseInt(record.functionalTestTotal) || 0;
        const regressionTotal = parseInt(record.regressionTestTotal) || 0;
        const hasTestCases = functionalTotal > 0 || regressionTotal > 0;
        
        if (month && hasTestCases && !monthsWithData.includes(month)) {
            monthsWithData.push(month);
        }
    });
    
    // Sort months chronologically
    const allMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    monthsWithData.sort((a, b) => allMonths.indexOf(a) - allMonths.indexOf(b));
    
    // Return up to maxMonths
    return monthsWithData.slice(-Math.min(maxMonths, monthsWithData.length));
}

// =====================================================
// MAIN TRENDS CHART FUNCTION
// =====================================================

function renderTestCasesTrendsChart(data) {
    console.log('=== RENDERING TEST CASES TRENDS CHART ===');
    
    const ctx = document.getElementById('testCasesTrendsChart');
    if (!ctx) {
        console.error('Test cases trends chart canvas not found');
        return;
    }
    
    // Destroy existing chart
    safeDestroyChart('testCasesTrends');
    
    // Use qualityData as source
    const sourceData = data || qualityData || [];
    console.log('Source data length:', sourceData.length);
    
    if (sourceData.length === 0) {
        showEmptyTrendsChart('No data available');
        return;
    }
    
    // Determine which months to show
    let monthsToShow = [];
    let chartTitle = '';
    
    // Try to get previous 3 months from selected month
    if (filters.month) {
        const previousMonths = getPreviousMonthsForTrends(filters.month, 3);
        console.log(`Trying previous months from ${filters.month}:`, previousMonths);
        
        // Check if these months have test data
        const hasDataInPreviousMonths = previousMonths.some(month => {
            return sourceData.some(record => {
                const recordMonth = getMonthFromDate(record.goLiveDate);
                const functionalTotal = parseInt(record.functionalTestTotal) || 0;
                const regressionTotal = parseInt(record.regressionTestTotal) || 0;
                return recordMonth === month && (functionalTotal > 0 || regressionTotal > 0);
            });
        });
        
        if (hasDataInPreviousMonths) {
            monthsToShow = previousMonths;
            chartTitle = `Test Cases Trends (3 months before ${filters.month})`;
        }
    }
    
    // Fallback: Find any months with test data
    if (monthsToShow.length === 0) {
        monthsToShow = findMonthsWithTestData(sourceData, 3);
        chartTitle = 'Test Cases Trends (Available months)';
        console.log('Using available months with data:', monthsToShow);
    }
    
    if (monthsToShow.length === 0) {
        showEmptyTrendsChart('No months with test case data found');
        return;
    }
    
    console.log('Final months to show:', monthsToShow);
    
    // Determine entities to compare based on filters
    let entitiesToCompare = [];
    let entityType = '';
    
    if (filters.group && filters.subGroup) {
        // Show applications within the selected subgroup
        entityType = 'Applications';
        entitiesToCompare = [...new Set(sourceData
            .filter(d => d.group === filters.group && d.subGroup === filters.subGroup)
            .map(d => d.application)
            .filter(app => app && app.trim())
        )];
    } else if (filters.group) {
        // Show subgroups within the selected group
        entityType = 'Sub Groups';
        entitiesToCompare = [...new Set(sourceData
            .filter(d => d.group === filters.group)
            .map(d => d.subGroup)
            .filter(sg => sg && sg.trim())
        )];
    } else {
        // Show all groups
        entityType = 'Groups';
        entitiesToCompare = [...new Set(sourceData
            .map(d => d.group)
            .filter(g => g && g.trim())
        )];
    }
    
    console.log(`Entity type: ${entityType}`);
    console.log(`Entities to compare: [${entitiesToCompare.join(', ')}]`);
    
    if (entitiesToCompare.length === 0) {
        showEmptyTrendsChart(`No ${entityType.toLowerCase()} found for current filters`);
        return;
    }
    
    // Generate colors for different entities
    const colors = [
        '#c41e3a', '#3498db', '#27ae60', '#f39c12', '#9b59b6',
        '#e74c3c', '#2ecc71', '#f1c40f', '#8e44ad', '#16a085',
        '#e67e22', '#34495e', '#95a5a6', '#d35400', '#7f8c8d'
    ];
    
    // Calculate data for each entity across all months
    const datasets = entitiesToCompare.map((entity, index) => {
        console.log(`\nProcessing entity: ${entity}`);
        
        const entityData = monthsToShow.map(month => {
            console.log(`  Processing ${entity} for ${month}`);
            
            // Filter data for this specific entity and month
            const monthEntityData = sourceData.filter(d => {
                const recordMonth = getMonthFromDate(d.goLiveDate);
                const matchMonth = recordMonth === month;
                
                if (!matchMonth) return false;
                
                // Apply entity filtering based on current filter level
                if (filters.group && filters.subGroup) {
                    // Application level
                    return d.group === filters.group && 
                           d.subGroup === filters.subGroup && 
                           d.application === entity;
                } else if (filters.group) {
                    // SubGroup level
                    return d.group === filters.group && d.subGroup === entity;
                } else {
                    // Group level
                    return d.group === entity;
                }
            });
            
            console.log(`    Found ${monthEntityData.length} records for ${entity} in ${month}`);
            
            // Calculate total test cases for this entity in this month
            const functionalTotal = monthEntityData.reduce((sum, d) => {
                const value = parseInt(d.functionalTestTotal) || 0;
                return sum + value;
            }, 0);
            
            const regressionTotal = monthEntityData.reduce((sum, d) => {
                const value = parseInt(d.regressionTestTotal) || 0;
                return sum + value;
            }, 0);
            
            const totalTestCases = functionalTotal + regressionTotal;
            
            console.log(`    ${entity} in ${month}: Functional=${functionalTotal}, Regression=${regressionTotal}, Total=${totalTestCases}`);
            
            return {
                month,
                entity,
                totalTestCases,
                functionalTotal,
                regressionTotal,
                recordsCount: monthEntityData.length
            };
        });
        
        // Prepare dataset
        const displayName = entity.length > 15 ? entity.substring(0, 15) + '...' : entity;
        const totalAcrossMonths = entityData.reduce((sum, d) => sum + d.totalTestCases, 0);
        
        console.log(`${entity} total across all months: ${totalAcrossMonths}`);
        
        return {
            label: displayName,
            data: entityData.map(d => d.totalTestCases),
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20', // 20% opacity
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: colors[index % colors.length],
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            // Store additional data for tooltips
            fullName: entity,
            monthlyData: entityData
        };
    });
    
    // Check if we have any data
    const totalDataPoints = datasets.reduce((sum, dataset) => 
        sum + dataset.data.reduce((dataSum, val) => dataSum + val, 0), 0);
    
    if (totalDataPoints === 0) {
        console.warn('All datasets have zero data');
        showEmptyTrendsChart(`No test case data found for ${entityType.toLowerCase()}`);
        return;
    }
    
    console.log(`Creating chart with ${datasets.length} datasets and ${totalDataPoints} total data points`);
    
    // Create the chart
    const fontSize = getResponsiveFontSize();
    
    charts.testCasesTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthsToShow,
            datasets: datasets
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
                    position: window.innerWidth < 768 ? 'bottom' : 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 12,
                        font: {
                            size: fontSize - 1
                        },
                        generateLabels: function(chart) {
                            const original = Chart.defaults.plugins.legend.labels.generateLabels;
                            const labels = original.call(this, chart);
                            
                            // Add total test cases to legend labels
                            labels.forEach((label, index) => {
                                const dataset = chart.data.datasets[index];
                                const totalAcrossMonths = dataset.data.reduce((sum, val) => sum + val, 0);
                                label.text = `${label.text} (${totalAcrossMonths.toLocaleString()})`;
                            });
                            
                            return labels;
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
                            return `${context[0].label} - Test Cases Execution`;
                        },
                        label: function(context) {
                            const dataset = context.dataset;
                            const monthlyData = dataset.monthlyData[context.dataIndex];
                            
                            return [
                                `${dataset.fullName}: ${context.parsed.y.toLocaleString()} total`,
                                `  • Functional: ${monthlyData.functionalTotal.toLocaleString()}`,
                                `  • Regression: ${monthlyData.regressionTotal.toLocaleString()}`,
                                `  • Releases: ${monthlyData.recordsCount}`
                            ];
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
                    },
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            size: fontSize,
                            weight: 'bold'
                        }
                    }
                },
                y: {
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
                        text: 'Number of Test Cases Executed',
                        font: {
                            size: fontSize,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
    
    // Add summary information below the chart
    addTrendsSummary(entitiesToCompare, entityType, monthsToShow, datasets, chartTitle);
    
    console.log('Test cases trends chart created successfully');
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Function to show empty state
function showEmptyTrendsChart(message) {
    const canvas = document.getElementById('testCasesTrendsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    
    console.log('Empty state shown:', message);
}

// Function to add summary information below the chart
function addTrendsSummary(entities, entityType, months, datasets, chartTitle) {
    const container = document.getElementById('testCasesTrendsChart').closest('.chart-container');
    if (!container) return;
    
    // Remove existing summary
    const existingSummary = container.querySelector('.trends-summary');
    if (existingSummary) {
        existingSummary.remove();
    }
    
    // Calculate summary statistics
    const totalAcrossAll = datasets.reduce((sum, dataset) => 
        sum + dataset.data.reduce((dataSum, val) => dataSum + val, 0), 0);
    
    const avgPerEntity = entities.length > 0 ? Math.round(totalAcrossAll / entities.length) : 0;
    const maxEntity = datasets.reduce((max, dataset) => {
        const total = dataset.data.reduce((sum, val) => sum + val, 0);
        return total > max.total ? { name: dataset.fullName, total } : max;
    }, { name: '', total: 0 });
    
    // Latest month data (last month in the trend)
    const latestMonth = months[months.length - 1];
    const latestMonthData = datasets.map(dataset => ({
        name: dataset.fullName,
        value: dataset.data[dataset.data.length - 1]
    })).sort((a, b) => b.value - a.value);
    
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'trends-summary';
    summaryDiv.style.cssText = `
        margin-top: 20px;
        padding: 15px;
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-radius: 8px;
        border-left: 4px solid #c41e3a;
        font-size: 13px;
        color: #666;
    `;
    
    const isMobile = window.innerWidth < 768;
    
    summaryDiv.innerHTML = `
        <div style="font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">
            📈 ${chartTitle || `${entityType} Trends Summary`}
        </div>
        <div style="display: grid; grid-template-columns: ${isMobile ? '1fr' : '1fr 1fr'}; gap: 12px;">
            <div>
                <strong style="color: #c41e3a;">Period:</strong> ${months.join(' → ')}<br>
                <strong style="color: #3498db;">Total Test Cases:</strong> ${totalAcrossAll.toLocaleString()}<br>
                <strong style="color: #27ae60;">Average per ${entityType.slice(0, -1)}:</strong> ${avgPerEntity.toLocaleString()}<br>
                <strong style="color: #f39c12;">Top Performer:</strong> ${maxEntity.name} (${maxEntity.total.toLocaleString()})
            </div>
            <div>
                <strong style="color: #9b59b6;">${latestMonth} Rankings:</strong><br>
                ${latestMonthData.slice(0, 3).map((item, index) => 
                    `${index + 1}. ${item.name}: ${item.value.toLocaleString()}`
                ).join('<br>')}
                ${latestMonthData.length > 3 ? '<br>...' : ''}
            </div>
        </div>
    `;
    
    container.appendChild(summaryDiv);
}

// =====================================================
// MAIN UPDATE FUNCTION
// =====================================================

function updateTestCasesTrends() {
    console.log('\n=== UPDATING TEST CASES TRENDS ===');
    console.log('Current filters:', filters);
    
    // Use qualityData as the source
    const sourceData = typeof qualityData !== 'undefined' ? qualityData : [];
    
    if (sourceData.length === 0) {
        console.error('No qualityData available');
        showEmptyTrendsChart('No data available');
        return;
    }
    
    console.log('Using qualityData with', sourceData.length, 'records');
    
    // Render the trends chart
    renderTestCasesTrendsChart(sourceData);
}

// =====================================================
// INTEGRATION FUNCTIONS
// =====================================================

// Function to add trends chart to a tab (if not already added)
function ensureTrendsChartExists() {
    // Check if chart canvas already exists
    if (document.getElementById('testCasesTrendsChart')) {
        return true;
    }
    
    // Try to add to execution tab
    const executionTab = document.getElementById('execution');
    if (executionTab) {
        const chartHTML = `
            <div class="chart-container">
                <div class="chart-header">Test Cases Execution Trends</div>
                <div class="chart-wrapper">
                    <canvas id="testCasesTrendsChart"></canvas>
                </div>
            </div>
        `;
        executionTab.insertAdjacentHTML('beforeend', chartHTML);
        console.log('Trends chart canvas added to execution tab');
        return true;
    }
    
    console.error('Could not find execution tab to add trends chart');
    return false;
}

// =====================================================
// DEBUGGING FUNCTIONS
// =====================================================

function debugTrendsChartQuick() {
    console.log('=== QUICK TRENDS DEBUG ===');
    
    // Check basic setup
    console.log('qualityData available:', typeof qualityData !== 'undefined');
    console.log('qualityData length:', qualityData ? qualityData.length : 0);
    console.log('Current filters:', filters);
    
    // Check canvas
    const canvas = document.getElementById('testCasesTrendsChart');
    console.log('Canvas exists:', !!canvas);
    
    // Check sample data
    if (qualityData && qualityData.length > 0) {
        const sample = qualityData[0];
        console.log('Sample record:', {
            group: sample.group,
            subGroup: sample.subGroup,
            application: sample.application,
            goLiveDate: sample.goLiveDate,
            functionalTestTotal: sample.functionalTestTotal,
            regressionTestTotal: sample.regressionTestTotal
        });
        
        // Check months in data
        const months = qualityData.map(d => getMonthFromDate(d.goLiveDate)).filter(m => m);
        const uniqueMonths = [...new Set(months)];
        console.log('Unique months in data:', uniqueMonths);
        
        // Check test case totals
        const withTestCases = qualityData.filter(d => 
            (parseInt(d.functionalTestTotal) || 0) > 0 || 
            (parseInt(d.regressionTestTotal) || 0) > 0
        );
        console.log('Records with test cases:', withTestCases.length);
    }
}

// =====================================================
// CALL THIS TO SET EVERYTHING UP
// =====================================================

function initializeTrendsChart() {
    console.log('Initializing trends chart...');
    
    // Ensure canvas exists
    if (!ensureTrendsChartExists()) {
        console.error('Failed to create trends chart canvas');
        return false;
    }
    
    // Initial render
    setTimeout(() => {
        updateTestCasesTrends();
    }, 500);
    
    return true;
}

// Run this after your page loads:
// initializeTrendsChart();
