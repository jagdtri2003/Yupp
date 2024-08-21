import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback as Touchable,
  ToastAndroid
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";

const UserPost = ({ username, userImage, post }) => {
  const [liked, setLiked] = useState(false);
  const [lastTap, setLastTap] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 400) {
      setLiked(true);
    } else {
      // Update the last tap time
      setLastTap(now);
    }
  };
  return (
    <View className="w-[88vw] mx-[6vw] my-6">
      <Touchable onPress={handleDoubleTap}>
        <View className="rounded-3xl h-[45vh] overflow-hidden">
          <ImageBackground
            source={{ uri: post }}
            className="w-full h-full"
            resizeMode="cover"
          >
            <View className="flex flex-row justify-between items-center px-4 py-3">
              <View className="flex flex-row items-center space-x-3 rounded-full">
                <Image
                  source={{ uri: userImage }}
                  className="w-10 h-10 rounded-full"
                />
                <View>
                    <Text className="text-white font-pmedium">{username}</Text>
                    <Text className="text-white text-[13px] font-pregular">25 min ago</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="more-vertical" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </Touchable>
      <View className="flex flex-row justify-between pt-2 items-center px-4">
        <View className="flex flex-row space-x-6">
          <TouchableOpacity onPress={() => setLiked(!liked)}>
            <FontAwesome
              name={liked ? "heart" : "heart-o"}
              size={24}
              color={liked ? "red" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="message-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {
            setBookmarked(!bookmarked);
            bookmarked ? ToastAndroid.show("Removed", ToastAndroid.SHORT) : ToastAndroid.show("Saved", ToastAndroid.SHORT);
             }}>
          <FontAwesome name={bookmarked ? "bookmark" : "bookmark-o"} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserPost;
