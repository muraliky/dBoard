// COMPREHENSIVE DEBUGGING FOR TRENDS CHART
// Add these debugging functions to your dashboard-charts.js

// STEP 1: Debug the raw data and month extraction
function debugTrendsData() {
    console.log('=== DEBUGGING TRENDS CHART DATA ===');
    
    // Check filters
    console.log('Current filters:', filters);
    
    // Check raw data
    const allData = typeof qualityData !== 'undefined' ? qualityData : getFilteredData();
    console.log('Total records in data:', allData.length);
    
    // Check first few records
    console.log('Sample records:');
    allData.slice(0, 5).forEach((record, index) => {
        console.log(`Record ${index + 1}:`, {
            group: record.group,
            subGroup: record.subGroup,
            application: record.application,
            goLiveDate: record.goLiveDate,
            extractedMonth: getMonthFromDate(record.goLiveDate),
            functionalTestTotal: record.functionalTestTotal,
            regressionTestTotal: record.regressionTestTotal
        });
    });
    
    // Check month extraction for all records
    console.log('\n=== MONTH EXTRACTION ANALYSIS ===');
    const monthCounts = {};
    allData.forEach(record => {
        const month = getMonthFromDate(record.goLiveDate);
        monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    console.log('Records per month:', monthCounts);
    
    // Test the previous months logic
    const selectedMonth = filters.month;
    const previousMonths = getPreviousMonthsEnhanced(selectedMonth, 3);
    console.log(`\nSelected month: ${selectedMonth}`);
    console.log(`Previous months: [${previousMonths.join(', ')}]`);
    
    // Check if we have data for previous months
    previousMonths.forEach(month => {
        const recordsForMonth = allData.filter(d => getMonthFromDate(d.goLiveDate) === month);
        console.log(`${month}: ${recordsForMonth.length} records`);
        
        if (recordsForMonth.length > 0) {
            const totalTestCases = recordsForMonth.reduce((sum, d) => 
                sum + (d.functionalTestTotal || 0) + (d.regressionTestTotal || 0), 0);
            console.log(`  Total test cases in ${month}: ${totalTestCases}`);
        }
    });
    
    return { allData, monthCounts, previousMonths };
}

// STEP 2: Debug entity filtering
function debugEntityFiltering() {
    console.log('\n=== DEBUGGING ENTITY FILTERING ===');
    
    const allData = typeof qualityData !== 'undefined' ? qualityData : getFilteredData();
    
    // Determine entities based on current filters
    let entitiesToCompare = [];
    let entityType = '';
    
    if (filters.group && filters.subGroup) {
        entityType = 'Applications';
        entitiesToCompare = [...new Set(allData
            .filter(d => d.group === filters.group && d.subGroup === filters.subGroup)
            .map(d => d.application))];
        console.log(`Filter: Group="${filters.group}" + SubGroup="${filters.subGroup}"`);
    } else if (filters.group) {
        entityType = 'Sub Groups';
        entitiesToCompare = [...new Set(allData
            .filter(d => d.group === filters.group)
            .map(d => d.subGroup))];
        console.log(`Filter: Group="${filters.group}" only`);
    } else {
        entityType = 'Groups';
        entitiesToCompare = [...new Set(allData.map(d => d.group))];
        console.log('Filter: No group selected, showing all groups');
    }
    
    console.log(`Entity type: ${entityType}`);
    console.log(`Entities to compare: [${entitiesToCompare.join(', ')}]`);
    
    // Test each entity with sample data
    entitiesToCompare.forEach(entity => {
        console.log(`\nTesting entity: ${entity}`);
        
        const entityRecords = allData.filter(d => {
            if (filters.group && filters.subGroup) {
                return d.group === filters.group && d.subGroup === filters.subGroup && d.application === entity;
            } else if (filters.group) {
                return d.group === filters.group && d.subGroup === entity;
            } else {
                return d.group === entity;
            }
        });
        
        console.log(`  Records for ${entity}: ${entityRecords.length}`);
        
        if (entityRecords.length > 0) {
            const totalTestCases = entityRecords.reduce((sum, d) => 
                sum + (d.functionalTestTotal || 0) + (d.regressionTestTotal || 0), 0);
            console.log(`  Total test cases for ${entity}: ${totalTestCases}`);
            
            // Check by month
            const previousMonths = getPreviousMonthsEnhanced(filters.month, 3);
            previousMonths.forEach(month => {
                const monthRecords = entityRecords.filter(d => getMonthFromDate(d.goLiveDate) === month);
                const monthTestCases = monthRecords.reduce((sum, d) => 
                    sum + (d.functionalTestTotal || 0) + (d.regressionTestTotal || 0), 0);
                console.log(`    ${month}: ${monthRecords.length} records, ${monthTestCases} test cases`);
            });
        }
    });
    
    return { entityType, entitiesToCompare };
}

// STEP 3: Fixed trends chart with better data handling
function renderTestCasesTrendsChartFixed(data) {
    console.log('=== RENDERING FIXED TRENDS CHART ===');
    
    const ctx = document.getElementById('testCasesTrendsChart');
    if (!ctx) {
        console.error('Test cases trends chart canvas not found');
        return;
    }
    
    safeDestroyChart('testCasesTrends');
    
    // Use the actual data source
    const sourceData = data || qualityData || [];
    console.log('Source data length:', sourceData.length);
    
    if (sourceData.length === 0) {
        console.error('No source data available');
        showEmptyTrendsChart('No data available');
        return;
    }
    
    // Get previous months
    const selectedMonth = filters.month || new Date().toLocaleString('default', { month: 'long' });
    const previousMonths = getPreviousMonthsEnhanced(selectedMonth, 3);
    
    console.log('Selected month:', selectedMonth);
    console.log('Previous months:', previousMonths);
    
    // Determine entities to compare
    let entitiesToCompare = [];
    let entityType = '';
    
    if (filters.group && filters.subGroup) {
        entityType = 'Applications';
        const filteredData = sourceData.filter(d => d.group === filters.group && d.subGroup === filters.subGroup);
        entitiesToCompare = [...new Set(filteredData.map(d => d.application))].filter(app => app && app.trim());
    } else if (filters.group) {
        entityType = 'Sub Groups';
        const filteredData = sourceData.filter(d => d.group === filters.group);
        entitiesToCompare = [...new Set(filteredData.map(d => d.subGroup))].filter(sg => sg && sg.trim());
    } else {
        entityType = 'Groups';
        entitiesToCompare = [...new Set(sourceData.map(d => d.group))].filter(g => g && g.trim());
    }
    
    console.log(`Entity type: ${entityType}`);
    console.log(`Entities: [${entitiesToCompare.join(', ')}]`);
    
    if (entitiesToCompare.length === 0) {
        console.error('No entities found');
        showEmptyTrendsChart('No entities found for current filters');
        return;
    }
    
    // Generate colors
    const colors = [
        '#c41e3a', '#3498db', '#27ae60', '#f39c12', '#9b59b6',
        '#e74c3c', '#2ecc71', '#f1c40f', '#8e44ad', '#16a085'
    ];
    
    // Calculate datasets
    const datasets = entitiesToCompare.map((entity, index) => {
        console.log(`\nProcessing entity: ${entity}`);
        
        const entityMonthlyData = previousMonths.map(month => {
            console.log(`  Processing ${entity} for ${month}`);
            
            // Filter records for this entity and month
            let entityRecords = sourceData.filter(d => {
                // Month match
                const recordMonth = getMonthFromDate(d.goLiveDate);
                const monthMatch = recordMonth === month;
                
                if (!monthMatch) return false;
                
                // Entity match based on filter level
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
            
            console.log(`    Found ${entityRecords.length} records for ${entity} in ${month}`);
            
            // Calculate test cases
            const functionalTotal = entityRecords.reduce((sum, d) => sum + (parseInt(d.functionalTestTotal) || 0), 0);
            const regressionTotal = entityRecords.reduce((sum, d) => sum + (parseInt(d.regressionTestTotal) || 0), 0);
            const totalTestCases = functionalTotal + regressionTotal;
            
            console.log(`    ${entity} in ${month}: Functional=${functionalTotal}, Regression=${regressionTotal}, Total=${totalTestCases}`);
            
            return {
                month,
                entity,
                totalTestCases,
                functionalTotal,
                regressionTotal,
                recordsCount: entityRecords.length
            };
        });
        
        const displayName = entity.length > 15 ? entity.substring(0, 15) + '...' : entity;
        const totalAcrossMonths = entityMonthlyData.reduce((sum, d) => sum + d.totalTestCases, 0);
        
        console.log(`${entity} total across all months: ${totalAcrossMonths}`);
        
        return {
            label: displayName,
            data: entityMonthlyData.map(d => d.totalTestCases),
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
            monthlyData: entityMonthlyData
        };
    });
    
    // Check if all datasets have zero data
    const totalDataPoints = datasets.reduce((sum, dataset) => 
        sum + dataset.data.reduce((dataSum, val) => dataSum + val, 0), 0);
    
    if (totalDataPoints === 0) {
        console.warn('All datasets have zero data');
        showEmptyTrendsChart(`No test case data found for ${previousMonths.join(', ')}`);
        return;
    }
    
    console.log('Creating chart with datasets:', datasets.length);
    
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
                        text: `Months (Before ${selectedMonth})`,
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
    
    console.log('Trends chart created successfully');
}

// Helper function to show empty state
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

// UPDATED updateTestCasesTrends function
function updateTestCasesTrendsFixed() {
    console.log('\n=== UPDATING TRENDS CHART ===');
    
    // Debug first
    const debugInfo = debugTrendsData();
    debugEntityFiltering();
    
    // Use the original data source, not filtered data
    const sourceData = typeof qualityData !== 'undefined' ? qualityData : [];
    
    if (sourceData.length === 0) {
        console.error('No source data available');
        showEmptyTrendsChart('No data available');
        return;
    }
    
    // Render with fixed function
    renderTestCasesTrendsChartFixed(sourceData);
}

// SIMPLE TEST FUNCTION - Run this to check your data
function testTrendsChartData() {
    console.log('=== SIMPLE TRENDS DATA TEST ===');
    
    // Check if basic data exists
    const hasQualityData = typeof qualityData !== 'undefined' && qualityData.length > 0;
    console.log('Quality data available:', hasQualityData);
    
    if (hasQualityData) {
        console.log('Quality data length:', qualityData.length);
        
        // Check a few records for test case data
        const recordsWithTestCases = qualityData.filter(d => 
            (d.functionalTestTotal && d.functionalTestTotal > 0) || 
            (d.regressionTestTotal && d.regressionTestTotal > 0)
        );
        console.log('Records with test cases:', recordsWithTestCases.length);
        
        if (recordsWithTestCases.length > 0) {
            console.log('Sample record with test cases:');
            console.log(recordsWithTestCases[0]);
        }
    }
    
    // Test month extraction
    console.log('\nTesting month extraction:');
    console.log('Current filter month:', filters.month);
    
    if (hasQualityData) {
        const sampleDates = qualityData.slice(0, 5).map(d => ({
            original: d.goLiveDate,
            extracted: getMonthFromDate(d.goLiveDate)
        }));
        console.log('Sample date extractions:', sampleDates);
    }
}
