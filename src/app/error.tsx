"use client";

// eslint-disable-next-line simple-import-sort/imports
import React from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset?: () => void;
}) {
  // Log the error (structured)
  logger.error("Unhandled error in App", error);
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h1>Ocorreu um erro</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
          <button onClick={reset}>Tentar novamente</button>
        </div>
      </body>
    </html>
  );
}
