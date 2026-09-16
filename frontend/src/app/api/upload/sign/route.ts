// src/app/api/upload/sign/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json(
        { error: "Cloudinary env vars em falta" },
        { status: 500 },
      );
    }

    const { folder } = await req.json();
    const resolvedFolder = folder ?? "NT/avatars";
    const timestamp = Math.round(Date.now() / 1000);

    // Assina apenas folder + timestamp (sem upload_preset).
    // Os parâmetros TÊM de estar em ordem alfabética.
    const paramsToSign = `folder=${resolvedFolder}&timestamp=${timestamp}`;

    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      folder: resolvedFolder,
      apiKey,
      cloudName,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao gerar assinatura" },
      { status: 500 },
    );
  }
}
