<?php
require_once __DIR__ . '/../config/db_connect.php';
require_once __DIR__ . '/../models/Cer.php';

// Démarrer la session
session_start();

// Vérifier l'authentification
if (!isset($_SESSION['user_id'])) {
    jsonError('Non authentifié', 401);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    try {
        // Vérifier qu'un fichier a été uploadé
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            jsonError('Aucun fichier uploadé ou erreur lors de l\'upload', 400);
        }

        $file = $_FILES['file'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        
        // Récupérer l'extension du fichier
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        // Extensions autorisées
        $allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];
        
        if (!in_array($fileExt, $allowedExtensions)) {
            jsonError('Type de fichier non autorisé. Formats acceptés: PDF, DOC, DOCX, PPT, PPTX', 400);
        }
        
        // Taille maximale: 10MB
        $maxSize = 10 * 1024 * 1024; // 10MB en bytes
        if ($fileSize > $maxSize) {
            jsonError('Fichier trop volumineux. Taille maximale: 10MB', 400);
        }
        
        // Créer le dossier uploads s'il n'existe pas
        $uploadDir = __DIR__ . '/../uploads/cers/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        // Générer un nom de fichier unique
        $uniqueFileName = uniqid('cer_', true) . '_' . time() . '.' . $fileExt;
        $destination = $uploadDir . $uniqueFileName;
        
        // Déplacer le fichier uploadé
        if (!move_uploaded_file($fileTmpName, $destination)) {
            jsonError('Erreur lors de la sauvegarde du fichier', 500);
        }
        
        // Chemin relatif pour la base de données
        $relativePath = 'uploads/cers/' . $uniqueFileName;
        
        // Si un CER ID est fourni, mettre à jour le CER existant
        if (isset($_POST['cer_id'])) {
            $cerId = (int)$_POST['cer_id'];
            $cerModel = new Cer();
            $cer = $cerModel->find($cerId);
            
            if (!$cer) {
                // Supprimer le fichier uploadé
                unlink($destination);
                jsonError('CER non trouvé', 404);
            }
            
            // Vérifier que l'utilisateur est l'auteur
            if ($cer['author_id'] != $_SESSION['user_id']) {
                unlink($destination);
                jsonError('Non autorisé', 403);
            }
            
            // Supprimer l'ancien fichier s'il existe
            if (!empty($cer['file_path']) && file_exists(__DIR__ . '/../' . $cer['file_path'])) {
                unlink(__DIR__ . '/../' . $cer['file_path']);
            }
            
            // Mettre à jour le CER
            $cerModel->update($cerId, [
                'file_path' => $relativePath,
                'file_type' => $fileExt,
                'file_size' => $fileSize
            ]);
            
            $updatedCer = $cerModel->getComplete($cerId);
            
            jsonSuccess('Fichier uploadé avec succès', [
                'file_path' => $relativePath,
                'file_name' => $uniqueFileName,
                'file_size' => $fileSize,
                'file_type' => $fileExt,
                'cer' => $updatedCer
            ]);
        } else {
            // Retourner juste les infos du fichier (pour création ultérieure de CER)
            jsonSuccess('Fichier uploadé avec succès', [
                'file_path' => $relativePath,
                'file_name' => $uniqueFileName,
                'file_size' => $fileSize,
                'file_type' => $fileExt
            ]);
        }
        
    } catch (Exception $e) {
        error_log("Upload Error: " . $e->getMessage());
        jsonError('Erreur lors de l\'upload', 500, $e->getMessage());
    }
} elseif ($method === 'DELETE') {
    // Supprimer un fichier
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['file_path'])) {
        jsonError('Chemin du fichier requis', 400);
    }
    
    $filePath = __DIR__ . '/../' . $data['file_path'];
    
    if (file_exists($filePath)) {
        if (unlink($filePath)) {
            jsonSuccess('Fichier supprimé avec succès');
        } else {
            jsonError('Erreur lors de la suppression du fichier', 500);
        }
    } else {
        jsonError('Fichier non trouvé', 404);
    }
} else {
    jsonError('Méthode non autorisée', 405);
}
