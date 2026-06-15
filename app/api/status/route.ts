import { supabase } from "@/app/utils/supabase";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    console.log(requestData);
    const generationIds = requestData.generationIds;

    const { data: statusData, error: statusError } = await supabase
      .from("generations")
      .select("id, status")
      .in("id", generationIds);

    if (!statusData || statusData.length === 0 || statusError) {
      console.error("Error fetching generation statuses:", statusError);
      throw new Error(
        statusError?.message || "Failed to fetch generation statuses.",
      );
    }

    return Response.json({
      status: statusData,
    });
  } catch (err) {
    console.log("Status error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch generation statuses." }),
      {
        status: 400,
      },
    );
  }
}
