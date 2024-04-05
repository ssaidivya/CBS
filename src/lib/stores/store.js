import { readable, writable } from "svelte/store";
import {auth,firestore} from "../../dbconfig/firebase"
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,GoogleAuthProvider,
  signInWithPopup,
  } from "firebase/auth"
import {collection,addDoc,getDocs} from "firebase/firestore"
import {navigate} from "svelte-routing"

let initialValue={
    user:{
        email:"",
        password:"",
        name:"",
        address:"",
        skills:[]
    },
    isAuthenticated:false,
    error:"",
    uid:""

}
export const userStore = writable(initialValue); 

export const createUser = async (user) => {
  const { email, password, name, address, skills } = user;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(firestore, "users"), {
      name,
      address,
      skills,
      email,
      uid: userCredential.user.uid,
      createdAt: new Date().toISOString()
    });

    userStore.set({
      ...initialValue,
      uid: userCredential.user.uid,
      isAuthenticated: true,
    });

    navigate("/");
  } catch (error) {
    console.error(error);
    // Handle error...
  }
};

export const signIn = async (user) => {
  const { email, password } = user;
  try {
    const signInRef = await signInWithEmailAndPassword(auth, email, password);
    userStore.set({
      ...initialValue,
      uid: signInRef.user.uid,
      isAuthenticated: true,
    });

    navigate("/");
  } catch (error) {
    console.error(error);
  }
};

export const googleLogin=async()=>{
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider)
   .then((result) => {
    console.log(result.user)
    const {email, uid} = result?.user;
    userStore.set({
      ...initialValue,
      uid:result.user.uid,
      isAuthenticated: true,
      email
    })

    navigate('/');
   })
   .catch((error) => {
    return error;
   });
}

export const logout = async () => {
  try {
    await signOut(auth);
    userStore.set({ ...initialValue });
  } catch (error) {
    console.error(error);
  }
};
