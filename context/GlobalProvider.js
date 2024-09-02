import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser,getAllPosts } from "../lib/appwrite";
import * as FileSystem from 'expo-file-system';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const path = FileSystem.documentDirectory + 'posts.txt';

  useEffect(()=>{
    const doRead = async()=>{
      const content = await FileSystem.readAsStringAsync(path);
      if(content){
        // console.log(content)
        setPosts(JSON.parse(content));
      } 
    }
    doRead();
  },[])

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setUser(res);
          setIsLogged(true);
          getAllPosts().then((pst) => {
            setPosts(pst);

          })
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        posts,
        setPosts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
