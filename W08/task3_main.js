d3.csv("https://Masahiro1113.github.io/JavaScript/W08/task3.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; d.color = d.color; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:10, left:10}
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
        // console.log( data );
    })
    .catch( error => {
        console.log( error );
    });

    class PieChart {

        constructor( config, data ) {
            this.config = {
                parent: config.parent,
                width: config.width || 64,
                height: config.height || 64,
                radius: config.radius || Math.min( config.width, config.height ) / 2,
                margin: config.margin || {top:10, right:10, bottom:20, left:60}
            }
            this.data = data;
            this.init();
        }

        init() {
            let self = this;

            self.svg = d3.select( self.config.parent )
                .attr('width', self.config.width)
                .attr('height', self.config.height)
                
            self.chart = self.svg.append('g')
                .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

            self.pie = d3.pie()
                .value(d => d.value);


            self.arc = d3.arc()
                .innerRadius(self.config.radius/2)
                .outerRadius(self.config.radius);
        }

        update() {
            let self = this;

            self.render();
        }

        render(){
            let self = this;

            console.log(self.pie(self.data));

            self.chart.selectAll('pie')
                .data( self.pie(self.data) )
                .enter()
                .append('path')
                .attr('d', self.arc)
                .style('fill', d => d.data.color )
                .attr('stroke', 'white')
                .style('stroke-width', '2px');

            self.chart.selectAll('pie')
                .data(self.pie(self.data))
                .enter()
                .append('text')
                .attr('transform', d => `translate(${self.arc.centroid(d)})`)
                .text(d => d.data.label )
                .attr("fill", 'red')
                .style("text-anchor", "middle")
                .attr("font-size", "10px");

        }
    }