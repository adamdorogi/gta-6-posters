import { supabase } from "@/app/utils/supabase";

export async function POST(request: Request) {
  const requestData = await request.json();
  console.log(requestData);
  const generationIds = requestData.generationIds;

  const { data, error } = await supabase
    .from("generations")
    .select("id, status")
    .in("id", generationIds);

  return Response.json({
    status: data,
  });
}
