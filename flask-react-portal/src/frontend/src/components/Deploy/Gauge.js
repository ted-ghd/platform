import React, { Component } from "react";

// component and styles
//import BillboardChart from "react-billboardjs";
//import "react-billboardjs/lib/billboard.css";

class GaugeChart extends Component {

   componentDidMount()  {

    }
 
  render() {

    let chart_data = {
            columns: [
                ["data", Number.parseInt(this.props.used)]
                ],
            type: "gauge"
        }

    let label = this.props.label
    let gauge = {
            max: Number.parseInt(this.props.max)
           /*, label: {
                format: function(value, ratio) {
                    return value + "\n"+label;  // multilined using `\n`
                }
            }*/
    }
    console.log(this.props)
    console.log(chart_data)
    console.log(gauge)

    return <BillboardChart data={chart_data} 
                              isPure
                            unloadBeforeLoad
                            gauge = {gauge} />;
  }
}

export default GaugeChart