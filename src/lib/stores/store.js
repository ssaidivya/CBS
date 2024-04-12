// @ts-nocheck
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
  tasks: {},
  isAuthenticated: false,
  error: "",
  uid: "",
};
export const userStore = writable(initialValue);

export const createUser = async (
  /** @type {{ name: any; email: any; password: any; address: any; skills: any; }} */ user
) => {
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

export const signIn = async (
  /** @type {{ email: any; password: any; }} */ user
) => {
  const { email, password } = user;
  try {
    const signInRef = await signInWithEmailAndPassword(auth, email, password);
    userStore.set({
      ...initialValue,
      uid: signInRef.user.uid,
      isAuthenticated: true,
    });
    localStorage.setItem("uid", signInRef.user.uid);
    window.location.reload();
    navigate("/home");
  } catch (error) {
    console.error(error);
    if (error.message === "Firebase: Error (auth/invalid-login-credentials).") {
      alert("Email and password not matches");
      return;
    }
    alert(error.message);
  }
};

export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider)
    .then(async (result) => {
      let { email, uid } = result?.user;
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

export const getUserDBData = async (/** @type {unknown} */ uid) => {
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
        uid: uesrsData[0].uid,
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

export const createTask = async (
  /** @type {{ title: any; category: any; description: any; needToDone: any; uid: any; createdBy: any; }} */ taskData
) => {
  let { title, category, description, needToDone, uid, createdBy } = taskData;
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
      isDone: false,
      createdBy,
      tasksDone: [],
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
  /** @type {any} */ name
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
  /** @type {any} */ uid,
  doneInfo
) => {
  console.log("Here is the task id", uid,taskId,doneInfo);
  try {
    let dbRef = doc(firestore, `tasks/${taskId}`);
    const tasksData = await _get_user_tasks(uid);
   
    
    console.log("tasksData[0].uid == uid",tasksData[0].uid == uid);
    // @ts-ignore
    if (uid === tasksData[0].uid) {
      await updateDoc(dbRef, {
        status: Task_Process.DONE,
        isTaskAccepted: false,
        isDone: true,
        tasksDone: [
          {
            uid: uid,
            date: new Date().toISOString(),
            doneNote: doneInfo.doneNote,
            doneBy: doneInfo.doneBy,
            isSelfDone: doneInfo.isSelfDone,
          },
        ],
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

export const _get_user_tasks = async (/** @type {unknown} */ uid) => {
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

export const _get_user_tasks_by_uid = async (/** @type {unknown} */ uid) => {
  console.log("====================================🥶");
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
    userStore.set({
      ...initialValue,
      tasks: tasksData,
      isAuthenticated: true,
    });

    console.log("Fetched tasks data:🥵", tasksData);
    return tasksData;
  } catch (error) {
    console.error("Error fetching tasks data:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const _get_user_name_by_uid = async (/** @type {unknown} */ uid) => {
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

export const _forgot_password = async (/** @type {string} */ email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent");
    alert("Password reset email sent");
  } catch (error) {
    console.error(error);
    alert("Failed to send password reset email");
  }
};

export const update_Profile = async (
  /** @type {any} */ user,
  /** @type {unknown} */ uid
) => {
  try {
    let dbRef = collection(firestore, "users");

    let q = query(dbRef, where("uid", "==", uid));
    let querySnapshot = await getDocs(q);
    let docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      ...user,
    });
    console.log("Profile Updated");
    alert("Profile Updated Successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to update profile");
  }
};

export async function fetchUsers(searchTerm = "") {
  const usersRef = collection(firestore, "users");
  const q = query(
    usersRef,
    where("name", ">=", searchTerm),
    where("name", "<=", searchTerm + "\uf8ff")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
}
