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
          <Card style={styles.container}>
            <CardItem style={{backgroundColor: '#F0FEFF'}}>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    marginLeft: 65,
    fontSize: 25, 
    fontWeight: 'bold',
  }
});