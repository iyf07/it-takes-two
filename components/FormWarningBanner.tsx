"use client";

export default function FormWarningBanner({
  error,
  message,
}: {
  error?: string | null;
  message?: string | null;
}) {
  if (!error && !message) return null;

  if (error) {
    return (
      <div className="alert alert-danger text-center py-2 mb-3">
        {error}
      </div>
    );
  }

  return (
    <div className="alert alert-success text-center py-2 mb-3">
      {message}
    </div>
  );
}
