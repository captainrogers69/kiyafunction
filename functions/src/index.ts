import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
const app = admin.initializeApp();
// const app = !admin.apps.length ? admin.initializeApp() : admin.app();

// const db = app.firestore();
const fcm = app.messaging();

export const notificationManager = functions.firestore
  .document("chatroom/{chatRoomId}/chats/{chatID}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    // const userData = await db
    //   .collection("users")
    //   .where("number", "==", data.recievedBy)
    //   .get();
    // const tokens = userData.docs.map((snap) => {
    //   return snap.data().token;
    // });
    const payload = {
      token:
        "dJhkHqscQLaxlZwDvWRcQs:APA91bEUJi0vTGty_GaJzhOVx65XP1Hr82xyprSD87iBJRl_vT4lCPQwcYggz09IluRngq-NXJbxNfOzPde-pTAmJySLvDNcQ7pHMHKIbvr0KUiiWJX3cYq4FWcensyG9IYpx7N1zH1p",
      notification: {
        title: "New Order!",
        body: `you got a message from ${data.sendByName} & ${data.message}`,
        icon: "@mipmap/launcher_icon",
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
    };
    return fcm.send(payload);
  });
