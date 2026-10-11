import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getInfoPage, infoPages } from "@/data/pages";

export const Route = createFileRoute("/info/$page")({
  head: ({ params }) => ({
    meta: [{ title: `${getInfoPage(params.page)?.title ?? "Info"} · VELORA` }],
  }),
  component: InfoRoute,
});

function InfoRoute() {
  const { page } = Route.useParams();
  const info = getInfoPage(page);
  const [note, setNote] = useState("");
  const [kept, setKept] = useState(false);

  if (!info) {
    return (
      <div className="wrap py-16">
        <h1 className="font-display text-5xl">That page is not here</h1>
        <Link to="/" className="btn btn-line mt-6">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap py-10">
      <p className="eyebrow">{info.kicker}</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">{info.title}</h1>
      <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted">
        {info.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {info.slug === "contact" && (
        <form
          className="mt-8 grid max-w-xl gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (note.trim().length < 2) return;
            setKept(true);
          }}
        >
          <label className="field">
            Note
            <textarea value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <button type="submit" className="btn btn-line w-fit">
            Keep on this screen
          </button>
          {kept && (
            <p className="text-sm text-gold-2" aria-live="polite">
              Kept on this screen only. It was not sent, and it will disappear when you leave.
            </p>
          )}
        </form>
      )}

      <ul className="mt-12 flex flex-wrap gap-4 text-sm text-faint">
        {infoPages
          .filter((item) => item.slug !== info.slug)
          .map((item) => (
            <li key={item.slug}>
              <Link to="/info/$page" params={{ page: item.slug }} className="hover:text-fg">
                {item.title}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
