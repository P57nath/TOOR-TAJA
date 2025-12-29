import axios, { type AxiosInstance } from "axios";
import { z } from "zod";

const client: AxiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterBuyerPayload = z.infer<typeof registerBuyerSchema>;
export type RegisterSellerPayload = z.infer<typeof registerSellerSchema>;
export type RegisterAdminPayload = z.infer<typeof registerAdminSchema>;

export type LoginResponse = {
  access_token: string;
};

export type RegisterBuyerResponse = {
  message: string;
  buyerId: string;
  email: string;
};

export type RegisterSellerResponse = {
  message: string;
  sellerId: string;
  email: string;
};

export type RegisterAdminResponse = {
  message: string;
  adminId: string;
  email: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const validated = loginSchema.parse(payload);
  const response = await client.post<LoginResponse>("/auth/login", validated);
  return response.data;
}

export async function registerBuyer(
  payload: RegisterBuyerPayload,
): Promise<RegisterBuyerResponse> {
  const validated = registerBuyerSchema.parse(payload);
  const response = await client.post<RegisterBuyerResponse>(
    "/api/auth/register/buyer",
    validated,
    { headers: { "Content-Type": "application/json" } },
  );
  return response.data;
}

export async function registerSeller(payload: RegisterSellerPayload): Promise<RegisterSellerResponse> {
  const validated = registerSellerSchema.parse(payload);
  const response = await client.post<RegisterSellerResponse>(
    "/api/auth/register/seller",
    validated,
    { headers: { "Content-Type": "application/json" } },
  );
  return response.data;
}

export async function registerAdmin(
  payload: RegisterAdminPayload,
  profileFile?: File,
): Promise<RegisterAdminResponse> {
  const validated = registerAdminSchema.parse(payload);
  const formData = new FormData();
  formData.append("email", validated.email);
  formData.append("password", validated.password);
  formData.append("name", validated.name);
  formData.append("nid", validated.nid);
  formData.append("role", validated.role);
  formData.append("phone", String(validated.phone));
  if (validated.isActive) {
    formData.append("isActive", validated.isActive);
  }
  if (profileFile) {
    formData.append("profileFile", profileFile);
  }
  const response = await client.post<RegisterAdminResponse>(
    "/api/auth/register/admin",
    formData,
  );
  return response.data;
}
