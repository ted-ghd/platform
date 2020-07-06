import {Doughnut} from 'react-chartjs-2';
import React, { Component } from "react";

class DoughnutChart extends Component {

   componentDidMount()  {

    }
 
  render() {

    let data = {
        datasets: [{
            data: [Number.parseInt(this.props.used), 
                    Number.parseInt(this.props.hard) - 
                    Number.parseInt(this.props.used)],
            backgroundColor: [
            '#FF6384',
            '#36A2EB'
            ],
            hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB'
            ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Occupied',
            'Available'
        ]
    };
    
    let options = {
        rotation : (3 * Math.PI)
    }
    console.log(this.props)

    return <Doughnut data={data} options={options}/>;
  }
}

export default DoughnutChart