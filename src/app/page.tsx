import { redirect } from "next/navigation";
import { DEFAULT_LANGUAGE } from "@/constants/languages";

export default function Home() {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
