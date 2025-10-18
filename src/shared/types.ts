import z from "zod";

export const CustomerSchema = z.object({
  id: z.number().optional(),
  station_id: z.string().min(1, "Station ID is required"),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const CreateCustomerSchema = CustomerSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const UpdateCustomerSchema = CustomerSchema.partial().required({ id: true });

export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
