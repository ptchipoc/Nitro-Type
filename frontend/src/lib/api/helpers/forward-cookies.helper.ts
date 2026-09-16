import { cookies } from "next/headers";

export async function forwardCookiesToBrowser(headers: Headers): Promise<void> {
  const setCookieHeader = headers.get("set-cookie");
  if (!setCookieHeader) return;

  const cookieStore = await cookies();

  const cookieList = setCookieHeader.split(/,(?=\s*\w+=)/);

  for (const rawCookie of cookieList) {
    const parts = rawCookie
      .trim()
      .split(";")
      .map((p) => p.trim());
    const [name, value] = parts[0].split("=");
    const attrs = parts.slice(1);

    const getAttr = (key: string) =>
      attrs.find((a) => a.toLowerCase().startsWith(key.toLowerCase()));

    cookieStore.set({
      name: name.trim(),
      value: value?.trim() ?? "",
      httpOnly: attrs.some((a) => a.toLowerCase() === "httponly"),
      secure: attrs.some((a) => a.toLowerCase() === "secure"),
      sameSite:
        (getAttr("samesite")?.split("=")[1]?.trim()?.toLowerCase() as
          | "strict"
          | "lax"
          | "none") ?? "lax",
      path: getAttr("path")?.split("=")[1]?.trim() ?? "/",
      maxAge: Number(getAttr("max-age")?.split("=")[1]) || undefined,
    });
  }
}
