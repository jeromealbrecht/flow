export interface FirestoreUser {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isAdmin: boolean;
}
