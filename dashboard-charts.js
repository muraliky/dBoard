// Chart instances
let charts = {};

// Chart.js default settings
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
Chart.defaults.color = '#333';

// Overview Charts
function renderOverviewCharts() {
    const filteredData = getFilteredData();
    renderReleaseStatusChart(filteredData);
    renderUATStatusChart(filteredData);
}

function renderReleaseStatusChart(data) {
    const ctx = document.getElementById('releaseStatusChart');
    if (!ctx) return;
    
    if (charts.releaseStatus) {
        charts.releaseStatus.destroy();
    }
    
    // Determine labels based on filters
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Calculate status counts for each label
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
    
    charts.releaseStatus = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Completed',
                    data: goLiveCompleted,
                    backgroundColor: '#27ae60',
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9
                },
                {
                    label: 'Deferred',
                    data: goLiveDelayed,
                    backgroundColor: '#e74c3c',
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9
                },
                {
                    label: 'Planned',
                    data: goLivePlanned,
                    backgroundColor: '#3498db',
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const datasetIndex = context.datasetIndex;
                            const index = context.dataIndex;
                            const label = labels[index];
                            
                            // Calculate totals for this label
                            const totalReleases = data.filter(d => {
                                if (filters.subGroup) return d.application === label;
                                if (filters.group) return d.subGroup === label;
                                return d.group === label;
                            }).length;
                            
                            const percentage = totalReleases > 0 ? 
                                ((context.parsed.y / totalReleases) * 100).toFixed(1) : 0;
                            
                            return `${percentage}% of ${totalReleases} releases`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Number of Releases'
                    }
                }
            }
        }
    });
}
function renderUATStatusChart(data) {
    const ctx = document.getElementById('uatStatusChart');
    if (!ctx) return;
    
    if (charts.uatStatus) {
        charts.uatStatus.destroy();
    }
    
    // Determine labels based on filters
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Calculate status counts for each label
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
    
    charts.uatStatus = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Completed',
                    data: uatCompleted,
                    backgroundColor: '#27ae60',
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9
                },
                {
                    label: 'Yet to start',
                    data: uatYetToStart,
                    backgroundColor: '#e74c3c',
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9
                },
                {
                    label: 'In progress',
                    data: uatInProgress,
                    backgroundColor: '#3498db',
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const datasetIndex = context.datasetIndex;
                            const index = context.dataIndex;
                            const label = labels[index];
                            
                            // Calculate totals for this label
                            const totalReleases = data.filter(d => {
                                if (filters.subGroup) return d.application === label;
                                if (filters.group) return d.subGroup === label;
                                return d.group === label;
                            }).length;
                            
                            const percentage = totalReleases > 0 ? 
                                ((context.parsed.y / totalReleases) * 100).toFixed(1) : 0;
                            
                            return `${percentage}% of ${totalReleases} releases`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Number of Releases'
                    }
                }
            }
        }
    });
}
// Defect Density Heatmap
function renderDefectDensityHeatmap(data) {
    const container = document.getElementById('defectDensityHeatmap');
    if (!container) return;
    
    // Get unique groups/subgroups based on filters
    let rows, cols;
    if (filters.group && !filters.subGroup) {
        // Show subgroups vs applications
        rows = [...new Set(data.map(d => d.subGroup))];
        cols = [...new Set(data.map(d => d.application))];
    } else if (filters.group && filters.subGroup) {
        // Show applications only
        rows = [...new Set(data.map(d => d.application))];
        cols = ['Defect Density'];
    } else {
        // Show groups vs subgroups
        rows = [...new Set(data.map(d => d.group))];
        cols = [...new Set(data.flatMap(d => d.subGroup))];
    }
    
    // Calculate max density for color scaling
    let maxDensity = 0;
    const densityData = {};
    
    rows.forEach(row => {
        densityData[row] = {};
        cols.forEach(col => {
            const relevantData = data.filter(d => {
                if (filters.group && !filters.subGroup) {
                    return d.subGroup === row && d.application === col;
                } else if (filters.group && filters.subGroup) {
                    return d.application === row;
                } else {
                    return d.group === row && d.subGroup === col;
                }
            });
            
            const totalDefects = relevantData.reduce((sum, d) => sum + d.defectsTotal, 0);
            const totalRequirements = relevantData.reduce((sum, d) => sum + d.requirements, 0);
            const density = totalRequirements > 0 ? (totalDefects / totalRequirements) : 0;
            
            densityData[row][col] = density;
            maxDensity = Math.max(maxDensity, density);
        });
    });
    
    // Create heatmap HTML
    let html = '<div class="heatmap-container">';
    
    // Header row
    html += '<div class="heatmap-row">';
    html += '<div class="heatmap-label"></div>';
    cols.forEach(col => {
        html += `<div class="heatmap-label" style="font-size: 11px; text-align: center;">${col}</div>`;
    });
    html += '</div>';
    
    // Data rows
    rows.forEach(row => {
        html += '<div class="heatmap-row">';
        html += `<div class="heatmap-label">${row}</div>`;
        
        cols.forEach(col => {
            const density = densityData[row][col];
            const color = getHeatColor(density, maxDensity);
            const textColor = density > maxDensity * 0.5 ? 'white' : '#333';
            
            html += `<div class="heatmap-cell" style="background: ${color}; color: ${textColor};" 
                     title="${row} - ${col}: ${density.toFixed(2)} defects/requirement">
                     ${density.toFixed(2)}
                     </div>`;
        });
        
        html += '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Test Execution Charts
function renderExecutionCharts() {
    const filteredData = getFilteredData();
    renderNewTestCasesProgressChart(filteredData);
    renderOverallTestSummaryChart(filteredData);
    renderTestCaseDistributionChart(filteredData); 
}

// Overall Test Summary Chart
function renderOverallTestSummaryChart(data) {
    const ctx = document.getElementById('overallTestSummaryChart');
    if (!ctx) return;
    
    if (charts.overallTestSummary) {
        charts.overallTestSummary.destroy();
    }
    
    // Calculate totals across all test types
    const totals = data.reduce((acc, d) => {
        acc.passed += d.functionalTestPassed + d.regressionTestPassed;
        acc.failed += d.functionalTestFailed + d.regressionTestFailed;
        acc.blocked += d.functionalTestBlocked + d.regressionTestBlocked;
        acc.na += d.functionalTestNA + d.regressionTestNA;
        return acc;
    }, { passed: 0, failed: 0, blocked: 0, na: 0 });
    
    const total = totals.passed + totals.failed + totals.blocked + totals.na;
    
    charts.overallTestSummary = new Chart(ctx, {
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
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
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
        }
    });
}

// Test Case Distribution Chart
function renderTestCaseDistributionChart(data) {
    const ctx = document.getElementById('testCaseDistributionChart');
    if (!ctx) return;
    
    if (charts.testCaseDistribution) {
        charts.testCaseDistribution.destroy();
    }
    
    // Determine labels based on filters
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Calculate test case counts and pass rates
    const testData = labels.map(label => {
        const labelData = data.filter(d => {
            if (filters.subGroup) return d.application === label;
            if (filters.group) return d.subGroup === label;
            return d.group === label;
        });
        
        const functional = {
            total: labelData.reduce((sum, d) => sum + d.functionalTestTotal, 0),
            passed: labelData.reduce((sum, d) => sum + d.functionalTestPassed, 0)
        };
        
        const regression = {
            total: labelData.reduce((sum, d) => sum + d.regressionTestTotal, 0),
            passed: labelData.reduce((sum, d) => sum + d.regressionTestPassed, 0)
        };
        
        return { functional, regression };
    });
    
    charts.testCaseDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Functional Tests',
                data: testData.map(d => d.functional.total),
                backgroundColor: '#3498db',
                borderRadius: 5
            }, {
                label: 'Regression Tests',
                data: testData.map(d => d.regression.total),
                backgroundColor: '#9b59b6',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const dataIndex = context.dataIndex;
                            const dataset = context.datasetIndex;
                            const testInfo = testData[dataIndex];
                            
                            if (dataset === 0) { // Functional
                                const passRate = testInfo.functional.total > 0 ? 
                                    ((testInfo.functional.passed / testInfo.functional.total) * 100).toFixed(1) : 0;
                                return `Pass Rate: ${passRate}%`;
                            } else { // Regression
                                const passRate = testInfo.regression.total > 0 ? 
                                    ((testInfo.regression.passed / testInfo.regression.total) * 100).toFixed(1) : 0;
                                return `Pass Rate: ${passRate}%`;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
}

function renderNewTestCasesProgressChart(data) {
    const ctx = document.getElementById('newTestCasesProgressChart');
    if (!ctx) return;
    
    if (charts.newTestCases) {
        charts.newTestCases.destroy();
    }
    
    const labels = filters.subGroup ? 
        [...new Set(data.map(d => d.application))] :
        filters.group ? 
        [...new Set(data.map(d => d.subGroup))] :
        [...new Set(data.map(d => d.group))];
    
    const testCases = labels.map(label => {
        const labelData = data.filter(d => 
            filters.subGroup ? d.application === label :
            filters.group ? d.subGroup === label :
            d.group === label
        );
        return labelData.reduce((sum, d) => sum + d.newTestCasesDesigned, 0);
    });
    
    charts.newTestCases = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Test Cases',
                data: testCases,
                backgroundColor: '#2ecc71',
                borderRadius: 5,
                barPercentage: 0.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// New Test Cases Progress Chart
/*function renderNewTestCasesProgressChart(data) {
    const ctx = document.getElementById('newTestCasesProgressChart');
    if (!ctx) return;
    
    if (charts.newTestCasesProgress) {
        charts.newTestCasesProgress.destroy();
    }
    
    // Determine labels based on filters
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Calculate new test cases and totals
    const progressData = labels.map(label => {
        const labelData = data.filter(d => {
            if (filters.subGroup) return d.application === label;
            if (filters.group) return d.subGroup === label;
            return d.group === label;
        });
        
        const newCases = labelData.reduce((sum, d) => sum + d.newTestCasesDesigned, 0);
        const totalCases = labelData.reduce((sum, d) => sum + d.functionalTestTotal + d.regressionTestTotal, 0);
        const percentage = totalCases > 0 ? ((newCases / totalCases) * 100).toFixed(1) : 0;
        
        return { newCases, totalCases, percentage };
    });
    
    // Create bullet chart style visualization
    charts.newTestCasesProgress = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Test Cases %',
                data: progressData.map(d => parseFloat(d.percentage)),
                backgroundColor: '#2ecc71',
                borderRadius: 5,
                barPercentage: 0.5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const idx = context.dataIndex;
                            const data = progressData[idx];
                            return [
                                `New Test Cases: ${data.newCases}`,
                                `Total Test Cases: ${data.totalCases}`,
                                `Percentage: ${data.percentage}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 30,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}*/

// Defects Charts
function renderDefectsCharts() {
    const filteredData = getFilteredData();
    renderDefectOverviewCard(filteredData);
    renderTopProblemAreasChart(filteredData);
    renderDefectDistributionMatrix(filteredData);
}

// Defect Overview Card
function renderDefectOverviewCard(data) {
    // Status Progress Bar
    const statusContainer = document.getElementById('defectStatusProgress');
    const totals = data.reduce((acc, d) => {
        acc.open += d.defectsOpen;
        acc.closed += d.defectsClosed;
        acc.deferred += d.defectsDeferred;
        acc.rejected += d.defectsRejected;
        return acc;
    }, { open: 0, closed: 0, deferred: 0, rejected: 0 });
    
    const total = totals.open + totals.closed + totals.deferred + totals.rejected;
    
    if (total > 0) {
        const openPct = ((totals.open / total) * 100).toFixed(1);
        const closedPct = ((totals.closed / total) * 100).toFixed(1);
        const deferredPct = ((totals.deferred / total) * 100).toFixed(1);
        const rejectedPct = ((totals.rejected / total) * 100).toFixed(1);
        
        let html = '<div class="defect-progress-bar">';
        html += `<div class="defect-progress-segment" style="width: ${openPct}%; background: #e74c3c;">${totals.open}</div>`;
        html += `<div class="defect-progress-segment" style="width: ${closedPct}%; background: #27ae60;">${totals.closed}</div>`;
        html += `<div class="defect-progress-segment" style="width: ${deferredPct}%; background: #f39c12;">${totals.deferred}</div>`;
        html += `<div class="defect-progress-segment" style="width: ${rejectedPct}%; background: #95a5a6;">${totals.rejected}</div>`;
        html += '</div>';
        
        html += '<div class="defect-progress-legend">';
        html += `<div class="legend-item"><div class="legend-color" style="background: #e74c3c;"></div>Open (${openPct}%)</div>`;
        html += `<div class="legend-item"><div class="legend-color" style="background: #27ae60;"></div>Closed (${closedPct}%)</div>`;
        html += `<div class="legend-item"><div class="legend-color" style="background: #f39c12;"></div>Deferred (${deferredPct}%)</div>`;
        html += `<div class="legend-item"><div class="legend-color" style="background: #95a5a6;"></div>Rejected (${rejectedPct}%)</div>`;
        html += '</div>';
        
        statusContainer.innerHTML = html;
    }
    
    // Severity Mini Chart
    const ctx = document.getElementById('defectSeverityMiniChart');
    if (!ctx) return;
    
    if (charts.defectSeverityMini) {
        charts.defectSeverityMini.destroy();
    }
    
    const severityTotals = data.reduce((acc, d) => {
        acc.critical += d.defectsCritical;
        acc.high += d.defectsHigh;
        acc.medium += d.defectsMedium;
        acc.low += d.defectsLow;
        return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
    
    charts.defectSeverityMini = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
                data: [severityTotals.critical, severityTotals.high, severityTotals.medium, severityTotals.low],
                backgroundColor: ['#8b0000', '#e74c3c', '#f39c12', '#f1c40f'],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });
}

// Top 5 Problem Areas Chart
function renderTopProblemAreasChart(data) {
    const ctx = document.getElementById('topProblemAreasChart');
    if (!ctx) return;
    
    if (charts.topProblemAreas) {
        charts.topProblemAreas.destroy();
    }
    
    // Calculate defect counts by area
    let areaDefects = [];
    
    if (filters.subGroup) {
        // Show by application
        data.forEach(d => {
            areaDefects.push({
                area: d.application,
                count: d.defectsTotal
            });
        });
    } else if (filters.group) {
        // Show by subgroup
        const subGroups = [...new Set(data.map(d => d.subGroup))];
        subGroups.forEach(sg => {
            const count = data.filter(d => d.subGroup === sg)
                .reduce((sum, d) => sum + d.defectsTotal, 0);
            areaDefects.push({ area: sg, count });
        });
    } else {
        // Show by group
        const groups = [...new Set(data.map(d => d.group))];
        groups.forEach(g => {
            const count = data.filter(d => d.group === g)
                .reduce((sum, d) => sum + d.defectsTotal, 0);
            areaDefects.push({ area: g, count });
        });
    }
    
    // Sort and take top 5
    areaDefects.sort((a, b) => b.count - a.count);
    const top5 = areaDefects.slice(0, 5);
    
    charts.topProblemAreas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top5.map(d => d.area),
            datasets: [{
                label: 'Total Defects',
                data: top5.map(d => d.count),
                backgroundColor: '#c41e3a',
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: true
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Defect Distribution Matrix
function renderDefectDistributionMatrix(data) {
    const container = document.getElementById('defectDistributionMatrix');
    if (!container) return;
    
    // Determine rows based on filters
    let rows;
    if (filters.subGroup) {
        rows = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        rows = [...new Set(data.map(d => d.subGroup))];
    } else {
        rows = [...new Set(data.map(d => d.group))];
    }
    
    // Calculate defect counts by severity
    const matrixData = {};
    let maxCount = 0;
    
    rows.forEach(row => {
        const rowData = data.filter(d => {
            if (filters.subGroup) return d.application === row;
            if (filters.group) return d.subGroup === row;
            return d.group === row;
        });
        
        matrixData[row] = {
            critical: rowData.reduce((sum, d) => sum + d.defectsCritical, 0),
            high: rowData.reduce((sum, d) => sum + d.defectsHigh, 0),
            medium: rowData.reduce((sum, d) => sum + d.defectsMedium, 0),
            low: rowData.reduce((sum, d) => sum + d.defectsLow, 0)
        };
        
        // Track max for heat coloring
        maxCount = Math.max(maxCount, 
            matrixData[row].critical,
            matrixData[row].high,
            matrixData[row].medium,
            matrixData[row].low
        );
    });
    
    // Create matrix table
    let html = '<table class="matrix-table">';
    
    // Header
    html += '<thead><tr>';
    html += '<th>Area</th>';
    html += '<th>Critical</th>';
    html += '<th>High</th>';
    html += '<th>Medium</th>';
    html += '<th>Low</th>';
    html += '<th>Total</th>';
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    rows.forEach(row => {
        const data = matrixData[row];
        const total = data.critical + data.high + data.medium + data.low;
        
        html += '<tr>';
        html += `<td style="text-align: left; font-weight: 600;">${row}</td>`;
        html += `<td class="${getHeatClass(data.critical, maxCount)}">${data.critical}</td>`;
        html += `<td class="${getHeatClass(data.high, maxCount)}">${data.high}</td>`;
        html += `<td class="${getHeatClass(data.medium, maxCount)}">${data.medium}</td>`;
        html += `<td class="${getHeatClass(data.low, maxCount)}">${data.low}</td>`;
        html += `<td style="font-weight: 700; background: #f8f9fa;">${total}</td>`;
        html += '</tr>';
    });
    
    // Footer with totals
    const totals = {
        critical: Object.values(matrixData).reduce((sum, d) => sum + d.critical, 0),
        high: Object.values(matrixData).reduce((sum, d) => sum + d.high, 0),
        medium: Object.values(matrixData).reduce((sum, d) => sum + d.medium, 0),
        low: Object.values(matrixData).reduce((sum, d) => sum + d.low, 0)
    };
    const grandTotal = totals.critical + totals.high + totals.medium + totals.low;
    
    html += '<tr style="border-top: 2px solid #333;">';
    html += '<td style="text-align: left; font-weight: 700;">Total</td>';
    html += `<td style="font-weight: 700; background: #f8f9fa;">${totals.critical}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa;">${totals.high}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa;">${totals.medium}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa;">${totals.low}</td>`;
    html += `<td style="font-weight: 700; background: #e9ecef;">${grandTotal}</td>`;
    html += '</tr>';
    
    html += '</tbody>';
    html += '</table>';
    
    container.innerHTML = html;
}

// Helper function to get heat class (used in the matrix)
function getHeatClass(value, max) {
    const ratio = value / max;
    if (ratio === 0) return 'heat-0';
    if (ratio <= 0.2) return 'heat-1';
    if (ratio <= 0.4) return 'heat-2';
    if (ratio <= 0.6) return 'heat-3';
    if (ratio <= 0.8) return 'heat-4';
    return 'heat-5';
}