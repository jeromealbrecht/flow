"use client";

import { useState, useEffect } from "react";
import { getAudios, createAudio } from "../hooks/AudioManagement";
import { uploadAudioFile } from "../hooks/uploadAudioFile"; // à créer
import { Audio } from "../types/audio";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth"; // Ajout du hook d'authentification

const AudioFrontManagement = () => {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Récupération de l'utilisateur connecté

  useEffect(() => {
    const fetchAudios = async () => {
      const fetched = await getAudios();
      setAudios(fetched || []);
      setLoading(false);
    };
    fetchAudios();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const audioUrl = await uploadAudioFile(file);

    const newAudio: Omit<Audio, "id"> = {
      title: file.name,
      description: "Ajouté automatiquement",
      audioUrl: audioUrl,
      createdAt: new Date(),
      assignedTo: user.id, // Ajout de l'ID de l'utilisateur
    };

    const response = await createAudio(newAudio);
    if (response.success) {
      setAudios([...audios, response.data]);
    }
  };

  if (loading) return <div>Chargement des audios...</div>;

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Gestion des audios</CardTitle>
      </CardHeader>
      <CardContent>
        {audios.map((audio) => (
          <Card key={audio.id} className="mb-4">
            <CardHeader>
              <CardTitle>{audio.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <audio
                controls
                src={audio.audioUrl}
                preload="metadata"
                controlsList="nodownload"
                crossOrigin="anonymous"
              >
                <source src={audio.audioUrl} type="audio/mpeg" />
                <source src={audio.audioUrl} type="audio/wav" />
                Votre navigateur ne supporte pas la lecture audio.
              </audio>
            </CardContent>
          </Card>
        ))}

        {/* Champ caché + bouton déclencheur */}
        <input
          type="file"
          accept="audio/*"
          id="audio-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          onClick={() => document.getElementById("audio-upload")?.click()}
          disabled={!user} // Désactiver le bouton si l'utilisateur n'est pas connecté
        >
          Ajouter un audio
        </button>
      </CardContent>
    </Card>
  );
};

export default AudioFrontManagement;
