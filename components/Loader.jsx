import { View, ActivityIndicator, Dimensions, Platform,Text } from "react-native";

const Loader = ({ isLoading, title }) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
      style={{
        height: screenHeight,
      }}
    >
      {title && <Text className="text-white font-pregular text-lg">{title}</Text>}<ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
