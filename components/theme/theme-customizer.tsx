"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Check, Moon, Palette, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const THEMES = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "System", value: "system" },
]

const COLOR_SCHEMES = [
  { name: "Default", value: "default" },
  { name: "Neon", value: "neon" },
  { name: "Cyberpunk", value: "cyberpunk" },
  { name: "Pastel", value: "pastel" },
  { name: "Monochrome", value: "monochrome" },
]

const FONT_SIZES = [
  { name: "Small", value: "small" },
  { name: "Medium", value: "medium" },
  { name: "Large", value: "large" },
]

const ANIMATIONS = [
  { name: "Minimal", value: "minimal" },
  { name: "Standard", value: "standard" },
  { name: "Elaborate", value: "elaborate" },
]

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const [colorScheme, setColorScheme] = useState("default")
  const [fontSize, setFontSize] = useState("medium")
  const [animation, setAnimation] = useState("standard")
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontWeight, setFontWeight] = useState([4])
  const [borderRadius, setBorderRadius] = useState([0.5])
  const [open, setOpen] = useState(false)

  const handleThemeChange = (value: string) => {
    setTheme(value)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {THEMES.map((t) => (
            <DropdownMenuItem
              key={t.value}
              onClick={() => handleThemeChange(t.value)}
              className="flex items-center justify-between"
            >
              {t.name}
              {theme === t.value && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <div className="flex items-center cursor-pointer w-full">
                <Palette className="mr-2 h-4 w-4" />
                <span>Customize</span>
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customize Theme</DialogTitle>
            <DialogDescription>Personalize your experience with custom theme settings.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="colors">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>
            <TabsContent value="colors" className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Color Scheme</h4>
                <RadioGroup value={colorScheme} onValueChange={setColorScheme} className="grid grid-cols-2 gap-2">
                  {COLOR_SCHEMES.map((scheme) => (
                    <div key={scheme.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={scheme.value} id={`color-${scheme.value}`} />
                      <Label htmlFor={`color-${scheme.value}`}>{scheme.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="typography" className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Font Size</h4>
                <RadioGroup value={fontSize} onValueChange={setFontSize} className="grid grid-cols-3 gap-2">
                  {FONT_SIZES.map((size) => (
                    <div key={size.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={size.value} id={`size-${size.value}`} />
                      <Label htmlFor={`size-${size.value}`}>{size.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-weight">Font Weight</Label>
                  <span className="text-sm text-muted-foreground">{fontWeight[0] * 100}</span>
                </div>
                <Slider id="font-weight" min={3} max={9} step={1} value={fontWeight} onValueChange={setFontWeight} />
              </div>
            </TabsContent>
            <TabsContent value="effects" className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Animation Level</h4>
                <RadioGroup value={animation} onValueChange={setAnimation} className="grid grid-cols-3 gap-2">
                  {ANIMATIONS.map((anim) => (
                    <div key={anim.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={anim.value} id={`anim-${anim.value}`} />
                      <Label htmlFor={`anim-${anim.value}`}>{anim.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <span className="text-sm text-muted-foreground">{borderRadius[0].toFixed(1)}rem</span>
                </div>
                <Slider
                  id="border-radius"
                  min={0}
                  max={2}
                  step={0.1}
                  value={borderRadius}
                  onValueChange={setBorderRadius}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setOpen(false)}>Apply Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

