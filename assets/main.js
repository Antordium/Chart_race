// Main application logic
let chart;

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', function() {
    chart = new BarChartRace('#chart-container', {
        animationDuration: 1000,
        yearDuration: 3000,
        maxBars: 10,
        minBars: 5
    });
});

// Handle CSV file upload
function handleFileUpload(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvData = e.target.result;
        chart.loadData(csvData);
    };
    reader.readAsText(file);
}

// Global functions for settings
window.handleFileUpload = handleFileUpload;

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (!chart) return;
    
    switch(event.key) {
        case ' ':
            event.preventDefault();
            if (chart.isPlaying) {
                chart.pause();
            } else {
                chart.play();
            }
            break;
        case 'ArrowLeft':
            event.preventDefault();
            chart.pause();
            chart.goToYear(Math.max(0, chart.currentYearIndex - 1));
            break;
        case 'ArrowRight':
            event.preventDefault();
            chart.pause();
            chart.goToYear(Math.min(chart.years.length - 1, chart.currentYearIndex + 1));
            break;
        case 'Home':
            event.preventDefault();
            chart.pause();
            chart.goToYear(0);
            break;
        case 'End':
            event.preventDefault();
            chart.pause();
            chart.goToYear(chart.years.length - 1);
            break;
    }
});

// Export functionality
function exportChart() {
    const svg = document.querySelector('.chart-svg');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    
    const blob = new Blob([source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-race.svg';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Sample CSV data template
const sampleCSVData = `Year,Organization,Value,Image
2020,TechCorp,150000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2020,InnovateLabs,120000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2020,DataSystems,100000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2020,CloudTech,80000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2020,AI Solutions,60000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI
2021,TechCorp,180000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2021,InnovateLabs,160000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2021,DataSystems,140000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2021,CloudTech,120000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2021,AI Solutions,100000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI
2022,TechCorp,220000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2022,InnovateLabs,200000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2022,DataSystems,180000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2022,CloudTech,160000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2022,AI Solutions,140000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI`;

// Function to download sample CSV
function downloadSampleCSV() {
    const blob = new Blob([sampleCSVData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-data.csv';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Speed control functions
let turboModeActive = false;

function setNormalSpeed() {
    turboModeActive = false;
    document.getElementById('animationSpeed').value = '3000';
    document.getElementById('transitionSpeed').value = '1000';
    document.getElementById('rapidMode').value = '0';
    chart.setAnimationSpeed(3000);
    chart.setTransitionSpeed(1000);
    updateTurboButton();
}

function setFastSpeed() {
    turboModeActive = false;
    document.getElementById('animationSpeed').value = '1000';
    document.getElementById('transitionSpeed').value = '500';
    document.getElementById('rapidMode').value = '0';
    chart.setAnimationSpeed(1000);
    chart.setTransitionSpeed(500);
    updateTurboButton();
}

function toggleTurboMode() {
    turboModeActive = !turboModeActive;
    chart.toggleTurboMode(turboModeActive);

    if (turboModeActive) {
        document.getElementById('rapidMode').value = '0';
    }

    updateTurboButton();
}

function updateTurboButton() {
    const btn = document.getElementById('turboBtn');
    if (turboModeActive) {
        btn.textContent = 'Turbo ON 🔥';
        btn.style.background = '#ff6b6b';
        btn.style.color = 'white';
    } else {
        btn.textContent = 'Turbo 🚀';
        btn.style.background = '';
        btn.style.color = '';
    }
}

// Make functions available globally
window.exportChart = exportChart;
window.downloadSampleCSV = downloadSampleCSV;
window.setNormalSpeed = setNormalSpeed;
window.setFastSpeed = setFastSpeed;
window.toggleTurboMode = toggleTurboMode;