// DIAGNOSED AND FIXED TRENDS CHART
// Replace your trends chart functions with these

// Enhanced month extraction with better debugging
function getMonthFromDateEnhanced(dateString) {
    if (!dateString) return null;
    
    try {
        let date;
        
        // Handle Excel serial numbers
        if (typeof dateString === 'number') {
            date = new Date((dateString - 25569) * 86400 * 1000);
        } else if (typeof dateString === 'string') {
            const trimmed = dateString.trim();
            
            // Try different date formats
            if (trimmed.includes('/')) {
                const parts = trimmed.split('/');
                if (parts.length === 3) {
                    // Try MM/DD/YYYY first, then DD/MM/YYYY
                    date = new Date(parts[2], parts[0] - 1, parts[1]);
                    if (isNaN(date.getTime())) {
                        date = new Date(parts[2], parts[1] - 1, parts[0]);
                    }
                }
            } else if (trimmed.includes('-')) {
                date = new Date(trimmed);
            } else {
                date = new Date(trimmed);
            }
        } else {
            date = new Date(dateString);
        }
        
        if (isNaN(date.getTime())) {
            return null;
        }
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        return monthNames[date.getMonth()];
        
    } catch (error) {
        console.warn('Error parsing date:', dateString, error);
        return null;
    }
}

// Comprehensive data analysis function
function analyzeTrendsData() {
    console.log('=== COMPREHENSIVE TRENDS DATA ANALYSIS ===');
    
    const sourceData = qualityData || [];
    console.log('Total records:', sourceData.length);
    
    if (sourceData.length === 0) {
        console.error('No qualityData available');
        return { availableMonths: [], monthData: {} };
    }
    
    // Analyze all months in the data
    const monthData = {};
    const allDates = [];
    
    sourceData.forEach((record, index) => {
        const month = getMonthFromDateEnhanced(record.goLiveDate);
        const functionalTotal = parseInt(record.functionalTestTotal) || 0;
        const regressionTotal = parseInt(record.regressionTestTotal) || 0;
        const totalTestCases = functionalTotal + regressionTotal;
        
        // Store original date for debugging
        allDates.push({
            original: record.goLiveDate,
            extracted: month,
            index: index
        });
        
        if (month) {
            if (!monthData[month]) {
                monthData[month] = {
                    recordCount: 0,
                    totalTestCases: 0,
                    records: []
                };
            }
            
            monthData[month].recordCount++;
            monthData[month].totalTestCases += totalTestCases;
            monthData[month].records.push({
                group: record.group,
                subGroup: record.subGroup,
                application: record.application,
                functionalTotal,
                regressionTotal,
                totalTestCases
            });
        }
    });
    
    console.log('Sample date extractions (first 10):');
    allDates.slice(0, 10).forEach(d => {
        console.log(`  "${d.original}" -> "${d.extracted}"`);
    });
    
    console.log('\nMonth analysis:');
    Object.entries(monthData).forEach(([month, data]) => {
        console.log(`${month}: ${data.recordCount} records, ${data.totalTestCases} test cases`);
    });
    
    const availableMonths = Object.keys(monthData)
        .filter(month => monthData[month].totalTestCases > 0)
        .sort((a, b) => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
            return months.indexOf(a) - months.indexOf(b);
        });
    
    console.log('Available months with test data:', availableMonths);
    
    return { availableMonths, monthData, allDates };
}

// Fixed function to get meaningful months for trends
function getMonthsForTrends(selectedMonth) {
    console.log('\n=== GETTING MONTHS FOR TRENDS ===');
    
    const analysis = analyzeTrendsData();
    const { availableMonths, monthData } = analysis;
    
    if (availableMonths.length === 0) {
        console.error('No months with test data found');
        return [];
    }
    
    console.log(`Selected month: "${selectedMonth}"`);
    console.log('Available months:', availableMonths);
    
    // Strategy 1: If we have 3+ months, show the last 3
    if (availableMonths.length >= 3) {
        const last3Months = availableMonths.slice(-3);
        console.log('Using last 3 months:', last3Months);
        return last3Months;
    }
    
    // Strategy 2: Show all available months
    console.log('Using all available months:', availableMonths);
    return availableMonths;
}

// MAIN FIXED TRENDS CHART FUNCTION
function renderTestCasesTrendsChartFixed(data) {
    console.log('\n=== RENDERING FIXED TRENDS CHART ===');
    
    const ctx = document.getElementById('testCasesTrendsChart');
    if (!ctx) {
        console.error('Canvas not found');
        return;
    }
    
    safeDestroyChart('testCasesTrends');
    
    const sourceData = data || qualityData || [];
    if (sourceData.length === 0) {
        showEmptyTrendsChart('No data available');
        return;
    }
    
    // Get months that actually have data
    const monthsToShow = getMonthsForTrends(filters.month);
    
    if (monthsToShow.length === 0) {
        showEmptyTrendsChart('No months with test case data found');
        return;
    }
    
    console.log('Final months to display:', monthsToShow);
    
    // Determine entities based on current filters
    let entitiesToCompare = [];
    let entityType = '';
    
    // Get entities that actually have data in the selected months
    const entitiesWithData = new Set();
    
    sourceData.forEach(record => {
        const month = getMonthFromDateEnhanced(record.goLiveDate);
        if (!monthsToShow.includes(month)) return;
        
        const functionalTotal = parseInt(record.functionalTestTotal) || 0;
        const regressionTotal = parseInt(record.regressionTestTotal) || 0;
        if (functionalTotal === 0 && regressionTotal === 0) return;
        
        if (filters.group && filters.subGroup) {
            if (record.group === filters.group && record.subGroup === filters.subGroup) {
                entitiesWithData.add(record.application);
            }
        } else if (filters.group) {
            if (record.group === filters.group) {
                entitiesWithData.add(record.subGroup);
            }
        } else {
            entitiesWithData.add(record.group);
        }
    });
    
    if (filters.group && filters.subGroup) {
        entityType = 'Applications';
        entitiesToCompare = Array.from(entitiesWithData).filter(e => e && e.trim());
    } else if (filters.group) {
        entityType = 'Sub Groups';
        entitiesToCompare = Array.from(entitiesWithData).filter(e => e && e.trim());
    } else {
        entityType = 'Groups';
        entitiesToCompare = Array.from(entitiesWithData).filter(e => e && e.trim());
    }
    
    console.log(`Entity type: ${entityType}`);
    console.log(`Entities with data: [${entitiesToCompare.join(', ')}]`);
    
    if (entitiesToCompare.length === 0) {
        showEmptyTrendsChart(`No ${entityType.toLowerCase()} found with test data`);
        return;
    }
    
    // Generate colors
    const colors = [
        '#c41e3a', '#3498db', '#27ae60', '#f39c12', '#9b59b6',
        '#e74c3c', '#2ecc71', '#f1c40f', '#8e44ad', '#16a085'
    ];
    
    // Calculate datasets with detailed logging
    const datasets = entitiesToCompare.map((entity, index) => {
        console.log(`\n--- Processing entity: ${entity} ---`);
        
        const entityData = monthsToShow.map(month => {
            console.log(`  Processing ${entity} for ${month}`);
            
            // Filter records for this entity and month
            const monthEntityData = sourceData.filter(d => {
                const recordMonth = getMonthFromDateEnhanced(d.goLiveDate);
                const matchMonth = recordMonth === month;
                
                if (!matchMonth) return false;
                
                // Entity matching
                if (filters.group && filters.subGroup) {
                    return d.group === filters.group && 
                           d.subGroup === filters.subGroup && 
                           d.application === entity;
                } else if (filters.group) {
                    return d.group === filters.group && d.subGroup === entity;
                } else {
                    return d.group === entity;
                }
            });
            
            console.log(`    Found ${monthEntityData.length} records`);
            
            // Calculate totals
            const functionalTotal = monthEntityData.reduce((sum, d) => {
                return sum + (parseInt(d.functionalTestTotal) || 0);
            }, 0);
            
            const regressionTotal = monthEntityData.reduce((sum, d) => {
                return sum + (parseInt(d.regressionTestTotal) || 0);
            }, 0);
            
            const totalTestCases = functionalTotal + regressionTotal;
            
            console.log(`    Results: Functional=${functionalTotal}, Regression=${regressionTotal}, Total=${totalTestCases}`);
            
            return {
                month,
                entity,
                totalTestCases,
                functionalTotal,
                regressionTotal,
                recordsCount: monthEntityData.length
            };
        });
        
        const displayName = entity.length > 15 ? entity.substring(0, 15) + '...' : entity;
        const totalAcrossMonths = entityData.reduce((sum, d) => sum + d.totalTestCases, 0);
        
        console.log(`${entity} total across all months: ${totalAcrossMonths}`);
        console.log(`${entity} monthly data:`, entityData.map(d => `${d.month}:${d.totalTestCases}`).join(', '));
        
        return {
            label: displayName,
            data: entityData.map(d => d.totalTestCases),
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
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
    
    // Check for data
    const totalDataPoints = datasets.reduce((sum, dataset) => 
        sum + dataset.data.reduce((dataSum, val) => dataSum + val, 0), 0);
    
    console.log(`\nFinal check: ${datasets.length} datasets, ${totalDataPoints} total data points`);
    
    if (totalDataPoints === 0) {
        showEmptyTrendsChart('No test case data found for the selected criteria');
        return;
    }
    
    // Log final dataset summary
    datasets.forEach(dataset => {
        console.log(`Dataset "${dataset.label}": [${dataset.data.join(', ')}]`);
    });
    
    // Create chart
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
                        font: { size: fontSize - 1 },
                        generateLabels: function(chart) {
                            const original = Chart.defaults.plugins.legend.labels.generateLabels;
                            const labels = original.call(this, chart);
                            
                            labels.forEach((label, index) => {
                                const dataset = chart.data.datasets[index];
                                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                                label.text = `${label.text} (${total.toLocaleString()})`;
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
                customDataLabels: { enabled: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: fontSize } },
                    title: {
                        display: true,
                        text: `Months with Test Data (${monthsToShow.length} months)`,
                        font: { size: fontSize, weight: 'bold' }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    ticks: {
                        font: { size: fontSize },
                        callback: function(value) {
                            return value >= 1000 ? (value/1000).toFixed(1) + 'K' : value;
                        }
                    },
                    title: {
                        display: true,
                        text: 'Number of Test Cases Executed',
                        font: { size: fontSize, weight: 'bold' }
                    }
                }
            }
        }
    });
    
    // Add summary
    addTrendsSummaryFixed(entitiesToCompare, entityType, monthsToShow, datasets);
    
    console.log('✅ Trends chart created successfully!');
}

// Enhanced summary
function addTrendsSummaryFixed(entities, entityType, months, datasets) {
    const container = document.getElementById('testCasesTrendsChart').closest('.chart-container');
    if (!container) return;
    
    const existingSummary = container.querySelector('.trends-summary');
    if (existingSummary) existingSummary.remove();
    
    const totalAcrossAll = datasets.reduce((sum, dataset) => 
        sum + dataset.data.reduce((dataSum, val) => dataSum + val, 0), 0);
    
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
    
    summaryDiv.innerHTML = `
        <div style="font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">
            📈 ${entityType} Test Execution Trends
        </div>
        <div>
            <strong style="color: #c41e3a;">Period:</strong> ${months.join(' → ')}<br>
            <strong style="color: #3498db;">Total Test Cases:</strong> ${totalAcrossAll.toLocaleString()}<br>
            <strong style="color: #27ae60;">Entities Compared:</strong> ${entities.length}<br>
            <strong style="color: #f39c12;">Months with Data:</strong> ${months.length}
        </div>
    `;
    
    container.appendChild(summaryDiv);
}

// Updated main function
function updateTestCasesTrendsFixed() {
    console.log('\n=== UPDATING FIXED TRENDS CHART ===');
    console.log('Current filters:', filters);
    
    const sourceData = typeof qualityData !== 'undefined' ? qualityData : [];
    
    if (sourceData.length === 0) {
        showEmptyTrendsChart('No data available');
        return;
    }
    
    console.log('Source data length:', sourceData.length);
    
    // Run analysis first
    analyzeTrendsData();
    
    // Render chart
    renderTestCasesTrendsChartFixed(sourceData);
}

// DEBUGGING FUNCTION - Run this to see exactly what's happening
function debugMonthIssue() {
    console.log('\n=== DEBUGGING MONTH ISSUE ===');
    
    // Check current filter
    console.log('Current month filter:', filters.month);
    
    // Analyze what data we have
    const analysis = analyzeTrendsData();
    
    // Check what the previous month logic would give us
    if (filters.month) {
        const previousMonths = getPreviousMonthsForTrends(filters.month, 3);
        console.log(`Previous 3 months from ${filters.month}:`, previousMonths);
        
        previousMonths.forEach(month => {
            const hasData = analysis.monthData[month];
            if (hasData) {
                console.log(`  ${month}: ${hasData.recordCount} records, ${hasData.totalTestCases} test cases`);
            } else {
                console.log(`  ${month}: NO DATA`);
            }
        });
    }
    
    // Show what months would actually be displayed
    const finalMonths = getMonthsForTrends(filters.month);
    console.log('Final months that will be shown:', finalMonths);
    
    return analysis;
}
