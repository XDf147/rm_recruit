import { PublicFooter, PublicHeader } from "../components/PublicHeader";
import "./news.css";

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <div className="information-page"><PublicHeader active="information" />{children}<PublicFooter /></div>;
}
