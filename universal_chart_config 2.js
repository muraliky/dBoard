// UNIVERSAL CHART CONFIGURATION FOR ALL VISUALIZATION TYPES
// Add this to the top of your dashboard-charts.js file

// ============================================
// UNIVERSAL CHART OPTIONS
// ============================================

// Base configuration for ALL Chart.js charts
const baseChartConfig = {
    responsive: true,
    maintainAspectRatio: false, // CRITICAL for fixed heights
    interaction: {
        intersect: false,
        mode: 'index'
    },
    layout: {
        padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5
        }
    },
    animation: {
        duration: 750 // Shorter animation for better performance
    }
};

// Legend configuration to prevent overflow
const standardLegend = {
    display: true,
    position: 'top',
    maxHeight: 50,
    labels: {
        maxWidth: 120,
        usePointStyle: true,
        padding: 12,
        font: {
            size: 11
        },
        generateLabels: function(chart) {
            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
            // Truncate long legend labels
            return labels.map(label => {
                if (label.text && label.text.length > 15) {
                    label.text = label.text.substring(0, 15) + '...';
                }
                return label;
            });
        }
    }
};

// Tooltip configuration
const standardTooltip = {
    backgroundColor: 'rgba(0,0,0,0.8)',
    titleFont: { size: 12 },
    bodyFont: { size: 11 },
    cornerRadius: 6,
    displayColors: true,
    callbacks: {
        title: function(context) {
            let title = context[0].label || '';
            return title.length > 20 ? title.substring(0, 20) + '...' : title;
        }
    }
};

// ============================================
// CHART TYPE SPECIFIC CONFIGURATIONS
// ============================================

// Bar chart configuration
const barChartConfig = {
    ...baseChartConfig,
    plugins: {
        legend: standardLegend,
        tooltip: standardTooltip
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                maxRotation: 45,
                maxTicksLimit: 12,
                font: { size: 10 },
                callback: function(value, index, values) {
                    const label = this.getLabelForValue(value);
                    return label.length > 12 ? label.substring(0, 12) + '...' : label;
                }
            }
        },
        y: {
            beginAtZero: true,
            ticks: {
                maxTicksLimit: 8,
                font: { size: 10 }
            },
            grid: {
                color: 'rgba(0,0,0,0.1)'
            }
        }
    }
};

// Horizontal bar chart configuration
const horizontalBarConfig = {
    ...baseChartConfig,
    indexAxis: 'y',
    plugins: {
        legend: standardLegend,
        tooltip: standardTooltip
    },
    scales: {
        x: {
            beginAtZero: true,
            grid: {
                display: true,
                color: 'rgba(0,0,0,0.1)'
            },
            ticks: {
                maxTicksLimit: 8,
                font: { size: 10 }
            }
        },
        y: {
            grid: {
                display: false
            },
            ticks: {
                maxRotation: 0,
                font: { size: 10 },
                callback: function(value, index, values) {
                    const label = this.getLabelForValue(value);
                    return label.length > 15 ? label.substring(0, 15) + '...' : label;
                }
            }
        }
    }
};

// Doughnut/Pie chart configuration
const doughnutConfig = {
    ...baseChartConfig,
    cutout: '60%', // For doughnut charts
    plugins: {
        legend: {
            ...standardLegend,
            position: 'right',
            maxWidth: 150
        },
        tooltip: {
            ...standardTooltip,
            callbacks: {
                label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                }
            }
        }
    }
};

// Line chart configuration
const lineConfig = {
    ...baseChartConfig,
    plugins: {
        legend: standardLegend,
        tooltip: standardTooltip
    },
    scales: {
        x: {
            grid: {
                display: true,
                color: 'rgba(0,0,0,0.1)'
            },
            ticks: {
                maxTicksLimit: 10,
                font: { size: 10 }
            }
        },
        y: {
            beginAtZero: true,
            ticks: {
                maxTicksLimit: 8,
                font: { size: 10 }
            },
            grid: {
                color: 'rgba(0,0,0,0.1)'
            }
        }
    },
    elements: {
        point: {
            radius: 4,
            hoverRadius: 6
        },
        line: {
            tension: 0.3
        }
    }
};

// ============================================
// DATA LIMITING FUNCTIONS
// ============================================

// Limit data points for charts
function limitChartData(data, maxItems = 15) {
    if (!Array.isArray(data) || data.length <= maxItems) {
        return data;
    }
    
    // Sort by a relevant metric if possible, otherwise take first items
    return data.slice(0, maxItems);
}

// Get appropriate labels based on current filter state
function getResponsiveLabels(data, maxItems = 15) {
    let labels = [];
    
    if (filters.subGroup) {
        labels = [...new Set(data.map(d => d.application || ''))];
    } else if (filters.group) {
        labels = [...new Set(data.map(d => d.subGroup || ''))];
    } else {
        labels = [...new Set(data.map(d => d.group || ''))];
    }
    
    // Remove empty labels and limit count
    labels = labels.filter(label => label.trim() !== '').slice(0, maxItems);
    
    return labels;
}

// ============================================
// UPDATED CHART RENDERING FUNCTIONS
// ============================================

// Enhanced Release Status Chart with data limiting
function renderReleaseStatusChart(data) {
    const ctx = document.getElementById('releaseStatusChart');
    if (!ctx) return;
    
    if (charts.releaseStatus) {
        charts.releaseStatus.destroy();
    }
    
    // Get limited labels
    const labels = getResponsiveLabels(data, 12); // Limit to 12 for better readability
    
    // Calculate data for limited labels
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
                    borderRadius: 4,
                    maxBarThickness: 50
                },
                {
                    label: 'Deferred',
                    data: goLiveDelayed,
                    backgroundColor: '#e74c3c',
                    borderRadius: 4,
                    maxBarThickness: 50
                },
                {
                    label: 'Planned',
                    data: goLivePlanned,
                    backgroundColor: '#3498db',
                    borderRadius: 4,
                    maxBarThickness: 50
                }
            ]
        },
        options: {
            ...barChartConfig,
            plugins: {
                ...barChartConfig.plugins,
                tooltip: {
                    ...standardTooltip,
                    callbacks: {
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            const label = labels[index];
                            
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
            }
        }
    });
}

// Enhanced Top Problem Areas Chart
function renderTopProblemAreasChart(data) {
    const ctx = document.getElementById('topProblemAreasChart');
    if (!ctx) return;
    
    if (charts.topProblemAreas) {
        charts.topProblemAreas.destroy();
    }
    
    // Calculate and sort problem areas
    let areaDefects = [];
    
    if (filters.subGroup) {
        data.forEach(d => {
            if (d.defectsTotal > 0) {
                areaDefects.push({
                    area: d.application,
                    count: d.defectsTotal
                });
            }
        });
    } else if (filters.group) {
        const subGroups = [...new Set(data.map(d => d.subGroup))];
        subGroups.forEach(sg => {
            const count = data.filter(d => d.subGroup === sg)
                .reduce((sum, d) => sum + d.defectsTotal, 0);
            if (count > 0) {
                areaDefects.push({ area: sg, count });
            }
        });
    } else {
        const groups = [...new Set(data.map(d => d.group))];
        groups.forEach(g => {
            const count = data.filter(d => d.group === g)
                .reduce((sum, d) => sum + d.defectsTotal, 0);
            if (count > 0) {
                areaDefects.push({ area: g, count });
            }
        });
    }
    
    // Sort and limit to top 10
    areaDefects.sort((a, b) => b.count - a.count);
    const topAreas = areaDefects.slice(0, 10);
    
    if (topAreas.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        return;
    }
    
    charts.topProblemAreas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topAreas.map(d => d.area),
            datasets: [{
                label: 'Total Defects',
                data: topAreas.map(d => d.count),
                backgroundColor: '#c41e3a',
                borderRadius: 4,
                maxBarThickness: 40
            }]
        },
        options: {
            ...horizontalBarConfig,
            plugins: {
                ...horizontalBarConfig.plugins,
                legend: {
                    display: false
                }
            }
        }
    });
}

// Enhanced Overall Test Summary (Doughnut)
function renderOverallTestSummaryChart(data) {
    const ctx = document.getElementById('overallTestSummaryChart');
    if (!ctx) return;
    
    if (charts.overallTestSummary) {
        charts.overallTestSummary.destroy();
    }
    
    const totals = data.reduce((acc, d) => {
        acc.passed += (d.functionalTestPassed || 0) + (d.regressionTestPassed || 0);
        acc.failed += (d.functionalTestFailed || 0) + (d.regressionTestFailed || 0);
        acc.blocked += (d.functionalTestBlocked || 0) + (d.regressionTestBlocked || 0);
        acc.na += (d.functionalTestNA || 0) + (d.regressionTestNA || 0);
        return acc;
    }, { passed: 0, failed: 0, blocked: 0, na: 0 });
    
    charts.overallTestSummary = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Passed', 'Failed', 'Blocked', 'Not Applicable'],
            datasets: [{
                data: [totals.passed, totals.failed, totals.blocked, totals.na],
                backgroundColor: ['#27ae60', '#e74c3c', '#f39c12', '#95a5a6'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: doughnutConfig
    });
}

// ============================================
// MATRIX AND HEATMAP FUNCTIONS WITH LIMITS
// ============================================

// Enhanced Matrix with scrolling and limits
function renderDefectDistributionMatrix(data) {
    const container = document.getElementById('defectDistributionMatrix');
    if (!container) return;
    
    // Limit rows to prevent excessive height
    let allRows;
    if (filters.subGroup) {
        allRows = [...new Set(data.map(d => d.application))];
    } else if (filters.group) {
        allRows = [...new Set(data.map(d => d.subGroup))];
    } else {
        allRows = [...new Set(data.map(d => d.group))];
    }
    
    const maxRows = 25;
    const rows = allRows.slice(0, maxRows);
    
    // Calculate defect counts
    const matrixData = {};
    let maxCount = 0;
    
    rows.forEach(row => {
        const rowData = data.filter(d => {
            if (filters.subGroup) return d.application === row;
            if (filters.group) return d.subGroup === row;
            return d.group === row;
        });
        
        matrixData[row] = {
            critical: rowData.reduce((sum, d) => sum + (d.defectsCritical || 0), 0),
            high: rowData.reduce((sum, d) => sum + (d.defectsHigh || 0), 0),
            medium: rowData.reduce((sum, d) => sum + (d.defectsMedium || 0), 0),
            low: rowData.reduce((sum, d) => sum + (d.defectsLow || 0), 0)
        };
        
        maxCount = Math.max(maxCount, 
            matrixData[row].critical,
            matrixData[row].high,
            matrixData[row].medium,
            matrixData[row].low
        );
    });
    
    // Create scrollable table
    let html = '<div style="max-height: 400px; overflow: auto; border: 1px solid #e0e0e0; border-radius: 8px;">';
    html += '<table class="matrix-table" style="width: 100%; border-collapse: collapse;">';
    
    // Sticky header
    html += '<thead style="position: sticky; top: 0; background: white; z-index: 10;"><tr>';
    html += '<th style="position: sticky; left: 0; background: #f8f9fa; z-index: 11; min-width: 150px; max-width: 200px; text-align: left; padding: 8px;">Area</th>';
    html += '<th style="padding: 8px; text-align: center;">Critical</th>';
    html += '<th style="padding: 8px; text-align: center;">High</th>';
    html += '<th style="padding: 8px; text-align: center;">Medium</th>';
    html += '<th style="padding: 8px; text-align: center;">Low</th>';
    html += '<th style="padding: 8px; text-align: center;">Total</th>';
    html += '</tr></thead><tbody>';
    
    // Data rows
    rows.forEach(row => {
        const data = matrixData[row];
        const total = data.critical + data.high + data.medium + data.low;
        
        html += '<tr>';
        html += `<td style="position: sticky; left: 0; background: white; border-right: 2px solid #e0e0e0; padding: 8px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${row}">${row}</td>`;
        html += `<td class="${getHeatClass(data.critical, maxCount)}" style="text-align: center; padding: 8px;">${data.critical}</td>`;
        html += `<td class="${getHeatClass(data.high, maxCount)}" style="text-align: center; padding: 8px;">${data.high}</td>`;
        html += `<td class="${getHeatClass(data.medium, maxCount)}" style="text-align: center; padding: 8px;">${data.medium}</td>`;
        html += `<td class="${getHeatClass(data.low, maxCount)}" style="text-align: center; padding: 8px;">${data.low}</td>`;
        html += `<td style="font-weight: 700; background: #f8f9fa; text-align: center; padding: 8px;">${total}</td>`;
        html += '</tr>';
    });
    
    // Footer totals
    const totals = {
        critical: Object.values(matrixData).reduce((sum, d) => sum + d.critical, 0),
        high: Object.values(matrixData).reduce((sum, d) => sum + d.high, 0),
        medium: Object.values(matrixData).reduce((sum, d) => sum + d.medium, 0),
        low: Object.values(matrixData).reduce((sum, d) => sum + d.low, 0)
    };
    const grandTotal = totals.critical + totals.high + totals.medium + totals.low;
    
    html += '<tr style="border-top: 2px solid #333; position: sticky; bottom: 0; background: white;">';
    html += '<td style="position: sticky; left: 0; background: #f8f9fa; font-weight: 700; padding: 8px; border-right: 2px solid #e0e0e0;">TOTAL</td>';
    html += `<td style="font-weight: 700; background: #f8f9fa; text-align: center; padding: 8px;">${totals.critical}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa; text-align: center; padding: 8px;">${totals.high}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa; text-align: center; padding: 8px;">${totals.medium}</td>`;
    html += `<td style="font-weight: 700; background: #f8f9fa; text-align: center; padding: 8px;">${totals.low}</td>`;
    html += `<td style="font-weight: 700; background: #e9ecef; text-align: center; padding: 8px;">${grandTotal}</td>`;
    html += '</tr></tbody></table></div>';
    
    // Add info about data limitation
    if (allRows.length > maxRows) {
        html += `<div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; font-size: 12px; color: #666; text-align: center;">
            Showing top ${maxRows} of ${allRows.length} items. Use filters to narrow down the data.
        </div>`;
    }
    
    container.innerHTML = html;
}

// ============================================
// AUTOMATION SPECIFIC FIXES
// ============================================

// Enhanced automation chart rendering with limits
function renderCoverageByGroupChart() {
    const canvas = document.getElementById('coverageByGroupChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (automationCharts && automationCharts.coverageByGroup) {
        automationCharts.coverageByGroup.destroy();
    }
    
    const data = getFilteredAutomationData();
    const labels = getResponsiveLabels(data, 10); // Limit to 10 for automation
    
    const coverageData = labels.map(label => {
        const labelData = data.filter(d => {
            if (typeof filters !== 'undefined' && filters.subGroup) return d.application === label;
            if (typeof filters !== 'undefined' && filters.group) return d.subGroup === label;
            return d.group === label;
        });
        const totalManual = labelData.reduce((sum, d) => sum + (d.totalManualCases || 0), 0);
        const totalAutomated = labelData.reduce((sum, d) => sum + (d.totalAutomated || 0), 0);
        return totalManual > 0 ? Math.round((totalAutomated / totalManual) * 100) : 0;
    });
    
    if (typeof automationCharts === 'undefined') {
        window.automationCharts = {};
    }
    
    automationCharts.coverageByGroup = new Chart(ctx, {
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
                borderRadius: 4,
                maxBarThickness: 50
            }]
        },
        options: {
            ...barChartConfig,
            plugins: {
                ...barChartConfig.plugins,
                legend: { display: false }
            },
            scales: {
                ...barChartConfig.scales,
                y: {
                    ...barChartConfig.scales.y,
                    max: 100,
                    ticks: {
                        ...barChartConfig.scales.y.ticks,
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
// UTILITY FUNCTIONS FOR ALL CHART TYPES
// ============================================

// Enhanced label truncation with tooltip support
function createTruncatedLabels(labels, maxLength = 12) {
    return labels.map(label => {
        if (!label) return '';
        const truncated = label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
        return truncated;
    });
}

// Data aggregation helper for any chart type
function aggregateDataByLabels(data, labels, aggregationFunction) {
    return labels.map(label => {
        const filteredData = data.filter(d => {
            if (filters.subGroup) return d.application === label || d.application.startsWith(label.replace('...', ''));
            if (filters.group) return d.subGroup === label || d.subGroup.startsWith(label.replace('...', ''));
            return d.group === label || d.group.startsWith(label.replace('...', ''));
        });
        
        return aggregationFunction(filteredData);
    });
}

// Chart resize observer to handle dynamic resizing
function addChartResizeObserver(chartId, chart) {
    const container = document.getElementById(chartId)?.closest('.chart-container');
    if (!container || !chart) return;
    
    const resizeObserver = new ResizeObserver(entries => {
        if (chart && !chart.isDestroyed) {
            chart.resize();
        }
    });
    
    resizeObserver.observe(container);
    
    // Store observer for cleanup
    if (!chart.resizeObserver) {
        chart.resizeObserver = resizeObserver;
    }
}

// Cleanup function for charts
function cleanupChart(chart) {
    if (chart) {
        if (chart.resizeObserver) {
            chart.resizeObserver.disconnect();
        }
        chart.destroy();
    }
}

// ============================================
// INITIALIZATION FUNCTION
// ============================================

// Call this when initializing charts to apply universal settings
function initializeUniversalChartSettings() {
    // Set global Chart.js defaults
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#666';
    Chart.defaults.borderColor = 'rgba(0,0,0,0.1)';
    Chart.defaults.backgroundColor = 'rgba(0,0,0,0.05)';
    
    // Disable animations for better performance with large datasets
    Chart.defaults.animation.duration = 400;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    
    // Set reasonable defaults for interactions
    Chart.defaults.interaction.mode = 'nearest';
    Chart.defaults.interaction.intersect = false;
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Monitor chart rendering performance
function monitorChartPerformance(chartName, renderFunction) {
    return function(...args) {
        const startTime = performance.now();
        
        try {
            const result = renderFunction.apply(this, args);
            const endTime = performance.now();
            
            if (endTime - startTime > 1000) { // Log slow renders
                console.warn(`Chart ${chartName} took ${(endTime - startTime).toFixed(2)}ms to render`);
            }
            
            return result;
        } catch (error) {
            console.error(`Error rendering chart ${chartName}:`, error);
            throw error;
        }
    };
}

// ============================================
// EXPORT FOR USE
// ============================================

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeUniversalChartSettings);
}
        html += `