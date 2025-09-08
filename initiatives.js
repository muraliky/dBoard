// initiatives.js - Complete Fixed Implementation with Grey Scrollbar and Clean Doughnut Chart
let initiativesData = [];
let initiativesCharts = {};

// Load initiatives data from JSON
async function loadInitiativesData() {
    console.log('Loading initiatives data from JSON...');
    
    try {
        const response = await fetch('data/Initiatives.json');
        const jsonData = await response.json();
        
        const flatData = Array.isArray(jsonData) ? jsonData : Object.values(jsonData).flat();
        
        initiativesData = flatData.map(row => ({
            serialNo: parseInt(row['S.No ']) || 0,
            toolName: row['Tool Name'] || '',
            features: row['Features Developed'] || row['Features'] || '',
            status: row['Current Status'] || '',
            completionPercentage: parseInt(row['Percentage of Completion']) || 0,
            saveTime: parseInt(row['Save Time']) || 0,
            technologyStack: row['Technology Stack Used to develop'] || '',
            comments: row['Comments'] || ''
        }));
        
    } catch (error) {
        console.log('Error loading initiatives data, using sample:', error);
        initiativesData = generateInitiativesSampleData();
    }
    
    console.log('Initiatives data loaded:', initiativesData.length, 'records');
    updateInitiativesMetrics();
}

// Generate sample data (fallback)
function generateInitiativesSampleData() {
    return [
        {
            serialNo: 1,
            toolName: "XML Comparison Tool",
            features: "Convert payment transaction XMLs to readable key-value format",
            status: "Completed",
            completionPercentage: 100,
            saveTime: 50,
            technologyStack: ".Net",
            comments: "Successfully deployed for payments operations team"
        },
        {
            serialNo: 2,
            toolName: "Easy Test Tool",
            features: "Automate screenshot capture for test evidence",
            status: "Completed",
            completionPercentage: 100,
            saveTime: 40,
            technologyStack: ".Net",
            comments: "Helps manual testers generate evidence documents"
        }
    ];
}

// Get filtered initiatives data
function getFilteredInitiativesData() {
    return initiativesData;
}

// Initialize initiatives tabs
function initializeInitiativesTabs() {
    const initiativesTabs = document.querySelectorAll('#initiativesPage .tab');
    initiativesTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchInitiativesTab(this.getAttribute('data-tab'));
        });
    });
}

function switchInitiativesTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('#initiativesPage .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`#initiativesPage [data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('#initiativesPage .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Render appropriate content
    setTimeout(() => {
        if (tabName === 'initiatives-overview') {
            renderInitiativesTable();
        } else if (tabName === 'initiatives-savings') {
            renderHoursSavedChart();
            renderTechnologyWordCloud();
            renderTechnologyStats();
        }
    }, 100);
}

// 1. Render initiatives table with grey scrollbar
function renderInitiativesTable() {
    const container = document.getElementById('initiativesTable');
    if (!container) return;
    
    const data = getFilteredInitiativesData();
    
    if (data.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <h4 style="font-size: 20px; margin-bottom: 10px;">No initiatives data available</h4>
                <p style="font-size: 14px; color: #999;">Check if the data file is properly loaded.</p>
            </div>
        `;
        return;
    }
    
    // Create scrollable table with grey scrollbar
    let html = `
        <!-- Fixed Height Scrollable Table Container -->
        <div style="
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
            height: 450px;
            overflow: hidden;
        ">
            <div style="
                height: 100%; 
                overflow-y: scroll; 
                overflow-x: auto;
            ">
                <style>
                    /* Custom grey scrollbar styles */
                    .initiatives-table-container::-webkit-scrollbar {
                        width: 8px;
                    }
                    .initiatives-table-container::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 4px;
                    }
                    .initiatives-table-container::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 4px;
                    }
                    .initiatives-table-container::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                </style>
                <div class="initiatives-table-container" style="height: 100%; overflow-y: scroll; overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 700px;">
                        <thead style="position: sticky; top: 0; z-index: 10; background: #c41e3a;">
                            <tr style="background: #c41e3a; color: white;">
                                <th style="padding: 14px 10px; text-align: left; font-weight: 600; font-size: 14px; min-width: 200px; border-bottom: 2px solid #a01729;">Tool Name</th>
                                <th style="padding: 14px 10px; text-align: center; font-weight: 600; font-size: 14px; min-width: 120px; border-bottom: 2px solid #a01729;">Status</th>
                                <th style="padding: 14px 10px; text-align: center; font-weight: 600; font-size: 14px; min-width: 140px; border-bottom: 2px solid #a01729;">Completion</th>
                                <th style="padding: 14px 10px; text-align: left; font-weight: 600; font-size: 14px; min-width: 160px; border-bottom: 2px solid #a01729;">Technology</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    // Generate all table rows
    data.forEach((initiative, index) => {
        const statusColor = initiative.status === 'Completed' ? '#27ae60' : 
                           initiative.status === 'In Progress' ? '#f39c12' : '#3498db';
        
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
        
        html += `
            <tr style="background: ${rowBg}; border-bottom: 1px solid #e9ecef;">
                <td style="padding: 12px 10px; font-weight: 600; color: #2c3e50; font-size: 13px; word-wrap: break-word; line-height: 1.4;">
                    ${initiative.toolName}
                </td>
                <td style="padding: 12px 10px; text-align: center;">
                    <span style="
                        background: ${statusColor}20;
                        color: ${statusColor};
                        padding: 5px 10px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 600;
                        display: inline-block;
                        white-space: nowrap;
                    ">${initiative.status}</span>
                </td>
                <td style="padding: 12px 10px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <div style="
                            background: #f0f0f0; 
                            border-radius: 8px; 
                            height: 8px; 
                            width: 70px;
                            overflow: hidden;
                            flex-shrink: 0;
                        ">
                            <div style="
                                width: ${initiative.completionPercentage}%;
                                height: 100%;
                                background: ${statusColor};
                                border-radius: 8px;
                                transition: width 0.5s ease;
                            "></div>
                        </div>
                        <span style="
                            font-weight: 600; 
                            color: ${statusColor}; 
                            font-size: 12px;
                            min-width: 35px;
                            white-space: nowrap;
                        ">${initiative.completionPercentage}%</span>
                    </div>
                </td>
                <td style="padding: 12px 10px; color: #666; font-size: 12px; word-wrap: break-word; line-height: 1.4;">
                    ${initiative.technologyStack || 'Not specified'}
                </td>
            </tr>
        `;
    });
    
    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// 2. Render hours saved chart without percentages
function renderHoursSavedChart() {
    const canvas = document.getElementById('hoursSavedChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    safeDestroyInitiativesChart('hoursSaved');
    
    const data = getFilteredInitiativesData();
    const completedInitiatives = data.filter(d => 
        (d.status === 'Completed' || d.completionPercentage === 100) && 
        d.saveTime && 
        d.saveTime > 0
    );
    
    if (completedInitiatives.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No completed initiatives', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText('with time saved data', canvas.width / 2, canvas.height / 2 + 10);
        return;
    }
    
    const labels = completedInitiatives.map(d => d.toolName);
    const timeSavedValues = completedInitiatives.map(d => d.saveTime);
    const totalHours = timeSavedValues.reduce((sum, hours) => sum + hours, 0);
    const colors = ['#c41e3a', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c', '#8e44ad'];
    
    initiativesCharts.hoursSaved = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: timeSavedValues,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 3,
                borderColor: '#fff',
                cutout: '60%'
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
                        font: { size: 12 },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                return {
                                    text: `${label}: ${value} hours`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].borderColor,
                                    lineWidth: data.datasets[0].borderWidth,
                                    pointStyle: 'circle'
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            return `${context.label}: ${value} hours`;
                        }
                    }
                },
                datalabels: {
                    display: false
                }
            }
        }
    });
    
    // Add center text showing total hours saved
    /*const centerText = {
        id: 'centerText',
        beforeDatasetsDraw: function(chart) {
            const { ctx, width, height } = chart;
            ctx.restore();
            
            const fontSize = (height / 114).toFixed(2);
            ctx.font = `bold ${fontSize}em Arial`;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#2c3e50';
            
            const totalText = `${totalHours.toLocaleString()}`;
            const labelText = 'Total Hours Saved';
            
            const totalTextX = Math.round((width - ctx.measureText(totalText).width) / 2);
            const totalTextY = height / 2 - 10;
            
            ctx.fillText(totalText, totalTextX, totalTextY);
            
            ctx.font = `${(fontSize * 0.6)}em Arial`;
            ctx.fillStyle = '#666';
            const labelTextX = Math.round((width - ctx.measureText(labelText).width) / 2);
            const labelTextY = height / 2 + 15;
            
            ctx.fillText(labelText, labelTextX, labelTextY);
            ctx.save();
        }
    };
    
    Chart.register(centerText);*/
}

// 3. Render improved technology word cloud
// 3. Render improved technology word cloud - FIXED VERSION
function renderTechnologyWordCloud() {
    const container = document.getElementById('technologyWordCloud');
    if (!container) return;
    
    const data = getFilteredInitiativesData();
    const techCount = {};
    
    data.forEach(initiative => {
        if (initiative.technologyStack && initiative.technologyStack.trim() !== '') {
            const techs = initiative.technologyStack.split(/[,;]+/).map(tech => tech.trim()).filter(tech => tech !== '');
            techs.forEach(tech => {
                const cleanTech = tech.trim();
                if (cleanTech) {
                    techCount[cleanTech] = (techCount[cleanTech] || 0) + 1;
                }
            });
        }
    });
    
    if (Object.keys(techCount).length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <h4>No technology stack data available</h4>
                <p>Technology information will appear here as initiatives are added.</p>
            </div>
        `;
        return;
    }
    
    const sortedTechs = Object.entries(techCount).sort(([,a], [,b]) => b - a);
    const totalInitiativesCount = data.length; // Use total initiatives count (10)
    
    // Create improved word cloud HTML with cards layout
    let html = `
        <div style="
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #dee2e6;
        ">
            <!-- Header -->
            <div style="
                text-align: center; 
                margin-bottom: 25px; 
                padding-bottom: 15px; 
                border-bottom: 2px solid #c41e3a20;
            ">
                <h3 style="
                    margin: 0; 
                    color: #2c3e50; 
                    font-size: 18px; 
                    font-weight: 700;
                ">Technology Stack Usage</h3>
                <p style="
                    margin: 5px 0 0 0; 
                    color: #666; 
                    font-size: 13px;
                ">Technologies used across ${totalInitiativesCount} different tools</p>
            </div>
            
            <!-- Technology Cards Grid -->
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            ">
    `;
    
    // Create technology cards - ALL HIGHLIGHTED EQUALLY
    sortedTechs.forEach(([tech, count]) => {
        // All cards get the same highlight level (no frequency-based variation)
        const cardColor = 'rgba(196, 30, 58, 0.15)';
        const borderColor = 'rgba(196, 30, 58, 0.5)';
        const textColor = 'rgba(196, 30, 58, 0.85)';
        
        html += `
            <div style="
                background: white;
                border: 2px solid ${borderColor};
                border-radius: 12px;
                padding: 15px;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            "
            onmouseover="
                this.style.transform='translateY(-3px)'; 
                this.style.boxShadow='0 8px 25px rgba(196, 30, 58, 0.2)';
                this.style.borderColor='#c41e3a';
            "
            onmouseout="
                this.style.transform='translateY(0)'; 
                this.style.boxShadow='none';
                this.style.borderColor='${borderColor}';
            ">
                <!-- Background Pattern -->
                <div style="
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    width: 40px;
                    height: 40px;
                    background: ${cardColor};
                    border-radius: 50%;
                    opacity: 0.5;
                "></div>
                
                <!-- Technology Name -->
                <div style="
                    font-size: 16px;
                    font-weight: 700;
                    color: ${textColor};
                    margin-bottom: 8px;
                    position: relative;
                    z-index: 2;
                ">${tech}</div>
                
                <!-- Usage Count -->
                <div style="
                    font-size: 12px;
                    color: #666;
                    font-weight: 500;
                    position: relative;
                    z-index: 2;
                ">${count} project${count > 1 ? 's' : ''}</div>
                
                <!-- Usage Bar - All same color intensity -->
                <div style="
                    margin-top: 10px;
                    background: #f0f0f0;
                    height: 4px;
                    border-radius: 2px;
                    overflow: hidden;
                    position: relative;
                    z-index: 2;
                ">
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, ${textColor}, ${borderColor});
                        border-radius: 2px;
                        transition: width 0.8s ease;
                    "></div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <!-- Summary Stats -->
            <div style="
                display: flex;
                justify-content: space-around;
                padding: 20px;
                background: white;
                border-radius: 12px;
                border: 1px solid #e9ecef;
            ">
                <div style="text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: #c41e3a;">${Object.keys(techCount).length}</div>
                    <div style="font-size: 11px; color: #666; text-transform: uppercase;">Technologies</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: #27ae60;">${sortedTechs[0] ? sortedTechs[0][0] : 'N/A'}</div>
                    <div style="font-size: 11px; color: #666; text-transform: uppercase;">Most Used</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: #3498db;">${totalInitiativesCount}</div>
                    <div style="font-size: 11px; color: #666; text-transform: uppercase;">Total Tools</div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// 4. Render technology statistics
function renderTechnologyStats() {
    const container = document.getElementById('technologyStats');
    if (!container) return;
    
    const data = getFilteredInitiativesData();
    const techStats = {};
    
    data.forEach(initiative => {
        if (initiative.technologyStack && initiative.technologyStack.trim() !== '') {
            const techs = initiative.technologyStack.split(/[,;]+/).map(tech => tech.trim()).filter(tech => tech !== '');
            techs.forEach(tech => {
                if (!techStats[tech]) {
                    techStats[tech] = { count: 0, completedProjects: 0, inProgressProjects: 0, totalHoursSaved: 0 };
                }
                techStats[tech].count++;
                if (initiative.status === 'Completed' || initiative.completionPercentage === 100) {
                    techStats[tech].completedProjects++;
                    if (initiative.saveTime > 0) {
                        techStats[tech].totalHoursSaved += initiative.saveTime;
                    }
                } else if (initiative.status === 'In Progress') {
                    techStats[tech].inProgressProjects++;
                }
            });
        }
    });
    
    if (Object.keys(techStats).length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <h4>No technology statistics available</h4>
            </div>
        `;
        return;
    }
    
    const sortedStats = Object.entries(techStats).sort(([,a], [,b]) => b.count - a.count);
    
    let html = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; padding: 20px;">`;
    
    sortedStats.forEach(([tech, stats]) => {
        const completionRate = stats.count > 0 ? Math.round((stats.completedProjects / stats.count) * 100) : 0;
        
        html += `
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-top: 4px solid #c41e3a;">
                <h4 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px;">${tech}</h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666; font-size: 14px;">Total Projects:</span>
                    <span style="font-weight: 600; color: #2c3e50;">${stats.count}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666; font-size: 14px;">Completed:</span>
                    <span style="font-weight: 600; color: #27ae60;">${stats.completedProjects}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666; font-size: 14px;">In Progress:</span>
                    <span style="font-weight: 600; color: #f39c12;">${stats.inProgressProjects}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span style="color: #666; font-size: 14px;">Hours Saved:</span>
                    <span style="font-weight: 600; color: #9b59b6;">${stats.totalHoursSaved}</span>
                </div>
                <div style="margin-top: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span style="font-size: 12px; color: #666;">Success Rate</span>
                        <span style="font-size: 12px; font-weight: 600; color: #27ae60;">${completionRate}%</span>
                    </div>
                    <div style="background: #f0f0f0; height: 6px; border-radius: 3px;">
                        <div style="width: ${completionRate}%; height: 100%; background: linear-gradient(90deg, #27ae60, #2ecc71); border-radius: 3px; transition: width 0.8s ease;"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Update initiatives metrics (KPIs)
function updateInitiativesMetrics() {
    const data = getFilteredInitiativesData();
    
    const totalInitiatives = data.length;
    const completedInitiatives = data.filter(d => d.status === 'Completed' || d.completionPercentage === 100).length;
    const inProgressInitiatives = data.filter(d => d.status === 'In Progress' || (d.completionPercentage > 0 && d.completionPercentage < 100)).length;
    
    const totalHoursSaved = data
        .filter(d => (d.status === 'Completed' || d.completionPercentage === 100) && d.saveTime > 0)
        .reduce((sum, d) => sum + d.saveTime, 0);
    
    const kpiElements = {
        'totalInitiatives': totalInitiatives,
        'completedInitiatives': completedInitiatives,
        'inProgressInitiatives': inProgressInitiatives,
        'totalHoursSaved': totalHoursSaved.toLocaleString()
    };
    
    Object.entries(kpiElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    initializeInitiativesTabs();
    
    const activeTab = document.querySelector('#initiativesPage .tab.active');
    const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'initiatives-overview';
    
    setTimeout(() => {
        if (tabName === 'initiatives-overview' || !activeTab) {
            renderInitiativesTable();
        } else if (tabName === 'initiatives-savings') {
            renderHoursSavedChart();
            renderTechnologyWordCloud();
            renderTechnologyStats();
        }
    }, 100);
}

// Utility function to safely destroy charts
function safeDestroyInitiativesChart(chartKey) {
    if (initiativesCharts[chartKey]) {
        try {
            initiativesCharts[chartKey].destroy();
        } catch (error) {
            console.warn(`Error destroying initiatives chart ${chartKey}:`, error);
        }
        delete initiativesCharts[chartKey];
    }
}

// Initialize initiatives page
function initializeInitiativesPage() {
    console.log('Initializing Initiatives Page...');
    loadInitiativesData();
    initializeInitiativesTabs();
}

// Export functions for integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadInitiativesData,
        initializeInitiativesPage,
        updateInitiativesMetrics,
        initiativesCharts
    };
}