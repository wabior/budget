import { z } from "zod";

/**
 * Schema walidacji dla tworzenia wydatku
 * Zgodny z typem CreateExpenseCommand i wymaganiami biznesowymi
 * UWAGA: user_id jest automatycznie przypisywany na backendzie (nie przesyłany w request)
 */
export const CreateExpenseSchema = z
  .object({
    name: z.string().min(1, "Nazwa wydatku jest wymagana").max(255, "Nazwa wydatku nie może przekraczać 255 znaków"),

    amount: z.number().positive("Kwota musi być dodatnia").finite("Kwota musi być liczbą skończoną"),

    frequency: z
      .number()
      .int("Częstotliwość musi być liczbą całkowitą")
      .min(0, "Częstotliwość musi być w zakresie 0-12")
      .max(12, "Częstotliwość musi być w zakresie 0-12"),

    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data rozpoczęcia musi być w formacie YYYY-MM-DD")
      .refine((date) => !isNaN(Date.parse(date)), "Nieprawidłowa data rozpoczęcia"),

    status: z.enum(["active", "completed", "suspended"], {
      errorMap: () => ({ message: "Status musi być jednym z: active, completed, suspended" }),
    }),

    type: z.enum(["regular", "one_time", "installment", "variable"], {
      errorMap: () => ({ message: "Typ musi być jednym z: regular, one_time, installment, variable" }),
    }),

    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data zakończenia musi być w formacie YYYY-MM-DD")
      .refine((date) => !isNaN(Date.parse(date)), "Nieprawidłowa data zakończenia")
      .optional()
      .nullable(),

    notes: z.string().max(1000, "Notatki nie mogą przekraczać 1000 znaków").optional().nullable(),
  })
  .refine(
    (data) => {
      // Walidacja: dla wydatków jednorazowych (one_time) frequency musi być 0
      if (data.type === "one_time" && data.frequency !== 0) {
        return false;
      }
      return true;
    },
    {
      message: "Dla wydatków jednorazowych (one_time) częstotliwość musi wynosić 0",
      path: ["frequency"],
    }
  )
  .refine(
    (data) => {
      // Walidacja: jeśli end_date jest podana, musi być późniejsza niż start_date
      if (data.end_date) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return endDate > startDate;
      }
      return true;
    },
    {
      message: "Data zakończenia musi być późniejsza niż data rozpoczęcia",
      path: ["end_date"],
    }
  );

/**
 * Typ inferred z schema walidacji
 */
export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
