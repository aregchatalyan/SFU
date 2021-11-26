import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

class Chart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chartData !== this.props.chartData) {
      this.setState({
        chartData: this.props.chartData
      });
    }
};

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right',
    location:'City'
  }

  render(){
    return (
      <div className="chart" style={{width: '400px'}}>
        <Bar
          data={this.state.chartData}
          options={{
            title:{
              display:this.props.displayTitle,
              text:'Հարցման արդյունքները',
              fontSize: 20
            },
            legend:{
                display:false,
                position:'right'
            },
            scales: {
              yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    display: false 
                }
              }]
              }
          }}
        />
      </div>
    )
  }
}

export default Chart;