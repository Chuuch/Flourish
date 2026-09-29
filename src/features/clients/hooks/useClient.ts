import { useClients } from './useClients';

export function useClient(clientId: string) {
  const { data, isPending, isError, error, refetch } = useClients();
  const client = data?.find((item) => item.id === clientId);

  return { client, isPending, isError, error, refetch };
}
