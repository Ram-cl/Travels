"""
Responsive / codebase-integrity audit for the Sri Vengamamba Travels site.

This is a local QA helper only. It READS files under public/ and prints a
report. It is not linked from any page and does not modify the site, so it
has zero effect on how the site renders (desktop or mobile).

Runs on the Python standard library only (no pip installs required) and
locates public/ relative to this file, so it works on any machine.

Usage:  python scratch/verify_responsive.py
"""

import re
import sys
from pathlib import Path

# public/ lives one level up from scratch/, resolved relative to THIS file.
PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public"

HTML_FILES = [
    "index.html",
    "about.html",
    "services.html",
    "contact.html",
    "gallery.html",
    "reviews.html",
    "404.html",
]

problems = 0
warnings = 0


def ok(msg):
    print(f"  [OK] {msg}")


def warn(msg):
    global warnings
    warnings += 1
    print(f"  [WARN] {msg}")


def fail(msg):
    global problems
    problems += 1
    print(f"  [FAIL] {msg}")


def meta_viewport_content(html):
    """Return the content="" of the viewport meta tag, or None if absent."""
    for tag in re.findall(r"<meta\b[^>]*>", html, re.I):
        if re.search(r'name\s*=\s*["\']viewport["\']', tag, re.I):
            m = re.search(r'content\s*=\s*["\']([^"\']*)["\']', tag, re.I)
            return m.group(1) if m else ""
    return None


def css_versions(html):
    """Set of ?v=NN cache-busting versions used on css/*.css links."""
    return set(re.findall(r"css/[\w.-]+\.css\?v=(\d+)", html))


def audit():
    print("=" * 52)
    print("    RESPONSIVE AUDIT & CODEBASE INTEGRITY CHECK")
    print("=" * 52)
    print(f"Project public dir: {PUBLIC_DIR}")

    if not PUBLIC_DIR.exists():
        fail(f"public/ directory not found at {PUBLIC_DIR}")
        return

    # ---- CSS-level checks ----------------------------------------------
    print("\n--- CSS files ---")
    css_dir = PUBLIC_DIR / "css"
    combined_css = ""
    for name in ("theme.css", "cinema.css"):
        p = css_dir / name
        if p.exists():
            combined_css += p.read_text(encoding="utf-8")
            ok(f"CSS exists: {name} ({p.stat().st_size} bytes)")
        else:
            fail(f"Missing CSS: {name}")

    if re.search(r"overflow-x\s*:\s*hidden", combined_css):
        ok("overflow-x:hidden overflow guard present")
    else:
        warn("overflow-x:hidden guard missing")

    if "clamp(" in combined_css:
        ok("Fluid typography with clamp() present")
    else:
        warn("No clamp() fluid typography found")

    # ---- Per-page checks -----------------------------------------------
    all_versions = set()
    for html_file in HTML_FILES:
        path = PUBLIC_DIR / html_file
        print(f"\n--- Auditing: {html_file} ---")
        if not path.exists():
            fail(f"Missing HTML file: {html_file}")
            continue
        html = path.read_text(encoding="utf-8")

        # 1. Viewport meta
        vp = meta_viewport_content(html)
        if vp and "width=device-width" in vp:
            ok(f"Viewport configured: {vp}")
        else:
            fail("Missing or invalid viewport meta tag")

        # 2. Fixed inline widths > 300px (a classic overflow source).
        # The (?<![-\w]) lookbehind skips max-width / min-width, which are
        # caps that still allow shrinking and are safe on mobile.
        wide = []
        for style in re.findall(r'style\s*=\s*"([^"]*)"', html, re.I):
            for m in re.finditer(r"(?<![-\w])width\s*:\s*(\d+)px", style):
                if int(m.group(1)) > 300:
                    wide.append(m.group(0))
        if wide:
            warn(f"Fixed inline widths >300px: {wide}")
        else:
            ok("No fixed inline widths >300px")

        # 3. Header / nav / mobile menu toggle present
        has_header = bool(re.search(r'class\s*=\s*"[^"]*\bheader\b', html))
        has_nav = "<nav" in html.lower()
        has_toggle = "menu-toggle" in html
        if has_header and has_nav and has_toggle:
            ok("Header, nav, and menu-toggle present")
        else:
            missing = [
                label
                for label, present in (
                    ("header", has_header),
                    ("nav", has_nav),
                    ("menu-toggle", has_toggle),
                )
                if not present
            ]
            warn(f"Header structure incomplete (missing: {', '.join(missing)})")

        # 4. Images all have a src
        imgs = re.findall(r"<img\b[^>]*>", html, re.I)
        missing_src = [t for t in imgs if not re.search(r'\bsrc\s*=\s*["\']', t, re.I)]
        if missing_src:
            fail(f"{len(missing_src)} image(s) missing src")
        else:
            ok(f"{len(imgs)} images inspected, all have src")

        # 5. CSS cache-version consistency within the page
        vers = css_versions(html)
        all_versions |= vers
        if len(vers) > 1:
            warn(f"Mixed CSS cache versions on this page: {sorted(vers)}")

    # ---- Cross-page cache-version consistency --------------------------
    print("\n--- Cache-busting version ---")
    if len(all_versions) <= 1:
        shared = next(iter(all_versions)) if all_versions else "n/a"
        ok(f"All pages share one CSS version: v={shared}")
    else:
        warn(f"CSS versions differ across pages: {sorted(all_versions)}")

    # ---- Summary --------------------------------------------------------
    print("\n" + "=" * 52)
    if problems == 0 and warnings == 0:
        print("          ALL RESPONSIVE AUDIT CHECKS PASSED")
    else:
        print(f"   COMPLETED WITH {problems} FAIL(S), {warnings} WARNING(S)")
    print("=" * 52)


if __name__ == "__main__":
    audit()
    sys.exit(1 if problems else 0)
