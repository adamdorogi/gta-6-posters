import { supabase } from "@/app/utils/supabase";
import { getUserId } from "@/app/utils/user";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  console.log("Request received.");
  const formData = await request.formData();
  const photos = formData.get("photos") as File;

  const uploadId = randomUUID();

  const splitString = photos.name.split(".");
  const type = splitString.length > 1 ? "." + splitString.pop() : "";

  console.log(`NAME: ${uploadId}${type}`);

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(`${await getUserId()}/${uploadId}${type}`, photos);

  console.log(data, error);

  console.log(photos);

  const { data: uploadData, error: uploadError } = await supabase
    .from("uploads")
    .insert({ id: uploadId, path: data?.path })
    .select()
    .single();

  if (error || uploadError) {
    console.error("Error uploading file:", error, uploadError);
    return new Response(JSON.stringify({ error: "Failed to upload file." }), {
      status: 500,
    });
  }

  return Response.json({ uploadId });
}
