import { z } from "zod";

export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  subtitle: z.string(),
  icon: z.string(),
  features: z.array(z.string()),
});

export const processStepSchema = z.object({
  number: z.string(),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  tags: z.array(z.string()),
  link: z.string().optional(),
  featured: z.boolean().optional(),
});

export const socialLinkSchema = z.object({
  platform: z.string(),
  url: z.string(),
  icon: z.string(),
});

export const resumeEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  link: z.string().optional(),
});

export const experienceSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  date: z.string(),
  logoUrl: z.string().optional(),
  domain: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  date: z.string(),
  gpa: z.string().optional(),
  activities: z.array(z.string()).optional(),
  logoUrl: z.string().optional(),
  domain: z.string().optional(),
});

export const courseSchema = z.object({
  code: z.string(),
  name: z.string(),
  url: z.string().url(),
});

export const otherProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
});

export const otherProjectCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  projects: z.array(otherProjectSchema),
});

export type Profile = z.infer<typeof profileSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type ProcessStep = z.infer<typeof processStepSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ResumeEntry = z.infer<typeof resumeEntrySchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Course = z.infer<typeof courseSchema>;
export type OtherProject = z.infer<typeof otherProjectSchema>;
export type OtherProjectCategory = z.infer<typeof otherProjectCategorySchema>;
