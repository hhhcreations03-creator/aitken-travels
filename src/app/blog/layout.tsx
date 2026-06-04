import { BlogNav } from "./BlogNav";
import { Footer } from "@/components/Footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BlogNav />
      {children}
      <Footer />
    </>
  );
}
