"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, type PersonalInfoData } from "@/lib/validations/booking";
import { User, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepPersonalProps {
  data: Partial<PersonalInfoData>;
  onNext: (data: PersonalInfoData) => void;
}

export function StepPersonal({ data, onNext }: StepPersonalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      last_name: data.last_name ?? "",
      first_name: data.first_name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h3 className="font-heading text-xl font-bold text-dark mb-1">
          Informations personnelles
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Dites-nous qui vous etes pour que nous puissions vous recontacter.
        </p>
      </div>

      {/* Nom */}
      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Nom *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="last_name"
            type="text"
            {...register("last_name")}
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
              errors.last_name ? "border-danger" : "border-gray-200"
            )}
            placeholder="Votre nom"
          />
        </div>
        {errors.last_name && (
          <p className="text-danger text-xs mt-1">{errors.last_name.message}</p>
        )}
      </div>

      {/* Prenom */}
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Prenom *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="first_name"
            type="text"
            {...register("first_name")}
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
              errors.first_name ? "border-danger" : "border-gray-200"
            )}
            placeholder="Votre prenom"
          />
        </div>
        {errors.first_name && (
          <p className="text-danger text-xs mt-1">{errors.first_name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            {...register("email")}
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
              errors.email ? "border-danger" : "border-gray-200"
            )}
            placeholder="votre@email.com"
          />
        </div>
        {errors.email && (
          <p className="text-danger text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Telephone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
          Telephone *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-lg border bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
              errors.phone ? "border-danger" : "border-gray-200"
            )}
            placeholder="+33 6 00 00 00 00"
          />
        </div>
        {errors.phone && (
          <p className="text-danger text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Next button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-3 px-6 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
        >
          Suivant
        </button>
      </div>
    </form>
  );
}
