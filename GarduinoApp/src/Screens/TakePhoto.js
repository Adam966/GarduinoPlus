import React, { Component } from 'react';
import { Container, Header, Left, Button, Body, Icon, Title } from 'native-base';
import { TouchableOpacity, Image, Dimensions } from 'react-native';
import { Camera, Permissions } from 'expo';


export default class TakePhoto extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.state = {
        type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log(photo.uri);
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
    return (
      <Container>
      <Camera ref={ref => { this.camera = ref; }} style={{ flex: 1 }} type={this.state.type}>
        <Header transparent>
          <Left>
            <Button transparent
              onPress={() => this.props.navigation.navigate('AddPlantRoute')}
            >
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Take Plant Photo</Title>
          </Body>
        </Header> 
        <TouchableOpacity
          onPress={this.snap}
        >
          <Image source={require('../../assets/takePhoto.png')} style={{width: 70, height: 70, justifyContent: 'center', marginLeft: 150, marginTop: Dimensions.get('window').height - 170}} />
        </TouchableOpacity>
      </Camera>
    </Container>
    );
  }
}
}