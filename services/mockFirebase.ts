import { User, Order } from '../types';

// This service mocks Firebase behavior so the UI works immediately for the user.
// In production, replace these with real firebase/auth and firebase/firestore calls.

export const mockSignIn = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uid: 'mock-user-123',
        email: email,
        displayName: email.split('@')[0]
      });
    }, 1000);
  });
};

export const mockSignOut = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
};

export const mockSaveOrder = async (order: Order): Promise<boolean> => {
  console.log("Saving order to Firestore...", order);
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1500);
  });
};