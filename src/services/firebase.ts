import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  getDocFromServer,
} from 'firebase/firestore';
import { AppLink } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must pass firestoreDatabaseId if configured
export const db = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Error Handling according to Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection check
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using local cached data.');
      return false;
    }
    return true;
  }
}

/**
 * Sanitizes link object to strictly conform to Firestore schema
 */
export function sanitizeLink(link: AppLink, orderIndex?: number): Record<string, any> {
  const cleanId = String(link.id || `link-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const data: Record<string, any> = {
    id: cleanId,
    title: String(link.title || 'Aplikasi Muzik').slice(0, 200),
    category: String(link.category || 'Kesenian & Muzik').slice(0, 100),
    url: String(link.url || '#').slice(0, 2048),
    description: String(link.description || '').slice(0, 1000),
    iconName: String(link.iconName || 'Music').slice(0, 100),
    color: String(link.color || 'blue').slice(0, 50),
    isFavorite: Boolean(link.isFavorite),
    isActive: link.isActive !== false,
    lastUpdated: link.lastUpdated || new Date().toISOString().split('T')[0],
  };

  if (link.subCategory) {
    data.subCategory = String(link.subCategory).slice(0, 100);
  }
  if (link.badgeText) {
    data.badgeText = String(link.badgeText).slice(0, 100);
  }
  if (typeof orderIndex === 'number') {
    data.order = orderIndex;
  }

  return data;
}

/**
 * Real-time subscription to links collection
 */
export function subscribeToLinks(
  onSuccess: (links: AppLink[]) => void,
  onError?: (err: any) => void
): () => void {
  const collectionPath = 'links';
  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const items: AppLink[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        items.push({
          id: data.id || d.id,
          title: data.title,
          category: data.category,
          subCategory: data.subCategory || undefined,
          description: data.description || '',
          url: data.url,
          iconName: data.iconName || 'Music',
          color: data.color || 'blue',
          isFavorite: Boolean(data.isFavorite),
          isActive: data.isActive !== false,
          badgeText: data.badgeText || undefined,
          lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0],
        });
      });

      // Sort by title or order if available
      items.sort((a, b) => a.title.localeCompare(b.title, 'ms'));
      onSuccess(items);
    },
    (error) => {
      console.warn('Firestore subscription error (continuing with local cache):', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Saves or updates a link in Firestore
 */
export async function saveLinkToFirestore(link: AppLink): Promise<void> {
  const cleanId = String(link.id || `link-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `links/${cleanId}`;
  try {
    const payload = sanitizeLink({ ...link, id: cleanId });
    await setDoc(doc(db, 'links', cleanId), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes a link from Firestore
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  const cleanId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `links/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'links', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time subscription to custom categories
 */
export function subscribeToCategories(
  onSuccess: (categories: string[]) => void,
  onError?: (err: any) => void
): () => void {
  const collectionPath = 'categories';
  return onSnapshot(
    collection(db, collectionPath),
    (snapshot) => {
      const cats: { name: string; order: number }[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (data.name) {
          cats.push({ name: data.name, order: typeof data.order === 'number' ? data.order : 999 });
        }
      });
      cats.sort((a, b) => a.order - b.order);
      onSuccess(cats.map((c) => c.name));
    },
    (error) => {
      console.warn('Categories subscription error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Saves a category to Firestore
 */
export async function saveCategoryToFirestore(name: string, order = 0): Promise<void> {
  const cleanId = name.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `categories/${cleanId}`;
  try {
    await setDoc(doc(db, 'categories', cleanId), { name, order }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes a category from Firestore
 */
export async function deleteCategoryFromFirestore(name: string): Promise<void> {
  const cleanId = name.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `categories/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'categories', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Batch seeds initial default links to Firestore if collection is empty
 */
export async function seedInitialLinksIfEmpty(defaultLinks: AppLink[]): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, 'links'));
    if (!snap.empty) {
      return false; // Already has data in cloud
    }

    console.log(`Pangkalan data awan kosong. Memulakan penyegerakan ${defaultLinks.length} pautan rasmi SSeMJ...`);
    const batch = writeBatch(db);
    defaultLinks.forEach((link, idx) => {
      const cleanId = String(link.id).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
      const docRef = doc(db, 'links', cleanId);
      batch.set(docRef, sanitizeLink(link, idx));
    });
    await batch.commit();
    console.log('Semua pautan rasmi SSeMJ berjaya disegerakkan ke pangkalan data awan Firestore!');
    return true;
  } catch (error) {
    console.warn('Gagal memulakan seed awal Firestore (meneruskan mod luar talian):', error);
    return false;
  }
}
