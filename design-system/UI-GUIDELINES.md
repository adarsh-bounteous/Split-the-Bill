# Split-the-Bill UI guidelines

## Navigation and information architecture
- **Top bar with four sections, in this order: Groups, Expenses, Balances, Settle up.** The order follows the flow: set up people, log spend, see who owes, then pay.
- **No sidebar, no account area.** The app has no sign-in, and four destinations fit a top bar.
- **Below the tablet breakpoint the links collapse behind a menu button.** Phones are the main device when splitting a bill at the table.
- **Group context is a heading on each screen, not a nav level.** One group at a time keeps the nav flat.

## Layout and density
- **Spacious consumer layout in a single centred column (`.container`), content width capped by `content-max-width`.** Users are casual and mostly on phones.
- **Design mobile-first (375px); the only layout change that matters is stacking to multi-column at tablet width.** Use `.grid` (auto-fit) so no per-breakpoint CSS is needed.
- **Space with `.stack` and `.cluster`, using `space-3` between items and `space-4` between sections.** Consistent rhythm replaces ad-hoc margins.
- **Primary action sits at the end of the content or form, full width on phones.** It is the thumb's natural target.

## Component usage
- **People, groups and expenses are `.card`s inside a `.grid`; a group's expenses are a `.list`.** Each item is a small record, not a data row.
- **Use `.table` only for the settle-up plan and the per-person balance summary.** Those are the only places users compare columns of money.
- **One `.btn-primary` per screen; secondary actions use `.btn-secondary` or `.btn-ghost`.** A single clear next step.
- **`.btn-danger` only for removing a person, expense or group, always behind a `.modal` confirmation.** Deletes change everyone's balances.
- **Amounts: `text-success` for money owed to you, `text-danger` for money you owe, neutral for settled.** Colour carries direction, but always pair it with words ("owes", "gets back").
- **Use `.badge-success` for "Settled" and `.badge-warning` for "Pending".** Status reads at a glance in lists.
- **Choosing who shared an expense uses `.chip`s or `.checkbox`es in a `.field`; the payer uses `.select`.** Many-of-many versus one-of-many.
- **Use `.tabs` to switch views inside a group (e.g. Expenses / Balances); use `.drawer` for add-expense on larger screens and a full screen on phones.** Keeps the user in context.
- **Feedback: `.toast` for completed saves, `.alert-danger` for failures, `.empty-state` with a primary action for a group with no expenses.** Each says what happened and what to do next.
- **Field errors show in `.field-error` beneath the control with `.is-invalid`.** The message sits next to the problem.

## Theme
- **Light theme only.** One theme halves the verification work, and bright surfaces suit use in daylight at restaurants.

## Voice and tone
- **Plain, friendly, second person: "You owe Asha ₹400", not "Debt: ₹400".** Money talk is awkward; plain words defuse it.
- **Always name the people and show the ₹ amount with Indian digit grouping (₹1,200).** Specifics prevent disputes.
- **Buttons are verbs: "Add expense", "Settle up", "Add person".** Users know what will happen.
- **Never blame or shame in empty and error states; say how to fix it.** Friends share these screens.
