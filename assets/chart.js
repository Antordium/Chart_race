// Bar Chart Race - D3.js Implementation
class BarChartRace {
    constructor(containerSelector, options = {}) {
        this.container = d3.select(containerSelector);
        this.options = {
            animationDuration: options.animationDuration || 1000,  // Bar transition speed
            yearDuration: options.yearDuration || 3000,            // Time between year changes
            maxBars: options.maxBars || 10,
            minBars: options.minBars || 5,
            colors: options.colors || [
                '#0078d4', '#00bcf2', '#40e0d0', '#7b68ee',
                '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
                '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'
            ]
        };

        this.data = [];
        this.years = [];
        this.currentYearIndex = 0;
        this.isPlaying = false;
        this.isTurboMode = false;
        this.animationTimer = null;
        this.colorMap = new Map();

        this.initializeChart();
        this.loadDefaultData();
    }

    initializeChart() {
        // Get container dimensions
        const containerNode = this.container.node();
        this.width = containerNode.clientWidth;
        this.height = containerNode.clientHeight;

        // Set margins
        this.margin = { top: 100, right: 200, bottom: 150, left: 80 };
        this.chartWidth = this.width - this.margin.left - this.margin.right;
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;

        // Create SVG
        this.svg = this.container.select('.chart-svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Create chart group
        this.chartGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Create scales
        this.xScale = d3.scaleLinear()
            .range([0, this.chartWidth - 150]);

        this.yScale = d3.scaleBand()
            .range([0, this.chartHeight])
            .padding(0.1);

        this.setupEventListeners();
    }

    loadDefaultData() {
        // Check if there's saved data in localStorage
        const savedData = localStorage.getItem('chartRaceData');
        if (savedData) {
            try {
                this.loadData(savedData);
                console.log('Loaded data from localStorage');
                return;
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }

        // Default sample data
        const defaultCSV = `Year,Organization,Value,Image
2018,TechCorp,120000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2018,InnovateLabs,95000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2018,DataSystems,85000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2018,CloudTech,70000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2018,AI Solutions,55000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI
2018,CyberSecure,48000,https://via.placeholder.com/40x40/4ecdc4/ffffff?text=CS
2019,TechCorp,150000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2019,InnovateLabs,120000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2019,DataSystems,100000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2019,CloudTech,80000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2019,AI Solutions,60000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI
2019,CyberSecure,58000,https://via.placeholder.com/40x40/4ecdc4/ffffff?text=CS
2020,TechCorp,180000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2020,InnovateLabs,160000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2020,DataSystems,140000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2020,CloudTech,120000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2020,AI Solutions,100000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI
2020,CyberSecure,85000,https://via.placeholder.com/40x40/4ecdc4/ffffff?text=CS
2021,TechCorp,220000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2021,InnovateLabs,200000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2021,DataSystems,180000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2021,CloudTech,160000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2021,AI Solutions,140000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI
2021,CyberSecure,110000,https://via.placeholder.com/40x40/4ecdc4/ffffff?text=CS
2022,TechCorp,270000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2022,InnovateLabs,250000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2022,DataSystems,220000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2022,CloudTech,200000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2022,AI Solutions,180000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI
2022,CyberSecure,145000,https://via.placeholder.com/40x40/4ecdc4/ffffff?text=CS
2023,TechCorp,320000,https://via.placeholder.com/40x40/0078d4/ffffff?text=TC
2023,InnovateLabs,300000,https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL
2023,DataSystems,270000,https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS
2023,CloudTech,250000,https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT
2023,AI Solutions,230000,https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI
2023,CyberSecure,190000,https://via.placeholder.com/40x40/4ecdc4/ffffff?text=CS`;

        this.loadData(defaultCSV);
    }

    loadData(csvData) {
        try {
            // Hide loading message
            this.container.select('.loading').style('display', 'none');

            // Parse CSV data
            const parsedData = d3.csvParse(csvData);

            // Validate data
            if (!parsedData || parsedData.length === 0) {
                throw new Error('No data found in CSV');
            }

            // Check required columns
            const requiredColumns = ['Year', 'Organization', 'Value'];
            const columns = Object.keys(parsedData[0]);
            const missingColumns = requiredColumns.filter(col => !columns.includes(col));

            if (missingColumns.length > 0) {
                throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
            }

            // Process and store data
            this.data = parsedData.map(d => ({
                year: +d.Year,
                organization: d.Organization,
                value: +d.Value,
                image: d.Image || `https://via.placeholder.com/40x40/0078d4/ffffff?text=${d.Organization.charAt(0)}`
            }));

            // Validate numeric values
            const invalidRows = this.data.filter(d => isNaN(d.year) || isNaN(d.value));
            if (invalidRows.length > 0) {
                throw new Error('Some rows contain invalid numeric values');
            }

            // Get unique years and sort them
            this.years = [...new Set(this.data.map(d => d.year))].sort((a, b) => a - b);

            if (this.years.length === 0) {
                throw new Error('No valid years found in data');
            }

            // Assign colors to organizations
            const organizations = [...new Set(this.data.map(d => d.organization))];
            organizations.forEach((org, i) => {
                this.colorMap.set(org, this.options.colors[i % this.options.colors.length]);
            });

            // Update slider
            this.container.select('.year-slider')
                .attr('max', this.years.length - 1)
                .property('value', 0);

            // Reset to first year
            this.currentYearIndex = 0;
            this.updateChart();

            // Save to localStorage
            localStorage.setItem('chartRaceData', csvData);

            console.log(`Data loaded: ${this.data.length} rows, ${this.years.length} years`);

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError(`Error loading CSV: ${error.message}`);
        }
    }

    showError(message) {
        const loading = this.container.select('.loading');
        loading.style('display', 'block')
            .style('background', 'rgba(255, 50, 50, 0.9)')
            .style('color', 'white')
            .text(message);

        setTimeout(() => {
            loading.style('display', 'none')
                .style('background', 'rgba(255, 255, 255, 0.9)')
                .style('color', '#666')
                .text('Loading data...');
        }, 5000);
    }

    updateChart() {
        if (!this.data || this.years.length === 0) return;

        const currentYear = this.years[this.currentYearIndex];

        // Filter data for current year
        let yearData = this.data.filter(d => d.year === currentYear);

        // Sort by value descending
        yearData.sort((a, b) => b.value - a.value);

        // Take top N bars
        const numBars = Math.min(this.options.maxBars, Math.max(this.options.minBars, yearData.length));
        yearData = yearData.slice(0, numBars);

        // Update scales
        this.xScale.domain([0, d3.max(yearData, d => d.value) * 1.1]);
        this.yScale.domain(d3.range(yearData.length));

        // Update year display
        this.updateYearDisplay(currentYear);

        // Bind data
        const bars = this.chartGroup.selectAll('.bar').data(yearData, d => d.organization);
        const images = this.chartGroup.selectAll('.org-image').data(yearData, d => d.organization);
        const labels = this.chartGroup.selectAll('.org-label').data(yearData, d => d.organization);
        const valueLabels = this.chartGroup.selectAll('.value-label').data(yearData, d => d.organization);
        const rankLabels = this.chartGroup.selectAll('.rank-label').data(yearData, d => d.organization);

        // Enter + Update bars
        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', (d, i) => this.yScale(i))
            .attr('height', this.yScale.bandwidth())
            .attr('width', 0)
            .attr('fill', d => this.colorMap.get(d.organization))
            .attr('rx', 5)
            .merge(bars)
            .transition()
            .duration(this.options.animationDuration)
            .attr('y', (d, i) => this.yScale(i))
            .attr('width', d => this.xScale(d.value))
            .attr('height', this.yScale.bandwidth())
            .attr('fill', d => this.colorMap.get(d.organization));

        // Handle image loading with fallback
        images.enter()
            .append('image')
            .attr('class', 'org-image')
            .attr('width', 40)
            .attr('height', 40)
            .attr('x', d => this.xScale(d.value) + 15)
            .attr('y', (d, i) => this.yScale(i) + (this.yScale.bandwidth() - 40) / 2)
            .attr('href', d => d.image)
            .on('error', function(event, d) {
                // Fallback to placeholder on error
                d3.select(this).attr('href', `https://via.placeholder.com/40x40/0078d4/ffffff?text=${d.organization.charAt(0)}`);
            })
            .merge(images)
            .transition()
            .duration(this.options.animationDuration)
            .attr('x', d => this.xScale(d.value) + 15)
            .attr('y', (d, i) => this.yScale(i) + (this.yScale.bandwidth() - 40) / 2)
            .attr('href', d => d.image);

        // Organization labels
        labels.enter()
            .append('text')
            .attr('class', 'org-label')
            .attr('x', d => this.xScale(d.value) + 65)
            .attr('y', (d, i) => this.yScale(i) + this.yScale.bandwidth() / 2 - 8)
            .attr('text-anchor', 'left')
            .attr('alignment-baseline', 'middle')
            .style('font-size', '16px')
            .style('fill', '#333')
            .text(d => d.organization)
            .merge(labels)
            .transition()
            .duration(this.options.animationDuration)
            .attr('x', d => this.xScale(d.value) + 65)
            .attr('y', (d, i) => this.yScale(i) + this.yScale.bandwidth() / 2 - 8)
            .text(d => d.organization);

        // Value labels
        valueLabels.enter()
            .append('text')
            .attr('class', 'value-label')
            .attr('x', d => this.xScale(d.value) + 65)
            .attr('y', (d, i) => this.yScale(i) + this.yScale.bandwidth() / 2 + 12)
            .attr('text-anchor', 'left')
            .attr('alignment-baseline', 'middle')
            .style('font-size', '14px')
            .style('fill', '#666')
            .text(d => this.formatValue(d.value))
            .merge(valueLabels)
            .transition()
            .duration(this.options.animationDuration)
            .attr('x', d => this.xScale(d.value) + 65)
            .attr('y', (d, i) => this.yScale(i) + this.yScale.bandwidth() / 2 + 12)
            .text(d => this.formatValue(d.value));

        // Rank labels
        rankLabels.enter()
            .append('text')
            .attr('class', 'rank-label')
            .attr('x', -10)
            .attr('y', (d, i) => this.yScale(i) + this.yScale.bandwidth() / 2)
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .style('fill', '#999')
            .text((d, i) => i + 1)
            .merge(rankLabels)
            .transition()
            .duration(this.options.animationDuration)
            .attr('y', (d, i) => this.yScale(i) + this.yScale.bandwidth() / 2)
            .text((d, i) => i + 1);

        // Remove old elements
        bars.exit().remove();
        images.exit().remove();
        labels.exit().remove();
        valueLabels.exit().remove();
        rankLabels.exit().remove();
    }

    updateYearDisplay(year) {
        this.container.select('.year-display').text(year);
        this.container.select('.current-year').text(year);
        this.container.select('.year-slider').property('value', this.currentYearIndex);
    }

    formatValue(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toLocaleString();
    }

    play() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.container.select('.btn-icon').text('⏸');
        this.container.select('.btn-text').text('Pause');

        this.animationTimer = setInterval(() => {
            this.currentYearIndex = (this.currentYearIndex + 1) % this.years.length;
            this.updateChart();

            if (this.currentYearIndex === 0) {
                this.pause();
            }
        }, this.options.yearDuration);
    }

    pause() {
        this.isPlaying = false;
        this.container.select('.btn-icon').text('▶');
        this.container.select('.btn-text').text('Play');

        if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
        }
    }

    goToYear(yearIndex) {
        this.currentYearIndex = Math.max(0, Math.min(yearIndex, this.years.length - 1));
        this.updateChart();
    }

    setupEventListeners() {
        // Play/Pause button
        this.container.select('.play-pause-btn').on('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });

        // Year slider
        this.container.select('.year-slider').on('input', (event) => {
            this.pause();
            this.goToYear(parseInt(event.target.value));
        });

        // Settings toggle
        this.container.select('.settings-btn').on('click', () => {
            const content = this.container.select('.settings-content');
            content.classed('active', !content.classed('active'));
        });

        // Click outside to close settings
        document.addEventListener('click', (event) => {
            const settingsPanel = this.container.select('.settings-panel').node();
            if (!settingsPanel.contains(event.target)) {
                this.container.select('.settings-content').classed('active', false);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        const containerNode = this.container.node();
        this.width = containerNode.clientWidth;
        this.height = containerNode.clientHeight;
        this.chartWidth = this.width - this.margin.left - this.margin.right;
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;

        this.svg.attr('width', this.width).attr('height', this.height);
        this.xScale.range([0, this.chartWidth - 150]);
        this.yScale.range([0, this.chartHeight]);

        this.updateChart();
    }

    setBackgroundImage(imageUrl) {
        if (imageUrl) {
            this.container.select('.background-image')
                .style('background-image', `url(${imageUrl})`)
                .style('background-size', 'cover')
                .style('background-position', 'center');
        } else {
            this.container.select('.background-image')
                .style('background-image', 'url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPC9zdmc+\')')
                .style('background-size', '20px 20px');
        }
    }

    setCornerImage(imageUrl) {
        if (imageUrl) {
            this.container.select('.corner-image')
                .style('background-image', `url(${imageUrl})`)
                .style('background-size', 'contain');
        }
    }

    setAnimationSpeed(speed) {
        this.options.yearDuration = parseInt(speed);
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }

    setTransitionSpeed(speed) {
        this.options.animationDuration = parseInt(speed);
        // No need to restart - will take effect on next transition
    }

    toggleTurboMode(enabled) {
        this.isTurboMode = enabled;
        if (enabled) {
            // Turbo mode: very fast transitions and rapid year changes
            this.options.animationDuration = 200;
            this.options.yearDuration = 300;
        } else {
            // Restore normal speeds from UI controls
            const yearSelect = document.getElementById('animationSpeed');
            const transitionSelect = document.getElementById('transitionSpeed');
            if (yearSelect) this.options.yearDuration = parseInt(yearSelect.value);
            if (transitionSelect) this.options.animationDuration = parseInt(transitionSelect.value);
        }

        // Restart animation if playing
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }

    setRapidMode(intervalMs) {
        // For very dense datasets, skip to minimal intervals
        this.options.animationDuration = Math.max(100, parseInt(intervalMs) * 0.3);
        this.options.yearDuration = parseInt(intervalMs);

        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }
}
