/**
 * Tests for the Kaggle competitions hub.
 *
 * The page exists under one rule: while a competition is running its repository
 * stays private, so nothing here may leak the method. These pin the two ways
 * that quietly breaks. First, an entry links out to the competition and never
 * to a repository. Second, the results table stays empty and says so until a
 * notebook has actually been scored, rather than showing a placeholder number
 * that reads like a real leaderboard position.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Kaggle from "./Kaggle";
import { kaggleCellTrackingLink } from "../middleware/links";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/kaggle"]}>
      <Kaggle />
    </MemoryRouter>
  );
}

test("links out to the competition and to no repository while it is running", () => {
  const { container } = renderPage();

  const competition = screen.getByRole("link", { name: /competition/i });
  expect(competition).toHaveAttribute("href", kaggleCellTrackingLink);
  expect(competition).toHaveAttribute("target", "_blank");

  const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
  expect(hrefs.some((href) => href.includes("github.com"))).toBe(false);
});

test("shows an empty results table until a notebook has been scored", () => {
  renderPage();

  expect(screen.getByText(/no submission yet/i)).toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

test("marks a single milestone as the stage under way", () => {
  renderPage();

  expect(screen.getAllByText(/^in progress$/i)).toHaveLength(1);
});
