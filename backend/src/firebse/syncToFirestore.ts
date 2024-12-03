import { firestoreDB } from './config';

import {
  serializeForFirestore,
  sanitizeMongooseDoc,
} from './serializeForFirestore';

const syncToFirestore = async (
  collectionName: string,
  metadata: {},
  id?: string
): Promise<void> => {
  try {
    const sanitizedData = sanitizeMongooseDoc({ ...metadata });
    const serializedData = serializeForFirestore(sanitizedData);
    const collectionRef = firestoreDB.collection(collectionName);
    const docRef = id ? collectionRef.doc(id) : collectionRef.doc();
    await docRef.set(serializedData);
    setTimeout(async () => {
      await docRef.delete();
    }, 5000);

    console.log(`Document synced to Firestore: ${collectionName}/${docRef.id}`);
  } catch (error) {
    console.error(`Failed to sync to Firestore: ${error}`);
    throw error;
  }
};

export default syncToFirestore;
