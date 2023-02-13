import type { Modifier, Key, KeyBind, FormatAttributeIntensity } from "wezterm";
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
    intensity: FormatAttributeIntensity;
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
    intensity: "Bold",
    normalModeColor: "red",
    hintColor: "green",
    modeTextColor: "black",
    textColor: "white",
  },
};

const createPrefixText = (
  prefix: string,
  textColor: string,
  intensity: FormatAttributeIntensity
) => {
  return wezterm.format([
    { Attribute: { Intensity: intensity } },
    { Foreground: { Color: textColor } },
    { Text: prefix },
  ]);
};

const createHintText = (
  key: Key,
  desc: string,
  hintColor: string,
  textColor: string,
  intensity: FormatAttributeIntensity
) => {
  return wezterm.format([
    { Attribute: { Intensity: intensity } },
    { Foreground: { Color: textColor } },
    { Text: "<" },
    { Foreground: { Color: hintColor } },
    { Text: key },
    { Foreground: { Color: textColor } },
    { Text: `> ${desc}` },
  ]);
};

const createModeText = (
  name: string,
  textColor: string,
  modeColor: string,
  intensity: FormatAttributeIntensity
) => {
  return wezterm.format([
    { Attribute: { Intensity: intensity } },
    { Foreground: { Color: modeColor } },
    { Text: " \uE0B2" },
    { Attribute: { Intensity: intensity } },
    { Foreground: { Color: textColor } },
    { Background: { Color: modeColor } },
    { Text: `  ${name.toUpperCase()} ` },
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
        options.theme.textColor,
        options.theme.intensity
      )
    )
    .join(` ${options.hintSeparator} `);

  state.modeTexts["normal"] = `${createPrefixText(
    options.modifier,
    options.theme.normalModeColor,
    options.theme.intensity
  )} + ${modeHints} ${createModeText(
    "normal",
    options.theme.modeTextColor,
    options.theme.normalModeColor,
    options.theme.intensity
  )}`;

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
          options.theme.textColor,
          options.theme.intensity
        )
      )
      .join(` ${options.hintSeparator} `);

    state.modeTexts[m.name] = `${actionHints} ${createModeText(
      m.name,
      options.theme.modeTextColor,
      m.modeColor,
      options.theme.intensity
    )}`;
  });
};

const getModeText = (modeName: string) => state.modeTexts[modeName];
const getKeys = () => state.keys;
const getKeyTables = () => state.keyTables;
const handleRightStatusUpdate = () => {
  wezterm.on("update-right-status", (window) => {
  	const ourPaneText = getModeText(window.active_key_table() ?? "normal");
  	if (ourPaneText)
    	window.set_right_status(ourPaneText);
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
