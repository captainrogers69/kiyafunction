import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
const app = admin.initializeApp();
// const app = !admin.apps.length ? admin.initializeApp() : admin.app();

const db = app.firestore();
const fcm = app.messaging();

export const notificationManager = functions.firestore
  .document("chatroom/{chatRoomId}/chats/{chatID}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const userData = await db
      .collection("users")
      .where("number", "==", data.recievedBy)
      .get();
    const tokens = userData.docs.map((snap) => {
      return snap.data().token;
    });
    return fcm.sendMulticast({
      tokens: tokens,

      notification: {
        title: "kiya konnect",

        body: `${data.message} by ${data.sendByName}`,

        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/chatspro-364e3.appspot.com/o/appiconkk.png?alt=media&token=e461c545-78d6-4329-bc19-14f74212c2ec",
      },
    });
  });

export const groupNotificationManager = functions.firestore
  .document("groups/{groupID}/chats/{chatID}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const group = context.params.groupID;
    const usersFromGroup = await db.collection("groups").doc(group).get();
    const users = usersFromGroup.data()!.members;
    const filteredUsers = users.filter(
      (user: { number: any }) => user.number != data.sendBy
    );

    const tokens = filteredUsers.map((snap: { token: any }) => {
      return snap.token;
    });

    return fcm.sendMulticast({
      tokens: tokens,

      notification: {
        title: "kiya konnect",

        body: `${data.message} by ${data.sendByName}`,

        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/chatspro-364e3.appspot.com/o/appiconkk.png?alt=media&token=e461c545-78d6-4329-bc19-14f74212c2ec",
      },
    });
  });
