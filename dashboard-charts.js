// Chart instances
let charts = {};

// Chart.js default settings for responsive behavior
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
Chart.defaults.color = '#333';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

const customDataLabelsPlugin = {
    id: 'customDataLabels',
    afterDatasetsDraw(chart, args, options) {
        // SKIP DOUGHNUT AND PIE CHARTS - This prevents center text
        if (chart.config.type === 'doughnut' || chart.config.type === 'pie') {
            return; // Don't draw any labels on pie/doughnut charts
        }
        
        const { ctx, data } = chart;
        
        ctx.save();
        
        data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            
            if (!meta.visible) return;
            
            meta.data.forEach((datapoint, index) => {
                const value = dataset.data[index];
                
                // Skip if value is 0 or null
                if (!value || value === 0) return;
                
                // Responsive font size
                const fontSize = window.innerWidth < 768 ? 10 : 11;
                ctx.font = `bold ${fontSize}px Arial`;
                
                let displayValue = value;
                let textX, textY;
                
                // Format value based on context
                if (dataset.label && dataset.label.toLowerCase().includes('coverage')) {
                    displayValue = value + '%';
                } else if (dataset.label && dataset.label.toLowerCase().includes('hour')) {
                    displayValue = value >= 1000 ? (value/1000).toFixed(1) + 'K' : value;
                } else if (value >= 1000) {
                    displayValue = (value/1000).toFixed(1) + 'K';
                }
                
                // Handle different chart orientations
                if (chart.config.options.indexAxis === 'y') {
                    // HORIZONTAL BAR CHART (Top Problem Areas)
                    console.log('Horizontal bar detected for value:', value);
                    console.log('Datapoint properties:', {
                        x: datapoint.x,
                        y: datapoint.y,
                        base: datapoint.base,
                        width: datapoint.width,
                        height: datapoint.height
                    });
                    
                    ctx.fillStyle = '#fff'; // White text on colored bars
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // Calculate the middle of the bar
                    // For horizontal bars: base is the starting point, x is the end point
                    const barStart = datapoint.base || 0;
                    const barEnd = datapoint.x;
                    const barMiddle = (barStart + barEnd) / 2;
                    
                    textX = barMiddle;
                    textY = datapoint.y;
                    
                    console.log('Calculated positions:', {
                        barStart,
                        barEnd,
                        barMiddle,
                        textX,
                        textY
                    });
                    
                    // Check if there's enough space for the text
                    const textWidth = ctx.measureText(displayValue).width;
                    const barWidth = Math.abs(barEnd - barStart);
                    
                    console.log('Text measurement:', {
                        textWidth,
                        barWidth,
                        hasSpace: barWidth >= textWidth + 10
                    });
                    
                    if (barWidth < textWidth + 10) {
                        // If bar is too narrow, position text to the right of the bar
                        textX = barEnd + 5;
                        ctx.textAlign = 'left';
                        ctx.fillStyle = '#333'; // Dark text outside bar
                        console.log('Text positioned outside bar at:', textX);
                    } else {
                        console.log('Text positioned inside bar at middle:', textX);
                    }
                    
                } else if (chart.config.options.scales && chart.config.options.scales.x && chart.config.options.scales.x.stacked) {
                    // STACKED VERTICAL BAR CHART
                    const width = datapoint.width || 0;
                    const height = datapoint.height || 0;
                    
                    if (width < 25) return; // Skip narrow segments
                    
                    ctx.fillStyle = '#fff'; // White text for better contrast on colored bars
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    textY = datapoint.y + (height / 2);
                    textX = datapoint.x;
                    
                } else {
                    // REGULAR VERTICAL BAR CHART
                    ctx.fillStyle = '#333'; // Dark text above bars
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    
                    // Position above the bar
                    textY = datapoint.y - 5;
                    textX = datapoint.x;
                }
                
                // Draw the text
                ctx.fillText(displayValue, textX, textY);
            });
        });
        
        ctx.restore();
    }
};

// Register the plugin
Chart.register(customDataLabelsPlugin);
// Base chart options for consistent responsive behavior
const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 15, // Reduced since labels are on bars, not above
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
        },
        customDataLabelsPlugin: {
            enabled: true
        }
    },
    scales: {
        x: {
            stacked: true,
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
            display: false, // Hide Y-axis
            stacked: true,
            beginAtZero: true,
            ticks: {
                display: false
            },
            grid: {
                display: false
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
    const allData = qualityData;
    renderTestCasesTimelineChart(qualityData);
    const filteredData = getFilteredData();
    renderReleaseStatusChart(filteredData);
    renderUATStatusChart(filteredData);
}
function sortMonthsChronologically(months) {
    const monthOrder = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
}

// Test Cases Timeline Chart
function renderTestCasesTimelineChart(data) {
    console.log('Starting renderTestCasesTimelineChart');
    console.log('Current filters:', filters);
    
    const canvas = document.getElementById('testCasesTimelineChart');
    if (!canvas) {
        console.error('Canvas testCasesTimelineChart not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context');
        return;
    }
    
    // Destroy existing chart
    safeDestroyChart('testCasesTimeline');
    
    // Get all months from ALL data
    const allMonthsRaw = qualityData.map(d => getMonthFromDate(d.goLiveDate)).filter(m => m !== null);
    const uniqueMonths = [...new Set(allMonthsRaw)];
    const sortedMonths = sortMonthsChronologically(uniqueMonths);
    
    // Filter months based on month filter - show ALL months up to selected month
    let displayMonths = sortedMonths;
    if (filters.month) {
        const selectedIndex = sortedMonths.indexOf(filters.month);
        if (selectedIndex !== -1) {
            displayMonths = sortedMonths.slice(0, selectedIndex + 1);
        }
    }
    
    console.log('Display months:', displayMonths);
    
    if (displayMonths.length === 0) {
        console.warn('No months to display');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data available for timeline', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // FIXED: Determine series based on filters
    let seriesLabels = [];
    let baseFilteredData = qualityData.filter(d => {
        const matchGroup = !filters.group || d.group === filters.group;
        const matchSubGroup = !filters.subGroup || d.subGroup === filters.subGroup;
        return matchGroup && matchSubGroup;
    });
    
    if (filters.group && filters.subGroup) {
        // Both Group and SubGroup selected - show individual Applications
        seriesLabels = [...new Set(baseFilteredData.map(d => d.application))];
        console.log('Showing applications for Group + SubGroup:', seriesLabels);
        
    } else if (filters.group && !filters.subGroup) {
        // Only Group selected - show SubGroups within that Group
        seriesLabels = [...new Set(baseFilteredData.map(d => d.subGroup))];
        console.log('Showing sub groups for Group:', seriesLabels);
        
    } else {
        // No Group selected - show all Groups
        seriesLabels = [...new Set(qualityData.map(d => d.group))];
        console.log('Showing all groups:', seriesLabels);
    }
    
    // Calculate data for each series
    seriesData = seriesLabels.map(label => {
        const monthlyData = displayMonths.map(month => {
            let monthData;
            
            if (filters.group && filters.subGroup) {
                // Show data for specific application
                monthData = qualityData.filter(d => 
                    d.group === filters.group &&
                    d.subGroup === filters.subGroup &&
                    d.application === label && 
                    getMonthFromDate(d.goLiveDate) === month
                );
            } else if (filters.group && !filters.subGroup) {
                // Show data for specific subGroup within group
                monthData = qualityData.filter(d => 
                    d.group === filters.group &&
                    d.subGroup === label && 
                    getMonthFromDate(d.goLiveDate) === month
                );
            } else {
                // Show data for specific group
                monthData = qualityData.filter(d => 
                    d.group === label && 
                    getMonthFromDate(d.goLiveDate) === month
                );
            }
            
            const total = monthData.reduce((sum, d) => 
                sum + (d.functionalTestTotal || 0) + (d.regressionTestTotal || 0), 0
            );
            
            return total;
        });
        
        console.log(`Data for ${label}:`, monthlyData);
        return monthlyData;
    });
    
    // Color palette
    const colors = [
        '#c41e3a', '#3498db', '#27ae60', '#f39c12', '#9b59b6',
        '#e74c3c', '#2ecc71', '#1abc9c', '#f1c40f', '#8e44ad'
    ];
    
    // Create datasets
    const datasets = seriesLabels.map((label, index) => ({
        label: label,
        data: seriesData[index],
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors[index % colors.length],
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3
    }));
    
    const fontSize = getResponsiveFontSize();
    const isMobile = window.innerWidth < 768;
    
    // Create chart
    charts.testCasesTimeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: displayMonths,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            layout: {
                padding: {
                    top: 20,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                legend: {
                    position: isMobile ? 'bottom' : 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: fontSize
                        }
                    }
                },
                tooltip: {
                    titleFont: { size: fontSize + 1 },
                    bodyFont: { size: fontSize },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            return `${context[0].label} - Test Cases Executed`;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            return `${label}: ${value.toLocaleString()}`;
                        }
                    }
                },
                customDataLabels: { enabled: false }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: filters.month ? `Months up to ${filters.month}` : 'All Months',
                        font: { size: fontSize, weight: 'bold' }
                    },
                    ticks: {
                        font: { size: fontSize },
                        maxRotation: isMobile ? 45 : 0
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Test Cases',
                        font: { size: fontSize, weight: 'bold' }
                    },
                    ticks: {
                        font: { size: fontSize },
                        callback: function(value) {
                            if (value >= 1000) {
                                return (value / 1000).toFixed(1) + 'K';
                            }
                            return value;
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
    
    console.log('Timeline chart created successfully');
}

function renderReleaseStatusChart(data) {
    const ctx = document.getElementById('releaseStatusChart');
    if (!ctx) return;
    
    safeDestroyChart('releaseStatus');
    
    // Determine labels based on filters
    let labels;
    if (filters.group && filters.subGroup) {
        // Show applications within selected subgroup
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group && !filters.subGroup) {
        // Show subgroups within selected group
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        // Show all groups
        labels = [...new Set(data.map(d => d.group))];
    }
    
    console.log('Release Status Chart - Labels:', labels);
    
    // Truncate labels if too long for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
    // Calculate status counts for each label
    const goLiveCompleted = labels.map(label => {
        return data.filter(d => {
            let matchLabel;
            if (filters.group && filters.subGroup) {
                matchLabel = d.application === label;
            } else if (filters.group && !filters.subGroup) {
                matchLabel = d.subGroup === label;
            } else {
                matchLabel = d.group === label;
            }
            return matchLabel && d.goLiveStatus === 'Completed';
        }).length;
    });
    
    const goLiveDelayed = labels.map(label => {
        return data.filter(d => {
            let matchLabel;
            if (filters.group && filters.subGroup) {
                matchLabel = d.application === label;
            } else if (filters.group && !filters.subGroup) {
                matchLabel = d.subGroup === label;
            } else {
                matchLabel = d.group === label;
            }
            return matchLabel && d.goLiveStatus === 'Deferred';
        }).length;
    });

    const goLivePlanned = labels.map(label => {
        return data.filter(d => {
            let matchLabel;
            if (filters.group && filters.subGroup) {
                matchLabel = d.application === label;
            } else if (filters.group && !filters.subGroup) {
                matchLabel = d.subGroup === label;
            } else {
                matchLabel = d.group === label;
            }
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
                    //...baseChartOptions.plugins.legend,
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
                        //...baseChartOptions.plugins.legend.labels,
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: fontSize
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
                    cornerRadius: 8,
                    callbacks: {
                        afterLabel: function(context) {
                            const datasetIndex = context.datasetIndex;
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

function renderUATStatusChart(data) {
    const ctx = document.getElementById('uatStatusChart');
    if (!ctx) return;
    
    safeDestroyChart('uatStatus');
    
    // Determine labels based on filters
     let labels;
    if (filters.group && filters.subGroup) {
        // Show applications within selected subgroup
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group && !filters.subGroup) {
        // Show subgroups within selected group
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        // Show all groups
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
             let matchLabel;
            if (filters.group && filters.subGroup) {
                matchLabel = d.application === label;
            } else if (filters.group && !filters.subGroup) {
                matchLabel = d.subGroup === label;
            } else {
                matchLabel = d.group === label;
            }
            return matchLabel && d.uatStatus === 'Completed';
        }).length;
    });
    
    const uatYetToStart = labels.map(label => {
        return data.filter(d => {
             let matchLabel;
            if (filters.group && filters.subGroup) {
                matchLabel = d.application === label;
            } else if (filters.group && !filters.subGroup) {
                matchLabel = d.subGroup === label;
            } else {
                matchLabel = d.group === label;
            }
            return matchLabel && d.uatStatus === 'Yet to start';
        }).length;
    });

    const uatInProgress = labels.map(label => {
        return data.filter(d => {
             let matchLabel;
            if (filters.group && filters.subGroup) {
                matchLabel = d.application === label;
            } else if (filters.group && !filters.subGroup) {
                matchLabel = d.subGroup === label;
            } else {
                matchLabel = d.group === label;
            }
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
    
    // Create labels with values
    const labelsWithValues = [
        `Passed (${totals.passed.toLocaleString()})`,
        `Failed (${totals.failed.toLocaleString()})`,
        `Blocked (${totals.blocked.toLocaleString()})`,
        `Not Applicable (${totals.na.toLocaleString()})`
    ];
    
    charts.overallTestSummary = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labelsWithValues,
            datasets: [{
                data: [totals.passed, totals.failed, totals.blocked, totals.na],
                backgroundColor: ['#27ae60', '#e74c3c', '#f39c12', '#95a5a6'],
                borderWidth: 2,
                borderColor: '#fff',
                cutout: window.innerWidth < 768 ? '50%' : '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: fontSize
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const dataset = data.datasets[0];
                                    const value = dataset.data[i];
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    
                                    return {
                                        text: `${label} (${percentage}%)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: dataset.borderWidth,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = ((value / total) * 100).toFixed(1);
                            const label = context.label.split(' (')[0];
                            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                },
                // EXPLICITLY DISABLE THE PROBLEMATIC PLUGIN FOR THIS CHART
                customDataLabels: {
                    enabled: false
                }
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            }
        }
    });
    
    console.log('Overall test summary chart created successfully');
}


// Test Case Distribution Chart
function renderTestCaseDistributionChart(data) {
    const ctx = document.getElementById('testCaseDistributionChart');
    if (!ctx) return;
    
    safeDestroyChart('testCaseDistribution');
    
    // Determine labels based on filters
     let labels;
    if (filters.group && filters.subGroup) {
        // Show applications within selected subgroup
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group && !filters.subGroup) {
        // Show subgroups within selected group
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        // Show all groups
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
            if (filters.group && filters.subGroup) {
                return d.application === label;
            } else if (filters.group && !filters.subGroup) {
                return d.subGroup === label;
            } else {
                return d.group === label;
            }
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
    
   let labels;
    if (filters.group && filters.subGroup) {
        // Show applications within selected subgroup
        labels = [...new Set(data.map(d => d.application))];
    } else if (filters.group && !filters.subGroup) {
        // Show subgroups within selected group
        labels = [...new Set(data.map(d => d.subGroup))];
    } else {
        // Show all groups
        labels = [...new Set(data.map(d => d.group))];
    }
    
    // Truncate labels for mobile
    const truncateLength = window.innerWidth < 768 ? 8 : 15;
    const displayLabels = labels.map(label => 
        label.length > truncateLength ? label.substring(0, truncateLength) + '...' : label
    );
    
    const testCases = labels.map(label => {
        const labelData = data.filter(d => {
            if (filters.group && filters.subGroup) {
                return d.application === label;
            } else if (filters.group && !filters.subGroup) {
                return d.subGroup === label;
            } else {
                return d.group === label;
            }
        });
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
    
    if (filters.group && filters.subGroup) {
        // Show applications
        data.forEach(d => {
            areaDefects.push({
                area: d.application,
                count: d.defectsTotal
            });
        });
    } else if (filters.group && !filters.subGroup) {
        // Show subgroups
        const subGroups = [...new Set(data.map(d => d.subGroup))];
        subGroups.forEach(sg => {
            const count = data.filter(d => d.subGroup === sg)
                .reduce((sum, d) => sum + d.defectsTotal, 0);
            areaDefects.push({ area: sg, count });
        });
    } else {
        // Show groups
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
                borderColor: '#8b0000',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Horizontal bars
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 60 // Extra space for external labels if needed
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            return top5[index].area;
                        },
                        label: function(context) {
                            return `Total Defects: ${context.parsed.x}`;
                        }
                    }
                },
                customDataLabels: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        font: { size: fontSize }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { size: fontSize }
                    }
                }
            },
            // Animation complete callback to add labels if plugin fails
            animation: {
                onComplete: function(animation) {
                    // Fallback: Add labels manually after animation
                    setTimeout(() => {
                        addHorizontalBarLabels('topProblemAreas', this);
                    }, 100);
                }
            }
        }
    });
    
    console.log('Top problem areas chart created');
    
    // Also try adding labels immediately after chart creation
    setTimeout(() => {
        addHorizontalBarLabels('topProblemAreas');
    }, 200);
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
// Updated renderDefectSeverityMiniChart function for laptop screen fix
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
    
    // Screen size detection
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isLaptop = width >= 769 && width <= 1400;
    const isDesktop = width > 1400;
    
    // Set canvas dimensions based on screen size
    if (isLaptop) {
        canvas.style.height = '320px';
        canvas.style.width = '100%';
        // Ensure parent container has enough height
        const parentSection = canvas.closest('.defect-severity-section');
        if (parentSection) {
            parentSection.style.minHeight = '350px';
        }
        const parentCard = canvas.closest('.defect-overview-card');
        if (parentCard) {
            parentCard.style.minHeight = '480px';
        }
    } else if (isMobile) {
        canvas.style.height = '200px';
        canvas.style.width = '100%';
    } else if (isDesktop) {
        canvas.style.height = '280px';
        canvas.style.width = '100%';
    }
    
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
    
    // Responsive font sizes
    let fontSize, padding, stepSize;
    if (isMobile) {
        fontSize = 10;
        padding = 5;
        stepSize = Math.max(1, Math.ceil(Math.max(...Object.values(severityTotals)) / 3));
    } else if (isLaptop) {
        fontSize = 11;
        padding = 10;
        stepSize = Math.max(1, Math.ceil(Math.max(...Object.values(severityTotals)) / 5));
    } else {
        fontSize = 12;
        padding = 15;
        stepSize = Math.max(1, Math.ceil(Math.max(...Object.values(severityTotals)) / 5));
    }
    
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
                    top: padding,
                    bottom: padding,
                    left: padding / 2,
                    right: padding / 2
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    titleFont: {
                        size: fontSize + 1
                    },
                    bodyFont: {
                        size: fontSize
                    },
                    padding: isLaptop ? 10 : 8,
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
                            size: fontSize
                        },
                        maxRotation: 0,
                        padding: isLaptop ? 2 : padding / 2,
                        maxTicksLimit: 4, // Force all 4 labels to show
                        autoSkip: false, // Don't skip any labels
                        minRotation: 0,
                        includeBounds: true
                    },
                    // Force display of all labels
                    afterBuildTicks: function(axis) {
                        if (isLaptop) {
                            // Ensure all ticks are visible on laptop
                            axis.ticks = axis.ticks.map((tick, index) => ({
                                ...tick,
                                label: ['Critical', 'High', 'Medium', 'Low'][index]
                            }));
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        stepSize: stepSize,
                        font: {
                            size: fontSize
                        },
                        padding: padding / 2,
                        callback: function(value) {
                            return Number.isInteger(value) ? value : '';
                        }
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        }
    };
    
    try {
        charts.defectSeverityMini = new Chart(ctx, chartConfig);
        console.log('Defect severity mini chart created successfully with totals:', severityTotals);
        
        // Force resize for laptop screens after creation
        if (isLaptop) {
            setTimeout(() => {
                if (charts.defectSeverityMini) {
                    charts.defectSeverityMini.resize();
                    console.log('Chart resized for laptop screen');
                }
            }, 150);
        }
        
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

// Enhanced resize handler specifically for defect severity chart
function handleDefectSeverityResize() {
    const width = window.innerWidth;
    const isLaptop = width >= 769 && width <= 1400;
    
    // Only re-render if we're on laptop and chart exists
    if (isLaptop && charts.defectSeverityMini) {
        console.log('Re-rendering defect severity chart for laptop resize');
        setTimeout(() => {
            // Get current data and re-render
            const filteredData = typeof getFilteredData === 'function' ? getFilteredData() : [];
            renderDefectSeverityMiniChart(filteredData);
        }, 200);
    }
}

// Add this resize listener specifically for defect severity issues
if (typeof window !== 'undefined') {
    window.addEventListener('resize', debounce(handleDefectSeverityResize, 300));
}

// Helper function for severity summary (if not already exists)
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
    
    const width = window.innerWidth;
    const isLaptop = width >= 769 && width <= 1400;
    const isMobile = width < 768;
    
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'severity-summary';
    summaryDiv.style.cssText = `
        margin-top: ${isLaptop ? '15px' : '10px'};
        padding: ${isLaptop ? '10px' : '8px'};
        background: ${priorityDefects > total * 0.3 ? '#fff5f5' : '#f0f9ff'};
        border-radius: 4px;
        border-left: 3px solid ${priorityDefects > total * 0.3 ? '#e74c3c' : '#3498db'};
        font-size: ${isMobile ? '11px' : isLaptop ? '12px' : '12px'};
        color: #666;
        text-align: center;
        flex-shrink: 0;
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
function debugCenterTextIssue() {
    console.log('=== DEBUGGING CENTER TEXT ISSUE ===');
    
    // Check Chart.js version and availability
    if (typeof Chart === 'undefined') {
        console.log('ERROR: Chart.js is not loaded');
        return;
    }
    
    console.log('Chart.js version:', Chart.version || 'Unknown');
    
    // Check different ways plugins might be registered
    if (Chart.registry && Chart.registry.plugins) {
        console.log('Chart.registry.plugins exists');
        try {
            if (Chart.registry.plugins._items) {
                console.log('Registered plugins:', Object.keys(Chart.registry.plugins._items));
            }
        } catch (e) {
            console.log('Could not access registry plugins:', e.message);
        }
    } else {
        console.log('Chart.registry.plugins not available');
    }
    
    // Check global plugins (older Chart.js versions)
    if (Chart.plugins && Chart.plugins.getAll) {
        console.log('Global plugins:', Chart.plugins.getAll());
    }
    
    // Check defaults
    if (Chart.defaults && Chart.defaults.plugins) {
        console.log('Default plugins config:', Chart.defaults.plugins);
    }
    
    // Check specific chart instance
    const chart = charts && charts.overallTestSummary;
    if (chart) {
        console.log('Current chart exists');
        console.log('Chart type:', chart.config.type);
        console.log('Chart plugins:', chart.config.plugins || 'None');
        console.log('Chart options plugins:', chart.options.plugins || 'None');
    } else {
        console.log('No chart instance found');
    }
    
    // Check DOM for the canvas
    const canvas = document.getElementById('overallTestSummaryChart');
    if (canvas) {
        console.log('Canvas found:', canvas);
        console.log('Canvas context:', canvas.getContext('2d'));
    } else {
        console.log('Canvas not found');
    }
}