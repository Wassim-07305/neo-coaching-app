// KPI Auto-calculation engine (F54)

export interface KpiInput {
  // Investment
  minutesOnModules: number;
  totalPossibleMinutes: number;
  rdvCount: number;
  communityMessageThisWeek: boolean;
  noActivityDays: number;

  // Efficacy
  questionnaireScore: number; // 0-10
  rdvFeedbackScore: number; // 0-10
  badgesCount: number;
  maxBadges: number;

  // Participation
  messagesCount: number;
  reactionsCount: number;
  eventsAttended: number;
  periodDays: number;
}

export interface KpiResult {
  investissement: number;
  efficacite: number;
  participation: number;
  details: {
    investissement: string;
    efficacite: string;
    participation: string;
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * F54a - Investment Formula:
 * (min_modules_completed + nb_RDV*60) / total_possible_minutes * 10
 * Bonus +0.5 if community message this week
 * Penalty -0.5 if no activity for 2+ weeks
 */
function calcInvestissement(input: KpiInput): { score: number; detail: string } {
  const totalMinutes = input.minutesOnModules + input.rdvCount * 60;
  const base =
    input.totalPossibleMinutes > 0
      ? (totalMinutes / input.totalPossibleMinutes) * 10
      : 5;

  let score = base;
  let detail = `Base: ${base.toFixed(1)}`;

  if (input.communityMessageThisWeek) {
    score += 0.5;
    detail += " | +0.5 (message communaute)";
  }
  if (input.noActivityDays >= 14) {
    score -= 0.5;
    detail += " | -0.5 (inactivite 2+ sem.)";
  }

  return { score: clamp(Math.round(score * 10) / 10, 0, 10), detail };
}

/**
 * F54b - Efficacy Formula:
 * (score_questionnaire + feedback_RDV + badges_ratio*10) / 3
 */
function calcEfficacite(input: KpiInput): { score: number; detail: string } {
  const badgeScore =
    input.maxBadges > 0 ? (input.badgesCount / input.maxBadges) * 10 : 5;
  const score =
    (input.questionnaireScore + input.rdvFeedbackScore + badgeScore) / 3;

  const detail = `Quest: ${input.questionnaireScore} | RDV: ${input.rdvFeedbackScore} | Badges: ${badgeScore.toFixed(1)}`;

  return { score: clamp(Math.round(score * 10) / 10, 0, 10), detail };
}

/**
 * F54c - Participation Formula:
 * (nb_messages + nb_reactions*0.5 + nb_events_attended) / period_factor * 10
 * Capped at 10
 */
function calcParticipation(input: KpiInput): { score: number; detail: string } {
  const raw =
    input.messagesCount + input.reactionsCount * 0.5 + input.eventsAttended;
  const periodFactor = Math.max(1, input.periodDays / 7);
  const normalized = raw / periodFactor;
  const score = Math.min(10, normalized * 2);

  const detail = `Msg: ${input.messagesCount} | React: ${input.reactionsCount} | Events: ${input.eventsAttended}`;

  return { score: clamp(Math.round(score * 10) / 10, 0, 10), detail };
}

export function calculateKpis(input: KpiInput): KpiResult {
  const inv = calcInvestissement(input);
  const eff = calcEfficacite(input);
  const part = calcParticipation(input);

  return {
    investissement: inv.score,
    efficacite: eff.score,
    participation: part.score,
    details: {
      investissement: inv.detail,
      efficacite: eff.detail,
      participation: part.detail,
    },
  };
}

/**
 * F54e - Check for KPI alerts
 * Returns alert if KPI < 4 or dropped > 2 points vs previous
 */
export function checkKpiAlerts(
  current: { investissement: number; efficacite: number; participation: number },
  previous?: { investissement: number; efficacite: number; participation: number }
): string[] {
  const alerts: string[] = [];

  if (current.investissement < 4)
    alerts.push("Investissement critique (< 4)");
  if (current.efficacite < 4)
    alerts.push("Efficacite critique (< 4)");
  if (current.participation < 4)
    alerts.push("Participation critique (< 4)");

  if (previous) {
    if (previous.investissement - current.investissement > 2)
      alerts.push(`Investissement en baisse (-${(previous.investissement - current.investissement).toFixed(1)})`);
    if (previous.efficacite - current.efficacite > 2)
      alerts.push(`Efficacite en baisse (-${(previous.efficacite - current.efficacite).toFixed(1)})`);
    if (previous.participation - current.participation > 2)
      alerts.push(`Participation en baisse (-${(previous.participation - current.participation).toFixed(1)})`);
  }

  return alerts;
}
