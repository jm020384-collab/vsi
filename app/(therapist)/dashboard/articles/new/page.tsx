import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ArticleComposer } from "./article-composer";

export default async function NewArticlePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <ArticleComposer />;
}
