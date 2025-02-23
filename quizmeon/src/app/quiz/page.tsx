"use client";

import { Suspense, lazy } from "react";

const QuizComponent = lazy(() => import("./Quiz"));

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-center text-lg">Loading Quiz...</div>}>
      <QuizComponent />
    </Suspense>
  );
}
