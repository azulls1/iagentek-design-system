#!/usr/bin/env python3
"""Patch App.tsx to add the 4 new showcase sections."""
import re

path = "/home/ubuntu/deploys/design-system/nxtview-playground/src/App.tsx"
content = open(path).read()

# 1. Add new lucide icons to the import
old_icons = "Menu, X, ChevronRight"
new_icons = "Menu, X, ChevronRight,\n  Footprints, MapPin, PanelRight, FileText,\n  ChevronDown, Command, ListOrdered, Layers, Clock, Code,\n  ToggleRight, CheckSquare, SlidersHorizontal, Tags, Calendar,\n  Users, BellDot, MessageCircle as PopoverIcon"
content = content.replace(old_icons, new_icons)

# 2. Add imports for new sections
old_import = 'import { LoadingView } from "./views/LoadingView";'
new_import = '''import { LoadingView } from "./views/LoadingView";
import { EstructuraSection } from "./showcase/EstructuraSection";
import { NavegacionSection } from "./showcase/NavegacionSection";
import { FormulariosAvanzadosSection } from "./showcase/FormulariosAvanzadosSection";
import { FeedbackExtraSection } from "./showcase/FeedbackExtraSection";'''
content = content.replace(old_import, new_import)

# 3. Add new nav sections before ASSETS
old_assets = '''  {
    title: "ASSETS",'''
new_sections = '''  {
    title: "ESTRUCTURA",
    items: [
      { id: "footer", label: "Footer", icon: Footprints },
      { id: "breadcrumbs", label: "Breadcrumbs", icon: MapPin },
      { id: "page-header", label: "Page Header", icon: FileText },
      { id: "drawer", label: "Drawer", icon: PanelRight },
    ],
  },
  {
    title: "NAVEGACION",
    items: [
      { id: "dropdown-menu", label: "Dropdown Menu", icon: ChevronDown },
      { id: "command-palette", label: "Command Palette", icon: Command },
      { id: "stepper", label: "Stepper / Wizard", icon: ListOrdered },
      { id: "accordion", label: "Accordion", icon: Layers },
      { id: "timeline", label: "Timeline", icon: Clock },
      { id: "code-block", label: "Code Block", icon: Code },
    ],
  },
  {
    title: "FORMULARIOS AVANZADOS",
    items: [
      { id: "toggle-switch", label: "Toggle / Switch", icon: ToggleRight },
      { id: "checkbox-radio", label: "Checkbox & Radio", icon: CheckSquare },
      { id: "slider-range", label: "Slider / Range", icon: SlidersHorizontal },
      { id: "tag-input", label: "Tag Input", icon: Tags },
      { id: "date-picker", label: "Date Picker", icon: Calendar },
    ],
  },
  {
    title: "FEEDBACK EXTRA",
    items: [
      { id: "avatar-group", label: "Avatar Group", icon: Users },
      { id: "notification-badge", label: "Notification Badge", icon: BellDot },
      { id: "popover", label: "Popover", icon: PopoverIcon },
    ],
  },
  {
    title: "ASSETS",'''
content = content.replace(old_assets, new_sections)

# 4. Add routing in SectionContent before the "return null"
old_return = "  return null;\n}"
new_routing = '''  // Estructura
  if (["footer", "breadcrumbs", "page-header", "drawer"].includes(activeId)) {
    return <EstructuraSection scrollTo={activeId} />;
  }
  // Navegacion
  if (["dropdown-menu", "command-palette", "stepper", "accordion", "timeline", "code-block"].includes(activeId)) {
    return <NavegacionSection scrollTo={activeId} />;
  }
  // Formularios Avanzados
  if (["toggle-switch", "checkbox-radio", "slider-range", "tag-input", "date-picker"].includes(activeId)) {
    return <FormulariosAvanzadosSection scrollTo={activeId} />;
  }
  // Feedback Extra
  if (["avatar-group", "notification-badge", "popover"].includes(activeId)) {
    return <FeedbackExtraSection scrollTo={activeId} />;
  }
  return null;
}'''
content = content.replace(old_return, new_routing)

open(path, 'w').write(content)
print("OK - App.tsx patched with 4 new sections (18 components)")
