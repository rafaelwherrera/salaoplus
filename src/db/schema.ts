import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Usuários do sistema
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToSalons: many(usersToSalonsTable),
}));

// Salões
export const salonsTable = pgTable("salons", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
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
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  salonId: uuid("salon_id")
    .notNull()
    .references(() => salonsTable.id),
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

// Profissionais (cabeleireiros, manicures, etc)
export const professionalsTable = pgTable("professionals", {
  id: uuid("id").defaultRandom().primaryKey(),
  salonId: uuid("salon_id")
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
  id: uuid("id").defaultRandom().primaryKey(),
  salonId: uuid("salon_id")
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
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  salonId: uuid("salon_id")
    .notNull()
    .references(() => salonsTable.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clientsTable.id, { onDelete: "cascade" }),
  professionalId: uuid("professional_id")
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
