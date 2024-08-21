import { Stack } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
        <>
        <StatusBar translucent={false} backgroundColor='#FF8E01' />
        <Stack>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        </Stack>
        </>
  )
}

export default AuthLayout