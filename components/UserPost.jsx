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

const UserPost = ({ username, userImage, post, date, caption, id }) => {
  const { user } = useGlobalContext();
  const [liked, setLiked] = useState(false);
  const [lastTap, setLastTap] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const toTitle = (str) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  };


  useEffect(() => {
    getLikesByUser(user.$id, id, setLikesCount, setLiked);

    const unsubscribe = subscribeToLikeChanges(id, user.$id, setLikesCount, setLiked);

    return () => unsubscribe();
  }, [user.$id, id]);

  const handleDoubleTap = async () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 400) {
      if (!liked) {
        setLiked(true);
        await likePost(id, user.$id);
        setLikesCount((count) => count + 1);
      }
    } else {
      setLastTap(now);
    }
  };

  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      setLikesCount((count) => count + 1);
      await likePost(id, user.$id);
    } else {
      setLiked(false);
      setLikesCount((count) => count - 1);
      await unlikePost(id, user.$id);
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
            onPress={() => {handleLike()}}
          >
            <FontAwesome
              name={liked ? "heart" : "heart-o"}
              size={24}
              color={liked ? "red" : "white"}
            />
            { likesCount > 0 &&
              <Text className="text-white font-pregular">{likesCount}</Text>
            }
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
