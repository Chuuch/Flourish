
interface ErrorFallbackProps {
  onRetry: () => void;
}

export function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <main role="alert">
      <h1>Something went wrong</h1>

      <p>An unexpected error occurred. Please try again.</p>
      <button type="button" onClick={onRetry}>Try again</button>
    </main>
  );
}
