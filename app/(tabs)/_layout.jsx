import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Home';
import ProfileScreen from './Profile';
import { StatusBar } from 'expo-status-bar';
import { CleanTabBar,ColorfulTabBar } from 'react-navigation-tabbar-collection';
import { FontAwesome } from '@expo/vector-icons';
import Create from './Create';
import Saved from './Saved';

export default function TabLayout() {
  const Tab = createBottomTabNavigator();
  return (
    <>
    <StatusBar translucent={false} backgroundColor='#232020' style="light" />
    <Tab.Navigator
      tabBar={props => <CleanTabBar darkMode={true}  {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
            title: 'HOME',
            icon: ({ focused, color, size }) => (
              <FontAwesome name='home' size={size} color={color}/>
            ),
            color: 'info',
          }}/>
      <Tab.Screen name="Create" component={Create} options={{
            title: 'ADD POST',
            icon: ({ focused, color, size }) => (
              <FontAwesome name='plus-square-o' size={size} color={color}/>
            ),
            color: 'info',
          }}/>
      <Tab.Screen name="Chat" component={Saved} options={{
            title: 'SAVED',
            icon: ({ focused, color, size }) => (
              <FontAwesome name='bookmark' size={size} color={color}/>
            ),
            color: 'info',
          }}/>
    </Tab.Navigator>
    </>
  );
}


