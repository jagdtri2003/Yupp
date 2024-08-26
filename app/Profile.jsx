import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { signOut,updateUser,getAllPosts} from "../lib/appwrite";
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import CustomButton from "../components/CustomButton";
import UserPost from "../components/UserPost";
import {MaterialIcons} from '@expo/vector-icons'
import Loader from "../components/Loader";
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const { user, setUser, setIsLogged,userPosts } = useGlobalContext();
  const [loading,setLoading] = React.useState(false);
  const [image,setImage] = React.useState(null);
  const [posts,setPosts] = React.useState([]);

  const handleSignout = () =>{
    setLoading(true);
    setTimeout(()=>{
      signOut();
      while (router.canGoBack()) { // Pop from stack until one element is left
        router.back();
      }
      router.replace('/sign-in');
      setUser(null);
      setIsLogged(false);
      setLoading(false);
    },1500);
  }
  useEffect(()=>{
    setPosts(userPosts.sort((a,b)=> new Date(b.Date) - new Date(a.Date)));
  },[])

  const handleUpdate = async(final) =>{
    if (final){
      setLoading(true);
      const updatedUser = await updateUser(user.$id,{avatar:image,username:user.username});
      setUser(updatedUser);
      setImage(null);
      setLoading(false);
      return ;
    }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,5],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    

  }

  return (
    <>
    <Loader isLoading={loading}></Loader>
    <ScrollView className="flex-1 bg-[#111111]">
      <View className="flex-1 bg-[#111111]">
        <View className="w-full h-[50vh]">
          <ImageBackground
            source={{
              uri: image ? image.uri : user.avatar,
            }}
            className="w-full h-full"
            resizeMode="cover"
          >
            <View className="flex-row ml-[72vw] mt-5">
              <TouchableOpacity className="rounded-full bg-[#333030] p-1 mx-2"><MaterialIcons  name="notifications" size={34} color="white" /></TouchableOpacity>
              <TouchableOpacity className="rounded-full bg-[#333030] p-1" onPress={handleSignout}><MaterialIcons  name="logout" size={34} color="white" /></TouchableOpacity>
            </View>
            <View className="flex-1 mt-[22vh] mb-[5vh] ml-[10vw]">
              <Text className=" text-3xl font-pbold  text-white">
                {user.username.slice(0, 1).toUpperCase() +
                  user.username.slice(1)}
              </Text>
              <Text className="flex-1 text-sm font-pregular  text-white ">
                Allahabad
              </Text>
              
              <CustomButton
                title={image ? "Update Profile Profile" :"Edit Profile Picture"}
                containerStyles={"mr-[10vw] rounded-3xl bg-white"}
                icon={image ? "check-square": "edit"} handlePress={image ? ()=> handleUpdate(true) :()=>handleUpdate(false)} ></CustomButton>
            </View>
          </ImageBackground>
        </View>
        <View className="w-full min-h-[53vh] flex-1 bg-[#232020] rounded-t-3xl mt-[-3vh]">
          <Text className="text-3xl font-pbold m-6 mb-3 text-white">
            Latest Post
          </Text>
          <View className="flex-1 w-full">
          {posts.map((post) => (
            <UserPost
              key={post.$id}
              username={user.username}
              post={post.ImageUrl}
              userImage={user.avatar}
              date={post.Date}
              caption={post.Caption}
              id={post.$id}
            />
          ))}
          </View>
        </View>
      </View>
    </ScrollView>
    </>
  );
};

export default Profile;
