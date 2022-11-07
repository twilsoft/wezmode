declare module "wezterm/coreTypes/actionFuncs" {
  export type Action = () => void;
  export type ActivateKeyTable = (opts: {
	  name: string,
	  one_shot: boolean,
	  until_unknown: boolean,
	  prevent_fallback: boolean
  }) => Action; 
}
