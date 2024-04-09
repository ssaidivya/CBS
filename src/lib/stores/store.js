import { readable, writable } from "svelte/store";
import { auth, firestore } from "../../dbconfig/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { navigate } from "svelte-routing";

let initialValue = {
  user: {
    email: "",
    password: "",
    name: "",
    address: "",
    skills: [],
  },
  isAuthenticated: false,
  error: "",
  uid: "",
};
export const userStore = writable(initialValue);

export const createUser = async (user) => {
  const { email, password, name, address, skills } = user;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await addDoc(collection(firestore, "users"), {
      name,
      address,
      skills,
      email,
      uid: userCredential.user.uid,
      createdAt: new Date().toISOString(),
    });

    userStore.set({
      ...initialValue,
      uid: userCredential.user.uid,
      isAuthenticated: true,
    });
    localStorage.setItem("uid", userCredential.user.uid);

    navigate("/home");
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use")
      alert("Email is already in use");
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
    localStorage.setItem("uid", signInRef.user.uid);
    navigate("/home");
  } catch (error) {
    console.error(error);
  }
};

export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider)
    .then(async(result) => {
      let {email,uid}= result?.user
      const userRef = doc(firestore, "users", uid);
      const userSnap = await getDoc(userRef);
      console.log(result.user);
      if (!userSnap.exists()) {
       
        console.error("User does not exist in database.");
        alert("Please do sign up first");
        return;
      }
      userStore.set({
        ...initialValue,
        uid: result.user.uid,
        isAuthenticated: true,
        email,
      });
      localStorage.setItem("uid", result.user.uid);
      navigate("/home");
    })
    .catch((error) => {
      return error;
    });
};

export const logout = async () => {
  try {
    await signOut(auth);
    userStore.set({ ...initialValue });
  } catch (error) {
    console.error(error);
  }
};

export const getUserDBData = async (uid) => {
  try {
    let dbRef = collection(firestore, "users");
    let q = query(dbRef, where("uid", "==", uid));
    let querySnapshot = await getDocs(q);
    let uesrsData = querySnapshot.docs.map((doc) => doc.data());
    userStore.set({
      ...initialValue,
      user: {
        name: uesrsData[0].name,
        address: uesrsData[0].address,
        skills: uesrsData[0].skills,
        email: uesrsData[0].email,
        password: "",
      },
      uid: uesrsData[0].uid,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getData = async () => {
  try {
    let dbRef = collection(firestore, "users");
    let docCol = await getDocs(dbRef);
    let users = [];
    docCol.docs.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  } catch (error) {
    console.error(error);
    return error;
  }
};
const Task_Process = Object.freeze({
  ON_GOING: 0,
  DONE: 1,
  CANCELLED: 2,
  ACCEPTED: 3,
  CREATED: 4,
});

export const createTask = async (taskData) => {
  let { title, category, description, needToDone, uid } = taskData;
  try {
    await addDoc(collection(firestore, "tasks"), {
      title,
      category,
      description,
      needToDone,
      uid,
      createdAt: new Date().toISOString(),
      status: Task_Process.CREATED,
      tasksAccepted: [],
      isTaskAccepted: false,
      isDone:false
    });
    console.log("Task Created");
    alert("Task Created Successfully");
  } catch (error) {
    console.error(error);
  }
};

export const _get_tasks = async () => {
  try {
    let dbRef = collection(firestore, "tasks");
    let tasksData = [];
    const snapshot = await getDocs(dbRef);
    snapshot.docs.forEach((doc) => {
      tasksData.push({ ...doc.data(), id: doc.id });
    });
    console.log("Fetched tasks data:", tasksData);
    return tasksData;
  } catch (error) {
    console.error("Error fetching tasks data:", error);
    return [];
  }
};

export const _accept_task = async (
  /** @type {any} */ taskId,
  /** @type {any} */ uid,
  name
) => {
  // tasksAccepted should be like [{uid:"",date:""}]
  try {
    let dbRef = doc(firestore, `tasks/${taskId}`);
    await updateDoc(dbRef, {
      status: Task_Process.ACCEPTED,
      isTaskAccepted: true,
      tasksAccepted: [{ uid: uid, date: new Date().toISOString(), name }],
    });
    console.log("Task Accepted");
    alert("Task Accepted Successfully");
  } catch (error) {
    console.error(error);
  }
};
export const _done_task = async (
  /** @type {any} */ taskId,
  /** @type {any} */ uid
) => {
  // tasksAccepted should be like [{uid:"",date:""}]
  console.log("Here is the task id", taskId);
  try {
    let dbRef = doc(firestore, `tasks/${taskId}`);
    //use rneeds to accept the task if the task is created by that user
    const tasksData = await _get_user_tasks(uid);
    // @ts-ignore
    console.log(tasksData[0].uid);
    console.log(uid);
    // @ts-ignore
    console.log(tasksData[0].uid == uid);
    // @ts-ignore
    if (uid == tasksData[0].uid) {
      await updateDoc(dbRef, {
        status: Task_Process.DONE,
        isTaskAccepted: false,
        isTaskDone: true,
        tasksDone: [{ uid: uid, date: new Date().toISOString() }],
      });
      console.log("Task Done");
      alert("Task Done Successfully");
    } else {
      alert("You are not the owner of this task");
    }
  } catch (error) {
    console.error(error);
  }
};

export const _get_user_tasks = async (uid) => {
  console.log("====================================dmnfdknfdnfmdnfmdnfmnd");
  console.log(uid);
  console.log("====================================");
  try {
    const dbRef = collection(firestore, "tasks");
    const q = query(dbRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const tasksData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    console.log("Fetched tasks data:", tasksData);
    return tasksData;
  } catch (error) {
    console.error("Error fetching tasks data:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const _get_user_name_by_uid = async (uid) => {
  try {
    const dbRef = collection(firestore, `users`);
    const q = query(dbRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const usersData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log("Fetched users data:", usersData);
    // @ts-ignore
    return usersData[0].name;
  } catch (error) {
    console.error("Error fetching users data:", error);
    throw new Error("Failed to fetch users");
  }
};


export const _forgot_password = async (email) => {
  try{
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent");
    alert("Password reset email sent");
  }catch(error){
    console.error(error);
    alert("Failed to send password reset email");
  }
}

export const update_Profile = async (user, uid) => {
  try {
    let dbRef= collection(firestore, "users");
    
    let q= query(dbRef, where("uid", "==", uid));
    let querySnapshot = await getDocs(q);
    let docRef =querySnapshot.docs[0].ref
    await updateDoc(docRef, {
      ...user
    })
    console.log("Profile Updated");
    alert("Profile Updated Successfully");
    
  } catch (error) {
    console.error(error);
    alert("Failed to update profile");
  }
}