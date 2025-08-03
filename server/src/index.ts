
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { 
  loginInputSchema,
  createCustomerInputSchema,
  createHotelInputSchema,
  createServiceInputSchema,
  createBookingInputSchema,
  createPaymentInputSchema,
  createExpenseInputSchema,
  reportFilterSchema,
  updateTravelSettingsInputSchema
} from './schema';

// Import handlers
import { login, verifyToken } from './handlers/auth';
import { getDashboardStats } from './handlers/get_dashboard_stats';
import { createCustomer } from './handlers/create_customer';
import { getCustomers } from './handlers/get_customers';
import { createHotel } from './handlers/create_hotel';
import { getHotels } from './handlers/get_hotels';
import { createService } from './handlers/create_service';
import { getServices } from './handlers/get_services';
import { createBooking } from './handlers/create_booking';
import { getBookings } from './handlers/get_bookings';
import { createPayment } from './handlers/create_payment';
import { getPayments } from './handlers/get_payments';
import { createExpense } from './handlers/create_expense';
import { getExpenses } from './handlers/get_expenses';
import { getFinancialReport } from './handlers/get_financial_report';
import { getTravelSettings } from './handlers/get_travel_settings';
import { updateTravelSettings } from './handlers/update_travel_settings';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),

  // Dashboard
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),

  // Customer management
  createCustomer: publicProcedure
    .input(createCustomerInputSchema)
    .mutation(({ input }) => createCustomer(input)),
  
  getCustomers: publicProcedure
    .query(() => getCustomers()),

  // Hotel management
  createHotel: publicProcedure
    .input(createHotelInputSchema)
    .mutation(({ input }) => createHotel(input)),
  
  getHotels: publicProcedure
    .query(() => getHotels()),

  // Service management
  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),
  
  getServices: publicProcedure
    .query(() => getServices()),

  // Booking management
  createBooking: publicProcedure
    .input(createBookingInputSchema)
    .mutation(({ input }) => createBooking(input, 1)), // TODO: Get userId from context
  
  getBookings: publicProcedure
    .query(() => getBookings()),

  // Payment management
  createPayment: publicProcedure
    .input(createPaymentInputSchema)
    .mutation(({ input }) => createPayment(input, 1)), // TODO: Get userId from context
  
  getPayments: publicProcedure
    .query(() => getPayments()),

  // Expense management (accessible by staff)
  createExpense: publicProcedure
    .input(createExpenseInputSchema)
    .mutation(({ input }) => createExpense(input, 1)), // TODO: Get userId from context
  
  getExpenses: publicProcedure
    .query(() => getExpenses()),

  // Financial reporting
  getFinancialReport: publicProcedure
    .input(reportFilterSchema)
    .query(({ input }) => getFinancialReport(input)),

  // Travel agency settings
  getTravelSettings: publicProcedure
    .query(() => getTravelSettings()),
  
  updateTravelSettings: publicProcedure
    .input(updateTravelSettingsInputSchema)
    .mutation(({ input }) => updateTravelSettings(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
