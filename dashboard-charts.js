// Chart instances
let charts = {};

// Chart.js default settings for responsive behavior
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
Chart.defaults.color = '#333';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Base chart options for consistent responsive behavior
const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 10,
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
            beginAtZero: true,
            ticks: {
                font: {
                    size: 11
                }
            }
        }
    }
};

// Utility function to safely destroy charts
function safeDestroyChart(chartKey) {
    if (charts[chartKey]) {
        try {
            charts[chartKey].destroy();
        } catch (error) {
            console.warn(`Error destroying chart ${chartKey}:`, error);
        }
        delete charts[chartKey];
    }
}

// Utility function to get responsive font sizes
function getResponsiveFontSize() {
    const width = window.innerWidth;
    if (width < 480) return 10;
    if (width < 768) return 11;
    if (width < 1200) return 12;
    return 12;
}

// Overview Charts
function renderOverviewCharts() {
    const filteredData = getFilteredData();
    renderReleaseStatusChart(filteredData);
    renderUATStatusChart(filteredData);
}

function renderReleaseStatusChart(data) {
    const ctx = document.getElementById('releaseStatusChart');
    if (!ctx) return;
    
    safeDestroyChart('releaseStatus');
    
    // Determine labels based on filters
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Truncate labels if too long for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
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
    
    const fontSize = getResponsiveFontSize();
    
    charts.releaseStatus = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: displayLabels,
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
            ...baseChartOptions,
            plugins: {
                ...baseChartOptions.plugins,
                legend: {
                    ...baseChartOptions.plugins.legend,
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        ...baseChartOptions.plugins.legend.labels,
                        font: {
                            size: fontSize
                        }
                    }
                },
                tooltip: {
                    ...baseChartOptions.plugins.tooltip,
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
                ...baseChartOptions.scales,
                x: {
                    ...baseChartOptions.scales.x,
                    ticks: {
                        ...baseChartOptions.scales.x.ticks,
                        maxRotation: window.innerWidth < 768 ? 45 : 30,
                        font: {
                            size: fontSize
                        }
                    }
                },
                y: {
                    ...baseChartOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Number of Releases',
                        font: {
                            size: fontSize
                        }
                    },
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
}

function renderUATStatusChart(data) {
    const ctx = document.getElementById('uatStatusChart');
    if (!ctx) return;
    
    safeDestroyChart('uatStatus');
    
    // Determine labels based on filters
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Truncate labels if too long for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
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
    
    const fontSize = getResponsiveFontSize();
    
    charts.uatStatus = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: displayLabels,
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
            ...baseChartOptions,
            plugins: {
                ...baseChartOptions.plugins,
                legend: {
                    ...baseChartOptions.plugins.legend,
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        ...baseChartOptions.plugins.legend.labels,
                        font: {
                            size: fontSize
                        }
                    }
                },
                tooltip: {
                    ...baseChartOptions.plugins.tooltip,
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
                ...baseChartOptions.scales,
                x: {
                    ...baseChartOptions.scales.x,
                    ticks: {
                        ...baseChartOptions.scales.x.ticks,
                        maxRotation: window.innerWidth < 768 ? 45 : 30,
                        font: {
                            size: fontSize
                        }
                    }
                },
                y: {
                    ...baseChartOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Number of Releases',
                        font: {
                            size: fontSize
                        }
                    },
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
    
    // Create responsive heatmap HTML
    const isMobile = window.innerWidth < 768;
    const cellWidth = isMobile ? 60 : 80;
    const labelWidth = isMobile ? 80 : 120;
    
    let html = '<div class="heatmap-container">';
    
    // Header row
    html += '<div class="heatmap-row">';
    html += `<div class="heatmap-label" style="width: ${labelWidth}px;"></div>`;
    cols.forEach(col => {
        const displayCol = isMobile && col.length > 6 ? col.substring(0, 6) + '...' : col;
        html += `<div class="heatmap-label" style="width: ${cellWidth}px; font-size: ${isMobile ? '10px' : '11px'}; text-align: center;">${displayCol}</div>`;
    });
    html += '</div>';
    
    // Data rows
    rows.forEach(row => {
        html += '<div class="heatmap-row">';
        const displayRow = isMobile && row.length > 10 ? row.substring(0, 10) + '...' : row;
        html += `<div class="heatmap-label" style="width: ${labelWidth}px; font-size: ${isMobile ? '10px' : '12px'};">${displayRow}</div>`;
        
        cols.forEach(col => {
            const density = densityData[row][col];
            const color = getHeatColor(density, maxDensity);
            const textColor = density > maxDensity * 0.5 ? 'white' : '#333';
            
            html += `<div class="heatmap-cell" style="width: ${cellWidth}px; background: ${color}; color: ${textColor}; font-size: ${isMobile ? '10px' : '12px'};" 
                     title="${row} - ${col}: ${density.toFixed(2)} defects/requirement">
                     ${density.toFixed(isMobile ? 1 : 2)}
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
    
    safeDestroyChart('overallTestSummary');
    
    // Calculate totals across all test types
    const totals = data.reduce((acc, d) => {
        acc.passed += d.functionalTestPassed + d.regressionTestPassed;
        acc.failed += d.functionalTestFailed + d.regressionTestFailed;
        acc.blocked += d.functionalTestBlocked + d.regressionTestBlocked;
        acc.na += d.functionalTestNA + d.regressionTestNA;
        return acc;
    }, { passed: 0, failed: 0, blocked: 0, na: 0 });
    
    const total = totals.passed + totals.failed + totals.blocked + totals.na;
    const fontSize = getResponsiveFontSize();
    
    charts.overallTestSummary = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed', 'Blocked', 'Not Applicable'],
            datasets: [{
                data: [totals.passed, totals.failed, totals.blocked, totals.na],
                backgroundColor: ['#27ae60', '#e74c3c', '#f39c12', '#95a5a6'],
                borderWidth: 0,
                cutout: window.innerWidth < 768 ? '40%' : '50%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                ...baseChartOptions.plugins,
                legend: {
                    ...baseChartOptions.plugins.legend,
                    position: window.innerWidth < 768 ? 'bottom' : 'right',
                    labels: {
                        ...baseChartOptions.plugins.legend.labels,
                        font: {
                            size: fontSize
                        }
                    }
                },
                tooltip: {
                    ...baseChartOptions.plugins.tooltip,
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
    
    safeDestroyChart('testCaseDistribution');
    
    // Determine labels based on filters
    let labels;
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
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
    
    const fontSize = getResponsiveFontSize();
    
    charts.testCaseDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: displayLabels,
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
            ...baseChartOptions,
            plugins: {
                ...baseChartOptions.plugins,
                legend: {
                    ...baseChartOptions.plugins.legend,
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        ...baseChartOptions.plugins.legend.labels,
                        font: {
                            size: fontSize
                        }
                    }
                },
                tooltip: {
                    ...baseChartOptions.plugins.tooltip,
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
                ...baseChartOptions.scales,
                x: {
                    ...baseChartOptions.scales.x,
                    stacked: true,
                    ticks: {
                        ...baseChartOptions.scales.x.ticks,
                        maxRotation: window.innerWidth < 768 ? 45 : 30,
                        font: {
                            size: fontSize
                        }
                    }
                },
                y: {
                    ...baseChartOptions.scales.y,
                    stacked: true,
                    ticks: {
                        font: {
                            size: fontSize
                        }
                    }
                }
            }
        }
    });
}

function renderNewTestCasesProgressChart(data) {
    const ctx = document.getElementById('newTestCasesProgressChart');
    if (!ctx) return;
    
    safeDestroyChart('newTestCases');
    
    const labels = filters.subGroup ? 
        [...new Set(data.map(d => d.application))] :
        filters.group ? 
        [...new Set(data.map(d => d.subGroup))] :
        [...new Set(data.map(d => d.group))];
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
    const testCases = labels.map(label => {
        const labelData = data.filter(d => 
            filters.subGroup ? d.application === label :
            filters.group ? d.subGroup === label :
            d.group === label
        );
        return labelData.reduce((sum, d) => sum + d.newTestCasesDesigned, 0);
    });
    
    const fontSize = getResponsiveFontSize();
    
    charts.newTestCases = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: displayLabels,
            datasets: [{
                label: 'New Test Cases',
                data: testCases,
                backgroundColor: '#2ecc71',
                borderRadius: 5,
                barPercentage: 0.5
            }]
        },
        options: {
            ...baseChartOptions,
            plugins: {
                ...baseChartOptions.plugins,
                legend: {
                    display: false
                }
            },
            scales: {
                ...baseChartOptions.scales,
                x: {
                    ...baseChartOptions.scales.x,
                    ticks: {
                        ...baseChartOptions.scales.x.ticks,
                        maxRotation: window.innerWidth < 768 ? 45 : 30,
                        font: {
                            size: fontSize
                        }
                    }
                },
                y: {
                    ...baseChartOptions.scales.y,
                    ticks: {
                        font: {
                            size: fontSize
                        }
                    }
                }
            }
        }
    });
}

// Defects Charts
function renderDefectsCharts() {
    const filteredData = getFilteredData();
    renderDefectOverviewCard(filteredData);
    renderTopProblemAreasChart(filteredData);
    renderDefectDistributionMatrix(filteredData);
}
function renderTopProblemAreasChart(data) {
    const ctx = document.getElementById('topProblemAreasChart');
    if (!ctx) return;
    
    safeDestroyChart('topProblemAreas');
    
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
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = top5.map(d => 
        d.area.length > truncateLength ? d.area.substring(0, truncateLength) + '...' : d.area
    );
    
    const fontSize = getResponsiveFontSize();
    
    charts.topProblemAreas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: displayLabels,
            datasets: [{
                label: 'Total Defects',
                data: top5.map(d => d.count),
                backgroundColor: '#c41e3a',
                borderRadius: 5
            }]
        },
        options: {
            ...baseChartOptions,
            indexAxis: window.innerWidth < 768 ? 'x' : 'y',
            plugins: {
                ...baseChartOptions.plugins,
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: window.innerWidth >= 768
                    },
                    ticks: {
                        font: {
                            size: fontSize
                        }
                    }
                },
                y: {
                    grid: {
                        display: window.innerWidth < 768
                    },
                    ticks: {
                        font: {
                            size: fontSize
                        }
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
    
    // Create responsive matrix table
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? '12px' : '14px';
    const padding = isMobile ? '8px 4px' : '12px 8px';
    
    let html = `<table class="matrix-table" style="font-size: ${fontSize};">`;
    
    // Header
    html += '<thead><tr>';
    html += `<th style="padding: ${padding};">Area</th>`;
    html += `<th style="padding: ${padding};">Critical</th>`;
    html += `<th style="padding: ${padding};">High</th>`;
    html += `<th style="padding: ${padding};">Medium</th>`;
    html += `<th style="padding: ${padding};">Low</th>`;
    html += `<th style="padding: ${padding};">Total</th>`;
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    rows.forEach(row => {
        const data = matrixData[row];
        const total = data.critical + data.high + data.medium + data.low;
        
        // Truncate row name for mobile
        const displayRow = isMobile && row.length > 12 ? row.substring(0, 12) + '...' : row;
        
        html += '<tr>';
        html += `<td style="text-align: left; font-weight: 600; padding: ${padding};">${displayRow}</td>`;
        html += `<td class="${getHeatClass(data.critical, maxCount)}" style="padding: ${padding};">${data.critical}</td>`;
        html += `<td class="${getHeatClass(data.high, maxCount)}" style="padding: ${padding};">${data.high}</td>`;
        html += `<td class="${getHeatClass(data.medium, maxCount)}" style="padding: ${padding};">${data.medium}</td>`;
        html += `<td class="${getHeatClass(data.low, maxCount)}" style="padding: ${padding};">${data.low}</td>`;
        html += `<td style="font-weight: 700; background: #f8f9fa; padding: ${padding};">${total}</td>`;
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
    html += `<td style="text-align: left; font-weight: 700; padding: ${padding};">Total</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa; padding: ${padding};">${totals.critical}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa; padding: ${padding};">${totals.high}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa; padding: ${padding};">${totals.medium}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa; padding: ${padding};">${totals.low}</td>`;
    html += `<td style="font-weight: 700; background: #e9ecef; padding: ${padding};">${grandTotal}</td>`;
    html += '</tr>';
    
    html += '</tbody>';
    html += '</table>';
    
    container.innerHTML = html;
}

// Helper function to get heat class (used in the matrix)
function getHeatClass(value, max) {
    if (max === 0) return 'heat-0';
    const ratio = value / max;
    if (ratio === 0) return 'heat-0';
    if (ratio <= 0.2) return 'heat-1';
    if (ratio <= 0.4) return 'heat-2';
    if (ratio <= 0.6) return 'heat-3';
    if (ratio <= 0.8) return 'heat-4';
    return 'heat-5';
}

// Helper function to get heat color
function getHeatColor(value, max) {
    if (max === 0) return '#f0f0f0';
    const ratio = value / max;
    if (ratio === 0) return '#f0f0f0';
    if (ratio <= 0.2) return '#ffe5e5';
    if (ratio <= 0.4) return '#ffcccc';
    if (ratio <= 0.6) return '#ff9999';
    if (ratio <= 0.8) return '#ff6666';
    return '#c41e3a';
}

function handleChartResize() {
    // Update font sizes based on current window size
    const fontSize = getResponsiveFontSize();
    
    // Recreate charts that are currently visible
    const activeTab = document.querySelector('#qualityPage .tab.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        
        // Add a small delay to ensure DOM has updated
        setTimeout(() => {
            if (tabName === 'overview') {
                renderOverviewCharts();
            } else if (tabName === 'execution') {
                renderExecutionCharts();
            } else if (tabName === 'defects') {
                renderDefectsCharts();
            }
        }, 100);
    }
}

// Debounce function for resize events
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

// Add resize listener
if (typeof window !== 'undefined') {
    window.addEventListener('resize', debounce(handleChartResize, 300));
}

// Enhanced chart creation with error handling
function createChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Canvas element ${canvasId} not found`);
        return null;
    }
    
    try {
        // Destroy existing chart if it exists
        if (charts[canvasId]) {
            charts[canvasId].destroy();
        }
        
        // Create new chart
        charts[canvasId] = new Chart(canvas, config);
        return charts[canvasId];
    } catch (error) {
        console.error(`Error creating chart ${canvasId}:`, error);
        return null;
    }
}

// Function to check if element is visible
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

// Function to update all visible charts
function updateVisibleCharts() {
    Object.keys(charts).forEach(key => {
        const canvas = document.getElementById(key);
        if (canvas && isElementVisible(canvas) && charts[key]) {
            try {
                charts[key].update('none'); // Update without animation for performance
            } catch (error) {
                console.warn(`Error updating chart ${key}:`, error);
            }
        }
    });
}

// Performance optimization: Only update charts when they're visible
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Intersection Observer for performance optimization
if (typeof IntersectionObserver !== 'undefined') {
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartId = entry.target.id;
                if (charts[chartId]) {
                    try {
                        charts[chartId].resize();
                    } catch (error) {
                        console.warn(`Error resizing chart ${chartId}:`, error);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe all chart canvases when they're created
    function observeChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            chartObserver.observe(canvas);
        }
    }
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderOverviewCharts,
        renderExecutionCharts,
        renderDefectsCharts,
        handleChartResize,
        updateVisibleCharts,
        charts
    };
}

function renderDefectOverviewCard(data) {
    console.log('Rendering defect overview card with', data.length, 'records');
    
    // Status Progress Bar
    renderDefectStatusProgressBar(data);
    
    // Severity Mini Chart
    renderDefectSeverityMiniChart(data);
}

// Render defect status progress bar with responsive design
function renderDefectStatusProgressBar(data) {
    const statusContainer = document.getElementById('defectStatusProgress');
    if (!statusContainer) {
        console.warn('Defect status progress container not found');
        return;
    }
    
    // Calculate totals for all statuses
    const totals = data.reduce((acc, d) => {
        acc.open += d.defectsOpen || 0;
        acc.closed += d.defectsClosed || 0;
        acc.deferred += d.defectsDeferred || 0;
        acc.rejected += d.defectsRejected || 0;
        return acc;
    }, { open: 0, closed: 0, deferred: 0, rejected: 0 });
    
    const total = totals.open + totals.closed + totals.deferred + totals.rejected;
    
    if (total === 0) {
        statusContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                <p>No defect data available</p>
            </div>
        `;
        return;
    }
    
    // Calculate percentages
    const percentages = {
        open: ((totals.open / total) * 100).toFixed(1),
        closed: ((totals.closed / total) * 100).toFixed(1),
        deferred: ((totals.deferred / total) * 100).toFixed(1),
        rejected: ((totals.rejected / total) * 100).toFixed(1)
    };
    
    // Check if mobile for responsive design
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1200;
    
    // Create progress bar HTML
    let html = '<div class="defect-progress-container">';
    
    // Progress bar
    html += '<div class="defect-progress-bar" style="margin-bottom: 15px;">';
    
    // Only show segments that have data
    if (totals.open > 0) {
        html += `<div class="defect-progress-segment" 
                      style="width: ${percentages.open}%; background: #e74c3c; color: white;" 
                      title="Open: ${totals.open} (${percentages.open}%)">
                      ${isMobile && percentages.open < 15 ? '' : totals.open}
                 </div>`;
    }
    
    if (totals.closed > 0) {
        html += `<div class="defect-progress-segment" 
                      style="width: ${percentages.closed}%; background: #27ae60; color: white;" 
                      title="Closed: ${totals.closed} (${percentages.closed}%)">
                      ${isMobile && percentages.closed < 15 ? '' : totals.closed}
                 </div>`;
    }
    
    if (totals.deferred > 0) {
        html += `<div class="defect-progress-segment" 
                      style="width: ${percentages.deferred}%; background: #f39c12; color: white;" 
                      title="Deferred: ${totals.deferred} (${percentages.deferred}%)">
                      ${isMobile && percentages.deferred < 15 ? '' : totals.deferred}
                 </div>`;
    }
    
    if (totals.rejected > 0) {
        html += `<div class="defect-progress-segment" 
                      style="width: ${percentages.rejected}%; background: #95a5a6; color: white;" 
                      title="Rejected: ${totals.rejected} (${percentages.rejected}%)">
                      ${isMobile && percentages.rejected < 15 ? '' : totals.rejected}
                 </div>`;
    }
    
    html += '</div>';
    
    // Legend with responsive layout
    const legendStyle = isMobile ? 
        'display: flex; flex-direction: column; gap: 8px;' : 
        'display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;';
    
    html += `<div class="defect-progress-legend" style="${legendStyle}">`;
    
    // Legend items - only show if there's data
    if (totals.open > 0) {
        html += `<div class="legend-item" style="display: flex; align-items: center; gap: 6px;">
                    <div class="legend-color" style="width: 12px; height: 12px; background: #e74c3c; border-radius: 2px;"></div>
                    <span style="font-size: ${isMobile ? '11px' : '12px'}; color: #666;">Open (${percentages.open}%)</span>
                 </div>`;
    }
    
    if (totals.closed > 0) {
        html += `<div class="legend-item" style="display: flex; align-items: center; gap: 6px;">
                    <div class="legend-color" style="width: 12px; height: 12px; background: #27ae60; border-radius: 2px;"></div>
                    <span style="font-size: ${isMobile ? '11px' : '12px'}; color: #666;">Closed (${percentages.closed}%)</span>
                 </div>`;
    }
    
    if (totals.deferred > 0) {
        html += `<div class="legend-item" style="display: flex; align-items: center; gap: 6px;">
                    <div class="legend-color" style="width: 12px; height: 12px; background: #f39c12; border-radius: 2px;"></div>
                    <span style="font-size: ${isMobile ? '11px' : '12px'}; color: #666;">Deferred (${percentages.deferred}%)</span>
                 </div>`;
    }
    
    if (totals.rejected > 0) {
        html += `<div class="legend-item" style="display: flex; align-items: center; gap: 6px;">
                    <div class="legend-color" style="width: 12px; height: 12px; background: #95a5a6; border-radius: 2px;"></div>
                    <span style="font-size: ${isMobile ? '11px' : '12px'}; color: #666;">Rejected (${percentages.rejected}%)</span>
                 </div>`;
    }
    
    html += '</div>';
    
    // Summary statistics
    html += `<div class="defect-status-summary" style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px; text-align: center;">
                <div style="font-size: ${isMobile ? '12px' : '13px'}; color: #666;">
                    <strong style="color: #333;">Total Defects: ${total}</strong>
                    ${total > 0 ? ` • Resolution Rate: ${percentages.closed}%` : ''}
                </div>
             </div>`;
    
    html += '</div>';
    
    statusContainer.innerHTML = html;
    
    console.log('Defect status progress bar rendered with totals:', totals);
}

// Render severity mini chart with responsive design
function renderDefectSeverityMiniChart(data) {
    const canvas = document.getElementById('defectSeverityMiniChart');
    if (!canvas) {
        console.warn('Defect severity mini chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context for defect severity chart');
        return;
    }
    
    // Destroy existing chart
    safeDestroyChart('defectSeverityMini');
    
    // Calculate severity totals
    const severityTotals = data.reduce((acc, d) => {
        acc.critical += d.defectsCritical || 0;
        acc.high += d.defectsHigh || 0;
        acc.medium += d.defectsMedium || 0;
        acc.low += d.defectsLow || 0;
        return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
    
    const total = severityTotals.critical + severityTotals.high + severityTotals.medium + severityTotals.low;
    
    if (total === 0) {
        // Show empty state
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No severity data', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Responsive font size
    const fontSize = getResponsiveFontSize();
    const isMobile = window.innerWidth < 768;
    
    // Chart configuration
    const chartConfig = {
        type: 'bar',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
                label: 'Defects by Severity',
                data: [severityTotals.critical, severityTotals.high, severityTotals.medium, severityTotals.low],
                backgroundColor: [
                    '#8b0000', // Dark red for critical
                    '#e74c3c', // Red for high
                    '#f39c12', // Orange for medium
                    '#f1c40f'  // Yellow for low
                ],
                borderColor: [
                    '#5d0000',
                    '#c0392b',
                    '#d68910',
                    '#d4ac0d'
                ],
                borderWidth: 1,
                borderRadius: isMobile ? 3 : 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    titleFont: {
                        size: fontSize
                    },
                    bodyFont: {
                        size: fontSize - 1
                    },
                    padding: 8,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return [
                                `${context.label}: ${value}`,
                                `${percentage}% of total defects`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: fontSize - 2
                        },
                        maxRotation: isMobile ? 45 : 0
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        stepSize: Math.max(1, Math.ceil(Math.max(...Object.values(severityTotals)) / 5)),
                        font: {
                            size: fontSize - 2
                        },
                        callback: function(value) {
                            return Number.isInteger(value) ? value : '';
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };
    
    try {
        charts.defectSeverityMini = new Chart(ctx, chartConfig);
        console.log('Defect severity mini chart created successfully with totals:', severityTotals);
        
        // Add summary text below chart
        addSeveritySummary(severityTotals, total);
        
    } catch (error) {
        console.error('Error creating defect severity mini chart:', error);
        
        // Fallback to text display
        const container = canvas.parentElement;
        if (container) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.style.cssText = 'text-align: center; padding: 20px; font-size: 12px; color: #666;';
            fallbackDiv.innerHTML = `
                <div>Critical: ${severityTotals.critical}</div>
                <div>High: ${severityTotals.high}</div>
                <div>Medium: ${severityTotals.medium}</div>
                <div>Low: ${severityTotals.low}</div>
            `;
            container.appendChild(fallbackDiv);
        }
    }
}

// Add severity summary below the chart
function addSeveritySummary(severityTotals, total) {
    const canvas = document.getElementById('defectSeverityMiniChart');
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    // Remove existing summary
    const existingSummary = container.querySelector('.severity-summary');
    if (existingSummary) {
        existingSummary.remove();
    }
    
    // Calculate critical + high percentage (priority defects)
    const priorityDefects = severityTotals.critical + severityTotals.high;
    const priorityPercentage = total > 0 ? ((priorityDefects / total) * 100).toFixed(1) : 0;
    
    const isMobile = window.innerWidth < 768;
    
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'severity-summary';
    summaryDiv.style.cssText = `
        margin-top: 10px;
        padding: 8px;
        background: ${priorityDefects > total * 0.3 ? '#fff5f5' : '#f0f9ff'};
        border-radius: 4px;
        border-left: 3px solid ${priorityDefects > total * 0.3 ? '#e74c3c' : '#3498db'};
        font-size: ${isMobile ? '11px' : '12px'};
        color: #666;
        text-align: center;
    `;
    
    summaryDiv.innerHTML = `
        <div style="font-weight: 600; color: #333; margin-bottom: 2px;">
            Priority Defects: ${priorityDefects} (${priorityPercentage}%)
        </div>
        <div style="font-size: ${isMobile ? '10px' : '11px'};">
            ${priorityDefects > total * 0.3 ? '⚠️ High priority defects need attention' : '✅ Priority defects under control'}
        </div>
    `;
    
    container.appendChild(summaryDiv);
}

// Enhanced defect overview with additional metrics
function renderEnhancedDefectOverview(data) {
    // Call the main function
    renderDefectOverviewCard(data);
    
    // Add additional insights
    setTimeout(() => {
        addDefectTrendsInsight(data);
    }, 500);
}

// Add defect trends insight
function addDefectTrendsInsight(data) {
    const container = document.querySelector('.defect-overview-card');
    if (!container) return;
    
    // Calculate additional metrics
    const totals = data.reduce((acc, d) => {
        acc.total += d.defectsTotal || 0;
        acc.open += d.defectsOpen || 0;
        acc.closed += d.defectsClosed || 0;
        acc.critical += d.defectsCritical || 0;
        acc.high += d.defectsHigh || 0;
        return acc;
    }, { total: 0, open: 0, closed: 0, critical: 0, high: 0 });
    
    if (totals.total === 0) return;
    
    const resolutionRate = ((totals.closed / totals.total) * 100).toFixed(1);
    const criticalRate = ((totals.critical / totals.total) * 100).toFixed(1);
    const highPriorityRate = (((totals.critical + totals.high) / totals.total) * 100).toFixed(1);
    
    // Remove existing insight
    const existingInsight = container.querySelector('.defect-insight');
    if (existingInsight) {
        existingInsight.remove();
    }
    
    const isMobile = window.innerWidth < 768;
    
    const insightDiv = document.createElement('div');
    insightDiv.className = 'defect-insight';
    insightDiv.style.cssText = `
        margin-top: 15px;
        padding: 12px;
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-radius: 8px;
        border: 1px solid #dee2e6;
        font-size: ${isMobile ? '11px' : '12px'};
    `;
    
    insightDiv.innerHTML = `
        <div style="font-weight: 600; color: #333; margin-bottom: 8px; font-size: ${isMobile ? '12px' : '13px'};">
            📊 Defect Analysis Summary
        </div>
        <div style="display: grid; grid-template-columns: ${isMobile ? '1fr' : '1fr 1fr'}; gap: 8px; color: #666;">
            <div>Resolution Rate: <strong style="color: ${resolutionRate > 80 ? '#27ae60' : resolutionRate > 60 ? '#f39c12' : '#e74c3c'};">${resolutionRate}%</strong></div>
            <div>Critical Rate: <strong style="color: ${criticalRate < 10 ? '#27ae60' : criticalRate < 20 ? '#f39c12' : '#e74c3c'};">${criticalRate}%</strong></div>
            ${!isMobile ? `<div style="grid-column: 1 / -1;">High Priority: <strong style="color: ${highPriorityRate < 30 ? '#27ae60' : highPriorityRate < 50 ? '#f39c12' : '#e74c3c'};">${highPriorityRate}%</strong></div>` : `<div>High Priority: <strong style="color: ${highPriorityRate < 30 ? '#27ae60' : highPriorityRate < 50 ? '#f39c12' : '#e74c3c'};">${highPriorityRate}%</strong></div>`}
        </div>
    `;
    
    container.appendChild(insightDiv);
}

// Utility function for responsive font sizes (if not already defined)
function getResponsiveFontSize() {
    const width = window.innerWidth;
    if (width < 480) return 10;
    if (width < 768) return 11;
    if (width < 1200) return 12;
    return 12;
}

// Utility function to safely destroy charts (if not already defined)
function safeDestroyChart(chartKey) {
    if (typeof charts !== 'undefined' && charts[chartKey]) {
        try {
            charts[chartKey].destroy();
        } catch (error) {
            console.warn(`Error destroying chart ${chartKey}:`, error);
        }
        delete charts[chartKey];
    }
}

// Export the main function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderDefectOverviewCard,
        renderDefectStatusProgressBar,
        renderDefectSeverityMiniChart,
        renderEnhancedDefectOverview
    };
}
