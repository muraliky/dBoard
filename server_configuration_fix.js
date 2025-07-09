// UPDATED SERVER.JS - Replace your existing server.js with this

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// CRITICAL: Serve static files from multiple locations
// This ensures files are accessible from both public/ and root directory
app.use('/libs', express.static(path.join(__dirname, 'public/libs')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname))); // Serve from root

// Set proper MIME types for JavaScript files
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (req.url.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Cache static assets
    if (req.url.includes('/libs/') || req.url.endsWith('.js') || req.url.endsWith('.css')) {
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    }
    
    next();
});

// Debug route to check file existence
app.get('/debug/files', (req, res) => {
    const filesToCheck = [
        'public/libs/chart.min.js',
        'public/libs/xlsx.full.min.js',
        'index.html',
        'dashboard-charts.js',
        'dashboard-main.js'
    ];
    
    const fileStatus = {};
    
    filesToCheck.forEach(file => {
        const fullPath = path.join(__dirname, file);
        fileStatus[file] = {
            exists: fs.existsSync(fullPath),
            size: fs.existsSync(fullPath) ? fs.statSync(fullPath).size : 0,
            path: fullPath
        };
    });
    
    res.json({
        currentDirectory: __dirname,
        files: fileStatus,
        nodeVersion: process.version,
        platform: process.platform
    });
});

// Specific route for chart.min.js to ensure it's served correctly
app.get('/libs/chart.min.js', (req, res) => {
    const chartPath = path.join(__dirname, 'public/libs/chart.min.js');
    
    if (fs.existsSync(chartPath)) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.sendFile(chartPath);
    } else {
        console.error('Chart.js file not found at:', chartPath);
        res.status(404).send('Chart.js file not found');
    }
});

// Specific route for xlsx file
app.get('/libs/xlsx.full.min.js', (req, res) => {
    const xlsxPath = path.join(__dirname, 'public/libs/xlsx.full.min.js');
    
    if (fs.existsSync(xlsxPath)) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.sendFile(xlsxPath);
    } else {
        console.error('XLSX file not found at:', xlsxPath);
        res.status(404).send('XLSX file not found');
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('index.html not found');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send(`Server Error: ${err.message}`);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    // Get network IP
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    Object.keys(interfaces).forEach(name => {
        interfaces[name].forEach(iface => {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log(`🌐 Network access: http://${iface.address}:${PORT}`);
            }
        });
    });
    
    // Check if required files exist
    console.log('\n📁 Checking required files:');
    const requiredFiles = [
        'index.html',
        'public/libs/chart.min.js',
        'public/libs/xlsx.full.min.js'
    ];
    
    requiredFiles.forEach(file => {
        const exists = fs.existsSync(path.join(__dirname, file));
        console.log(`${exists ? '✅' : '❌'} ${file}`);
        
        if (!exists && file.includes('chart.min.js')) {
            console.log('   💡 Run: npm run copy-assets');
        }
    });
    
    console.log(`\n🔧 Debug URL: http://localhost:${PORT}/debug/files`);
});

module.exports = app;