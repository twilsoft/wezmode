declare module "wezterm/coreTypes" {
  // ** helpers
  type uniqueUnion<
    baseUnion extends string,
    removalCandidates extends string,
    usedCandidate
  > = Exclude<baseUnion, Exclude<removalCandidates, usedCandidate>>;

  type uniqueSet<m extends metaKeys, s extends superKeys> = uniqueUnion<
    modifierKeys,
    superKeys,
    s
  > &
    uniqueUnion<modifierKeys, metaKeys, m>;

  type modifierPermutations<
    t extends string,
    u extends string = t
  > = t extends any ? t | `${t}|${modifierPermutations<Exclude<u, t>>}` : never;

  export type formatAttributeUnderline =
    | "None"
    | "Single"
    | "Double"
    | "Curly"
    | "Dotted"
    | "Dashed";

  export type formatAttributeIntensity = "Normal" | "Bold" | "Half";

  export type formatAttributeElement = {
    Attribute:
      | { Underline: formatAttributeUnderline }
      | { Intensity: formatAttributeIntensity }
      | { Italic: boolean };
  };

  export type formatColor = { Color: string } | { AnsiColor: string };
  export type formatForegroundElement = { Foreground: formatColor };
  export type formatBackgroundElement = { Background: formatColor };
  export type formatTextElement = { Text: string }

  export type formatElement =
    | formatAttributeElement
    | formatForegroundElement
    | formatBackgroundElement
    | formatTextElement;

  export type keyMapPreference = "Physical" | "Mapped";

  export type modifierKeys =
    | "SUPER"
    | "CMD"
    | "WIN"
    | "CTRL"
    | "SHIFT"
    | "ALT"
    | "OPT"
    | "META"
    | "LEADER"
    | "VoidSymbol";

  export type mappedKeys = `mapped:${allKeys}`;
  export type physicalKeys = `phys:${allKeys}`;
  export type allKeys =
    | "Hyper"
    | "Super"
    | "Meta"
    | "Cancel"
    | "Backspace"
    | "Tab"
    | "Clear"
    | "Enter"
    | "Shift"
    | "Escape"
    | "LeftShift"
    | "RightShift"
    | "Control"
    | "LeftControl"
    | "RightControl"
    | "Alt"
    | "LeftAlt"
    | "RightAlt"
    | "Menu"
    | "LeftMenu"
    | "RightMenu"
    | "Pause"
    | "CapsLock"
    | "VoidSymbol"
    | "PageUp"
    | "PageDown"
    | "End"
    | "Home"
    | "LeftArrow"
    | "RightArrow"
    | "UpArrow"
    | "DownArrow"
    | "Select"
    | "Print"
    | "Execute"
    | "PrintScreen"
    | "Insert"
    | "Delete"
    | "Help"
    | "LeftWindows"
    | "RightWindows"
    | "Applications"
    | "Sleep"
    | "Numpad0"
    | "Numpad1"
    | "Numpad2"
    | "Numpad3"
    | "Numpad4"
    | "Numpad5"
    | "Numpad6"
    | "Numpad7"
    | "Numpad8"
    | "Numpad9"
    | "Multiply"
    | "Add"
    | "Separator"
    | "Subtract"
    | "Decimal"
    | "Divide"
    | "NumLock"
    | "ScrollLock"
    | "BrowserBack"
    | "BrowserForward"
    | "BrowserRefresh"
    | "BrowserStop"
    | "BrowserSearch"
    | "BrowserFavorites"
    | "BrowserHome"
    | "VolumeMute"
    | "VolumeDown"
    | "VolumeUp"
    | "MediaNextTrack"
    | "MediaPrevTrack"
    | "MediaStop"
    | "MediaPlayPause"
    | "ApplicationLeftArrow"
    | "ApplicationRightArrow"
    | "ApplicationUpArrow"
    | "ApplicationDownArrow"
    | "F1"
    | "F2"
    | "F3"
    | "F4"
    | "F5"
    | "F6"
    | "F7"
    | "F8"
    | "F9"
    | "F10"
    | "F11"
    | "F12"
    | "F13"
    | "F14"
    | "F15"
    | "F16"
    | "F17"
    | "F18"
    | "F19"
    | "F20"
    | "F21"
    | "F22"
    | "F23"
    | "F24";

  export type superKeys = "SUPER" | "WIN" | "CMD";
  export type metaKeys = "ALT" | "OPT" | "META";

  export type modifierCombos = // there has to be a nicer way than this??
      | modifierPermutations<uniqueSet<"ALT", "SUPER">>
      | modifierPermutations<uniqueSet<"ALT", "WIN">>
      | modifierPermutations<uniqueSet<"ALT", "CMD">>
      | modifierPermutations<uniqueSet<"OPT", "SUPER">>
      | modifierPermutations<uniqueSet<"OPT", "WIN">>
      | modifierPermutations<uniqueSet<"OPT", "CMD">>
      | modifierPermutations<uniqueSet<"META", "SUPER">>
      | modifierPermutations<uniqueSet<"META", "WIN">>
      | modifierPermutations<uniqueSet<"META", "CMD">>;
}
