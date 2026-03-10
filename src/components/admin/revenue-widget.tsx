"use client";

import { useMemo } from "react";
import { Euro, TrendingUp, TrendingDown, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { PaymentWithDetails } from "@/hooks/use-supabase-data";

interface RevenueWidgetProps {
  payments: PaymentWithDetails[];
  loading?: boolean;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function RevenueWidget({ payments, loading }: RevenueWidgetProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));
    const last7Days = subDays(now, 7);

    const succeededPayments = payments.filter((p) => p.status === "succeeded");

    // This month revenue
    const thisMonthPayments = succeededPayments.filter((p) => {
      const date = new Date(p.created_at);
      return date >= thisMonthStart && date <= thisMonthEnd;
    });
    const thisMonthRevenue = thisMonthPayments.reduce((sum, p) => sum + p.amount_cents, 0);

    // Last month revenue
    const lastMonthPayments = succeededPayments.filter((p) => {
      const date = new Date(p.created_at);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + p.amount_cents, 0);

    // Last 7 days
    const last7DaysPayments = succeededPayments.filter((p) => {
      const date = new Date(p.created_at);
      return date >= last7Days;
    });
    const last7DaysRevenue = last7DaysPayments.reduce((sum, p) => sum + p.amount_cents, 0);

    // Growth
    const growth = lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    // Recent transactions
    const recentTransactions = succeededPayments
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        amount: p.amount_cents,
        userName: p.user ? `${p.user.first_name} ${p.user.last_name}` : "Client",
        description: p.module?.title || "Session intervenant",
        date: p.created_at,
      }));

    return {
      thisMonthRevenue,
      lastMonthRevenue,
      last7DaysRevenue,
      growth,
      transactionCount: thisMonthPayments.length,
      recentTransactions,
    };
  }, [payments]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Euro className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-dark">Revenus</h3>
              <p className="text-xs text-gray-500">
                {format(new Date(), "MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>
          {stats.growth !== 0 && (
            <div
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                stats.growth >= 0
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              )}
            >
              {stats.growth >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stats.growth >= 0 ? "+" : ""}
              {stats.growth}%
            </div>
          )}
        </div>

        {/* Main stat */}
        <div className="mb-4">
          <p className="text-3xl font-bold font-heading text-dark">
            {formatPrice(stats.thisMonthRevenue)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            vs {formatPrice(stats.lastMonthRevenue)} le mois dernier
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">7 derniers jours</p>
            <p className="text-lg font-semibold text-dark">
              {formatPrice(stats.last7DaysRevenue)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Transactions</p>
            <p className="text-lg font-semibold text-dark">
              {stats.transactionCount}
            </p>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="p-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Transactions recentes
        </h4>
        {stats.recentTransactions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Aucune transaction recente
          </p>
        ) : (
          <div className="space-y-3">
            {stats.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark truncate">
                      {tx.userName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {tx.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-success shrink-0 ml-2">
                  +{formatPrice(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4">
        <Link
          href="/admin/paiements"
          className="flex items-center justify-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          Voir tous les paiements
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
