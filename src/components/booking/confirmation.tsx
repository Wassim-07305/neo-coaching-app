import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Calendar, Clock, Video, ArrowLeft } from "lucide-react";
import type { BookingFormData } from "@/lib/validations/booking";

interface ConfirmationProps {
  data: BookingFormData;
}

export function Confirmation({ data }: ConfirmationProps) {
  const formattedDate = data.selected_date
    ? format(new Date(data.selected_date), "EEEE d MMMM yyyy", { locale: fr })
    : "";

  return (
    <div className="text-center space-y-6">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
      </div>

      <div>
        <h3 className="font-heading text-2xl font-bold text-dark mb-2">
          Votre rendez-vous est confirme !
        </h3>
        <p className="text-gray-500">
          Un email de confirmation va vous etre envoye a{" "}
          <span className="font-medium text-dark">{data.email}</span>.
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 border border-gray-100">
        <h4 className="font-heading font-semibold text-dark text-lg">
          Recapitulatif
        </h4>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-medium text-dark capitalize">{formattedDate}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <div>
              <div className="text-sm text-gray-500">Horaire</div>
              <div className="font-medium text-dark">{data.selected_time}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Video className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <div>
              <div className="text-sm text-gray-500">Format</div>
              <div className="font-medium text-dark">
                Visioconference (un lien Zoom vous sera envoye)
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Nom :</span>{" "}
              <span className="text-dark font-medium">
                {data.first_name} {data.last_name}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Tel :</span>{" "}
              <span className="text-dark font-medium">{data.phone}</span>
            </div>
            {data.type_accompagnement && (
              <div className="col-span-2">
                <span className="text-gray-500">Type :</span>{" "}
                <span className="text-dark font-medium">
                  {data.type_accompagnement}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        Duree : 30 minutes &middot; Gratuit et sans engagement
      </p>

      {/* Back to home */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-primary-medium font-semibold hover:text-accent transition-colors mt-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour a l&apos;accueil
      </Link>
    </div>
  );
}
