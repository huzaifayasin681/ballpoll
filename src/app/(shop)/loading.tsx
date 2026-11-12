import { Container, Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <Container className="py-10">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    </Container>
  );
}
