import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100 text-teal-600 font-bold">
              SS
            </span>
            <span className="text-lg font-semibold tracking-tight">
              SmartShield
            </span>
          </div>

          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            <a href="#how-it-works" className="hover:text-slate-900">
              How it works
            </a>
            <a href="#owners" className="hover:text-slate-900">
              For camera owners
            </a>
            <a href="#police" className="hover:text-slate-900">
              For authorities
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden text-sm text-slate-600 hover:text-slate-900 md:inline"
            >
              Log in
            </a>
            <a
              href="/register"
              className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 pt-12 pb-20 lg:flex lg:items-center lg:gap-10">
        {/* Left content */}
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200">
            Privacy-first · Voluntary CCTV network
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Safer streets,{" "}
            <span className="text-teal-600">with cameras you control.</span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            SmartShield securely connects shop and society cameras with local
            police during verified incidents – with owner consent, full audit
            trails, and no mass surveillance.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/register"
              className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-teal-500"
            >
              Join as camera owner
            </a>
            <a
              href="/authority-login"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-600"
            >
              For police & authorities
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              End-to-end encrypted access
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Full access logs for every view
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Built for Indian cities & DPDP
            </div>
          </div>
        </div>

        {/* Right visual */}
        <div className="mt-12 w-full lg:mt-0 lg:flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="absolute -top-4 -left-4 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
              Live city view
            </div>

            <img
              src="/assets/safe-city-illustration.svg"
              alt="Smart city surveillance illustration"
              className="w-full rounded-2xl object-cover"
            />

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3 border">
                <p className="text-[0.65rem] uppercase text-slate-400">
                  Connected cameras
                </p>
                <p className="mt-1 text-lg font-semibold text-teal-600">
                  1,248
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border">
                <p className="text-[0.65rem] uppercase text-slate-400">
                  Avg. response time
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-600">
                  -37%
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border">
                <p className="text-[0.65rem] uppercase text-slate-400">
                  Owner control
                </p>
                <p className="mt-1 text-xs">
                  One-tap approve / revoke for every request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-lg font-semibold text-slate-900">
            How it works
          </h2>

          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Camera owners register their CCTV, choose what they want to share,
            and approve requests from verified police officers. Every view and
            download is logged and visible to owners.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-2xl border bg-white p-4">
              <p className="text-xs font-semibold text-teal-600">
                1 · Register
              </p>
              <p className="mt-1 text-slate-700">
                Add your shop or society cameras, set sharing rules and
                retention.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <p className="text-xs font-semibold text-teal-600">
                2 · Approve
              </p>
              <p className="mt-1 text-slate-700">
                Receive incident-based access requests from police with case
                details.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <p className="text-xs font-semibold text-teal-600">
                3 · Audit
              </p>
              <p className="mt-1 text-slate-700">
                See exactly who viewed or downloaded your footage and when.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
