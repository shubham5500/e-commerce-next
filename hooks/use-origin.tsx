import { useEffect, useState } from "react";

const useOrigin = () => {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });
  if (!isMounted) {
    return '';
  }
  return origin;
};

export default useOrigin;
