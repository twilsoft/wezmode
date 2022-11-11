/**  @noResolution **/
declare module "wezterm" {
  import type {
    allKeys,
    mappedKeys,
    physicalKeys,
    modifierCombos,
    formatElement,
    formatAttributeIntensity,
  } from "wezterm/coreTypes";

  import type * as actions from "wezterm/coreTypes/actionFuncs";

  export class Window {
    set_right_status(text: string): void;
    active_key_table(): string;
  }

  export type Modifier = modifierCombos;
  export type Key = allKeys | mappedKeys | physicalKeys;

  export type KeyBind = {
    key: Key;
    mods?: Modifier;
    action: actions.Action;
  };

  export type KeyTable = KeyBind[];

  export type FormatElement = formatElement;

  export const action: {
    ActivateKeyTable: actions.ActivateKeyTable;
  };

  /** @noSelf **/
  export const format: (elements: formatElement[]) => string;

  /** @noSelf **/
  type eventHandler = (window: Window, pane: any) => void;

  /** @noSelf **/
  export const on: (
    event: string,
    handler: eventHandler
  ) => void;

  export type FormatAttributeIntensity = formatAttributeIntensity
}
