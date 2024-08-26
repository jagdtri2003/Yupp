import { View, Text, TextInput,TouchableWithoutFeedback as Touchable,Image,ScrollView } from "react-native";
import React,{useState} from "react";
import BackTab from "../../components/BackTab";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons,Entypo } from "@expo/vector-icons";
import { createPost } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

const Create = () => {
  const {user,setPosts} = useGlobalContext()
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = user?.$id;
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handlePost = async() =>{
    setLoading(true);
    if (!image) {
      alert('Please select an image');
      setLoading(false);
      return;
    }
    const form = {image,caption,userId}
    try{
      const newPost = await createPost(form)
      setPosts(prev => [newPost, ...prev]);
      setImage(null);
      setCaption('');
      router.replace('/Home');
    }catch(error){
      console.log(error)
    }finally{
      setLoading(false);
    }
  }
  return (
    <ScrollView className="h-full w-full bg-[#111111]">
    <View>
      <BackTab tabName="New Post" />

      <View className="w-full">
        <View className="bg-[#232020] rounded-3xl m-6">
            <Text className="text-lg font-pregular mx-5 mt-2 text-white">Caption</Text>
            <TextInput multiline value={caption} onChangeText={setCaption} className="h-24 border-2 border-[#7B7B8B] text-white mx-5 my-2 rounded-2xl px-4 " />
        </View>
      </View>

      <View className="w-full">
        <View className="bg-[#232020] rounded-3xl m-6 mt-3">
          <Text className="text-lg font-pregular mx-5 mt-2 text-white">Add Image</Text>
          <View className="min-h-[20vh] max-h-[45vh] border-2 border-[#7B7B8B] text-white mx-5 my-3 mb-6 rounded-2xl px-4 " >
            {image ?<Image resizeMode="contain" source={{ uri: image.uri }} className=" w-full h-full " />: 
            <View className="flex flex-1 justify-center items-center">
            <Touchable onPress={pickImage}>
              <MaterialCommunityIcons name="file-image-plus" size={38} color="white" />
            </Touchable>
            </View>
            }
            {image && <Text className="absolute top-0 right-0"> <Entypo name="cross" size={30} color="red" onPress={() => setImage(null)} /></Text>}
          </View>
        </View>
      </View>

      <View>
        <CustomButton title="Post" containerStyles="mt-4 mx-6 mb-5" handlePress={handlePost} isLoading={loading}/>
      </View>
    
    </View>
    </ScrollView>
  );
};

export default Create;
