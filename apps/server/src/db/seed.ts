import bcrypt from "bcrypt";

import { db, queryClient } from ".";
import { events, registration, users } from "./schema";

/**
 * Preenche o banco de dados com informações iniciais para facilitar o
 * desenvolvimento. Os dados incluem um organizador padrão, alguns participantes
 * e eventos de exemplo.
 */
const seed = async () => {
  // Remove todos os registros para garantir um estado limpo
  await db.delete(registration);
  await db.delete(events);
  await db.delete(users);

  // Senha padrão "123456" compartilhada por todas as contas criadas aqui
  const password = await bcrypt.hash("123456", 12);

  // Usuário organizador padrão para facilitar o login inicial
  const [user] = await db
    .insert(users)
    .values({
      name: "Usuário Teste",
      email: "Teste@teste.com",
      role: "organizador",
      password,
    })
    .returning();

  // Cria alguns participantes para demonstrar inscrições
  const participantes = await db
    .insert(users)
    .values([
      {
        name: "Ana Silva",
        email: "ana.silva@example.com",
        role: "participante",
        password,
      },
      {
        name: "Carlos Souza",
        email: "carlos.souza@example.com",
        role: "participante",
        password,
      },
      {
        name: "Mariana Oliveira",
        email: "mariana.oliveira@example.com",
        role: "participante",
        password,
      },
      {
        name: "Lucas Lima",
        email: "lucas.lima@example.com",
        role: "participante",
        password,
      },
      {
        name: "Fernanda Costa",
        email: "fernanda.costa@example.com",
        role: "participante",
        password,
      },
    ])
    .returning();

  // Eventos de exemplo com diferentes status e vagas
  const eventsData = await db
    .insert(events)
    .values([
      {
        title: "Yoga Class",
        description: "A relaxing yoga session for all levels.",
        location: "Community Center Room A",
        availableSlots: 10,
        eventType: "presencial",
        status: "ativo",
        startDate: new Date("2024-10-20T09:00:00Z"),
        endDate: new Date("2024-10-20T10:00:00Z"),
        organizerId: user.id,
      },
      {
        title: "Art Workshop",
        description: "Explore your creativity in this fun art workshop.",
        location: "Art Studio B",
        availableSlots: 0,
        eventType: "presencial",
        status: "ativo",
        startDate: new Date("2024-10-22T14:00:00Z"),
        endDate: new Date("2024-10-22T16:00:00Z"),
        organizerId: user.id,
      },
      {
        title: "Cooking Class",
        description: "Learn to cook delicious meals with a professional chef.",
        location: "Culinary School Kitchen",
        availableSlots: 8,
        eventType: "presencial",
        status: "cancelado",
        startDate: new Date("2024-10-25T18:00:00Z"),
        endDate: new Date("2024-10-25T20:00:00Z"),
        organizerId: user.id,
      },
      {
        title: "Tech Talk: AI Innovations",
        description: "Join us for a discussion on the latest in AI technology.",
        location: "Conference Hall 3",
        availableSlots: 15,
        eventType: "híbrido",
        status: "cancelado",
        startDate: new Date("2024-10-30T17:00:00Z"),
        endDate: new Date("2024-10-30T19:00:00Z"),
        organizerId: user.id,
      },
    ])
    .returning();

  // Inscreve todos os participantes no primeiro evento
  for (const participant of participantes) {
    await db.insert(registration).values({
      eventId: eventsData[0].id,
      userId: participant.id,
    });
  }

  // Inscrições adicionais para simular eventos com vagas ocupadas
  await db.insert(registration).values([
    {
      eventId: eventsData[1].id,
      userId: participantes[0].id,
    },
    {
      eventId: eventsData[1].id,
      userId: participantes[1].id,
    },
    {
      eventId: eventsData[2].id,
      userId: participantes[3].id,
    },
  ]);
};

seed().then(() => {
  console.log("🌱 Database seeded successfully!");
  queryClient.end();
});
