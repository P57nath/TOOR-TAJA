import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export const registerBuyerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .regex(/^[a-zA-Z\s]*$/, { message: "Name can only use letters and spaces." }),
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(/(?=.*[a-z])/, {
      message: "Password must include at least one lowercase letter.",
    }),
  phone: z
    .string()
    .regex(/^01\d{9}$/, { message: "Phone must be 11 digits starting with 01." })
    .optional(),
  age: z
    .number()
    .min(8, { message: "Age must be at least 8." })
    .max(120, { message: "Age must be 120 or below." })
    .optional(),
  status: z
    .enum(["active", "inactive"], {
      message: "Status must be active or inactive.",
    })
    .optional(),
  defaultAddressId: z
    .string()
    .min(1, { message: "Default address ID cannot be empty." })
    .optional(),
});

export const registerSellerSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required." })
    .max(100, { message: "Username cannot exceed 100 characters." }),
  fullName: z
    .string()
    .min(1, { message: "Full name is required." })
    .max(150, { message: "Full name cannot exceed 150 characters." }),
  email: z
    .string()
    .regex(/@aiub\.edu$/, { message: "Email must end with @aiub.edu." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must include at least one uppercase letter.",
    }),
  gender: z.enum(["male", "female"], {
    message: "Gender must be male or female.",
  }),
  phoneNumber: z
    .string()
    .regex(/^\d+$/, { message: "Phone number must contain digits only." }),
  isActive: z
    .enum(["active", "inactive"], {
      message: "Status must be active or inactive.",
    })
    .optional(),
});

export const registerAdminSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(1, { message: "Password is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  nid: z
    .string()
    .min(10, { message: "NID must be at least 10 digits." }),
  role: z.enum(["superadmin", "manager", "support"], {
    message: "Role must be superadmin, manager, or support.",
  }),
  phone: z
    .string()
    .regex(/^01\d{9}$/, { message: "Phone must be 11 digits starting with 01." }),
  isActive: z
    .enum(["active", "inactive"], {
      message: "Status must be active or inactive.",
    })
    .optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterBuyerForm = z.infer<typeof registerBuyerSchema>;
export type RegisterSellerForm = z.infer<typeof registerSellerSchema>;
export type RegisterAdminForm = z.infer<typeof registerAdminSchema>;
