export interface Audio {
  readonly id: string;
  title: string;
  description: string;
  audioUrl: string; // <-- Lien vers le fichier dans Firebase Storage
  createdAt: Date;
  assignedTo: string; // l'ID du user qui a uploadé l'audio
}

// Données utilisées pour le formulaire de création ou d'édition d'un audio
export type AudioFormData = Omit<Partial<Audio>, "createdAt">;
// ✨ Explication :
// - Partial<Audio> rend tous les champs optionnels
// - Omit<..., 'createdAt'> enlève le champ `createdAt` car il est géré par le backend
// Résultat : { id?: string, title?: string, description?: string, audioUrl?: string }

export interface AudioList {
  audios: Audio[];
  total: number;
}

export interface ApiResponse<T> {
  data: T; // Données renvoyées par l'API
  success: boolean; // Indique si la requête a été réussie
  message?: string; // Message d'information, utile pour les messages de validation
  errors?: Record<string, string[]>; // utile pour les messages de validation
  meta?: Record<string, unknown>; // ex: pagination, infos supplémentaires
}

// Données utilisées pour la liste d'audios
export type AudioListItem = Audio;
