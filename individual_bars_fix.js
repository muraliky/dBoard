// FIXED STATUS CHARTS - Individual Bars Instead of Stacked
// Replace these functions in your dashboard-charts.js

// Updated Release Status Chart - Individual Bars
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
                    borderColor: '#229954',
                    borderWidth: 1,
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.25 // This controls individual bar width
                },
                {
                    label: 'Deferred',
                    data: goLiveDelayed,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1,
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.25
                },
                {
                    label: 'Planned',
                    data: goLivePlanned,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1,
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.25
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 25,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
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
                },
                customDataLabels: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    stacked: false, // CHANGED: No stacking
                    ticks: {
                        maxRotation: 45,
                        font: {
                            size: fontSize
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: false, // CHANGED: No stacking
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: fontSize
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Number of Releases',
                        font: {
                            size: fontSize,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// Updated UAT Status Chart - Individual Bars
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
                    borderColor: '#229954',
                    borderWidth: 1,
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.25 // Individual bar width
                },
                {
                    label: 'Yet to start',
                    data: uatYetToStart,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1,
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.25
                },
                {
                    label: 'In progress',
                    data: uatInProgress,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1,
                    borderRadius: 5,
                    categoryPercentage: 0.8,
                    barPercentage: 0.25
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 25,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                legend: {
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    labels: {
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
                },
                customDataLabels: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    stacked: false, // CHANGED: No stacking
                    ticks: {
                        maxRotation: window.innerWidth < 768 ? 45 : 30,
                        font: {
                            size: fontSize
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: false, // CHANGED: No stacking
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: fontSize
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Number of Releases',
                        font: {
                            size: fontSize,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// ALSO UPDATE the baseChartOptions to make individual bars the default
// Replace your existing baseChartOptions in dashboard-charts.js
const baseChartOptionsIndividual = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 25,
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
        customDataLabels: {
            enabled: true
        }
    },
    scales: {
        x: {
            stacked: false, // Individual bars by default
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
            stacked: false, // Individual bars by default
            beginAtZero: true,
            ticks: {
                font: {
                    size: 11
                }
            },
            grid: {
                color: 'rgba(0,0,0,0.1)'
            }
        }
    }
};

// UPDATED customDataLabelsPlugin to handle individual bars better
const customDataLabelsPluginUpdated = {
    id: 'customDataLabels',
    afterDatasetsDraw(chart, args, options) {
        // SKIP DOUGHNUT AND PIE CHARTS
        if (chart.config.type === 'doughnut' || chart.config.type === 'pie') {
            return;
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
                
                const fontSize = window.innerWidth < 768 ? 9 : 10;
                ctx.font = `bold ${fontSize}px Arial`;
                
                let displayValue = value;
                let textX, textY;
                
                // Format value
                if (dataset.label && dataset.label.toLowerCase().includes('coverage')) {
                    displayValue = value + '%';
                } else if (dataset.label && dataset.label.toLowerCase().includes('hour')) {
                    displayValue = value >= 1000 ? (value/1000).toFixed(1) + 'K' : value;
                } else if (value >= 1000) {
                    displayValue = (value/1000).toFixed(1) + 'K';
                }
                
                if (chart.config.options.indexAxis === 'y') {
                    // HORIZONTAL BAR CHART
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    const barStart = datapoint.base || 0;
                    const barEnd = datapoint.x;
                    const barMiddle = (barStart + barEnd) / 2;
                    
                    textX = barMiddle;
                    textY = datapoint.y;
                    
                    const textWidth = ctx.measureText(displayValue).width;
                    const barWidth = Math.abs(barEnd - barStart);
                    
                    if (barWidth < textWidth + 10) {
                        textX = barEnd + 5;
                        ctx.textAlign = 'left';
                        ctx.fillStyle = '#333';
                    }
                    
                } else {
                    // VERTICAL BAR CHART (Individual bars)
                    ctx.fillStyle = '#fff'; // White text on colored bars
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // Position in the middle of the bar
                    textX = datapoint.x;
                    textY = datapoint.y + (datapoint.height / 2);
                    
                    // If bar is too short, position above
                    if (Math.abs(datapoint.height) < 20) {
                        textY = datapoint.y - 5;
                        ctx.textBaseline = 'bottom';
                        ctx.fillStyle = '#333';
                    }
                }
                
                // Draw the text
                ctx.fillText(displayValue, textX, textY);
            });
        });
        
        ctx.restore();
    }
};

// Replace your existing plugin registration
Chart.unregister({ id: 'customDataLabels' }); // Remove old version
Chart.register(customDataLabelsPluginUpdated); // Register new version
