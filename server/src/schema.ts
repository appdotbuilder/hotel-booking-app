
import { z } from 'zod';

// Enums
export const userRoleSchema = z.enum(['admin', 'staff']);
export const bookingStatusSchema = z.enum(['pending', 'confirmed', 'cancelled', 'completed']);
export const paymentStatusSchema = z.enum(['pending', 'partial', 'paid', 'cancelled']);
export const paymentMethodSchema = z.enum(['cash', 'card', 'bank_transfer', 'online']);
export const currencySchema = z.enum(['SAR', 'USD', 'EUR', 'AED']); // SAR (Riyal) as main currency
export const expenseTypeSchema = z.enum(['hotel', 'transport', 'meals', 'guide', 'visa', 'insurance', 'other']);

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  role: userRoleSchema,
  full_name: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Login schema
export const loginInputSchema = z.object({
  username: z.string(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Customer schema
export const customerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().nullable(),
  phone: z.string(),
  address: z.string().nullable(),
  nationality: z.string().nullable(),
  passport_number: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Customer = z.infer<typeof customerSchema>;

export const createCustomerInputSchema = z.object({
  name: z.string(),
  email: z.string().email().nullable(),
  phone: z.string(),
  address: z.string().nullable(),
  nationality: z.string().nullable(),
  passport_number: z.string().nullable()
});

export type CreateCustomerInput = z.infer<typeof createCustomerInputSchema>;

// Hotel schema
export const hotelSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  rating: z.number().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Hotel = z.infer<typeof hotelSchema>;

export const createHotelInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  rating: z.number().min(1).max(5).nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable()
});

export type CreateHotelInput = z.infer<typeof createHotelInputSchema>;

// Service schema
export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  currency: currencySchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

export const createServiceInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  price: z.number().positive(),
  currency: currencySchema
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

// Booking schema
export const bookingSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  hotel_id: z.number(),
  check_in_date: z.coerce.date(),
  check_out_date: z.coerce.date(),
  room_type: z.string(),
  guests_count: z.number().int().positive(),
  total_amount: z.number(),
  currency: currencySchema,
  status: bookingStatusSchema,
  notes: z.string().nullable(),
  created_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Booking = z.infer<typeof bookingSchema>;

export const createBookingInputSchema = z.object({
  customer_id: z.number(),
  hotel_id: z.number(),
  check_in_date: z.coerce.date(),
  check_out_date: z.coerce.date(),
  room_type: z.string(),
  guests_count: z.number().int().positive(),
  total_amount: z.number().positive(),
  currency: currencySchema,
  notes: z.string().nullable(),
  service_ids: z.array(z.number()).optional()
});

export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;

// Booking Services schema (many-to-many)
export const bookingServiceSchema = z.object({
  id: z.number(),
  booking_id: z.number(),
  service_id: z.number(),
  quantity: z.number().int().positive(),
  price: z.number(),
  currency: currencySchema,
  created_at: z.coerce.date()
});

export type BookingService = z.infer<typeof bookingServiceSchema>;

// Payment schema
export const paymentSchema = z.object({
  id: z.number(),
  booking_id: z.number(),
  amount: z.number(),
  currency: currencySchema,
  payment_method: paymentMethodSchema,
  payment_date: z.coerce.date(),
  status: paymentStatusSchema,
  reference_number: z.string().nullable(),
  notes: z.string().nullable(),
  created_by: z.number(),
  created_at: z.coerce.date()
});

export type Payment = z.infer<typeof paymentSchema>;

export const createPaymentInputSchema = z.object({
  booking_id: z.number(),
  amount: z.number().positive(),
  currency: currencySchema,
  payment_method: paymentMethodSchema,
  payment_date: z.coerce.date(),
  reference_number: z.string().nullable(),
  notes: z.string().nullable()
});

export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>;

// Expense schema
export const expenseSchema = z.object({
  id: z.number(),
  booking_id: z.number().nullable(),
  type: expenseTypeSchema,
  description: z.string(),
  amount: z.number(),
  currency: currencySchema,
  expense_date: z.coerce.date(),
  receipt_number: z.string().nullable(),
  notes: z.string().nullable(),
  created_by: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Expense = z.infer<typeof expenseSchema>;

export const createExpenseInputSchema = z.object({
  booking_id: z.number().nullable(),
  type: expenseTypeSchema,
  description: z.string(),
  amount: z.number().positive(),
  currency: currencySchema,
  expense_date: z.coerce.date(),
  receipt_number: z.string().nullable(),
  notes: z.string().nullable()
});

export type CreateExpenseInput = z.infer<typeof createExpenseInputSchema>;

// Travel Agency Settings schema
export const travelSettingsSchema = z.object({
  id: z.number(),
  company_name: z.string(),
  company_address: z.string(),
  company_phone: z.string(),
  company_email: z.string().email(),
  tax_number: z.string().nullable(),
  logo_url: z.string().nullable(),
  default_currency: currencySchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type TravelSettings = z.infer<typeof travelSettingsSchema>;

export const updateTravelSettingsInputSchema = z.object({
  company_name: z.string(),
  company_address: z.string(),
  company_phone: z.string(),
  company_email: z.string().email(),
  tax_number: z.string().nullable(),
  logo_url: z.string().nullable(),
  default_currency: currencySchema
});

export type UpdateTravelSettingsInput = z.infer<typeof updateTravelSettingsInputSchema>;

// Dashboard statistics schema
export const dashboardStatsSchema = z.object({
  total_bookings: z.number(),
  pending_bookings: z.number(),
  total_revenue: z.number(),
  total_expenses: z.number(),
  profit: z.number(),
  currency: currencySchema,
  period: z.string()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Financial report schema
export const financialReportSchema = z.object({
  period: z.string(),
  total_revenue: z.number(),
  total_expenses: z.number(),
  profit: z.number(),
  currency: currencySchema,
  bookings_count: z.number(),
  revenue_by_month: z.array(z.object({
    month: z.string(),
    revenue: z.number(),
    expenses: z.number()
  }))
});

export type FinancialReport = z.infer<typeof financialReportSchema>;

export const reportFilterSchema = z.object({
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  currency: currencySchema.optional()
});

export type ReportFilter = z.infer<typeof reportFilterSchema>;
