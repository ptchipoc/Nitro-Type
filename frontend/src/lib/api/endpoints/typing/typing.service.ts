import {
  activateSession,
  createSection,
  getResult,
  getSection,
  getUserResults,
  submitSession,
} from "./typing.feature";
import { CreateSectionInput, SubmitSessionInput } from "./typing.input";

export async function fetchSection(id: string) {
  const response = await getSection(id);
  if (!response.success) {
    throw new Error("Failed to fetch section");
  }
  return response.data;
}


export async function fetchSubmitSession(input: SubmitSessionInput) {
  const response = await submitSession(input);
  if (!response.success) {
    console.log("Failed to submit session", response);
    throw new Error("Failed to submit session");
  }
  return response.data;
}

export async function fetchResult(id: string) {
  const response = await getResult(id);
  if (!response.success) {
    throw new Error("Failed to fetch result");
  }
  return response.data;
}

export async function fetchUserResults() {
  const response = await getUserResults();
  if (!response.success) {
    throw new Error("Failed to fetch user results");
  }
  return response.data;
}

export async function fetchActivateSession(id: string) {
  const response = await activateSession(id);
  if (!response.success) {
    throw new Error("Failed to activate session");
  }
  return response.data;
}
