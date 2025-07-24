// lib/auth.ts
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config"; 
import { signOut } from "firebase/auth";

export const logout = async () => {
  await signOut(auth);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    try {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        userType: "crowd", 
        createdAt: new Date(),
      });
      console.log("User created in Firestore");
    } catch (error) {
      console.error("Failed to create user in Firestore:", error);
    }
  }
  

  return user;
};
export { auth };

