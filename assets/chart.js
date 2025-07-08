// Complete the truncated chart.js file
// Add this to complete the updateChart method and add missing methods

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
}