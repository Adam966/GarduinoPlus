import React, { Component } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { Content } from 'native-base';
import { Dimensions } from 'react-native';



export default class Chart extends Component {
  constructor(props) {
    const data = {
      labels: [],
      datasets: [{
        data:this.props.data
      }]
    }
    super(props);
    this.state = {
      //data:this.props.data,
      data:data
     // statname:this.props.statname
    };
  }

  render() {
    return (
        <Content>
            <LineChart
                data = {this.state.data}
                    width={Dimensions.get('window').width - 30} 
                    height={220}
                    //yAxisLabel={data.datasets.data}
                    chartConfig={{
                      backgroundColor: '#F0FEFF',
                      backgroundGradientFrom: '#F0FEFF',
                      backgroundGradientTo: '#F0FEFF',
                    color: (opacity = 1) => `rgba(0,74,60, ${opacity})`,
                    decimalPlaces: 2, 
                    strokeWidth: 2,
                    style: {
                        borderRadius: 16
                    }
                }}
                bezier
                style={{
                    borderRadius: 16,
                    marginVertical: 15,
                    borderWidth: 0.3,
                    borderRadius: 5,
                    borderColor: '#006b56',
                 }}
            />
            
        </Content>
    );
  }

}
