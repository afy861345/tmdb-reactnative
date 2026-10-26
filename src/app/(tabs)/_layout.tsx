import { Tabs } from 'expo-router'
import { Image, ImageBackground, ImageSourcePropType, Text, View } from 'react-native'
import { icons } from '../../../constants/icons'
import { images } from '../../../constants/images'
interface TabIconProps {
    focused: boolean
    icon: ImageSourcePropType
    title: string
}
const _layout = () => {

    const TabIcon = ({ focused, icon, title }: TabIconProps) => {
        if (focused) {
            return (

                <ImageBackground source={images.highlight} resizeMode='stretch'
                    className='flex flex-row flex-1 w-full min-w-[112] min-h-20 rounded-full  justify-center items-center overflow-hidden'>
                    <Image className='size-5' source={icon} tintColor="#151312" />
                    <Text className='text-secondary text-base font-semibold ml-2'>
                        {title}
                    </Text>
                </ImageBackground>
            )
        }
        return (
            <View className='size-full justify-center 
    items-center rounded-full'>
                <Image source={icon} tintColor={'#A8B5DB'} className='size-5' />
            </View>
        )
    }

    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,

            tabBarItemStyle: {
                width: '100%', height: '100%',
                justifyContent: 'center',
                alignContent: 'center',
            },
            tabBarIconStyle: {
                width: "100%",
                height: "100%",
                borderRadius: 50,



            },
            tabBarStyle: {
                backgroundColor: '#0f0d23',
                borderRadius: 50,
                marginHorizontal: 10,
                height: 52,
                position: 'absolute',
                overflow: 'hidden',
                borderWidth: 1, borderColor: '#0f0d23',
                marginBottom: 1
            }

        }}>
            <Tabs.Screen name='index' options={{
                title: "Home", headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.home} title={"Home"} />
                )
            }}
            />
            <Tabs.Screen name='search' options={{
                title: "Search", headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.search} title='Search' />
                )
            }} />
            <Tabs.Screen name='saved' options={{
                title: "Saved", headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.save} title='Saved' />
                )
            }} />
            <Tabs.Screen name='profile' options={{
                title: "Profile", headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.person} title='Profile' />
                )
            }} />
        </Tabs>
    )
}

export default _layout
