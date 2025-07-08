class BarChartRace {
    constructor(containerId, options = {}) {
        this.container = d3.select(containerId);
        this.options = {
            animationDuration: 1000,
            yearDuration: 3000,
            maxBars: 10,
            minBars: 5,
            colors: ['#0078d4', '#00bcf2', '#40e0d0', '#7b68ee', '#ff6b6b', '#ffd93d', '#6bcf7f', '#ff8c42', '#ff6b9d', '#c44569'],
            ...options
        };
        
        this.data = [];
        this.years = [];
        this.currentYearIndex = 0;
        this.isPlaying = false;
        this.animationTimer = null;
        
        this.initializeChart();
        this.generateSampleData();
        this.setupEventListeners();
    }

    initializeChart() {
        // Get container dimensions
        const containerNode = this.container.node();
        this.width = containerNode.clientWidth;
        this.height = containerNode.clientHeight;
        
        // Set up margins
        this.margin = { top: 100, right: 200, bottom: 120, left: 80 };
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
            .range([0, this.chartWidth - 150]); // Reserve space for images and labels
        
        this.yScale = d3.scaleBand()
            .range([0, this.chartHeight])
            .padding(0.1);
        
        // Hide loading
        this.container.select('.loading').style('display', 'none');
    }

    generateSampleData() {
        // Sample organizations with placeholder images
        const organizations = [
            { name: 'TechCorp', image: 'https://via.placeholder.com/40x40/0078d4/ffffff?text=TC' },
            { name: 'InnovateLabs', image: 'https://via.placeholder.com/40x40/00bcf2/ffffff?text=IL' },
            { name: 'DataSystems', image: 'https://via.placeholder.com/40x40/40e0d0/ffffff?text=DS' },
            { name: 'CloudTech', image: 'https://via.placeholder.com/40x40/7b68ee/ffffff?text=CT' },
            { name: 'AI Solutions', image: 'https://via.placeholder.com/40x40/ff6b6b/ffffff?text=AI' },
            { name: 'RoboticsCorp', image: 'https://via.placeholder.com/40x40/ffd93d/000000?text=RC' },
            { name: 'GreenEnergy', image: 'https://via.placeholder.com/40x40/6bcf7f/ffffff?text=GE' },
            { name: 'BioMedical', image: 'https://via.placeholder.com/40x40/ff8c42/ffffff?text=BM' },
            { name: 'SpaceX Plus', image: 'https://via.placeholder.com/40x40/ff6b9d/ffffff?text=SP' },
            { name: 'QuantumTech', image: 'https://via.placeholder.com/40x40/c44569/ffffff?text=QT' }
        ];

        // Generate data for years 2020-2025
        this.years = [];
        const currentYear = new Date().getFullYear();
        for (let year = 2020; year <= currentYear; year++) {
            this.years.push(year);
        }

        this.data = this.years.map(year => {
            const yearData = organizations.map(org => ({
                organization: org.name,
                image: org.image,
                value: Math.floor(Math.random() * 1000000) + 100000 + (year - 2020) * 50000,
                year: year
            }));

            // Sort by value and take top performers
            yearData.sort((a, b) => b.value - a.value);
            
            return {
                year: year,
                data: yearData.slice(0, Math.min(this.options.maxBars, yearData.length))
            };
        });

        // Update slider
        this.container.select('.year-slider')
            .attr('max', this.years.length - 1);

        // Initial render
        this.updateChart();
    }

    loadData(csvData) {
        try {
            // Parse CSV data
            const parsed = d3.csvParse(csvData);
            
            if (!parsed || parsed.length === 0) {
                throw new Error('No data found in CSV');
            }

            // Group by year
            const dataByYear = {};
            parsed.forEach(row => {
                const year = +row.Year;
                if (!dataByYear[year]) {
                    dataByYear[year] = [];
                }
                dataByYear[year].push({
                    organization: row.Organization,
                    image: row.Image || `https://via.placeholder.com/40x40/0078d4/ffffff?text=${row.Organization.charAt(0)}`,
                    value: +row.Value,
                    year: year
                });
            });

            // Sort years and prepare data
            this.years = Object.keys(dataByYear).map(Number).sort();
            this.data = this.years.map(year => ({
                year: year,
                data: dataByYear[year]
                    .sort((a, b) => b.value - a.value)
                    .slice(0, Math.min(this.options.maxBars, dataByYear[year].length))
            }));

            // Update slider
            this.container.select('.year-slider')
                .attr('max', this.years.length - 1);

            // Reset and render
            this.currentYearIndex = 0;
            this.updateChart();
            
            console.log('Data loaded successfully:', this.data.length, 'years');
            
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading CSV data. Please check the format and try again.');
        }
    }

    updateChart() {
        if (!this.data || this.data.length === 0) return;

        const currentData = this.data[this.currentYearIndex];
        const maxValue = d3.max(currentData.data, d => d.value);

        // Update scales
        this.xScale.domain([0, maxValue]);
        this.yScale.domain(d3.range(currentData.data.length));

        // Update year display
        this.updateYearDisplay(currentData.year);

        // Bind data
        const bars = this.chartGroup.selectAll('.bar')
            .data(currentData.data, d => d.organization);

        const images = this.chartGroup.selectAll('.org-image')
            .data(currentData.data, d => d.organization);

        const labels = this.chartGroup.selectAll('.org-label')
            .data(currentData.data, d => d.organization);

        const valueLabels = this.chartGroup.selectAll('.value-label')
            .data(currentData.data, d => d.organization);

        const rankLabels = this.chartGroup.selectAll('.rank-label')
            .data(currentData.data, d => d.organization);

        // Enter new bars
        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', (d, i) => this.yScale(i))
            .attr('width', 0)
            .attr('height', this.yScale.bandwidth())
            .attr('fill', (d, i) => this.options.colors[i % this.options.colors.length])
            .attr('rx', 6)
            .attr('ry', 6)
            .merge(bars)
            .transition()
            .duration(this.options.animationDuration)
            .attr('y', (d, i) => this.yScale(i))
            .attr('width', d => this.xScale(d.value))
            .attr('fill', (d, i) => this.options.colors[i % this.options.colors.length]);

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
            .attr('y', (d, i) => this.yScale(i) + (this.yScale.bandwidth() -