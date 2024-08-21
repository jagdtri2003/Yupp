import { StyleSheet, Text, ScrollView,View,Image, SafeAreaView} from 'react-native'
import React from 'react';
import {AntDesign} from '@expo/vector-icons';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { router,Redirect } from 'expo-router';
import { useGlobalContext } from "../context/GlobalProvider";

const MainComponent = () => {

  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/Home" />;


  return (
    <SafeAreaView className="h-full flex-1">
    <Loader isLoading={loading}/>
    <ScrollView contentContainerStyle={{height: "100%"}} style={styles.container}>
      <Text className="mt-12 py-9 text-4xl text-white text-center font-pbold" >
      <AntDesign name="dingding" size={35} color="white" />Yupp</Text>
      <Image className="w-full " source={require('../assets/images/cards.png')} style={{maxWidth:380, maxHeight: 298}}/>
      <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-[#FF8E01]">Yupp</Text>
            </Text>
            <Image
              source={require('../assets/images/path.png')}
              className="w-[136px] h-[15px] absolute -bottom-3 -right-0 "
              resizeMode="contain"
            />
      </View>
      <Text className="text-sm font-pregular text-[#CDCDE0] mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Yupp
          </Text>
          <Text className="text-sm font-pregular text-[#CDCDE0] mt-7 text-center">
            Made with ❤️ by Jagdamba Tripathi
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="max-w-[90vw] mx-6 mt-7"
          />
    </ScrollView>
    </SafeAreaView>
  )
}

// secondary color : #232020

export default MainComponent;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#111111',
    },
    textHeading:{
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 150,

    }
});