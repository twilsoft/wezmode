local wezterm = require("wezterm")

-- local state
local state = {
  keys = {},
  modeTexts = {},
  keyTables = {}
}

-- exported state
local wezmode = {}

wezmode.getModeText = function(modeName)
  return state.modeTexts[modeName] or ""
end

wezmode.defaultOpts = {
  modifier = "CTRL",
  manualMode = false,
  hintSeparator = "/",
  normalModeColor = "red",
  hintColor = "green",
  modeTextColor = "black",
  textColor = "white",
}

wezmode.getKeys = function() return state.keys end

wezmode.getKeyTables = function() return state.keyTables end

wezmode.handleRightStatusUpdate = function()
  wezterm.on('update-right-status', function(window)
    window:set_right_status(wezmode.getModeText(window:active_key_table() or "normal"))
  end)
end

wezmode.mergeTables = function(t1, t2)
  for k, v in pairs(t2) do
    if (type(v) == "table") and (type(t1[k] or false) == "table") then
      wezmode.mergeTables(t1[k], t2[k])
    else
      t1[k] = v
    end
  end
  return t1
end

wezmode.extendTable = function(t1, t2)
  for _, v in pairs(t2) do
    table.insert(t1, v)
  end
  return t1
end

local createPrefixText = function(modifier, color)
  return wezterm.format({
    { Attribute = { Intensity = "Bold" } },
    { Foreground = { Color = color } },
    { Text = modifier }
  })
end

local createHintText = function(key, desc, hintColor, textColor)
  local element = {
    { Attribute = { Intensity = "Bold" } },
    { Foreground = { Color = textColor } },
    { Text = "<" },
    { Foreground = { Color = hintColor } },
    { Text = key },
    { Foreground = { Color = textColor } },
    { Text = "> " .. desc },
  }
  return wezterm.format(element)
end

local createModeText = function(name, foreground, background)
  local element = {
    { Attribute = { Intensity = "Bold" } },
    { Foreground = { Color = foreground } },
    { Background = { Color = background } },
    { Text = " " .. string.upper(name) .. " " .. "MODE " },
  }
  return " " .. wezterm.format(element)
end


wezmode.setup = function(modes, opts)
  opts = wezmode.mergeTables(wezmode.defaultOpts, opts or {})

  -- normal mode text setup
  local normalModePrefix = createPrefixText(opts.modifier, opts.normalModeColor) .. " + "
  local hints = {}

  for _, v in pairs(modes) do
    -- create the hints for normal mode
    table.insert(hints, createHintText(v.key, v.name, opts.hintColor, opts.textColor))

    -- create the initial keybinds
    table.insert(state.keys, {
      key = v.key,
      mods = opts.modifier,
      action = wezterm.action.ActivateKeyTable({
        name = v.name,
        one_shot = v.one_shot or false,
        until_unknown = v.until_unknown or true,
      })
    })

    -- create the key tables
    state.keyTables[v.name] = v.keyTable;
    local modeHints = {}
    for _, ktv in pairs(v.keyTable) do
      table.insert(modeHints, createHintText(ktv.key, ktv.desc, opts.hintColor, opts.textColor))
    end
    state.modeTexts[v.name] = table.concat(modeHints, " " .. opts.hintSeparator .. " ") ..
        " " .. createModeText(v.name, opts.modeTextColor, v.modeColor)
  end

  -- tie up the text for normal mode
  state.modeTexts["normal"] =
  normalModePrefix ..
      table.concat(hints, " " .. opts.hintSeparator .. " ")
      .. " " .. createModeText("normal", opts.modeTextColor, opts.normalModeColor)
end

return wezmode;
