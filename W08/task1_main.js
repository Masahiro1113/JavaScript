d3.csv("https://Masahiro1113.github.io/JavaScript/W08/task1.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 500,
            height: 500,
            margin: {top:100, right:100, bottom:300, left:100}
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
        console.log( data );
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:20, right:10, bottom:30, left:60}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleBand()
            .domain(self.data.map(d => d.label))
            .range( [0, self.inner_width] )
            .paddingInner(0.1);

        self.yscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.value)])
            .rangeRound([self.inner_height, 0])
            .range( [0, self.inner_height] );

        self.axis_yscale = d3.scaleLinear()
            .domain([d3.max(self.data, d => d.value), 0])
            .rangeRound([self.inner_height, 0])
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.axis_yscale )
            .ticks(15)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_width})`);

        self.yaxis_group = self.chart.append('g');

        self.svg.append("g")
            .append("text")
            .attr('transform', `translate(245, 30)`)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "20pt")
            .attr("font-weight", "bold")
            .text("Bar Chart");

        self.svg.append("g")
            .attr('transform', `translate(250, ${self.inner_height + 90})`)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold");
    }

    update() {
        let self = this;

        const valuemax = d3.max( self.data, d => d.value );

        self.xscale.domain(self.data.map(d => d.label));
        self.yscale.domain( [0,valuemax] );
        self.axis_yscale.domain( [valuemax,0] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect").data(self.data).enter()
            .append("rect")
            .attr("x", d => self.xscale(d.label))
            .attr("y",d => self.inner_height - self.yscale(d.value))
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.yscale(d.value));

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }

}