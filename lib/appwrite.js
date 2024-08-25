import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jagdtri2003.shopit",
  projectId: "66bd90240032a6beeb45",
  storageId: "66c79e1c0029608682c7",
  databaseId: "66c0c1c10033384f12e2",
  userCollectionId: "66c0c2120030fdb0021b",
  videoCollectionId: "66c0c22900245e4a9c2d",
  userPostCollectionId: "66c788eb002d49d9f2ed",
};



const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const {fileName , fileSize , mimeType , uri } = file;
  const final = { name: fileName, size: fileSize , uri , type: mimeType};

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      final
    );

    if (!uploadedFile) throw Error;
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Post
export async function createPost(form) {
  try {

    const ImageUrl = await uploadFile(form.image, "image");

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userPostCollectionId,
      ID.unique(),
      {
        Caption: form.caption,
        ImageUrl: ImageUrl,
        Date: new Date().toISOString(),
        User: form.userId,
        LikedBy : [],
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userPostCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Update User
export async function updateUser(userId, form) {
  try {
    if (form.avatar) {
      const ImageUrl = await uploadFile(form.avatar, "image");
      form.avatar = ImageUrl;
    }
    const user = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        username: form.username,
        avatar: form.avatar,
      }
    );
    return user;  
  } catch (error) {
    throw new Error(error);
  }
}

export async function likePost(postId, userId) {
  try {
    // Fetch the current post
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userPostCollectionId,
      postId
    );

    // Check if the user already liked the post
    if (post.LikedBy.includes(userId)) {
      return ;
    }

    // Add the user's ID to the LikedBy array
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userPostCollectionId,
      postId,
      {
        LikedBy: [...post.LikedBy, userId],
      }
    );

    return updatedPost;
  } catch (error) {
    throw new Error(`Failed to like the post: ${error.message}`);
  }
}

export async function unlikePost(postId, userId) {
  try {
    // Fetch the current post
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userPostCollectionId,
      postId
    );

    // Check if the user has not liked the post
    const likedByUser = post.LikedBy.some(liker => liker.accountId === userId);
    if (!likedByUser) {
      throw new Error("User has not liked this post.");
    }

    // Remove the user's object from the LikedBy array
    const updatedLikedBy = post.LikedBy.filter((liker) => liker.accountId !== userId);

    // Update the post with the modified LikedBy array
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userPostCollectionId,
      postId,
      {
        LikedBy: updatedLikedBy,
      }
    );

    return updatedPost;
  } catch (error) {
    throw new Error(`Failed to unlike the post: ${error.message}`);
  }
}


export const getLikesByUser = async (userId, postId, setLikesCount, setLiked) => {
  try {
    // Query to fetch likes for the given postId
    const response = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userPostCollectionId, [
      `equal("postId", "${postId}")`,
    ]);

    const likes = response.documents;

    // Calculate likes count and check if user has liked the post
    const likesCount = likes.length;
    const isLiked = likes.some((like) => like.userId === userId);

    // Update the state
    setLikesCount(likesCount);
    setLiked(isLiked);

  } catch (err) {
    console.error('Error in getLikesByUser:', err);
  }
};

// Subscribe to real-time updates
export const subscribeToLikeChanges = (postId, userId, setLikesCount, setLiked) => {
  return client.subscribe(
    `collections.${appwriteConfig.userPostCollectionId}.documents`,
    (event) => {
      // Check if the event is related to the specific postId
      if (event.payload.postId === postId) {
        getLikesByUser(userId, postId, setLikesCount, setLiked);
      }
    }
  );
};

