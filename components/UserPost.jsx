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
import React, { useState,useEffect } from "react";
import playSound from "../components/PlayAudio";
import { timeAgo } from "../lib/timeAgo";
import { likePost,unlikePost,getLikesByUser,subscribeToLikeChanges } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const UserPost = ({ username, userImage, post, date, caption, likedBy, id }) => {
  const { user } = useGlobalContext();
  const [liked, setLiked] = useState(false);
  const [lastTap, setLastTap] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [hasRendered, setHasRendered] = useState(false); // Flag for initial render
  const [likeCount, setLikeCount] = useState(likedBy.length);

  const toTitle = (str) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  };

  useEffect(() => {    
    setLiked(likedBy.some(liker => liker.accountId === user.accountId));
    setHasRendered(true); // Mark the initial render as completed
  }, [likedBy, user.accountId]);

  useEffect(() => {
    // Only perform the API call after the initial render
    if (hasRendered) {
      if (liked) {
        likePost(id, user.$id);
      } else {
        unlikePost(id, user.$id);
      }
    }
  }, [liked, id, user.accountId, hasRendered]);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 400) {
      setLiked(true);
      if(!likedBy.some(liker => liker.accountId === user.accountId)){
        setLikeCount(likeCount + 1); 
      }
    } else {
      setLastTap(now);
    }
  };


  return (
    <View className="w-[88vw] mx-[6vw] my-6">
      <Touchable onPress={handleDoubleTap}>
        <View className="rounded-3xl h-[49vh] overflow-hidden">
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
                  <Text className="text-white font-pmedium">
                    {toTitle(username)}
                  </Text>
                  <Text className="text-white text-[13px] font-pregular">
                    {timeAgo(date)}
                  </Text>
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
          <TouchableOpacity
            className="flex flex-row items-center space-x-2"
            onPress={() => setLiked(!liked)}
          >
            <FontAwesome
              name={liked ? "heart" : "heart-o"}
              size={24}
              color={liked ? "red" : "white"}
            />
            {likedBy && likedBy.length > 0 && (
              <Text className="text-white font-pregular">{likedBy.length}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="message-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={async () => {
            setBookmarked(!bookmarked);
            bookmarked
              ? ToastAndroid.show("Removed", ToastAndroid.SHORT)
              : ToastAndroid.show("Saved", ToastAndroid.SHORT);
            await playSound({ name: "success" });
          }}
        >
          <FontAwesome
            name={bookmarked ? "bookmark" : "bookmark-o"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <View>
        {caption && (
          <Text className="text-white font-pregular px-4 py-2">
            {toTitle(username).split(" ")[0]} says : {caption}
          </Text>
        )}
      </View>
    </View>
  );
};

export default UserPost;
