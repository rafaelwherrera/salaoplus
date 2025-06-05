import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
} from "drizzle-orm/pg-core";

// Usuários do sistema
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToSalons: many(usersToSalonsTable),
}));

// Salões
export const salonsTable = pgTable("salons", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  street: text("street").notNull(), // Rua
  number: text("number").notNull(), // Número (text para aceitar "s/n" ou letras)
  complement: text("complement"), // Complemento (opcional)
  neighborhood: text("neighborhood").notNull(), // Bairro
  city: text("city").notNull(), // Cidade
  state: text("state").notNull(), // Estado
  zipCode: text("zip_code").notNull(), // CEP
  phone: text("phone").notNull(), // Telefone
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const salonsTableRelations = relations(salonsTable, ({ many }) => ({
  professionals: many(professionalsTable),
  clients: many(clientsTable),
  appointments: many(appointmentsTable),
  usersToSalons: many(usersToSalonsTable),
}));

// Relação entre usuários e salões (proprietários ou gerentes)
export const usersToSalonsTable = pgTable("users_to_salons", {
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  salonId: text("salon_id")
    .notNull()
    .references(() => salonsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersToSalonsTableRelations = relations(
  usersToSalonsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToSalonsTable.userId],
      references: [usersTable.id],
    }),
    salon: one(salonsTable, {
      fields: [usersToSalonsTable.salonId],
      references: [salonsTable.id],
    }),
  }),
);

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// Profissionais (cabeleireiros, manicures, etc)
export const professionalsTable = pgTable("professionals", {
  id: text("id").primaryKey(),
  salonId: text("salon_id")
    .notNull()
    .references(() => salonsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  specialty: text("specialty").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const professionalsTableRelations = relations(
  professionalsTable,
  ({ many, one }) => ({
    salon: one(salonsTable, {
      fields: [professionalsTable.salonId],
      references: [salonsTable.id],
    }),
    appointments: many(appointmentsTable),
  }),
);

// Enum de sexo dos clientes
export const clientSexEnum = pgEnum("client_sex", ["male", "female"]);

// Clientes do salão
export const clientsTable = pgTable("clients", {
  id: text("id").primaryKey(),
  salonId: text("salon_id")
    .notNull()
    .references(() => salonsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  sex: clientSexEnum("sex").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const clientsTableRelations = relations(
  clientsTable,
  ({ one, many }) => ({
    salon: one(salonsTable, {
      fields: [clientsTable.salonId],
      references: [salonsTable.id],
    }),
    appointments: many(appointmentsTable),
  }),
);

// Agendamentos
export const appointmentsTable = pgTable("appointments", {
  id: text("id").primaryKey(),
  date: timestamp("date").notNull(),
  salonId: text("salon_id")
    .notNull()
    .references(() => salonsTable.id, { onDelete: "cascade" }),
  clientId: text("client_id")
    .notNull()
    .references(() => clientsTable.id, { onDelete: "cascade" }),
  professionalId: text("professional_id")
    .notNull()
    .references(() => professionalsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appointmentsTableRelations = relations(
  appointmentsTable,
  ({ one }) => ({
    salon: one(salonsTable, {
      fields: [appointmentsTable.salonId],
      references: [salonsTable.id],
    }),
    client: one(clientsTable, {
      fields: [appointmentsTable.clientId],
      references: [clientsTable.id],
    }),
    professional: one(professionalsTable, {
      fields: [appointmentsTable.professionalId],
      references: [professionalsTable.id],
    }),
  }),
);
