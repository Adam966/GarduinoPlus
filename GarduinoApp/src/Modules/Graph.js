import React, { Component } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { Content } from 'native-base';
import { Dimensions } from 'react-native';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      data: [ 20, 45, 28, 80, 99, 43 ]
    }]
}

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <Content>
            <LineChart
                data={data}
                    width={Dimensions.get('window').width - 30} 
                    height={220}
                    //yAxisLabel={data.datasets.data}
                    chartConfig={{
                      backgroundColor: '#F0FEFF',
                      backgroundGradientFrom: '#F0FEFF',
                      backgroundGradientTo: '#F0FEFF',
                    color: (opacity = 1) => `rgba(31, 49, 58, ${opacity})`,
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
                    borderColor: '#1f313a',
                 }}
            />
            
        </Content>
    );
  }

}
