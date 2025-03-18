"use client";

import { AdminGuard } from "@/components/AdminGuard";
import { useEffect, useState, useRef } from "react";
import {
  getAllUsers,
  updateUserRole,
  UserRole,
  Recording,
} from "@/lib/firebase/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Loader2 } from "lucide-react";
import { updateDoc, doc, getFirestore } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function AdminPage() {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);
  const [uploadingUserId, setUploadingUserId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const db = getFirestore();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminToggle = async (userId: string, newStatus: boolean) => {
    try {
      await updateUserRole(userId, newStatus);
      await loadUsers(); // Recharger la liste après la mise à jour
    } catch (err) {
      console.error("Erreur lors de la mise à jour du rôle:", err);
      setError("Erreur lors de la mise à jour du rôle");
    }
  };

  const handleUploadClick = (user: UserRole) => {
    setSelectedUser(user);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedUser?.uid) return;

    try {
      setUploadingUserId(selectedUser.uid);
      setUploadProgress(0);

      // Au lieu d'uploader directement le fichier, nous allons simuler un upload réussi
      // et stocker uniquement les métadonnées

      // Génération d'un ID unique pour l'enregistrement
      const recordingId = uuidv4();

      // Création d'un nouvel enregistrement sans l'URL audio réelle
      const newRecording: Recording = {
        id: recordingId,
        title: file.name.replace(/\.[^/.]+$/, ""), // Enlever l'extension
        createdAt: new Date(),
        status: "published",
        // On simule une URL audio (ce sera ajouté ultérieurement via Firebase Console)
        audioUrl: `https://firebasestorage.googleapis.com/v0/b/cdson-24c90.appspot.com/o/audio%2F${
          selectedUser.uid
        }%2F${recordingId}_${encodeURIComponent(file.name)}`,
      };

      // Simulation de progression d'upload
      setUploadProgress(50);

      // Vérifier si l'utilisateur a déjà des enregistrements
      let userRecordings = selectedUser.recordings || [];

      // Si c'est juste l'enregistrement par défaut, on le remplace
      if (
        userRecordings.length === 1 &&
        userRecordings[0].title === "Pas encore de titre enregistré"
      ) {
        userRecordings = [newRecording];
      } else {
        // Sinon on ajoute le nouvel enregistrement
        userRecordings = [...userRecordings, newRecording];
      }

      // Mettre à jour le document utilisateur
      await updateDoc(doc(db, "users", selectedUser.uid), {
        recordings: userRecordings,
      });

      // Recharger les utilisateurs
      await loadUsers();

      setUploadProgress(100);
      setTimeout(() => {
        setUploadingUserId(null);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      console.error("Erreur lors de l'upload du fichier:", err);
      setError("Erreur lors de l'upload du fichier");
      setUploadingUserId(null);
    }

    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Administration</h1>
          <p>Chargement...</p>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Administration</h1>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileUpload}
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Enregistrements</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">
                    {user.displayName || "Sans nom"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastLogin.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {user.recordings &&
                    user.recordings.length === 1 &&
                    user.recordings[0].title ===
                      "Pas encore de titre enregistré"
                      ? "0"
                      : user.recordings?.length || "0"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? "default" : "secondary"}>
                      {user.isAdmin ? "Admin" : "Utilisateur"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isAdmin}
                      onCheckedChange={(checked) =>
                        user.uid && handleAdminToggle(user.uid, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleUploadClick(user)}
                      disabled={uploadingUserId === user.uid}
                    >
                      {uploadingUserId === user.uid ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <Music className="h-4 w-4" />
                          Ajouter une piste
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminGuard>
  );
}
