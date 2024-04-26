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
  deleteDoc,
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
      let collectionRef = collection(firestore, "users");
      let docRef = query(
        collectionRef,
        where("uid", "==", uid),
        where("email", "==", email)
      );
      let userData = await getDocs(docRef);

      if (!userData.docs.length > 0) {
        console.error("User does not exist in database.");
        alert("Please do sign up first");
        return;
      }
      localStorage.setItem("uid", result.user.uid);
      localStorage.setItem("user", JSON.stringify(userData.docs[0].data()));
      navigate("/home");
    })
    .catch((error) => {
      return error;
    });
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("uid");
    localStorage.removeItem("user");
    userStore.set({ ...initialValue });
    window.location.reload();
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
  /** @type {{ title: string; category: any; description: any; needToDone: any; uid: any; createdBy: any; }} */ taskData
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
    window.location.reload();
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
      assignedTo: name,
    });
    console.log("Task Accepted");
    alert("Task Accepted Successfully");
    // window.location.reload();
  } catch (error) {
    console.error(error);
  }
};
export const _done_task = async (
  /** @type {any} */ taskId,
  /** @type {any} */ uid,
  doneInfo
) => {
  console.log("Here is the task id", uid, taskId, doneInfo);
  try {
    let dbRef = doc(firestore, `tasks/${taskId}`);
    const tasksData = await _get_user_tasks(uid);

    console.log("tasksData[0].uid == uid", tasksData);
    // @ts-ignore
    if (uid === tasksData[0].uid) {
      await updateDoc(dbRef, {
        status: Task_Process.DONE,
        isDone: true,
        taskDoneByUID: doneInfo.userId,
        tasksDone: [
          {
            creatorUID: uid,
            date: new Date().toISOString(),
            doneNote: doneInfo.doneNote,
            doneBy: doneInfo.doneBy,
            isSelfDone: doneInfo.isSelfDone,
            doneUserId: doneInfo.userId,
            rating: doneInfo.rating
          },
        ],
      });
      console.log("Task Done");
      alert("Task Done Successfully");
      window.location.reload();
    } else {
      alert("You are not the owner of this task");
    }
  } catch (error) {
    console.error(error);
  }
};

export const _get_user_tasks = async (/** @type {unknown} */ uid) => {
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

/**
 * @param {string} uid
 * @returns {Promise<any>}
 */

// here, need to get the skills of the user form the user colleciton and based on that
// filter the related tasks from the db in the tasks colleciton
// return the related tasks array to from this function

export const _get_tasks_realted_to_user = async (uid) => {
  try {
    const userRef = collection(firestore, "users");
    let userQuery = query(userRef, where("uid", "==", uid));
    let userSnapshot = await getDocs(userQuery);
    let userData = userSnapshot.docs.map((doc) => doc.data().skills);
    console.log("userData", userData[0]);
    const tasksRef = collection(firestore, "tasks");
    let tasksData = [];

    let tasksQuery = query(tasksRef, where("category", "in", userData[0]));
    let tasksSnapshot = await getDocs(tasksQuery);
    tasksSnapshot.docs.map((doc) => {
      tasksData.push({ ...doc.data(), id: doc.id });
    });
    console.log("Tasks related to user's skills:", tasksData);

    return tasksData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const _get_tasks_done_by_me = async (uid) => {
  try {
    const tasksRef = collection(firestore, "tasks");
    let tasksData = [];
    let tasksQuery = query(tasksRef, where("taskDoneByUID", "==", uid));
    let tasksSnapshot = await getDocs(tasksQuery);
    tasksSnapshot.docs.map((doc) => {
      tasksData.push({ ...doc.data(), id: doc.id });
    });
    console.log("Tasks done by me:", tasksData);

    return tasksData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const _fetch_notifications = async (receiver_id) => {
  try {
    const notificationsRef = collection(firestore, "notifications");
    let notificationsData = [];
    let notificationsQuery = query(
      notificationsRef,
      where("receiverId", "==", receiver_id)
    );
    let notificationsSnapshot = await getDocs(notificationsQuery);
    notificationsSnapshot.docs.map((doc) => {
      notificationsData.push({ ...doc.data(), id: doc.id });
    });
    console.log("Notifications:", notificationsData);

    return notificationsData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const fetch_message_by_message_id = async (message_id) => {
  try {
    const messagesRef = collection(firestore, "messages");
    let messageData;
    let messagesQuery = query(
      messagesRef,
      where("messageId", "==", message_id)
    );
    let messagesSnapshot = await getDocs(messagesQuery);
    messagesSnapshot.docs.map((doc) => {
      messageData = doc.data().message;
    });
    console.log("Messages:", messageData);

    return messageData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//fist the notifications need to update like if the read button clicks then notifications ae read
//and then trigger run automatically to update the messages in

export const updateNotifications = async (notification_id, messageId) => {
  try {
    let notificationsRef = collection(firestore, "notifications");
    let notificationsQuery = query(
      notificationsRef,
      where("notificationId", "==", notification_id),
      where("messageId", "==", messageId)
    );
    let notificationsSnapshot = await getDocs(notificationsQuery);
    let docRef = notificationsSnapshot.docs[0].ref;
    await updateDoc(docRef, {
      isRead: true,
    });
    await deleteDoc(docRef);
    console.log("Notification Updated");
    alert("Notification Updated Successfully");
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

export const get_user_name_by_uid = async (uid) => {
  try {
    let username = "";
    const dbRef = collection(firestore, `users`);
    const q = query(dbRef, where("uid", "==", uid));
    let querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data().name;
  } catch (error) {
    console.error("Error fetching users data:", error);
    throw new Error("Failed to fetch users");
  }
};

export const _get_user_reviews_of_tasks_done = async (uid) => {
  try {
    let reviews = [];
    const dbRef = collection(firestore, `reviews`);
    const q = query(dbRef, where("taskDoneByUID", "==", uid));
    let querySnapshot = await getDocs(q);
    querySnapshot.docs.map((doc) => {
      reviews.push({ ...doc.data(), id: doc.id });
    });
    console.log("reviews", reviews);
    return reviews;
  } catch (error) {
    console.log(error);
  }
};

export const _get_user_reviews_of_tasks_given = async (taskDoneUserId) => {
  try {
    let taskRef = collection(firestore, `tasks`);
    let q = query(taskRef, where("taskDoneByUID", "==", taskDoneUserId));
    let querySnapshot = await getDocs(q);
    let tasksData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log("tasksData", tasksData);
    let reviews = [];
    tasksData.map((task) => {
      reviews.push({
        review: task.doneNote,
        doneAt: task.date,
      });
    });
  } catch (error) {
    console.log(error);
  }
};


export const _get_user_rating = async (uid) => {
  console.log("====================================", uid);
  try {
    let tasksData = await collection(firestore, `tasks`);
    let q = query(tasksData, where("taskDoneByUID", "==",uid ));
    let querySnapshot = await getDocs(q);
    let reviews = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log("reviews", reviews);

    let totalRating = 0;
    let count = 0;
    let data=[]

    reviews.forEach((review) => {
      console.log('====================================');
      console.log("review", review);
      console.log('====================================');
      review.tasksDone.forEach((task) => {
        if (task.doneUserId === uid) {
          data.push({
            rating: task.rating,
            doneNote: task.doneNote,
            description: review.description,
            category:review.category
          })
        }
      });
    });

    console.log("totalRating", totalRating);
    console.log("count", count);

    // Calculate average rating if count is not 0
   

    console.log("data📈", data);

    return data;
  } catch (error) {
    console.log(error);
  }
};