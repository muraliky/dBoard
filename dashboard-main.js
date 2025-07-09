// Global variables
let qualityData = [];
//let automationData = [];
let currentPage = 'quality';
let currentTab = 'overview';
let filters = {
    group: '',
    subGroup: '',
    month: 'June'
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTabs();
    initializeFilters();
    loadData();
});

async function loadQualityData() {
    console.log('Loading quality metrics data...');
    
    try {
        const res = await fetch('data/Quality.json');
        const jsonData = await res.json();

        // Optional: flatten if jsonData is an object with sheets
        const flatData = Array.isArray(jsonData)
        ? jsonData
        : Object.values(jsonData).flat();

        qualityData = flatData.map(row => ({
            group: row.Group || '',
            subGroup: row['Sub Group'] || '',
            application: (row['Application name'] || '').trim(),
            releaseName: (row['Release name'] || '').trim(),
            goLiveDate: row['Go Live Date'] || '',
            goLiveStatus: row['Go Live Status'] || '',
            executionStart: row['Execution start'] || '',
            executionEnd: row['Execution end'] || '',
            uatStatus: row['UAT Status'] || '',
            requirements: parseInt(row['No.of requirements']) || 0,
            functionalTestTotal: parseInt(row['Functional Test Cases Total']) || 0,
            functionalTestPassed: parseInt(row['Functional Test cases Passed']) || 0,
            functionalTestFailed: parseInt(row['Functional Test Cases Failed']) || 0,
            functionalTestBlocked: parseInt(row['Functional Test Cases Blocked']) || 0,
            functionalTestNA: parseInt(row['Functional Test Cases Not applicable']) || 0,
            functionalTestNoRun: parseInt(row['Functional Test Cases No run']) || 0,
            regressionTestTotal: parseInt(row['Regression Test Cases Total']) || 0,
            regressionTestPassed: parseInt(row['Regression Test cases Passed']) || 0,
            regressionTestFailed: parseInt(row['Regression Test Cases Failed']) || 0,
            regressionTestBlocked: parseInt(row['Regression Test Cases Blocked']) || 0,
            regressionTestNA: parseInt(row['Regression Test Cases Not applicable']) || 0,
            regressionTestNoRun: parseInt(row['Regression Test Cases No run']) || 0,
            defectsTotal: parseInt(row['Defects - Total']) || 0,
            defectsOpen: parseInt(row['Open']) || 0,
            defectsClosed: parseInt(row['Closed']) || 0,
            defectsDeferred: parseInt(row['Deferred']) || 0,
            defectsRejected: parseInt(row['Rejected']) || 0,
            defectsCritical: parseInt(row['Critical']) || 0,
            defectsHigh: parseInt(row['High']) || 0,
            defectsMedium: parseInt(row['Medium']) || 0,
            defectsLow: parseInt(row['Low']) || 0,
            newTestCasesDesigned: parseInt(row['Number of New Test Cases Designed']) || 0
        }));

        // DEBUG: Log sample Go Live Dates to see the format
        console.log('=== DEBUGGING GO LIVE DATES ===');
        console.log('Sample Go Live Dates from your data:');
        qualityData.slice(0, 10).forEach((row, index) => {
            console.log(`Row ${index + 1}: "${row.goLiveDate}" (type: ${typeof row.goLiveDate})`);
        });
        
        // Test the month extraction on your actual data
        console.log('Testing month extraction:');
        qualityData.slice(0, 5).forEach((row, index) => {
            const month = getMonthFromDate(row.goLiveDate);
            console.log(`Row ${index + 1}: "${row.goLiveDate}" → "${month}"`);
        });
        
    } catch (error) {
        console.log('Error loading data, using sample:', error);
        qualityData = generateSampleData();
    }
    
    console.log('Quality data loaded:', qualityData.length, 'records');
}
// Load all data
async function loadData() {

    await loadQualityData();
    //qualityData = loadJSONData(url);
    populateFilters();
    updateQualityMetrics();
}

// Navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage(this.getAttribute('data-page'));
        });
    });
}

function switchPage(page) {
    currentPage = page;
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Update page title
    document.getElementById('page-title').textContent = 
        page === 'quality' ? 'Quality Metrics' : 'Automation Metrics';
    
    // Show/hide pages
    document.getElementById('qualityPage').style.display = 
        page === 'quality' ? 'block' : 'none';
    document.getElementById('automationPage').style.display = 
        page === 'automation' ? 'block' : 'none';
    
    // Update data based on page
    if (page === 'quality') {
        updateQualityMetrics();
    } else if (page === 'automation') {
        // Initialize automation page when switching to it
        if (typeof initializeAutomationPage === 'function') {
            initializeAutomationPage();
        }
    }
}

// Tabs
function initializeTabs() {
    document.querySelectorAll('#qualityPage .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });
}

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('#qualityPage .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`#qualityPage [data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('#qualityPage .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Render charts
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

// Filters
function initializeFilters() {
    const groupFilter = document.getElementById('groupFilter');
    const subGroupFilter = document.getElementById('subGroupFilter');
    const monthFilter = document.getElementById('monthFilter');
    
    groupFilter.addEventListener('change', function() {
        filters.group = this.value;
        updateSubGroupFilter();
        updateQualityMetrics();
    });
    
    subGroupFilter.addEventListener('change', function() {
        filters.subGroup = this.value;
        updateQualityMetrics();
    });
    
    monthFilter.addEventListener('change', function() {
        filters.month = this.value;
        updateQualityMetrics();
    });
}

function updateSubGroupFilter() {
    const subGroupFilter = document.getElementById('subGroupFilter');
    subGroupFilter.innerHTML = '<option value="">All Sub Groups</option>';
    
    if (filters.group) {
        const subGroups = [...new Set(qualityData
            .filter(d => d.group === filters.group)
            .map(d => d.subGroup))];
        
        subGroups.forEach(sg => {
            const option = document.createElement('option');
            option.value = sg;
            option.textContent = sg;
            subGroupFilter.appendChild(option);
        });
    }
    
    filters.subGroup = '';
}

// Updated populateFilters with more debugging
function populateFilters() {
    console.log('=== POPULATING FILTERS ===');
    
    // Group filter
    const groups = [...new Set(qualityData.map(d => d.group))];
    const groupFilter = document.getElementById('groupFilter');
    groupFilter.innerHTML = '<option value="">All Groups</option>';
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupFilter.appendChild(option);
    });
    
    // Month filter - Extract months from Go Live Date
    console.log('Extracting months from Go Live dates...');
    const allMonths = qualityData.map(d => getMonthFromDate(d.goLiveDate));
    console.log('All extracted months:', allMonths);
    
    const validMonths = allMonths.filter(month => month !== null);
    console.log('Valid months:', validMonths);
    
    const uniqueMonths = [...new Set(validMonths)];
    console.log('Unique months:', uniqueMonths);
    
    const sortedMonths = uniqueMonths.sort((a, b) => {
        const monthOrder = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
    
    console.log('Final sorted months for dropdown:', sortedMonths);
    
    const monthFilter = document.getElementById('monthFilter');
    monthFilter.innerHTML = '<option value="">All Months</option>';
    sortedMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
    
    // Set default to current month or latest available month
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    if (sortedMonths.includes(currentMonth)) {
        filters.month = currentMonth;
        monthFilter.value = currentMonth;
    } else if (sortedMonths.length > 0) {
        filters.month = sortedMonths[sortedMonths.length - 1];
        monthFilter.value = filters.month;
    } else {
        filters.month = '';
    }
    
    console.log('Selected default month:', filters.month);
}
function getMonthFromDate(dateString) {
    if (!dateString) {
        console.log('Empty date string received');
        return null;
    }
    
    console.log(`Processing date: "${dateString}" (type: ${typeof dateString})`);
    
    try {
        let date;
        
        // Handle Excel serial number dates (common in Excel exports)
        if (typeof dateString === 'number') {
            // Excel date serial number (days since 1900-01-01)
            date = new Date((dateString - 25569) * 86400 * 1000);
            console.log(`Converted Excel serial ${dateString} to:`, date);
        }
        // Handle string dates
        else if (typeof dateString === 'string') {
            const trimmed = dateString.trim();
            
            // Try different formats
            if (trimmed.includes('/')) {
                // Handle MM/DD/YYYY or DD/MM/YYYY format
                const parts = trimmed.split('/');
                if (parts.length === 3) {
                    // Try MM/DD/YYYY first
                    date = new Date(parts[2], parts[0] - 1, parts[1]);
                    if (isNaN(date.getTime())) {
                        // Try DD/MM/YYYY if first attempt failed
                        date = new Date(parts[2], parts[1] - 1, parts[0]);
                    }
                }
            } else if (trimmed.includes('-')) {
                // Handle YYYY-MM-DD format
                date = new Date(trimmed);
            } else {
                // Try direct parsing
                date = new Date(trimmed);
            }
        } else {
            date = new Date(dateString);
        }
        
        if (isNaN(date.getTime())) {
            console.log(`Failed to parse date: "${dateString}"`);
            return null;
        }
        
        const monthName = date.toLocaleString('default', { month: 'long' });
        console.log(`Successfully extracted month: "${monthName}" from "${dateString}"`);
        return monthName;
        
    } catch (error) {
        console.warn('Error parsing date:', dateString, error);
        return null;
    }
}
// Generate sample data
function generateSampleData() {
    const groups = ['WIM', 'CSBB', 'Credit Solutions', 'Payments', 'London UAT'];
    const subGroups = {
        'WIM': ['PMP', 'MM', 'AOM', 'AgentDesktop'],
        'CSBB': ['CSBB1.0', 'CSBB2.0', 'CSBB3.0', 'CSBB4.0'],
        'Credit Solutions': ['1view', '1Click', 'Data', 'Test4'],
        'Payments': ['Pega', 'Payment Gateway', 'Settlement'],
        'London UAT': ['London1', 'London2']
    };
    
    const data = [];
    const months = ['June'];
    
    groups.forEach(group => {
        subGroups[group].forEach(subGroup => {
            months.forEach(month => {
                const functionalTotal = Math.floor(Math.random() * 50) + 20;
                const functionalPassed = Math.floor(Math.random() * functionalTotal * 0.8);
                const functionalFailed = Math.floor((functionalTotal - functionalPassed) * 0.6);
                const functionalBlocked = Math.floor((functionalTotal - functionalPassed - functionalFailed) * 0.5);
                
                const regressionTotal = Math.floor(Math.random() * 200) + 100;
                const regressionPassed = Math.floor(Math.random() * regressionTotal * 0.8);
                const regressionFailed = Math.floor((regressionTotal - regressionPassed) * 0.6);
                const regressionBlocked = Math.floor((regressionTotal - regressionPassed - regressionFailed) * 0.5);
                
                data.push({
                    group: group,
                    subGroup: subGroup,
                    application: `${subGroup}App`,
                    releaseName: month,
                    goLiveDate: '2025-06-12',
                    goLiveStatus: Math.random() > 0.2 ? 'Completed' : 'Delayed',
                    executionStart: '2025-06-01',
                    executionEnd: '2025-06-10',
                    uatStatus: Math.random() > 0.1 ? 'Completed' : 'In Progress',
                    requirements: Math.floor(Math.random() * 10) + 1,
                    functionalTestTotal: functionalTotal,
                    functionalTestPassed: functionalPassed,
                    functionalTestFailed: functionalFailed,
                    functionalTestBlocked: functionalBlocked,
                    functionalTestNA: functionalTotal - functionalPassed - functionalFailed - functionalBlocked,
                    functionalTestNoRun: 0,
                    regressionTestTotal: regressionTotal,
                    regressionTestPassed: regressionPassed,
                    regressionTestFailed: regressionFailed,
                    regressionTestBlocked: regressionBlocked,
                    regressionTestNA: regressionTotal - regressionPassed - regressionFailed - regressionBlocked,
                    regressionTestNoRun: 0,
                    defectsTotal: Math.floor(Math.random() * 20) + 5,
                    defectsOpen: Math.floor(Math.random() * 10),
                    defectsClosed: Math.floor(Math.random() * 10),
                    defectsDeferred: Math.floor(Math.random() * 3),
                    defectsRejected: Math.floor(Math.random() * 2),
                    defectsCritical: Math.floor(Math.random() * 5),
                    defectsHigh: Math.floor(Math.random() * 5),
                    defectsMedium: Math.floor(Math.random() * 8),
                    defectsLow: Math.floor(Math.random() * 5),
                    newTestCasesDesigned: Math.floor(Math.random() * 15) + 5
                });
            });
        });
    });
    
    return data;
}

// Filter data
function getFilteredData() {
    return qualityData.filter(d => {
        const matchGroup = !filters.group || d.group === filters.group;
        const matchSubGroup = !filters.subGroup || d.subGroup === filters.subGroup;
        // For month filter, we'll handle this differently in timeline vs other charts
        let matchMonth = true;
        if (filters.month) {
            const recordMonth = getMonthFromDate(d.goLiveDate);
            matchMonth = recordMonth === filters.month;
        }
        return matchGroup && matchSubGroup && matchMonth;
    });
}
function getFilteredDataForCharts(includeMonthFilter = true) {
    return qualityData.filter(d => {
        const matchGroup = !filters.group || d.group === filters.group;
        const matchSubGroup = !filters.subGroup || d.subGroup === filters.subGroup;
        
        let matchMonth = true;
        if (includeMonthFilter && filters.month) {
            const recordMonth = getMonthFromDate(d.goLiveDate);
            matchMonth = recordMonth === filters.month;
        }
        
        return matchGroup && matchSubGroup && matchMonth;
    });
}
// Update quality metrics
function updateQualityMetrics() {
    const filteredData = getFilteredData();
    updateKPIs(filteredData);
    
    if (currentTab === 'overview') {
        renderOverviewCharts();
    } else if (currentTab === 'execution') {
        renderExecutionCharts();
    } else if (currentTab === 'defects') {
        renderDefectsCharts();
    }
}

// Update KPI values
function updateKPIs(data) {
    // Total Releases
    document.getElementById('totalReleases').textContent = data.length;
    
    // % Go Live on Time
    const onTime = data.filter(d => d.goLiveStatus === 'Completed').length;
    const goLivePercentage = data.length > 0 ? Math.round((onTime / data.length) * 100) : 0;
    document.getElementById('goLiveOnTime').textContent = goLivePercentage + '%';
    
    // % UAT Passed
    const uatPassed = data.filter(d => d.uatStatus === 'Completed').length;
    const uatPercentage = data.length > 0 ? Math.round((uatPassed / data.length) * 100) : 0;
    document.getElementById('uatPassed').textContent = uatPercentage + '%';
    
    // Avg Defect Density
    const totalDefects = data.reduce((sum, d) => sum + d.defectsTotal, 0);
    const totalRequirements = data.reduce((sum, d) => sum + d.requirements, 0);
    //const defectDensity = totalRequirements > 0 ? (totalDefects / totalRequirements).toFixed(2) : 0;
    //document.getElementById('avgDefectDensity').textContent = defectDensity;
    
    // Total Test Cases Executed (NEW)
    const totalTestCases = data.reduce((sum, d) => 
        sum + d.functionalTestTotal + d.regressionTestTotal, 0);
    document.getElementById('totalTestCasesExecuted').textContent = totalTestCases.toLocaleString();
    
    // Total Defects Raised (NEW)
    document.getElementById('totalDefectsRaised').textContent = totalDefects.toLocaleString();
}

// Helper function to get heat color
function getHeatColor(value, max) {
    const ratio = value / max;
    if (ratio === 0) return '#f0f0f0';
    if (ratio <= 0.2) return '#ffe5e5';
    if (ratio <= 0.4) return '#ffcccc';
    if (ratio <= 0.6) return '#ff9999';
    if (ratio <= 0.8) return '#ff6666';
    return '#c41e3a';
}

// Helper function to get heat class
function getHeatClass(value, max) {
    const ratio = value / max;
    if (ratio === 0) return 'heat-0';
    if (ratio <= 0.2) return 'heat-1';
    if (ratio <= 0.4) return 'heat-2';
    if (ratio <= 0.6) return 'heat-3';
    if (ratio <= 0.8) return 'heat-4';
    return 'heat-5';
}