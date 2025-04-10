"use client";

import { useState, useEffect } from "react";
import {
  getAudios,
  createAudio,
  getUsers,
  updateAudio,
} from "../hooks/AudioManagement";
import { Audio } from "../types/audio";
import { FirestoreUser } from "../types/firestoreUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Music, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const AudioFrontManagement = () => {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedAudios, fetchedUsers] = await Promise.all([
          getAudios(),
          getUsers(),
        ]);
        setAudios(fetchedAudios || []);
        setUsers(fetchedUsers || []);
      } catch (error: unknown) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Impossible de charger les données", {
          description:
            error instanceof Error ? error.message : "Erreur inconnue",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = async (file: File) => {
    const uploadPromise = new Promise<string>(async (resolve, reject) => {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Erreur lors de l'upload");
        }

        const newAudio: Omit<Audio, "id"> = {
          title: file.name,
          description: "Ajouté automatiquement",
          audioUrl: data.url,
          createdAt: new Date(),
          assignedTo: user?.id || "",
        };

        const createResponse = await createAudio(newAudio);
        if (createResponse.success) {
          setAudios([...audios, createResponse.data]);
          resolve("Audio ajouté avec succès");
        } else {
          reject(new Error("Échec de la création de l'audio"));
        }
      } catch (error: unknown) {
        console.error("Erreur d'upload:", error);
        reject(error instanceof Error ? error.message : "Erreur inconnue");
      } finally {
        setUploading(false);
      }
    });

    toast.promise(uploadPromise, {
      loading: "Upload en cours...",
      success: (message: string) => message as string,
      error: (error: Error) => `Erreur lors de l'upload: ${error.message}`,
    });
  };

  const handleAssignAudio = async (audioId: string, userId: string) => {
    const assignPromise = new Promise<string>(async (resolve, reject) => {
      try {
        const audioToUpdate = audios.find((a) => a.id === audioId);
        if (!audioToUpdate) {
          reject(new Error("Audio non trouvé"));
          return;
        }

        const response = await updateAudio(audioId, {
          ...audioToUpdate,
          assignedTo: userId,
        });

        if (response.success) {
          setAudios(
            audios.map((a) =>
              a.id === audioId ? { ...a, assignedTo: userId } : a
            )
          );
          const targetUser = users.find((u) => u.id === userId);
          resolve(
            `Audio attribué à ${
              targetUser?.displayName || targetUser?.email || userId
            }`
          );
        } else {
          reject(new Error("Échec de l'attribution"));
        }
      } catch (error: unknown) {
        console.error("Erreur lors de l'attribution:", error);
        reject(new Error("Impossible d'attribuer l'audio"));
      }
    });

    toast.promise(assignPromise, {
      loading: "Attribution en cours...",
      success: (message: string) => message as string,
      error: (error: Error) => `Erreur: ${error.message}`,
    });
  };

  // Filtrer les audios selon l'utilisateur sélectionné
  const filteredAudios =
    selectedUser === "all"
      ? audios
      : audios.filter((audio) => audio.assignedTo === selectedUser);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des audios...</p>
        </div>
      </div>
    );

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle>Gestion des audios</CardTitle>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par utilisateur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les utilisateurs</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.displayName || user.email || `Utilisateur ${user.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "audio/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFileUpload(file);
            };
            input.click();
          }}
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Upload en cours..." : "Ajouter un audio"}
        </Button>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {filteredAudios.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-muted-foreground py-8"
            >
              <Music className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">
                {selectedUser === "all"
                  ? "Aucun audio disponible. Cliquez sur le bouton pour ajouter !"
                  : "Aucun audio trouvé pour cet utilisateur."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredAudios.map((audio) => (
                <motion.div
                  key={audio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{audio.title}</CardTitle>
                      <Select
                        value={audio.assignedTo}
                        onValueChange={(value) =>
                          handleAssignAudio(audio.id, value)
                        }
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Attribuer à un utilisateur" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.displayName ||
                                user.email ||
                                `Utilisateur ${user.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardHeader>
                    <CardContent>
                      <audio
                        controls
                        src={audio.audioUrl}
                        preload="metadata"
                        controlsList="nodownload"
                        className="w-full"
                      >
                        <source src={audio.audioUrl} type="audio/mpeg" />
                        Votre navigateur ne supporte pas la lecture audio.
                      </audio>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AudioFrontManagement;
