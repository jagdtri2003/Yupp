import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from '../../components/CustomButton'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser, setIsLogged } = useGlobalContext();

  const validate = () => {
    let valid = true;
    let emailError = "";
    let passwordError = "";

    // Email validation
    if (!email) {
      emailError = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      emailError = "Invalid email address";
      valid = false;
    }

    // Password validation
    if (!password) {
      passwordError = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      passwordError = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors({ email: emailError, password: passwordError });
    return valid;
  };

  const handleSignIn = async() => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        await signIn(email,password);
        const result = await getCurrentUser();
        setUser(result);
        setIsLogged(true);
        router.replace("/Home");
      } catch (error) {
        setErrors({ email:"", password: error.message });
      } finally {
        setIsSubmitting(false);
      }
      
    }
  };

  return (
    <SafeAreaView className="h-full flex-1">
      <ScrollView
        className="bg-[#111111]"
        contentContainerStyle={{ height: "100%" }}
      >
        <Text className="mt-12 py-9 text-4xl text-white text-center font-pbold">
          <AntDesign name="dingding" size={35} color="white" />
          Yupp
        </Text>

        <View className="relative mt-5">
          <Text className="px-5 text-2xl text-white font-pbold">
            Log in to Yupp
          </Text>
        </View>

        {/* Email Input */}
        <View
          className={`flex-row items-center rounded-lg mt-10 mx-4 ${
            errors.email ? "border border-red-500 bg-[#333333]" : "bg-[#333333]"
          }`}
        >
          <View className="mx-2">
            <AntDesign name="mail" size={20} color="#ffffff" className="px-4" />
          </View>
          <TextInput
            className="flex-1 text-white px-4 py-3"
            placeholder="Email"
            placeholderTextColor="#888888"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View className="mb-10 mt-1">
          {errors.email ? (
            <Text className="text-red-500 px-6">{errors.email}</Text>
          ) : null}
        </View>

        {/* Password Input */}
        <View
          className={`flex-row items-center rounded-lg mx-4 ${
            errors.password ? "border border-red-500 bg-[#333333]" : "bg-[#333333]"
          }`}
        >
          <View className="mx-2">
            <AntDesign name="lock1" size={20} color="#fff" />
          </View>
          <TextInput
            className="flex-1 text-white px-4 py-3"
            placeholder="Password"
            placeholderTextColor="#888888"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <View className="mx-4">
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Feather
                name={passwordVisible ? "eye" : "eye-off"}
                size={20}
                color="#fff"
                className="px-5"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mb-10 mt-1">
          {errors.password ? (
            <Text className="text-red-500 mb-10 mt-1 px-6">{errors.password}</Text>
          ) : null}
        </View>

        {/* Sign In Button */}
        <CustomButton
            title="Sign In"
            handlePress={handleSignIn}
            containerStyles="mt-5 mx-4"
            isLoading={isSubmitting}
          />

        {/* Forgot Password */}
        <TouchableOpacity className="mt-6">
          <Text className="text-center text-[#FF8E01] text-sm font-semibold">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="mt-12 flex-row justify-center">
          <Text className="text-white text-sm">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text className="text-[#FF8E01] text-sm font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
