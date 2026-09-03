import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("uses a self-hosted standalone Docker build", async () => {
  const [config, dockerfile, compose, packageJson] = await Promise.all([
    read("next.config.ts"), read("Dockerfile"), read("docker-compose.yml"), read("package.json"),
  ]);
  assert.match(config, /output:\s*"standalone"/);
  assert.match(dockerfile, /FROM node:22-bookworm-slim AS runner/);
  assert.match(dockerfile, /VOLUME \["\/data"\]/);
  assert.match(compose, /rm-recruit-data:\/data/);
  assert.doesNotMatch(packageJson, /vinext|wrangler|cloudflare/i);
});

test("keeps applicant and admin surfaces separate", async () => {
  const [home, applicant, admin, publicApi, protectedApi] = await Promise.all([
    read("app/page.tsx"), read("app/apply/page.tsx"), read("app/admin/page.tsx"),
    read("app/api/applications/route.ts"), read("app/api/admin/applications/route.ts"),
  ]);
  assert.match(home, /className="entry-page"/);
  assert.match(home, /href="\/apply"/);
  assert.match(applicant, /<ApplicationForm/);
  assert.match(admin, /getCurrentAdmin/);
  assert.match(admin, /redirect\("\/admin\/login"\)/);
  assert.doesNotMatch(publicApi, /export function GET/);
  assert.match(protectedApi, /getRequestAdmin/);
});

test("requires PDF resumes and uses the hardware and algorithm groups", async () => {
  const [form, uploadApi, groups, database] = await Promise.all([
    read("app/apply/ApplicationForm.tsx"), read("app/api/applications/route.ts"),
    read("lib/groups.ts"), read("db/index.ts"),
  ]);
  assert.match(form, /name="resume" type="file" required/);
  assert.match(uploadApi, /signature !== "%PDF-"/);
  assert.match(uploadApi, /PDF 简历为必交项目/);
  assert.match(uploadApi, /投递表单格式无效/);
  assert.match(uploadApi, /new Set/);
  assert.match(groups, /"硬件组"/);
  assert.match(groups, /"算法组"/);
  assert.doesNotMatch(groups, /视觉组/);
  assert.match(database, /UPDATE applications SET primary_group = '算法组' WHERE primary_group = '视觉组'/);
  assert.doesNotMatch(database, /SET primary_group = '硬件组' WHERE primary_group = '算法组'/);
});

test("enforces captain and group-leader access server-side", async () => {
  const [auth, applications, accounts] = await Promise.all([
    read("lib/auth.ts"), read("lib/applications.ts"), read("app/api/admin/accounts/route.ts"),
  ]);
  assert.match(auth, /admin\.role === "captain"/);
  assert.match(auth, /primaryGroup === "不确定"/);
  assert.match(applications, /primary_group = \? OR secondary_group = \?/);
  assert.match(accounts, /admin\.role !== "captain"/);
});

test("provides clickable group profiles with group media", async () => {
  const [overview, profile, groups, applicant] = await Promise.all([
    read("app/groups/page.tsx"), read("app/groups/[slug]/page.tsx"),
    read("lib/groups.ts"), read("app/apply/page.tsx"),
  ]);
  assert.match(overview, /href={`\/groups\/\${group\.slug}`}/);
  assert.match(profile, /generateStaticParams/);
  assert.doesNotMatch(profile, /IMAGE PLACEHOLDER|IMAGE SLOT|图片预留位/);
  assert.match(profile, /unit-theme-\${group\.slug}/);
  assert.match(groups, /slug: "mechanical"/);
  assert.match(groups, /slug: "algorithm"/);
  assert.match(applicant, /initialGroup={initialGroup}/);
});
