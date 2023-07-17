import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { Login } from '../screens';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Login'
        component={Login}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
