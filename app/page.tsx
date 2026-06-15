import Image from "next/image";
import GenerationForm from "./ui/generation-form";
import { supabase } from "./utils/supabase";

export default async function Home() {
  const { data: styles } = await supabase.from("styles").select("id, name");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <GenerationForm styles={styles || []} />
      </main>
    </div>
  );
}

/*
POST https://turnmeroyal.com/api/upload
Request: Form Data: photos (binary)
Response:
{
    "uploads": [
        {
            "upload_id": "d8df83b3-2542-45bd-a036-70cbecd125f6",
            "storage_path": "9bbafb59-3b86-43c2-914e-ad3e3cca879c/d8df83b3-2542-45bd-a036-70cbecd125f6.jpg"
        }
    ]
}

POST https://turnmeroyal.com/api/upload
Request: Form Data: photos (binary)
Response:
{
    "uploads": [
        {
            "upload_id": "62ba856d-0062-4eb1-8d0c-34df2463446a",
            "storage_path": "9bbafb59-3b86-43c2-914e-ad3e3cca879c/62ba856d-0062-4eb1-8d0c-34df2463446a.jpg"
        }
    ]
}

POST https://turnmeroyal.com/api/generate
Request:
{
  "upload_ids": [
    "62ba856d-0062-4eb1-8d0c-34df2463446a",
    "d8df83b3-2542-45bd-a036-70cbecd125f6"
  ],
  "allowed_category_ids": [
    "f35c525e-4f70-404e-8720-45c346c4646b",
    "f70fbfb1-f7ab-462a-a58f-156026e543a6",
    "ee8d4af9-7abd-42b5-840d-8f668408f7e3",
    "ec32fd61-9828-47e4-bda8-ac2214c6156d",
    "bec1bda9-9eeb-49c0-a7ca-fb381f415073",
    "c4e14482-b398-40e9-9c16-204e28b2807c",
    "59a831b7-b727-4075-898f-c4bcd5b2d389",
    "b01c8c8c-a9bc-4acf-8b79-87824f06c8e2",
    "3d1353fc-783f-4f5f-92ad-59972be64392",
    "18103374-9873-498a-8c59-f6c18718ed6e"
  ],
  "user_prompt": "no crown"
}
Response:
{
    "generation_group_id": "fad3b5f1-869d-4ac5-abf6-f21f2e2e296e",
    "generation_id": "abd46e7f-45f0-4f31-9881-152e7027c6fa",
    "category_id": "",
    "detected_category_name": "",
    "detection_time_ms": 1420
}

Redirect to: https://turnmeroyal.com/preview/fad3b5f1-869d-4ac5-abf6-f21f2e2e296e

show https://turnmeroyal.com/api/image/abd46e7f-45f0-4f31-9881-152e7027c6fa

GET https://turnmeroyal.com/api/generation-limit
Response:
{
    "is_authenticated":false,
    "used":8,
    "limit":15,
    "remaining":7
}

POST https://turnmeroyal.com/api/generate/retry
Request:
{
      "generation_group_id":"fad3b5f1-869d-4ac5-abf6-f21f2e2e296e",
      "source":"retry"
}
Response:
{
      "generation_id":"09cc4364-3749-450b-8c2d-0869ef129a33"
}

GET https://turnmeroyal.com/api/generation/09cc4364-3749-450b-8c2d-0869ef129a33/status
{
    "status": "processing",
    "watermarked_url": null,
    "error_message": null,
    "category_name": null,
    "detected_category_name": null,
    "detection_time_ms": 1461,
    "meta_event_id": null,
    "v2_subject_id": "235ce158-f2d2-41ae-8454-bc8427786a64",
    "v2_style_id": "7bf282b9-d67f-4168-8cb7-fd2fda2455ad"
}

https://bktibfdhkrzhefvybtlo.supabase.co/storage/v1/object/public/watermarked/admin/e584e0ed-248b-4be9-96c0-716973704d49.jpg
https://bktibfdhkrzhefvybtlo.supabase.co/storage/v1/object/public/reviews/loox-reviews/HlKAJUN6FL.jpg


*/
