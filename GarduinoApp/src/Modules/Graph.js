import React, { Component } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { Content } from 'native-base';
import { Dimensions } from 'react-native';


const data = {
    labels: [],
    datasets: [{
      data: ['1','2','3'],
    }]
}

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
     /* data:this.props.data,
      newData:[],
      statname:this.props.statName*/
    };
  }

filterData = (data,statname) => {

//AirHum,Date,SoilHum,Temp,WatSurf
let newStatName;

if(statname === "Temperature"){
  newStatName = "Temp";
}else if(statname === "Air Humidity"){
  newStatName = "AirHum";
}else if(statname === "Soil Humidity"){
  newStatName = "SoilHum";
}else if(statname === "WaterSurface"){
  newStatName = "WaterSurf"
}

let arr = obj.map(({newStatName}) => newStatName);
//this.setState({newData: arr});

} 

  render() {
    return (
        <Content>
            <LineChart
                data={data}
                //data = {this.state.newData}
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
