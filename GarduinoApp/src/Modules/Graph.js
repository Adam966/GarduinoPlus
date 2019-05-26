import React, { Component } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { Container, Content } from 'native-base';
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
                    width={Dimensions.get('window').width} // from react-native
                    height={220}
                    yAxisLabel={'$'}
                    chartConfig={{
                    backgroundColor: '#d2e3e5',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    }
                }}
                bezier
                style={{
                    borderRadius: 16
                 }}
            />
            
        </Content>
    );
  }
}
