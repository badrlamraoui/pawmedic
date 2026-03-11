import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { createElement } from "react";
import ReminderEmail from "@/emails/ReminderEmail";
import { getDaysUntil } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const isCron = req.headers.get("x-cron-secret") === process.env.CRON_SECRET;
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    // In-app mode: get pending for a specific user
    if (userId && !isCron) {
      const user = await requireUser();
      if (user.id !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const now = new Date();
      const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const reminders = await prisma.healthEvent.findMany({
        where: {
          animal: { userId },
          nextDue: { lte: thirtyDaysLater },
        },
        include: { animal: { select: { id: true, name: true, species: true } } },
        orderBy: { nextDue: "asc" },
      });

      const formatted = reminders.map((r) => ({
        id: r.id,
        animalId: r.animal.id,
        animalName: r.animal.name,
        animalSpecies: r.animal.species,
        eventName: r.name,
        eventType: r.type,
        nextDue: r.nextDue?.toISOString() || null,
        daysUntilDue: r.nextDue ? getDaysUntil(r.nextDue) : null,
        urgency:
          r.nextDue && getDaysUntil(r.nextDue) < 0
            ? "OVERDUE"
            : r.nextDue && getDaysUntil(r.nextDue) <= 7
            ? "DUE_SOON"
            : "UPCOMING",
      }));

      return NextResponse.json({ reminders: formatted });
    }

    // Cron mode: send reminder emails
    if (isCron) {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const dueEvents = await prisma.healthEvent.findMany({
        where: {
          nextDue: { lte: sevenDaysLater },
          reminderSent: false,
        },
        include: {
          animal: {
            include: {
              user: true,
            },
          },
        },
      });

      // Group by user
      const byUser = new Map<string, typeof dueEvents>();
      for (const event of dueEvents) {
        const uid = event.animal.userId;
        if (!byUser.has(uid)) byUser.set(uid, []);
        byUser.get(uid)!.push(event);
      }

      let sentCount = 0;

      for (const [, events] of byUser) {
        const firstEvent = events[0];
        const userRecord = firstEvent.animal.user;
        const userName = userRecord.email.split("@")[0];

        const reminders = events.map((e) => ({
          name: e.name,
          type: e.type,
          dueDate: e.nextDue?.toLocaleDateString("fr-FR") || "",
          urgency: e.nextDue && getDaysUntil(e.nextDue) < 0 ? "OVERDUE" : "DUE_SOON",
        }));

        try {
          await sendEmail({
            to: userRecord.email,
            subject: `Rappel Pawmedic — ${events.length} événement(s) à venir`,
            react: createElement(ReminderEmail, {
              userName,
              animalName: firstEvent.animal.name,
              reminders,
            }),
          });

          // Mark as sent
          await prisma.healthEvent.updateMany({
            where: { id: { in: events.map((e) => e.id) } },
            data: { reminderSent: true },
          });

          sentCount++;
        } catch (emailErr) {
          console.error("[reminders] Email send failed:", emailErr);
        }
      }

      return NextResponse.json({ sent: sentCount, total: byUser.size });
    }

    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  } catch (error) {
    console.error("[GET /api/reminders/pending]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
