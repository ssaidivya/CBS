const admin = require("firebase-admin");
const serviceAccount = require("./service_key.json");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.sendNotificationToUnReadMessageUser = functions.firestore
  .document("/messages/{messageId}")
  .onCreate((snapshot, context) => {
    const message = snapshot.data();
    const receiverId = message.receiverId;
    let notificationRef = db.collection("notifications").doc(receiverId);
    return notificationRef.set(
      {
        message: message.text,
        receiverId,
        senderId: message.senderId,
        message_sent_at: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        notificationId: notificationRef.id,
        messageId: message.messageId,
      },
    );
  });

exports.checkDeadlineAndUpdateStatus = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("Etc/UTC")
  .onRun(async (context) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let timeNow = now.toISOString().split("T")[0];
    let tasksRef = db.collection("tasks");
    let querySnapshot = await tasksRef
      .where("needToDone", "<=", timeNow)
      .where("status", "!=", "date passed")
      .get();

    const promises = [];
    querySnapshot.forEach((doc) => {
      const updatePromise = doc.ref.update({
        status: "date passed",
        needToDone:""
      });
      promises.push(updatePromise);
    });

    try {
      await Promise.all(promises);
      console.log("All tasks updated successfully");
    } catch (error) {
      console.log(error);
    }
  });


  exports.checkNotificationIsReadAndUpdateMessages = functions.firestore.document("notifications/{notification_id}").onUpdate((change,context)=>{
    const after = change.after
    const before = change.before

    //here need to do is first check of the notification document is upadated is so then update the messages collection
    if(after.data().isRead !== before.data().isRead){
      const notification = after.data()
      const messageId = notification.messageId
      const receiverId = notification.receiverId
      const senderId = notification.senderId
      const message = notification.message
      const message_sent_at = notification.message_sent_at
      const isRead = notification.isRead
      const notificationId = notification.notificationId

      let messageRef = db.collection("messages").where("messageId","==",messageId)
      return messageRef.set({
        receiverId,
        senderId,
        message,
        message_sent_at,
        isRead:true,
        notificationId
      },{merge:true})
    }
  })

//run the trigger function to save the notification if the task is accepted
exports.onTaskDone= functions.firestore.document("tasks/{taskId}").onUpdate((change,context)=>{
  const after = change.after
  const taskId = context.params.taskId
  const taskDoneByUID = after.data().taskDoneByUID
  const tasksDone = after.data().tasksDone[0]
  const taskStatus = after.data().status
  const taskDoneUserNotes= tasksDone.doneNote
  const reviewsRef = db.collection("reviews").doc(taskId)
  reviewsRef.set({
    taskId,
    taskDoneByUID,
    comment:taskDoneUserNotes,
    taskStatus,
    category:after.data().category,
    title:after.data().title,
    description:after.data().description,
    reviewedBy:after.data().uid
  })
})
