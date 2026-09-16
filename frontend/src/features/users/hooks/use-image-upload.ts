// src/hooks/use-image-upload.ts
"use client";
import { useState } from "react";

interface UploadResult {
  url: string;
  publicId: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<UploadResult | null> => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      // 1. Pede assinatura ao Next.js (sem upload_preset)
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "NT/avatars" }),
      });

      if (!signRes.ok) {
        const body = await signRes.json().catch(() => ({}));
        throw new Error(body?.error ?? "Falha ao gerar assinatura");
      }

      const { signature, timestamp, folder, apiKey, cloudName } =
        await signRes.json();

      // 2. Faz upload directo para Cloudinary (signed, sem preset)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey);
      formData.append("signature", signature);

      // XMLHttpRequest para ter progresso real
      const result = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            resolve({ url: data.secure_url, publicId: data.public_id });
          } else {
            // Mostra o erro real do Cloudinary
            let message = `Upload falhou (${xhr.status})`;
            try {
              const errData = JSON.parse(xhr.responseText);
              if (errData?.error?.message) message = errData.error.message;
            } catch { }
            reject(new Error(message));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Erro de rede")));

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        );
        xhr.send(formData);
      });

      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro no upload";
      setError(msg);
      console.error("[useImageUpload]", msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, progress, error };
}
