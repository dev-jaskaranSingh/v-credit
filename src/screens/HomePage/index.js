import { TouchableOpacity, View } from 'react-native';
import {Text, Card, Button} from "react-native-paper";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

import Customers from "./../HomePage/Customers"
import Transactions from "./../HomePage/Transactions"

import { styled } from 'nativewind';
import {COLORS} from "../../core";
import {StatusBar} from "expo-status-bar";

const StyledView = styled(TouchableOpacity)
const StyledText = styled(Text)


const Box = ({ className, children, ...props }) => (
    <StyledView className={`flex text-center h-20 rounded ${className}`} {...props}>
        {children}
    </StyledView>
)



const Tab = createMaterialTopTabNavigator();
export default function Index() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar animated={true}/>
            <StyledView className="flex flex-row h-1/8 items-center space-x-2 p-2 bg-blue-100">
                <Box className="flex-1 bg-white shadow-md flex-row justify-evenly items-center">
                    <View className="bg-emerald-600 p-2 rounded-full h-[45px] w-[45px] justify-center items-center">
                        <MaterialCommunityIcons name="call-received" size={24} color="white" />
                    </View>
                    <View>
                        <Text variant={"bodyMedium"}>To Receive</Text>
                        <Text variant={"titleLarge"}  className="font-bold text-slate-700">$100</Text>
                    </View>
                </Box>
                <Box className="flex-1 bg-white shadow-md flex-row justify-evenly items-center" >
                    <View className="bg-red-500 p-2 rounded-full h-[45px] w-[45px] justify-center items-center">
                        <MaterialIcons name="call-made" size={24} color="white" />
                    </View>
                    <View>
                        <Text variant={"bodyMedium"}>To Pay</Text>
                        <Text variant={"titleLarge"}  className="font-bold text-slate-700">$140</Text>
                    </View>
                </Box>
            </StyledView>
            <View className={"flex-1"}>
                <NavigationContainer independent={true}>
                    <Tab.Navigator
                        screenOptions={{
                            tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
                            tabBarStyle: { backgroundColor: 'white' },
                            tabBarActiveTintColor: COLORS.primary,
                            tabBarInactiveTintColor: COLORS.darkgray,
                            tabBarAllowFontScaling: false,
                            tabBarIndicatorStyle: {
                                height: 4,
                                backgroundColor: COLORS.primary,
                            }
                        }}
                    >
                        <Tab.Screen name="Customers" component={Customers} />
                        <Tab.Screen name="Credit/Udhaar" component={Transactions} />
                    </Tab.Navigator>
                </NavigationContainer>
            </View>
            <View className={"absolute bottom-10 flex w-full flex-row justify-evenly space-x-2 px-4"}>
                <View className={"flex-1"}>
                    <Button mode={"contained"} className={"bg-sky-500 shadow-lg"}>
                        Take Payment
                    </Button>
                </View>
                <View className={"flex-1"}>
                    <Button mode={"contained"} className={"bg-amber-500 shadow-lg"}>
                        Give Create (Udhaar)
                    </Button>
                </View>
            </View>
        </View>
    );
}