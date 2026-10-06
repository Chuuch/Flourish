import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

/** Open a SelectField by label and choose an option by visible name or value. */
export async function chooseSelectOption(
  user: UserEvent,
  label: string | RegExp,
  option: string | RegExp,
) {
  await user.click(await screen.findByLabelText(label));

  const named = screen.queryByRole('option', { name: option });
  if (named) {
    await user.click(named);
    return;
  }

  if (typeof option === 'string') {
    const match = screen
      .getAllByRole('option')
      .find((node) => node.getAttribute('data-value') === option);
    if (match) {
      await user.click(match);
      return;
    }
  }

  throw new Error(`Unable to find select option: ${String(option)}`);
}
