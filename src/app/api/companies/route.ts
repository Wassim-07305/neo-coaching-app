import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface CreateCompanyRequest {
  name: string;
  dirigeantEmail?: string;
  dirigeantFirstName?: string;
  dirigeantLastName?: string;
  missionStartDate?: string;
  missionEndDate?: string;
  kpiObjectives?: Record<string, unknown>;
  notes?: string;
}

interface AddEmployeeRequest {
  companyId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "salarie" | "dirigeant";
  sendInvite?: boolean;
}

// Helper to generate a temporary password
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// GET - List companies with stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("id");
  const includeEmployees = searchParams.get("includeEmployees") === "true";

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({
      success: true,
      mock: true,
      data: getMockCompanies(),
    });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (companyId) {
      // Get single company with details
      const { data: company, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
      }

      // Get employees if requested
      let employees = [];
      if (includeEmployees) {
        const { data: employeeData } = await supabase
          .from("profiles")
          .select("*")
          .eq("company_id", companyId)
          .order("last_name");
        employees = employeeData || [];
      }

      // Get company stats
      const [moduleProgressRes, kpiRes, parcoursRes] = await Promise.all([
        supabase
          .from("module_progress")
          .select("id, status, user_id")
          .in("user_id", employees.map((e: { id: string }) => e.id)),
        supabase
          .from("kpi_scores")
          .select("*")
          .eq("company_id", companyId)
          .order("scored_at", { ascending: false })
          .limit(1),
        supabase
          .from("assigned_parcours")
          .select("id, status, progress")
          .eq("company_id", companyId),
      ]);

      const stats = {
        employeeCount: employees.length,
        modulesCompleted: (moduleProgressRes.data || []).filter(
          (m: { status: string }) => m.status === "validated"
        ).length,
        avgKpi: kpiRes.data?.[0]
          ? Math.round(
              ((kpiRes.data[0].investissement +
                kpiRes.data[0].efficacite +
                kpiRes.data[0].participation) /
                3) *
                10
            ) / 10
          : 0,
        parcoursInProgress: (parcoursRes.data || []).filter(
          (p: { status: string }) => p.status === "in_progress"
        ).length,
        avgProgress:
          parcoursRes.data && parcoursRes.data.length > 0
            ? Math.round(
                (parcoursRes.data as { progress: number }[]).reduce((sum, p) => sum + p.progress, 0) /
                  parcoursRes.data.length
              )
            : 0,
      };

      return NextResponse.json({
        success: true,
        data: {
          ...company,
          employees: includeEmployees ? employees : undefined,
          stats,
        },
      });
    }

    // List all companies
    const { data: companies, error } = await supabase
      .from("companies")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching companies:", error);
      return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
    }

    // Get employee counts for each company
    const companiesWithStats = await Promise.all(
      (companies || []).map(async (company: { id: string }) => {
        const { count } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("company_id", company.id);

        return {
          ...company,
          employeeCount: count || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: companiesWithStats,
    });
  } catch (error) {
    console.error("Error in companies API:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// POST - Create company or add employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: true,
        mock: true,
        message: action === "addEmployee" ? "Employee added (mock)" : "Company created (mock)",
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (action === "addEmployee") {
      return handleAddEmployee(supabase, body as AddEmployeeRequest);
    }

    return handleCreateCompany(supabase, body as CreateCompanyRequest);
  } catch (error) {
    console.error("Error in companies API:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleCreateCompany(supabase: any, data: CreateCompanyRequest) {
  const {
    name,
    dirigeantEmail,
    dirigeantFirstName,
    dirigeantLastName,
    missionStartDate,
    missionEndDate,
    kpiObjectives,
    notes,
  } = data;

  if (!name) {
    return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  }

  // Create company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name,
      mission_start_date: missionStartDate || null,
      mission_end_date: missionEndDate || null,
      mission_status: "active",
      kpi_objectives: kpiObjectives || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (companyError) {
    console.error("Error creating company:", companyError);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }

  // If dirigeant details provided, create their account
  let dirigeant = null;
  if (dirigeantEmail && dirigeantFirstName && dirigeantLastName) {
    const tempPassword = generateTempPassword();

    // Create auth user (would need admin client in production)
    // For now, just create the profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: crypto.randomUUID(),
        email: dirigeantEmail,
        first_name: dirigeantFirstName,
        last_name: dirigeantLastName,
        role: "dirigeant",
        company_id: company.id,
        status: "active",
      })
      .select()
      .single();

    if (!profileError && profile) {
      dirigeant = {
        ...profile,
        tempPassword, // In production, send this via email
      };

      // Update company with dirigeant_id
      await supabase
        .from("companies")
        .update({ dirigeant_id: profile.id })
        .eq("id", company.id);
    }
  }

  // Create default community group for the company
  await supabase.from("groups").insert({
    name: `Equipe ${name}`,
    type: "entreprise",
    company_id: company.id,
    is_active: true,
    created_by: dirigeant?.id || company.id,
  });

  return NextResponse.json({
    success: true,
    data: {
      company,
      dirigeant,
    },
    message: "Company created successfully",
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleAddEmployee(supabase: any, data: AddEmployeeRequest) {
  const { companyId, email, firstName, lastName, role, sendInvite } = data;

  if (!companyId || !email || !firstName || !lastName) {
    return NextResponse.json(
      { error: "companyId, email, firstName, lastName are required" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingProfile) {
    return NextResponse.json(
      { error: "Un compte existe deja avec cet email" },
      { status: 400 }
    );
  }

  const tempPassword = generateTempPassword();

  // Create profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: crypto.randomUUID(),
      email,
      first_name: firstName,
      last_name: lastName,
      role: role || "salarie",
      company_id: companyId,
      status: "active",
    })
    .select()
    .single();

  if (profileError) {
    console.error("Error creating employee:", profileError);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }

  // Add to company group
  const { data: group } = await supabase
    .from("groups")
    .select("id")
    .eq("company_id", companyId)
    .eq("type", "entreprise")
    .single();

  if (group) {
    await supabase.from("group_members").insert({
      group_id: group.id,
      user_id: profile.id,
    });
  }

  // In production, send invite email with tempPassword
  if (sendInvite) {
    // Call email API here
    console.log(`Would send invite to ${email} with password: ${tempPassword}`);
  }

  return NextResponse.json({
    success: true,
    data: {
      ...profile,
      tempPassword, // Return for admin to share
    },
    message: "Employee added successfully",
  });
}

// DELETE - Remove company or employee
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const employeeId = searchParams.get("employeeId");

  if (!companyId && !employeeId) {
    return NextResponse.json(
      { error: "companyId or employeeId is required" },
      { status: 400 }
    );
  }

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({
      success: true,
      mock: true,
      message: "Deleted (mock)",
    });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (employeeId) {
      // Archive employee (soft delete)
      await supabase
        .from("profiles")
        .update({ status: "archived", company_id: null })
        .eq("id", employeeId);

      return NextResponse.json({
        success: true,
        message: "Employee archived",
      });
    }

    // Archive company and all employees
    const { data: employees } = await supabase
      .from("profiles")
      .select("id")
      .eq("company_id", companyId);

    if (employees && employees.length > 0) {
      await supabase
        .from("profiles")
        .update({ status: "archived" })
        .in("id", employees.map((e: { id: string }) => e.id));
    }

    await supabase
      .from("companies")
      .update({ mission_status: "completed" })
      .eq("id", companyId);

    return NextResponse.json({
      success: true,
      message: "Company archived",
    });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// Mock data
function getMockCompanies() {
  return [
    {
      id: "company-1",
      name: "Alpha Corp",
      mission_status: "active",
      mission_start_date: "2026-01-15",
      mission_end_date: "2026-07-15",
      employeeCount: 5,
    },
    {
      id: "company-2",
      name: "Beta Industries",
      mission_status: "active",
      mission_start_date: "2026-02-01",
      mission_end_date: "2026-08-01",
      employeeCount: 8,
    },
  ];
}
