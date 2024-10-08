import { View, Text,ScrollView,Image,TouchableOpacity,RefreshControl,BackHandler,Alert } from 'react-native'
import React,{useCallback,useEffect} from 'react'
import {useGlobalContext} from '../../context/GlobalProvider'
import {  router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import UserPost from "../../components/UserPost";
import { useFocusEffect } from '@react-navigation/native';
import Loader from "../../components/Loader";
import {getAllPosts} from "../../lib/appwrite"

const Home = () => {
  useEffect(()=>{
    if(!user){
      router.replace('/sign-in');
    }
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const {user,posts} = useGlobalContext();
  const [fetching, setFetching] = React.useState(true);
  const [Posts, setPosts] = React.useState([]);
  useEffect(()=>{
    const fetchPosts = () => {
      if(posts.length > 0){
          setPosts(posts.sort((a,b)=> new Date(b.Date) - new Date(a.Date)));
          setFetching(false);
        }
    };
    console.log("refresh!!")
    fetchPosts();
  },[refreshing,posts])
  const handleRefresh = async() =>{
    setRefreshing(true);
    const newPosts = await getAllPosts();
    setPosts(newPosts.sort((a,b)=> new Date(b.Date) - new Date(a.Date)));
    setRefreshing(false);
  }

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [])
  );

  return (
    <>
      <Loader isLoading={fetching}></Loader>
      <ScrollView showsVerticalScrollIndicator={false} className="h-full bg-[#111111]" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        <View className="h-[24vh] bg-[#232020] rounded-b-3xl mb-8">
          <View className="flex flex-row justify-between items-center">
            <View>
              <Text className="text-white font-pregular text-sm m-3 mb-2">{`${new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase()} , ${new Date().getDate()} ${new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase()}`}</Text>
              {user && <Text className="text-white font-pbold text-3xl ml-3">{user.username.split(" ")[0].slice(0,1).toUpperCase()+user.username.split(" ")[0].slice(1)}</Text>}
            </View>
            <View>
              <View >
                <TouchableOpacity onPress={()=>{router.push("/Profile")}}>
                <Image source={{uri: user.avatar}} className="w-16 h-16 rounded-full mx-4" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex flex-row" >
              <View>
                <View key={0} className="bg-[#4c4a4a] rounded-full w-16 h-16 mt-3 mx-4 flex justify-center items-center ">
                  <FontAwesome6 name="plus" size={24} color="white" />
                </View>
                <Text className="text-white my-2 text-center">Add Story</Text>
              </View>
              {new Array(5).fill(0).map((_, index) => (
                <View key={index+1}>
                <View className="bg-white rounded-full w-16 h-16 mt-3 mx-4"> 
                  <Image source={{uri: "https://picsum.photos/1600"}}></Image>
                </View>
                <View>
                  <Text className="text-white my-2 text-center">UserName</Text>
                </View>
                </View>
              ))}
          </ScrollView>
        </View>
        {Posts.map((post) => (
          <UserPost
            key={post.$id} 
            username={post.User.username}
            post={post.ImageUrl}
            userImage={post.User.avatar}
            date={post.Date}
            caption={post.Caption}
            likedBy={post.LikedBy}
            id={post.$id}
          />
        ))}
      </ScrollView>
    </>
  )
}

export default Home