# Human Reviewer Checklist

The human reviewer approves evidence, not confidence.

## 1. Intent

- [ ] I read the issue/request.
- [ ] I understand the user-facing goal.
- [ ] The change matches the requested scope.
- [ ] Non-goals were respected.

## 2. History

- [ ] I read relevant issue comments.
- [ ] I read relevant PR comments.
- [ ] I checked prior decisions if this touches architecture.
- [ ] I checked recent commits for touched files.

## 3. Diff Review

- [ ] I reviewed every changed file.
- [ ] The change is smaller than a rewrite unless a rewrite was justified.
- [ ] No unrelated formatting churn was introduced.
- [ ] No secrets, tokens, credentials, or private data were added.
- [ ] Error handling is appropriate.
- [ ] Names and structure are clear.

## 4. Verification

- [ ] The stated checks were actually run.
- [ ] Test output or command results were recorded.
- [ ] New behavior has tests or a reason tests are not applicable.
- [ ] Negative cases were considered.
- [ ] Documentation was checked if behavior/process changed.

## 5. Trust Boundary

- [ ] AI-generated claims are supported by repo evidence.
- [ ] Machine-actionable outputs are validated where possible.
- [ ] Dangerous actions require human approval or safe tooling.
- [ ] The change does not expand permissions without justification.

## 6. Decision

Review decision:

- [ ] Approve.
- [ ] Request changes.
- [ ] Comment only.
- [ ] Split into follow-up issues.
- [ ] Do not merge.

Reviewer notes:
