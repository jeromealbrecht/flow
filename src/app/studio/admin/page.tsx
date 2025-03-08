"use client";

import { AdminGuard } from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, UserRole } from "@/lib/firebase/admin";
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

export default function AdminPage() {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Admin</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminGuard>
  );
}
