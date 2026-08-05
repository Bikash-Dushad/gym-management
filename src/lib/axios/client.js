"use client";
import { createApiInstance, makeHelpers } from "./base";

const Instance = createApiInstance();

export const { getData, postData } = makeHelpers(Instance);
