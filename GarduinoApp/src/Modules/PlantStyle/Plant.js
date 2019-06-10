import React, { Component } from 'react';
import { Card, CardItem, Text, Left, Thumbnail } from 'native-base';
import { StyleSheet } from 'react-native';

export default class Plant extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };


  render() {
    return (
          <Card noShadow style={styles.container}>
            <CardItem style={{backgroundColor: '#F0FEFF',height: 120, width:'100%',borderRadius: 5}}>
              <Left>
                <Thumbnail source={require('../../../assets/plant.png')} />
                <Text style={styles.name}>{this.props.name}</Text>  
              </Left>
            </CardItem>
          </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: .3,
    shadowRadius: 3,
    elevation: 3,
  },
  name: {
    marginLeft: 25,
    fontSize: 25, 
    fontWeight: 'bold',
  }
});