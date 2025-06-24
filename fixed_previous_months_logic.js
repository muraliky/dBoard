// FIXED PREVIOUS MONTHS LOGIC - Replace in dashboard-charts.js
// This function now gets the PAST 3 months from the selected month (not including current)

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
    if (currentIndex === -1) {
        console.warn('Invalid month:', currentMonth);
        return [currentMonth]; // Return current month if invalid
    }
    
    console.log(`Getting ${count} months BEFORE ${currentMonth} (index ${currentIndex})`);
    
    const result = [];
    
    // Get the PREVIOUS months (not including current month)
    for (let i = count; i >= 1; i--) {
        let monthIndex = (currentIndex - i + 12) % 12;
        result.push(months[monthIndex]);
    }
    
    console.log(`Previous months result:`, result);
    return result;
}

// ENHANCED version with better logic and validation
function getPreviousMonthsEnhanced(selectedMonth, count = 3) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Handle case where no month is selected
    if (!selectedMonth || selectedMonth === '') {
        console.log('No month selected, using current month');
        const now = new Date();
        selectedMonth = months[now.getMonth()];
    }
    
    const selectedIndex = months.indexOf(selectedMonth);
    if (selectedIndex === -1) {
        console.error('Invalid month:', selectedMonth);
        return [];
    }
    
    console.log(`=== GETTING PREVIOUS MONTHS ===`);
    console.log(`Selected month: ${selectedMonth} (index: ${selectedIndex})`);
    console.log(`Requesting ${count} months BEFORE the selected month`);
    
    const previousMonths = [];
    
    // Get the months BEFORE the selected month
    for (let i = count; i >= 1; i--) {
        // Calculate the index for the month that is 'i' months before
        let previousIndex = selectedIndex - i;
        
        // Handle year boundary (wrap around)
        if (previousIndex < 0) {
            previousIndex += 12;
        }
        
        const previousMonth = months[previousIndex];
        previousMonths.push(previousMonth);
        
        console.log(`  ${count - i + 1}. ${i} months before: ${previousMonth} (index: ${previousIndex})`);
    }
    
    console.log(`Final result: [${previousMonths.join(', ')}] -> ${selectedMonth}`);
    return previousMonths;
}

// UPDATED renderTestCasesTrendsChart with better month logic
function renderTestCasesTrendsChart(data) {
    const ctx = document.getElementById('testCasesTrendsChart');
    if (!ctx) {
        console.error('Test cases trends chart canvas not found');
        return;
    }
    
    safeDestroyChart('testCasesTrends');
    
    // Get the PREVIOUS 3 months from the currently selected month
    const selectedMonth = filters.month;
    const previousMonths = getPreviousMonthsEnhanced(selectedMonth, 3);
    
    console.log('=== TRENDS CHART CONFIGURATION ===');
    console.log('Selected month in filter:', selectedMonth);
    console.log('Showing trends for PREVIOUS months:', previousMonths);
    console.log('Current filters:', filters);
    
    if (previousMonths.length === 0) {
        console.error('No valid previous months found');
        return;
    }
    
    // Determine what entities to compare based on current filters
    let entitiesToCompare = [];
    let entityType = '';
    
    if (filters.group && filters.subGroup) {
        entityType = 'Applications';
        entitiesToCompare = [...new Set(data
            .filter(d => d.group === filters.group && d.subGroup === filters.subGroup)
            .map(d => d.application))];
    } else if (filters.group) {
        entityType = 'Sub Groups';
        entitiesToCompare = [...new Set(data
            .filter(d => d.group === filters.group)
            .map(d => d.subGroup))];
    } else {
        entityType = 'Groups';
        entitiesToCompare = [...new Set(data.map(d => d.group))];
    }
    
    console.log(`Comparing ${entityType}:`, entitiesToCompare);
    
    if (entitiesToCompare.length === 0) {
        console.warn('No entities found to compare');
        // Show empty state
        const ctx = document.getElementById('testCasesTrendsChart').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data available for comparison', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    // Generate colors for different entities
    const colors = [
        '#c41e3a', '#3498db', '#27ae60', '#f39c12', '#9b59b6',
        '#e74c3c', '#2ecc71', '#f1c40f', '#8e44ad', '#16a085',
        '#e67e22', '#34495e', '#95a5a6', '#d35400', '#7f8c8d'
    ];
    
    // Calculate data for each entity across the previous months
    const datasets = entitiesToCompare.map((entity, index) => {
        const entityData = previousMonths.map(month => {
            console.log(`Processing ${entity} for month ${month}`);
            
            // Filter data for this specific entity and month
            const monthEntityData = data.filter(d => {
                const recordMonth = getMonthFromDate(d.goLiveDate);
                const matchMonth = recordMonth === month;
                
                let matchEntity = false;
                if (filters.group && filters.subGroup) {
                    // Application level
                    matchEntity = d.group === filters.group && 
                                 d.subGroup === filters.subGroup && 
                                 d.application === entity;
                } else if (filters.group) {
                    // SubGroup level
                    matchEntity = d.group === filters.group && d.subGroup === entity;
                } else {
                    // Group level
                    matchEntity = d.group === entity;
                }
                
                return matchMonth && matchEntity;
            });
            
            // Calculate total test cases for this entity in this month
            const functionalTotal = monthEntityData.reduce((sum, d) => sum + (d.functionalTestTotal || 0), 0);
            const regressionTotal = monthEntityData.reduce((sum, d) => sum + (d.regressionTestTotal || 0), 0);
            const totalTestCases = functionalTotal + regressionTotal;
            
            console.log(`  ${entity} in ${month}: ${totalTestCases} test cases (${monthEntityData.length} records)`);
            
            return {
                month,
                entity,
                totalTestCases,
                functionalTotal,
                regressionTotal,
                recordsCount: monthEntityData.length
            };
        });
        
        // Truncate entity name for legend if too long
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
            fullName: entity,
            monthlyData: entityData
        };
    });
    
    console.log('Datasets created:', datasets.length);
    
    const fontSize = getResponsiveFontSize();
    
    charts.testCasesTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: previousMonths,
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
                    enabled: false
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
                        text: `Months (Before ${selectedMonth || 'Current'})`,
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
    
    // Add summary information
    addTrendsSummaryEnhanced(entitiesToCompare, entityType, previousMonths, selectedMonth, datasets);
    
    console.log('Multi-group test cases trends chart created successfully');
}

// Enhanced summary with better context
function addTrendsSummaryEnhanced(entities, entityType, previousMonths, selectedMonth, datasets) {
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
    const latestMonth = previousMonths[previousMonths.length - 1];
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
            📈 ${entityType} Trends - 3 Months Before ${selectedMonth || 'Current Month'}
        </div>
        <div style="display: grid; grid-template-columns: ${isMobile ? '1fr' : '1fr 1fr'}; gap: 12px;">
            <div>
                <strong style="color: #c41e3a;">Period:</strong> ${previousMonths.join(' → ')}<br>
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

// TEST FUNCTION - Run this to verify the month logic
function testMonthLogic() {
    console.log('=== TESTING MONTH LOGIC ===');
    
    const testMonths = ['January', 'March', 'June', 'December'];
    
    testMonths.forEach(month => {
        console.log(`\nTesting with selected month: ${month}`);
        const previous = getPreviousMonthsEnhanced(month, 3);
        console.log(`Previous 3 months: [${previous.join(', ')}]`);
    });
    
    // Test with current filter
    console.log(`\nCurrent filter month: ${filters.month}`);
    const currentPrevious = getPreviousMonthsEnhanced(filters.month, 3);
    console.log(`Previous months for current filter: [${currentPrevious.join(', ')}]`);
}
