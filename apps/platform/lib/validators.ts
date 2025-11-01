import { z } from "zod";

export const serviceRequestSchema = z.object({
  tenantSlug: z.string().min(2),
  serviceType: z.enum(["home_clean", "pressure_wash", "auto_detail", "custom"]),
  squareFootage: z.number().min(200).max(8000).optional(),
  location: z.object({
    addressLine1: z.string().min(3),
    addressLine2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().length(2),
    postalCode: z.string().min(5),
    lat: z.number().optional(),
    lng: z.number().optional()
  }),
  contact: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10)
  }),
  preferredWindows: z
    .array(
      z.object({
        start: z.string(),
        end: z.string()
      })
    )
    .min(1),
  surfaces: z.array(z.string()).min(1),
  notes: z.string().optional()
});

export type ServiceRequestPayload = z.infer<typeof serviceRequestSchema>;
