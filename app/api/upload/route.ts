import { supabase } from "@/app/utils/supabase";
import { getUserId } from "@/app/utils/user";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    console.log("Request received.");
    const formData = await request.formData();
    const photos = formData.get("photos") as File;

    console.log("Photos:", photos);

    if (photos.size < 1) {
      throw new Error("No file uploaded.");
    }

    const uploadId = randomUUID();

    const splitString = photos.name.split(".");
    const type = splitString.length > 1 ? "." + splitString.pop() : "";

    const fileName = `${uploadId}${type}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`${await getUserId()}/${fileName}`, photos);

    if (!data || error) {
      throw new Error(error?.message || "Failed to upload file.");
    }

    console.log("Upload data:", data);

    const { data: uploadData, error: uploadError } = await supabase
      .from("uploads")
      .insert({ id: uploadId, path: data.path })
      .select()
      .single();

    if (!uploadData || uploadError) {
      throw new Error(
        uploadError?.message || "Failed to create upload record.",
      );
    }

    return Response.json({ uploadId: uploadData.id });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Failed to upload file." }), {
      status: 400,
    });
  }
}
