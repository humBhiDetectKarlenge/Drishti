import { storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadFile(file: File, uid: string): Promise<string> {
  const fileRef = ref(storage, `attachments/${uid}/${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}
