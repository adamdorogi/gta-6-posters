"use client";

import { useSearchParams, useRouter } from "next/navigation";
import SuccessModal from "@/app/ui/success-modal";
import { useEffect, useState } from "react";

export default function SuccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const success = searchParams.get("success");

  useEffect(() => {
    if (success) {
      setIsOpen(true);
    }
  }, [success]);

  const handleClose = () => {
    setIsOpen(false);
    // Remove the success param from URL without refreshing the page
    router.replace(window.location.pathname, { scroll: false });
  };

  return isOpen ? <SuccessModal onClose={handleClose} /> : null;
}
