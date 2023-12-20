d3.csv("https://Masahiro1113.github.io/JavaScript/W04/data.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 500,
            height: 500,
            margin: { top: 50, right: 100, bottom: 150, left: 100 }
        };

        const scatter_plot = new ScatterPlot(config, data);
        console.log(data);
        scatter_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

class ScatterPlot {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 250,
            height: config.height || 250,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(15);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(15);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('id', 'yaxis');

        self.svg.append("g")
            .append("text")
            .attr('transform', `translate(${self.config.width / 2}, 30)`)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "20pt")
            .attr("font-weight", "bold")
            .text("Scatter Plot");

        self.svg.append("g")
            .append("text")
            .attr('transform', `translate(${self.config.width / 2}, ${self.inner_height + 110})`)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("X Label");

        self.svg.append("g")
            .append("text")
            .attr('transform', `translate(60, ${self.inner_height / 2 + 50})rotate(-90)`)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("Y Label");

       
        self.tooltip = d3.select(self.config.parent)
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', 'solid')
            .style('border-width', '1px')
            .style('border-radius', '5px')
            .style('padding', '10px');
    }

    update() {
        let self = this;

        const margin = self.config.margin;
        const space = 10;
        const xmin = d3.min(self.data, d => d.x) - space;
        const xmax = d3.max(self.data, d => d.x) + space;
        self.xscale.domain([xmin, xmax]).range([0, self.inner_width]);

        const ymin = d3.min(self.data, d => d.y) - space;
        const ymax = d3.max(self.data, d => d.y) + space;
        self.yscale.domain([ymax, ymin]).range([0, self.inner_height]);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => d.r)
            .style('fill', 'steelblue')  
            .style('opacity', 0.7)       
            .on('mouseover', (e, d) => {
                self.tooltip
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`)
                    .style('background-color', 'lightsteelblue')
                    .style('border-color', 'steelblue');
            })
            .on('mousemove', (e) => {
                const padding = 10;
                self.tooltip
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                self.tooltip.style('opacity', 0);
            });

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}
