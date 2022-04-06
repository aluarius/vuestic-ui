import { GlobalConfig, useGlobalConfig } from '../global-config/global-config'
import {
  getBoxShadowColor,
  getHoverColor,
  getFocusColor,
  getGradientBackground,
  isColor,
  isCSSVariable,
  getTextColor,
  shiftHSLAColor,
  setHSLAColor,
} from './color-functions'

export type CssColor = string
export type ColorConfig = { [colorName: string]: CssColor }

// Most default color - fallback when nothing else is found.
export const DEFAULT_COLOR = '#000000'

// Here expose methods that user wants to use in vue component
export const useColors = () => {
  const { setGlobalConfig, getGlobalConfig } = useGlobalConfig()

  const setColors = (colors: ColorConfig): void => {
    setGlobalConfig((config: GlobalConfig) => ({
      ...config,
      colors: { ...config.colors, ...colors },
    }))
  }

  const getColors = (): ColorConfig => {
    return getGlobalConfig().colors || {}
  }

  /**
   * Returns color from config by name or return prop if color is it's valid hex, hsl, hsla, rgb or rgba color.
   * @param prop - should be color name or color in hex, hsl, hsla, rgb or rgba format
   * @param defaultColor - this color will be used if prop is invalid
   */
  const getColor = (prop?: string, defaultColor: string = DEFAULT_COLOR): CssColor => {
    const colors = getColors()

    if (!prop) {
      prop = defaultColor
    }

    if (colors[prop]) {
      return colors[prop]
    }

    if (isColor(prop) || isCSSVariable(prop)) {
      return prop
    }

    return defaultColor
  }

  const colorsToCSSVariable = (colors: { [colorName: string]: string | undefined }, prefix = 'va') => {
    return Object
      .keys(colors)
      .filter((key) => colors[key] !== undefined)
      .reduce((acc: Record<string, any>, colorName: string) => {
        acc[`--${prefix}-${colorName}`] = getColor(colors[colorName])
        return acc
      }, {})
  }

  return {
    setColors,
    getColors,
    getColor,
    getBoxShadowColor,
    getHoverColor,
    getFocusColor,
    getGradientBackground,
    getTextColor,
    shiftHSLAColor,
    setHSLAColor,
    colorsToCSSVariable,
  }
}

export const setColors = (colors: ColorConfig): void => {
  useColors().setColors(colors)
}

export const getColors = (): ColorConfig => {
  return useColors().getColors()
}

/**
 * Returns color from config by name or return prop if color is it's valid hex, hsl, hsla, rgb or rgba color.
 * @param prop - should be color name or color in hex, hsl, hsla, rgb or rgba format
 * @param defaultColor - this color will be used if prop is invalid
 */
export const getColor = (prop?: string, defaultColor: string = DEFAULT_COLOR): CssColor => {
  return useColors().getColor(prop, defaultColor)
}

export const colorsToCSSVariable = (colors: { [colorName: string]: string | undefined }, prefix = 'va') => {
  return useColors().colorsToCSSVariable(colors)
}
