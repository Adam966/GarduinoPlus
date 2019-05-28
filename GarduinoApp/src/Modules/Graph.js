import React, { Component } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { Content } from 'native-base';
import { Dimensions } from 'react-native';

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
                data={{
                    labels: ['18.5.2019','18.5.2019','18.5.2019','18.5.2019','18.5.2019','18.5.2019'],
                    datasets: [{
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]
                    }]
                }} 
                    width={Dimensions.get('window').width - 30} 
                    height={220}
                    yAxisLabel={'°C'}
                    chartConfig={{
                    backgroundColor: '#d2e3e5',
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
