import { z } from "zod";

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  last_name: z.string().min(1, "Le nom est requis"),
  first_name: z.string().min(1, "Le prenom est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(1, "Le telephone est requis"),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

// Step 2: Current Situation
export const situationSchema = z.object({
  poste_actuel: z.string().optional(),
  entreprise: z.string().optional(),
  problematique: z.string().optional(),
});

export type SituationData = z.infer<typeof situationSchema>;

// Step 3: Motivation & Objectives
export const motivationSchema = z.object({
  motivation_level: z.number().min(1).max(10),
  objectifs: z.string().optional(),
  budget: z.string().min(1, "Veuillez selectionner un budget"),
});

export type MotivationData = z.infer<typeof motivationSchema>;

// Step 4: Qualification
export const qualificationSchema = z.object({
  connait_emotions: z.string().min(1, "Veuillez repondre"),
  deja_coaching: z.string().min(1, "Veuillez repondre"),
  type_accompagnement: z.string().min(1, "Veuillez selectionner un type"),
  source: z.string().min(1, "Veuillez indiquer comment vous nous avez connu"),
});

export type QualificationData = z.infer<typeof qualificationSchema>;

// Step 5: Time Slot
export const creneauSchema = z.object({
  selected_date: z.string().min(1, "Veuillez selectionner une date"),
  selected_time: z.string().min(1, "Veuillez selectionner un horaire"),
});

export type CreneauData = z.infer<typeof creneauSchema>;

// Combined full form data
export type BookingFormData = PersonalInfoData &
  SituationData &
  MotivationData &
  QualificationData &
  CreneauData;
