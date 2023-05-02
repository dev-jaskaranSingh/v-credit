import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { TextInput, Text, LogBox } from "react-native";

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

if (Text.defaultProps == null) {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
    TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
}

Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreLogs(['Reanimated 2']);