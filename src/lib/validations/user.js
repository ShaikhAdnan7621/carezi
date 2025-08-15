import * as z from "zod"

export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  profilePic: z.string().optional(),
  vitalStats: z.object({
    bloodType: z.string().optional(),
    allergies: z.array(z.string()).optional(),
    height: z.number().nullable().optional(),
    weight: z.number().nullable().optional(),
    age: z.number().nullable().optional(),
    bmi: z.number().nullable().optional(),
    checkups: z.array(z.object({
      date: z.string().optional(),
      type: z.string().optional(),
      doctor: z.string().optional(),
      notes: z.string().optional(),
      nextAppointment: z.string().optional()
    })).optional(),
    healthIssues: z.array(z.object({
      condition: z.string(),
      diagnosedDate: z.string(),
      severity: z.string(),
      status: z.string()
    })).optional(),
    interests: z.array(z.string()).optional(), // Stays as array of strings, now consistent with Mongoose and frontend
    lifestyle: z.object({
      exercise: z.object({
        frequency: z.string().optional(),
        preferredActivities: z.array(z.string()).optional()
      }).optional(),
      diet: z.object({
        status: z.string().optional(),
        restrictions: z.array(z.string()).optional(),
        preferredDiet: z.string().optional()
      }).optional(),
      sleepPattern: z.object({
        hoursPerDay: z.string().optional(),
        quality: z.string().optional()
      }).optional(),
      stressLevel: z.string().optional()
    }).optional(),
    emergencyContact: z.object({
      name: z.string().optional(),
      relation: z.string().optional(),
      phone: z.string().optional()
    }).optional()
  }).optional()
})
