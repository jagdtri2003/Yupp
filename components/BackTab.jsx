import { View, Text,TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const BackTab = ({ tabName }) => {
  return (
    <View className="h-[7vh] w-full flex flex-row items-center bg-[#232020] rounded-b-3xl">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="my-3 mx-5">
          <Ionicons name="arrow-back" size={34} color="white" />
        </View>
      </TouchableOpacity>
      <Text className="text-2xl font-pbold mx-5 mt-1 text-white">{tabName}</Text>
    </View>
  );
};

export default BackTab;
