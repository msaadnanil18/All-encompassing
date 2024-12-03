// // const firestoreData = {
// //   ...(savedRequest as any)._doc,
// //   _id: savedRequest._id.toString(),
// // };

// // const collectionRef = firestoreDB.collection('component');
// // const docRef = collectionRef.doc();
// // await docRef.set(firestoreData);

// // const firestoreDocRef = doc(collection(firestoreDB, 'component'));
// // await setDoc(firestoreDocRef, {
// //   savedRequest,
// // });

// // const firestoreDocRef = doc(collection(firestoreDB, 'forms')); // 'forms' is a Firestore collection
// // await setDoc(firestoreDocRef, {
// //   ...savedRequest.toObject(),
// //   id: savedRequest._id,
// // });

// import { asyncHandler } from '../../utils/asyncHandler';
// import { Component } from '../../models/conmponent.medel';
// import dayjs from 'dayjs';
// import { collection, doc, setDoc } from 'firebase/firestore';
// import { firestoreDB } from '../../firebse';
// import mongoose from 'mongoose';
// import { debounce } from 'lodash-es';
// import { log } from 'console';

// const serializeForFirestore: any = (obj: any) => {
//   if (Array.isArray(obj)) {
//     return obj.map(serializeForFirestore);
//   } else if (obj && typeof obj === 'object') {
//     return Object.fromEntries(
//       Object.entries(obj).map(([key, value]) => [
//         key,
//         value instanceof mongoose.Types.ObjectId
//           ? value.toString()
//           : serializeForFirestore(value),
//       ])
//     );
//   }
//   return obj;
// };

// const deleteFirestoreDoc = debounce(async (docRef) => {
//   await docRef.delete();
// }, 5000);

// const firebaseReq = asyncHandler(async (req, res) => {
//   const { message } = req.body;

//   try {
//     const savedRequest = await Component.create({
//       message,
//       name: dayjs().toISOString(),
//       timestamp: new Date(),
//     });

//     const collectionRef = firestoreDB.collection('component');
//     const docRef = collectionRef.doc();
//     await docRef.set({
//       ...serializeForFirestore((savedRequest as any)._doc),
//     });

//     res.status(200).send({ success: true, id: savedRequest._id });
//     deleteFirestoreDoc(docRef);

//     // setTimeout(async () => {
//     //   await docRef.delete();
//     // }, 5000);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false, error: error });
//   }
// });

// export { firebaseReq };
