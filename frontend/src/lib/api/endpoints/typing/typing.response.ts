import { ApiEnvelope } from "../../api";
import { TypingSection, TypingSessionResult } from "./typing.type";

export type TypingSectionResponse = ApiEnvelope<TypingSection>;

export type TypingSessionResultResponse = ApiEnvelope<TypingSessionResult>;

export type TypingUserResultsResponse = ApiEnvelope<TypingSessionResult[]>;
