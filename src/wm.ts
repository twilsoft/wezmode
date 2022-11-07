import type { Modifier, Key, KeyBind } from "wezterm";
import * as wezterm from "wezterm";

import { mergeObjects } from "./helpers";

type describedKeyBind = KeyBind & {
  desc: string;
};

type mode = {
  name: string;
  key: Key;
  modeColor: string;
  keyTable: describedKeyBind[];
  one_shot?: boolean;
  until_unknown?: boolean;
  prevent_fallback?: boolean;
};

type wezmodeOpts = {
  modifier: Modifier;
  hintSeparator: string;
  theme: {
    normalModeColor: string;
    hintColor: string;
    modeTextColor: string;
    textColor: string;
  };
};

type wezmodeState = {
  keys: KeyBind[];
  modeTexts: Record<string, string>;
  keyTables: Record<string, describedKeyBind[]>;
};

const state: wezmodeState = {
  keys: [],
  modeTexts: {},
  keyTables: {},
};

const defaultOpts: wezmodeOpts = {
  modifier: "CTRL",
  hintSeparator: "/",
  theme: {
    normalModeColor: "red",
    hintColor: "green",
    modeTextColor: "black",
    textColor: "white",
  },
};

const createPrefixText = (prefix: string, textColor: string) => {
  return wezterm.format([
    { Attribute: { Intensity: "Bold" } },
    { Foreground: { Color: textColor } },
    { Text: prefix },
  ]);
};

const createHintText = (
  key: Key,
  desc: string,
  hintColor: string,
  textColor: string
) => {
  return wezterm.format([
    { Attribute: { Intensity: "Bold" } },
    { Foreground: { Color: textColor } },
    { Text: "<" },
    { Foreground: { Color: hintColor } },
    { Text: key },
    { Foreground: { Color: textColor } },
    { Text: `> ${desc}` },
  ]);
};

const createModeText = (name: string, textColor: string, modeColor: string) => {
  return wezterm.format([
    { Attribute: { Intensity: "Bold" } },
    { Foreground: { Color: textColor } },
    { Background: { Color: modeColor } },
    { Text: ` ${name.toUpperCase()} MODE ` },
  ]);
};

const setup = (modes: mode[], opts?: Partial<wezmodeOpts>) => {
  const options = mergeObjects(defaultOpts, opts ?? {});

  const modeHints = modes
    .map((m) =>
      createHintText(
        m.key,
        m.name,
        options.theme.hintColor,
        options.theme.textColor
      )
    )
    .join(` ${options.hintSeparator} `);

  state.modeTexts["normal"] = `${createPrefixText(
    options.modifier,
    options.theme.normalModeColor
  )} + ${modeHints} ${createModeText("normal", options.theme.modeTextColor, options.theme.normalModeColor)}`;

  modes.forEach((m) => {
    state.keys.push({
      key: m.key,
      mods: options.modifier,
      action: wezterm.action.ActivateKeyTable({
        name: m.name,
        one_shot: !!m.one_shot,
        until_unknown: !!m.until_unknown,
        prevent_fallback: !!m.prevent_fallback,
      }),
    });

    state.keyTables[m.name] = m.keyTable;

    const actionHints = m.keyTable
      .map((k) =>
        createHintText(
          k.key,
          k.desc,
          options.theme.hintColor,
          options.theme.textColor
        )
      )
      .join(` ${options.hintSeparator} `);

    state.modeTexts[m.name] = `${actionHints} ${createModeText(
      m.name,
      options.theme.modeTextColor,
      m.modeColor
    )}`;
  });
};

const getModeText = (modeName: string) => state.modeTexts[modeName];
const getKeys = () => state.keys;
const getKeyTables = () => state.keyTables;
const handleRightStatusUpdate = () => {
  wezterm.on("update-right-status", (window) => {
    window.set_right_status(getModeText(window.active_key_table() ?? "normal"));
  });
};
const mergeTables = mergeObjects;
const extendTable = (t1: any[], t2: any[]) => t1.concat(t2);

export {
  setup,
  getModeText,
  getKeys,
  getKeyTables,
  handleRightStatusUpdate,
  mergeTables,
  extendTable,
};
