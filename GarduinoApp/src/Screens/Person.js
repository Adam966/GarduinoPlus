import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View, Dimensions  } from 'react-native';
import { Header, Container } from 'native-base';

export default class Person extends Component {
  static navigationOptions = {
    header: null,
  }
    constructor(props){
        super(props);
        this.state ={ isLoading: true}
      }
    
      componentDidMount(){
        return fetch('https://facebook.github.io/react-native/movies.json')
          .then((response) => response.json())
          .then((responseJson) => {
    
            this.setState({
              isLoading: false,
              dataSource: responseJson.movies,
            }, function(){
                console.log(responseJson)
            });
    
          })
          .catch((error) =>{
            console.error(error);
          });
      }
    
    
    
      render(){
    
        if(this.state.isLoading){
          return(
            <View style={{flex: 1, padding: 20}}>
              <ActivityIndicator/>
            </View>
          )
        }
    
        return(
          <Container>
            <Header style={{width: Dimensions.get('window').width}}>
            </Header>
            <View style={{flex: 1, paddingTop:20}}>
              <FlatList
                data={this.state.dataSource}
                renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
                keyExtractor={({id}, index) => id}
              />
            </View>
          </Container>
        );
      }
}
