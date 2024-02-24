// Which platform the training item is being sourced from.
export type BasicAuthentication = {
  email: string;
  apiToken: string;
};

export type Platform = 'confluence' | 'jira' | 'github' | 'google';

// An array of training items, each with a title, URL, body, and ID.
export type TrainingItems = {
  platform: Platform;
  items: TrainingItem[];
};

export type Label = {
  categoryId: number;
  name: string;
};

// Create a type for an array of Label
export type Labels = Label[];
// A single training item which has been normalized from their more nuanced api
// structure.  Each contain a title, URL, body, ID, key, excerpt, and labels.
export interface TrainingItem {
  title: string;
  url: string;
  body: string | null;
  itemId: string;
  id: number | null;
  key: string;
  excerpt: string | '';
  labels: Labels | [];
}

export interface RecommendedItem extends TrainingItem {
  proficiencies: string[] | [];
  tools: string[] | [];
  advancedSkills: string[] | [];
}

export type LabelData = [Label[]];
