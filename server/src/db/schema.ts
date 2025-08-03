
import { serial, text, pgTable, timestamp, numeric, integer, pgEnum, boolean, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'staff']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'partial', 'paid', 'cancelled']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'card', 'bank_transfer', 'online']);
export const currencyEnum = pgEnum('currency', ['SAR', 'USD', 'EUR', 'AED']);
export const expenseTypeEnum = pgEnum('expense_type', ['hotel', 'transport', 'meals', 'guide', 'visa', 'insurance', 'other']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  full_name: text('full_name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Customers table
export const customersTable = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address'),
  nationality: varchar('nationality', { length: 100 }),
  passport_number: varchar('passport_number', { length: 50 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Hotels table
export const hotelsTable = pgTable('hotels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  rating: integer('rating'), // 1-5 stars
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Services table
export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Bookings table
export const bookingsTable = pgTable('bookings', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull(),
  hotel_id: integer('hotel_id').notNull(),
  check_in_date: timestamp('check_in_date').notNull(),
  check_out_date: timestamp('check_out_date').notNull(),
  room_type: text('room_type').notNull(),
  guests_count: integer('guests_count').notNull(),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  status: bookingStatusEnum('status').default('pending').notNull(),
  notes: text('notes'),
  created_by: integer('created_by').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Booking Services junction table
export const bookingServicesTable = pgTable('booking_services', {
  id: serial('id').primaryKey(),
  booking_id: integer('booking_id').notNull(),
  service_id: integer('service_id').notNull(),
  quantity: integer('quantity').default(1).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Payments table
export const paymentsTable = pgTable('payments', {
  id: serial('id').primaryKey(),
  booking_id: integer('booking_id').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  payment_date: timestamp('payment_date').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  reference_number: varchar('reference_number', { length: 100 }),
  notes: text('notes'),
  created_by: integer('created_by').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Expenses table
export const expensesTable = pgTable('expenses', {
  id: serial('id').primaryKey(),
  booking_id: integer('booking_id'), // Can be null for general expenses
  type: expenseTypeEnum('type').notNull(),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  expense_date: timestamp('expense_date').notNull(),
  receipt_number: varchar('receipt_number', { length: 100 }),
  notes: text('notes'),
  created_by: integer('created_by').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Travel agency settings table
export const travelSettingsTable = pgTable('travel_settings', {
  id: serial('id').primaryKey(),
  company_name: text('company_name').notNull(),
  company_address: text('company_address').notNull(),
  company_phone: varchar('company_phone', { length: 20 }).notNull(),
  company_email: varchar('company_email', { length: 255 }).notNull(),
  tax_number: varchar('tax_number', { length: 50 }),
  logo_url: text('logo_url'),
  default_currency: currencyEnum('default_currency').default('SAR').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  bookings: many(bookingsTable),
  payments: many(paymentsTable),
  expenses: many(expensesTable)
}));

export const customersRelations = relations(customersTable, ({ many }) => ({
  bookings: many(bookingsTable)
}));

export const hotelsRelations = relations(hotelsTable, ({ many }) => ({
  bookings: many(bookingsTable)
}));

export const servicesRelations = relations(servicesTable, ({ many }) => ({
  bookingServices: many(bookingServicesTable)
}));

export const bookingsRelations = relations(bookingsTable, ({ one, many }) => ({
  customer: one(customersTable, {
    fields: [bookingsTable.customer_id],
    references: [customersTable.id]
  }),
  hotel: one(hotelsTable, {
    fields: [bookingsTable.hotel_id],
    references: [hotelsTable.id]
  }),
  createdBy: one(usersTable, {
    fields: [bookingsTable.created_by],
    references: [usersTable.id]
  }),
  bookingServices: many(bookingServicesTable),
  payments: many(paymentsTable),
  expenses: many(expensesTable)
}));

export const bookingServicesRelations = relations(bookingServicesTable, ({ one }) => ({
  booking: one(bookingsTable, {
    fields: [bookingServicesTable.booking_id],
    references: [bookingsTable.id]
  }),
  service: one(servicesTable, {
    fields: [bookingServicesTable.service_id],
    references: [servicesTable.id]
  })
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  booking: one(bookingsTable, {
    fields: [paymentsTable.booking_id],
    references: [bookingsTable.id]
  }),
  createdBy: one(usersTable, {
    fields: [paymentsTable.created_by],
    references: [usersTable.id]
  })
}));

export const expensesRelations = relations(expensesTable, ({ one }) => ({
  booking: one(bookingsTable, {
    fields: [expensesTable.booking_id],
    references: [bookingsTable.id]
  }),
  createdBy: one(usersTable, {
    fields: [expensesTable.created_by],
    references: [usersTable.id]
  })
}));

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  customers: customersTable,
  hotels: hotelsTable,
  services: servicesTable,
  bookings: bookingsTable,
  bookingServices: bookingServicesTable,
  payments: paymentsTable,
  expenses: expensesTable,
  travelSettings: travelSettingsTable
};
