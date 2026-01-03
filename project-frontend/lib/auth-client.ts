import { z } from "zod";

import { apiClient, appClient } from "./http";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerBuyerFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  phone: z.string().min(10, "Phone number is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSellerFormSchema = z.object({
  storeName: z.string().min(2, "Store name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerAdminFormSchema = z.object({
  displayName: z.string().min(2, "Display name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is missing."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const registerBuyerPayloadSchema = z.object({
  email: registerBuyerFormSchema.shape.email,
  password: registerBuyerFormSchema.shape.password,
  role: z.literal("BUYER"),
  buyerProfile: z.object({
    fullName: registerBuyerFormSchema.shape.fullName,
    phone: registerBuyerFormSchema.shape.phone,
  }),
});

const registerSellerPayloadSchema = z.object({
  email: registerSellerFormSchema.shape.email,
  password: registerSellerFormSchema.shape.password,
  role: z.literal("SELLER"),
  sellerProfile: z.object({
    storeName: registerSellerFormSchema.shape.storeName,
  }),
});

const registerAdminPayloadSchema = z.object({
  email: registerAdminFormSchema.shape.email,
  password: registerAdminFormSchema.shape.password,
  role: z.literal("ADMIN"),
  adminProfile: z.object({
    displayName: registerAdminFormSchema.shape.displayName,
  }),
});

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterBuyerForm = z.infer<typeof registerBuyerFormSchema>;
export type RegisterSellerForm = z.infer<typeof registerSellerFormSchema>;
export type RegisterAdminForm = z.infer<typeof registerAdminFormSchema>;
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

export type LoginResponse = {
  role: "buyer" | "seller" | "admin";
};

export type RegisterResponse = {
  message?: string;
  [key: string]: unknown;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const validated = loginSchema.parse(payload);
  const response = await appClient.post<LoginResponse>(
    "/api/auth/login",
    validated,
  );
  return response.data;
}

export async function registerBuyer(
  payload: RegisterBuyerForm,
): Promise<RegisterResponse> {
  const validated = registerBuyerFormSchema.parse(payload);
  const requestBody = registerBuyerPayloadSchema.parse({
    email: validated.email,
    password: validated.password,
    role: "BUYER",
    buyerProfile: {
      fullName: validated.fullName,
      phone: validated.phone,
    },
  });
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    requestBody,
  );
  return response.data;
}

export async function registerSeller(
  payload: RegisterSellerForm,
): Promise<RegisterResponse> {
  const validated = registerSellerFormSchema.parse(payload);
  const requestBody = registerSellerPayloadSchema.parse({
    email: validated.email,
    password: validated.password,
    role: "SELLER",
    sellerProfile: {
      storeName: validated.storeName,
    },
  });
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    requestBody,
  );
  return response.data;
}

export async function registerAdmin(
  payload: RegisterAdminForm,
): Promise<RegisterResponse> {
  const validated = registerAdminFormSchema.parse(payload);
  const requestBody = registerAdminPayloadSchema.parse({
    email: validated.email,
    password: validated.password,
    role: "ADMIN",
    adminProfile: {
      displayName: validated.displayName,
    },
  });
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    requestBody,
  );
  return response.data;
}

export async function requestPasswordReset(
  payload: ForgotPasswordPayload,
): Promise<RegisterResponse> {
  const validated = forgotPasswordSchema.parse(payload);
  const response = await apiClient.post<RegisterResponse>(
    "/auth/password/forgot",
    validated,
  );
  return response.data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<RegisterResponse> {
  const validated = resetPasswordSchema.parse(payload);
  const response = await apiClient.post<RegisterResponse>(
    "/auth/password/reset",
    validated,
  );
  return response.data;
}
