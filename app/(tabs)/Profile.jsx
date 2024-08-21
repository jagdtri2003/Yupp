import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { signOut } from '../../lib/appwrite'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'

const Profile = () => {
  const {user,setUser,setIsLogged} = useGlobalContext();
  return (
    <View>
      <Text>Profile</Text>
      <TouchableOpacity onPress={()=>{
        signOut();
        setUser(null);
        setIsLogged(false);
        router.replace('/sign-in');
        }}>
        <Text className="text-[#FF0000] font-pmedium text-4xl">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile