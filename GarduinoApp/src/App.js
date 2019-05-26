import Login from './Screens/Login';
import PlantList from './Screens/PlantList';
import PlantInfo from './Screens/PlantInfo';
import StatDetail from './Screens/StatDetail';
import ValuesSettings from './Screens/ValuesSettings';
import Logo from './Screens/Logo';
import Notification from './Screens/Notification'; 

import {createSwitchNavigator, createAppContainer, createStackNavigator, createDrawerNavigator} from 'react-navigation';
import {Dimensions} from 'react-native'


const LoginNavigation = createSwitchNavigator(
  {
    LoginRoute: Login,
    LogoRoute: Logo
  }
)

const AppNavigation = createStackNavigator(
  {
      PlantListRoute: PlantList,
      PlantInfoRoute: PlantInfo,
      StatDetailRoute: StatDetail,
      ValuesSettingRoute: ValuesSettings,
  }
)

const AppDrawer = createDrawerNavigator({
  DrawerRoute: AppNavigation,
}, 
{
  contentComponent: Notification 
},
  DrawerConfig
); 

const DrawerConfig = {
  drawerWidth: Dimensions.get('window').width * 0.80,
}

export default createAppContainer(createSwitchNavigator(
{
  Start: LoginNavigation,
  App: AppDrawer,
}
));