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
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from '../../components/CustomButton'

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser, setIsLogged } = useGlobalContext();

  const validate = () => {
    let valid = true;
    let nameError = "";
    let emailError = "";
    let passwordError = "";

    // Name validation
    if (!name) {
      nameError = "Name is required";
      valid = false;
    }

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

    setErrors({ name: nameError, email: emailError, password: passwordError });
    return valid;
  };

  const handleSignUp = () => {
    if (validate()) {
      // Proceed with sign up
      setIsSubmitting(true);
      createUser(email, password,name)
        .then((result) => {
          setIsSubmitting(false);
          // Proceed with login
          setIsLogged(true);
          setUser(result);
          router.push("/Home");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
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
            Sign up to Yupp
          </Text>
        </View>

        {/* Name Input */}
        <View
          className={`flex-row items-center rounded-lg mt-10 mx-4 ${
            errors.name ? "border border-red-500 bg-[#333333]" : "bg-[#333333]"
          }`}
        >
          <View className="mx-2">
            <AntDesign name="user" size={20} color="#ffffff" className="px-4" />
          </View>
          <TextInput
            className="flex-1 text-white px-4 py-3"
            placeholder="Name"
            placeholderTextColor="#888888"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View className="mb-10 mt-1">
          {errors.name ? (
            <Text className="text-red-500 px-6">{errors.name}</Text>
          ) : null}
        </View>

        {/* Email Input */}
        <View
          className={`flex-row items-center rounded-lg mx-4 ${
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
            <Text className="text-red-500 px-6">{errors.password}</Text>
          ) : null}
        </View>

        {/* Sign Up Button */}
          <CustomButton title="Sign Up" handlePress={handleSignUp} containerStyles="mt-5 mx-4" isLoading={isSubmitting} />

        {/* Sign In Link */}
        <View className="mt-12 flex-row justify-center">
          <Text className="text-white text-sm">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text className="text-[#FF8E01] text-sm font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
