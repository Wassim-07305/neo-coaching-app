"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  User,
  BookOpen,
  Euro,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { usePayments, type PaymentWithDetails } from "@/hooks/use-supabase-data";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import { RevenueChart } from "@/components/admin/revenue-chart";
import type { PaymentStatus, PaymentType } from "@/lib/supabase/types";

type FilterStatus = "all" | PaymentStatus;
type FilterType = "all" | PaymentType;

// Format price from cents to EUR
function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

// Mock data for demo when no real payments exist
const mockPayments: PaymentWithDetails[] = [
  {
    id: "pay-1",
    user_id: "user-1",
    amount_cents: 9900,
    type: "module",
    stripe_payment_id: "pi_demo_1",
    status: "succeeded",
    module_id: "mod-1",
    intervenant_id: null,
    created_at: "2026-03-08T14:30:00Z",
    user: {
      id: "user-1",
      first_name: "Marie",
      last_name: "Dupont",
      email: "marie.dupont@email.com",
      avatar_url: null,
      phone: null,
      role: "coachee",
      company_id: null,
      coaching_type: "individuel",
      status: "active",
      onboarding_completed: true,
      created_at: "2026-01-15T10:00:00Z",
      updated_at: "2026-03-08T14:30:00Z",
    },
    module: {
      id: "mod-1",
      title: "Intelligence Emotionnelle",
      description: null,
      content: {},
      exercise: null,
      order_index: 1,
      parcours_type: "individuel",
      price_cents: 9900,
      is_free: false,
      duration_minutes: 120,
      created_at: "2026-01-01T00:00:00Z",
    },
  },
  {
    id: "pay-2",
    user_id: "user-2",
    amount_cents: 7900,
    type: "module",
    stripe_payment_id: "pi_demo_2",
    status: "succeeded",
    module_id: "mod-2",
    intervenant_id: null,
    created_at: "2026-03-06T10:15:00Z",
    user: {
      id: "user-2",
      first_name: "Sophie",
      last_name: "Martin",
      email: "sophie.martin@email.com",
      avatar_url: null,
      phone: null,
      role: "coachee",
      company_id: null,
      coaching_type: "individuel",
      status: "active",
      onboarding_completed: true,
      created_at: "2026-02-01T10:00:00Z",
      updated_at: "2026-03-06T10:15:00Z",
    },
    module: {
      id: "mod-2",
      title: "Estime de soi",
      description: null,
      content: {},
      exercise: null,
      order_index: 2,
      parcours_type: "individuel",
      price_cents: 7900,
      is_free: false,
      duration_minutes: 90,
      created_at: "2026-01-01T00:00:00Z",
    },
  },
  {
    id: "pay-3",
    user_id: "user-3",
    amount_cents: 15000,
    type: "intervenant_session",
    stripe_payment_id: "pi_demo_3",
    status: "pending",
    module_id: null,
    intervenant_id: "int-1",
    created_at: "2026-03-09T16:00:00Z",
    user: {
      id: "user-3",
      first_name: "Camille",
      last_name: "Rousseau",
      email: "camille.rousseau@email.com",
      avatar_url: null,
      phone: null,
      role: "coachee",
      company_id: null,
      coaching_type: "individuel",
      status: "active",
      onboarding_completed: true,
      created_at: "2026-02-15T10:00:00Z",
      updated_at: "2026-03-09T16:00:00Z",
    },
  },
  {
    id: "pay-4",
    user_id: "user-4",
    amount_cents: 9900,
    type: "module",
    stripe_payment_id: "pi_demo_4",
    status: "failed",
    module_id: "mod-1",
    intervenant_id: null,
    created_at: "2026-03-05T09:00:00Z",
    user: {
      id: "user-4",
      first_name: "Julie",
      last_name: "Moreau",
      email: "julie.moreau@email.com",
      avatar_url: null,
      phone: null,
      role: "coachee",
      company_id: null,
      coaching_type: "individuel",
      status: "active",
      onboarding_completed: true,
      created_at: "2026-01-20T10:00:00Z",
      updated_at: "2026-03-05T09:00:00Z",
    },
    module: {
      id: "mod-1",
      title: "Intelligence Emotionnelle",
      description: null,
      content: {},
      exercise: null,
      order_index: 1,
      parcours_type: "individuel",
      price_cents: 9900,
      is_free: false,
      duration_minutes: 120,
      created_at: "2026-01-01T00:00:00Z",
    },
  },
  {
    id: "pay-5",
    user_id: "user-1",
    amount_cents: 7900,
    type: "module",
    stripe_payment_id: "pi_demo_5",
    status: "refunded",
    module_id: "mod-3",
    intervenant_id: null,
    created_at: "2026-02-28T11:30:00Z",
    user: {
      id: "user-1",
      first_name: "Marie",
      last_name: "Dupont",
      email: "marie.dupont@email.com",
      avatar_url: null,
      phone: null,
      role: "coachee",
      company_id: null,
      coaching_type: "individuel",
      status: "active",
      onboarding_completed: true,
      created_at: "2026-01-15T10:00:00Z",
      updated_at: "2026-02-28T11:30:00Z",
    },
    module: {
      id: "mod-3",
      title: "Confiance en soi",
      description: null,
      content: {},
      exercise: null,
      order_index: 3,
      parcours_type: "individuel",
      price_cents: 7900,
      is_free: false,
      duration_minutes: 90,
      created_at: "2026-01-01T00:00:00Z",
    },
  },
];

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  succeeded: { label: "Reussi", color: "bg-success/10 text-success", icon: CheckCircle },
  pending: { label: "En attente", color: "bg-warning/10 text-warning", icon: Clock },
  failed: { label: "Echoue", color: "bg-danger/10 text-danger", icon: XCircle },
  refunded: { label: "Rembourse", color: "bg-gray-100 text-gray-600", icon: RefreshCw },
};

const typeLabels: Record<PaymentType, string> = {
  module: "Module",
  intervenant_session: "Session intervenant",
};

export default function PaiementsPage() {
  const { toast } = useToast();
  const { data: paymentsData, loading, refetch } = usePayments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  // Use real data if available, otherwise mock data
  const payments = paymentsData && paymentsData.length > 0 ? paymentsData : mockPayments;

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        search === "" ||
        payment.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        payment.user?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        payment.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        payment.module?.title?.toLowerCase().includes(search.toLowerCase()) ||
        payment.stripe_payment_id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      const matchesType = typeFilter === "all" || payment.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [payments, search, statusFilter, typeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = payments.filter((p) => {
      const paymentDate = new Date(p.created_at);
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      );
    });

    const succeeded = payments.filter((p) => p.status === "succeeded");
    const pending = payments.filter((p) => p.status === "pending");

    const totalRevenue = succeeded.reduce((sum, p) => sum + p.amount_cents, 0);
    const monthlyRevenue = thisMonth
      .filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + p.amount_cents, 0);

    return {
      total: payments.length,
      totalRevenue,
      monthlyRevenue,
      pending: pending.length,
      succeeded: succeeded.length,
    };
  }, [payments]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Date",
      "Client",
      "Email",
      "Type",
      "Module/Session",
      "Montant",
      "Statut",
      "ID Stripe",
    ];
    const rows = filteredPayments.map((p) => [
      format(new Date(p.created_at), "dd/MM/yyyy HH:mm"),
      `${p.user?.first_name || ""} ${p.user?.last_name || ""}`.trim() || "N/A",
      p.user?.email || "N/A",
      typeLabels[p.type],
      p.module?.title || "Session intervenant",
      formatPrice(p.amount_cents),
      statusConfig[p.status].label,
      p.stripe_payment_id,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `paiements-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast("Export CSV telecharge", "success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-accent" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">
              Historique des paiements
            </h1>
            <p className="text-sm text-gray-500">
              {stats.total} transactions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Euro className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">
                {formatPrice(stats.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500">Revenu total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">
                {formatPrice(stats.monthlyRevenue)}
              </p>
              <p className="text-xs text-gray-500">Ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.pending}</p>
              <p className="text-xs text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.succeeded}</p>
              <p className="text-xs text-gray-500">Reussis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <RevenueChart payments={payments} loading={loading} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, module..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="all">Tous les statuts</option>
              <option value="succeeded">Reussis</option>
              <option value="pending">En attente</option>
              <option value="failed">Echoues</option>
              <option value="refunded">Rembourses</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as FilterType)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="all">Tous les types</option>
              <option value="module">Modules</option>
              <option value="intervenant_session">Sessions intervenant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Aucun paiement"
            description="Aucun paiement ne correspond a vos criteres de recherche."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Client
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Montant
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => {
                  const StatusIcon = statusConfig[payment.status].icon;
                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-dark">
                              {format(new Date(payment.created_at), "d MMM yyyy", { locale: fr })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(payment.created_at), "HH:mm")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-medium/10 flex items-center justify-center shrink-0">
                            {payment.user?.avatar_url ? (
                              <img
                                src={payment.user.avatar_url}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-primary-medium" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-dark truncate">
                              {payment.user?.first_name} {payment.user?.last_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {payment.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                            payment.type === "module"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          )}
                        >
                          {typeLabels[payment.type]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-dark">
                            {payment.module?.title || "Session intervenant"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-semibold text-dark">
                          {formatPrice(payment.amount_cents)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                              statusConfig[payment.status].color
                            )}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig[payment.status].label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer info */}
      {filteredPayments.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          Affichage de {filteredPayments.length} paiement{filteredPayments.length > 1 ? "s" : ""} sur {payments.length}
        </p>
      )}
    </div>
  );
}
