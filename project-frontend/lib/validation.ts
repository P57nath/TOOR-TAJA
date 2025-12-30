import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerBuyerSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z\s]*$/),
  email: z.string().email(),
  password: z.string().min(6).regex(/(?=.*[a-z])/),
  phone: z.string().regex(/^01\d{9}$/).optional(),
  age: z.number().min(8).max(120).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  defaultAddressId: z.string().min(1).optional(),
});

export const registerSellerSchema = z.object({
  username: z.string().min(1).max(100),
  fullName: z.string().min(1).max(150),
  email: z.string().regex(/@aiub\.edu$/),
  password: z.string().min(6).regex(/(?=.*[A-Z])/),
  gender: z.enum(["male", "female"]),
  phoneNumber: z.string().regex(/^\d+$/),
  isActive: z.enum(["active", "inactive"]).optional(),
});

export const registerAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: z.string().min(1),
  nid: z.string().min(10),
  role: z.enum(["superadmin", "manager", "support"]),
  phone: z.string().regex(/^01\d{9}$/),
  isActive: z.enum(["active", "inactive"]).optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterBuyerForm = z.infer<typeof registerBuyerSchema>;
export type RegisterSellerForm = z.infer<typeof registerSellerSchema>;
export type RegisterAdminForm = z.infer<typeof registerAdminSchema>;
