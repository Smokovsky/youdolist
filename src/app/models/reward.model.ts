export interface Reward {
  id?: string;
  name?: string;
  description?: string;
  points?: number;
  isApproved?: boolean;
  position?: number;

  authorId?: string;
  creationDate?: any;
  lastEditorId?: string;
  lastEditDate?: any;
  completitorId?: string;
  completitionDate?: any;
}
