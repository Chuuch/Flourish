import { isRouteErrorResponse, useRouteError } from 'react-router';

import { logger } from '@/lib/logger/logger';

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    logger.error('Unhandled route error', error);

    return (
      <main role="alert">
        <h1>Something went wrong</h1>

        <p>An unexpected error occurred. Please try again.</p>

        <button
          type="button"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload page
        </button>
      </main>
    );
  }

  if (isRouteErrorResponse(error)) {
    return (
      <main role="alert">
        <h1>
          {error.status} {error.statusText}
        </h1>

        <p>The requested page could not be loaded.</p>

        <button
          type="button"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload page
        </button>
      </main>
    );
  }

  return (
    <main role="alert">
      <h1>Something went wrong</h1>

      <p>An unexpected error occurred. Please try again.</p>

      <button
        type="button"
        onClick={() => {
          window.location.reload();
        }}
      >
        Reload page
      </button>
    </main>
  );
}
