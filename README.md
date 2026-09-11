# licence-gate-target

**A licence-compliance gate, deliberately exposed. Please try to beat it.**

This repository exists to be attacked. Nothing in it is real — the project, the
licences, the files, and the register are all invented. There is no secret to find
and no production system behind it. The only thing under test is whether the gate
can be made to pass something it should have stopped.

If you break it, you have done us a favour, and the finding is the deliverable. Say
what you did and we will write it up.

---

## What the gate is supposed to guarantee

Four claims. Falsify any one of them.

1. **No licence or copyright line is removed or altered without it being noticed.**
2. **Every modified file carrying a licence header also carries a modification notice.**
3. **Every new file gets a licence decision, and a machine never invents a copyright
   holder.**
4. **Every candidate replacement event is dispositioned by a reviewer — not the
   author — against the current head commit.**

The gate runs as SHA-pinned actions from
[`moodyjmz/licence-gate-tooling`](https://github.com/moodyjmz/licence-gate-tooling).
Read the source. It is not obfuscated and knowing how it works is not cheating — a
gate that only survives ignorance does not survive.

## The rules of engagement

- `main` is protected. Required checks: `gate` and `acknowledgement-gate`, strict.
  Force-push and deletion are off. **`enforce_admins` is on**, so this applies to the
  owner too — a direct push to `main` is refused for everybody.
- **Changing the branch protection is not an attack, it is switching the gate off.**
  Same for editing the pin to point at code you control, unless you can do it
  *without* it being visible in the pull request. Out of scope.
- Denial of service counts. If you can permanently block a pull request that should
  pass, that is a finding — one already found that way is in the history below.
- Anything you can do from a pull request, a comment, a fork, or a rename is in scope.

## What to attack

### 1. Get a modified file past the gate without a modification notice

The notice is a fixed string. The check reads the first 40 lines of the file at head
for a licence header, then looks for the notice anywhere in the file. Both of those
sentences contain an assumption.

### 2. Remove a copyright line without check B firing

Check B scans removed lines in the diff for a header-shaped pattern, skipping
tooling and documentation paths. The pattern was deliberately narrowed after an
earlier version flagged its own source. Narrowing a pattern to stop false positives
is exactly when false negatives arrive.

### 3. Get a header applied to a file that is not ours

This is the one that already happened for real, and the one worth your time.

The interesting attack is not smuggling an unlabelled file past the gate. It is
constructing a file that *earns* a first-party header — correct directory, correct
extension, plausible content, nothing visibly wrong — where the only false thing
about it is where it came from. Two icons in a real repository, named as though they
were first-party work, were unmodified third-party icons; provenance only surfaced
because someone checked a `viewBox` attribute by hand.

If the gate catches the crude version and misses the careful one, it is theatre.

### 4. Get a replacement event past the acknowledgement gate

Candidate detection over-reports on purpose: renames, deletions, and added or
modified assets all raise a candidate. A reviewer must name every candidate path in
a comment beginning `example-log:`. Ways in:

- make a replacement that produces no candidate at all
- make a candidate whose path does not appear in the diff the way the gate expects
- get a disposition to count when the person who wrote it should not have been able to
- get a stale disposition — made against an earlier commit — to carry over

### 5. Make the gate lie

The report comment claims what was verified. Anything that makes it claim something
untrue is a finding, even where nothing merges — a reviewer who trusts a false
"✅ verified automatically" has been told not to look.

### 6. Abuse the comment commands

`/auto-fix` and `/std-licence` are triggered by comment and hold `contents: write`.
They authorise against the collaborator permission API rather than
`author_association`, which reports organisation membership rather than access here.
An unauthorised caller is ignored silently — no reply — and logged.

Things worth probing: does the command act on the pull request you think it does;
can the comment body reach a shell; can a fork trigger a push; can the report be made
to describe work that did not happen.

## Already found, so not worth repeating

These were found building it and are fixed. They tell you the shape of what works.

| Defect | Shape |
|---|---|
| Gate ran `scripts/licence-gate.py` from the pull request's own checkout | Edit the file you are judged by; it passes itself |
| Same, in workflows holding `contents: write` | Escalation from "can push a branch" to "can act as the workflow" |
| Acknowledgement gate took the newest register-shaped comment and *then* checked eligibility | Anyone who can comment permanently blocks a pull request that already had a valid disposition |
| Unauthorised commands replied "you need write access" | Confirms to a prober that the command exists and permission was the only obstacle |
| Header writer prepended unconditionally | Header above a shebang stops a script running; above an XML declaration invalidates an SVG — and the diff looks correct |
| Renames not detected (`R<score>` in `--name-status` carries two paths) | The commonest shape of a replacement raised no candidate at all |

Note the pattern in that list. The interesting failures are the ones where **the
output looks right**: a green check, a correct-looking diff, a status that says
verified. Attacks that produce a visible error are not the dangerous ones.

## How to have a go

Fork or branch, open a pull request, watch the `gate` and `acknowledgement-gate`
checks, and read the comment the gate posts. Then try to make that comment say
something false.

Some additional notes on usage.
