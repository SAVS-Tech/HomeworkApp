export interface SelfCareTip {
  id: string;
  text: string;
  active: boolean;
  author?: string;
  isShared?: boolean;
  createdAt?: string;
  firebaseId?: string;
}
