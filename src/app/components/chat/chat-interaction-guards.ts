import {
  ChatInteraction,
  ConfirmInteraction,
  FileRequestInteraction,
  FormInteraction,
  TermPickerInteraction,
} from '../../types';

export function asFormInteraction(interaction: ChatInteraction): FormInteraction {
  return interaction as FormInteraction;
}

export function asTermPickerInteraction(interaction: ChatInteraction): TermPickerInteraction {
  return interaction as TermPickerInteraction;
}

export function asConfirmInteraction(interaction: ChatInteraction): ConfirmInteraction {
  return interaction as ConfirmInteraction;
}

export function asFileRequestInteraction(interaction: ChatInteraction): FileRequestInteraction {
  return interaction as FileRequestInteraction;
}
