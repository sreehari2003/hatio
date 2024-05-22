import { z } from "zod";

export const authSchema = z.object({
  email: z.string({ message: "Email is required" }).email(),
  password: z.string({ message: "Description is required" }).min(6).max(14),
});

export interface Prop {
  toggleOption: () => void;
}
