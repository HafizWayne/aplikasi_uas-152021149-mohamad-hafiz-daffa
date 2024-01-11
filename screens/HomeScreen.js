import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

import Berita from './Berita';
import Penulis from './Penulis';

const berita = "berita";
const penulis = "penulis";

const Tab = createBottomTabNavigator();

const Menu = () => {
  const route = useRoute();

  return (
    <Tab.Navigator
      initialRouteName={berita}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === berita) {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }
          if (route.name === penulis) {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }


          // You can return any component that you like here!
          return <Ionicons name={iconName} size={24} color={color} />;
        },

        tabBarActiveTintColor: '#16a0ff',
        tabBarInactiveTintColor: 'grey',
        tabBarIconStyle: { fontSize: 15 },
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 15 },
        tabBarStyle: {
          height: 75,
          backgroundColor: '#202126',
          borderTopWidth: 2,
          borderTopColor: route.state ? (route.state.index === route.key ? 'blue' : 'transparent') : 'transparent',
        },
      })}
    >
      <Tab.Screen name={berita} component={Berita} options={{ headerShown: false }} />
      <Tab.Screen name={penulis} component={Penulis} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default Menu;


