# Dyecode 🎨

> A realistic hair color simulator that shows you what ACTUALLY happens when you dye your hair—not fantasy, but chemistry.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

---

## 🚀 What is Dyecode?

**Dyecode** is a hair color planning tool built for impulsive girlies who want to avoid hair disasters. It simulates realistic color outcomes based on color theory, pigment science, and lift mechanics—no AI gimmicks, no face detection, just pure chemistry-driven logic.

### The Problem
- You have burgundy hair and want to go golden blonde
- Box dye says "Golden Blonde" but you end up with orange-brown
- You don't know how many bleach sessions you need
- You can't visualize the journey from dark to light

### The Solution
Dyecode shows you:
- ✅ What color you'll ACTUALLY get (not what the box promises)
- ✅ How many bleach sessions you need to reach your goal
- ✅ The realistic journey from your current color to your target
- ✅ How your color will fade over 8 weeks
- ✅ What products to look for (no specific brands, just shade codes)

---

## ✨ Key Features

### 🎯 Realistic Color Simulation
- **Before & After Preview**: See what happens when you apply a specific dye to your current hair
- **Underlying Pigment Detection**: Shows the warm tones (red, orange, yellow) that will show through
- **Level-Based Accuracy**: Respects the darkness/lightness of your hair (Level 1-10 scale)

### 🔬 Chemistry-Based Engine
- Uses LAB color space for realistic color blending
- Accounts for:
  - Current hair level and tone
  - Hair history (virgin, previously dyed darker/lighter)
  - Porosity and damage levels
  - Bleach lift mechanics
  - Underlying pigment exposure

### 🗺️ Color Journey Visualization
Shows the complete path from start to finish:
1. **Your Hair Now** - Current color
2. **Bleach Sessions** - Each lightening step (if needed)
3. **Your Goal** - What you want to achieve
4. **Actual Result** - What you'll realistically get

### ⚠️ Safety & Damage Prevention
- **Porosity Quiz**: Determines how your hair absorbs chemicals
- **Damage Level Tracking**: Warns about breakage risks
- **Safety Warnings**: Critical alerts for high-risk combinations
- **Difficulty Rating**: Easy / Moderate / Hard / Expert
- **Chemical History Tracking**: Flags incompatible processes (relaxers + bleach = disaster)

### 📅 Process Timeline
- **Step-by-Step Instructions**: Detailed application guide
- **Time Estimates**: How long each session takes
- **Cost Breakdown**: Estimated total cost
- **Maintenance Schedule**: When to refresh color, use toner, etc.

### 🛒 Smart Shopping List
Instead of specific products (which may not be available), shows:
- Color level and tone to look for (e.g., "Level 7 Ash")
- Search terms for any beauty supply store
- Quantity needed based on hair length/thickness
- Generic product categories (bleach powder, developer, toner)

### 📊 Color Longevity Simulator
- **8-Week Fade Prediction**: See how your color evolves
- **Wash Frequency Impact**: Daily vs. every-other-day vs. twice-weekly
- **Maintenance Reminders**: When to refresh toner or reapply color

### 🎨 Realistic Hair Strand Preview
- Canvas-based rendering with individual hair strands
- Natural gradient from roots to ends
- Shine and shadow effects for dimension
- Shows actual hair texture, not flat color blocks

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Color Math** | chroma-js (LAB color space) |
| **Canvas** | HTML Canvas API |
| **State** | Zustand |
| **Forms** | React Hook Form |
| **Testing** | Vitest |

---

## 🎯 How It Works

### 1. Input Your Current Hair
- **Level** (1-10): How dark or light your hair is
- **Tone**: Natural, Ash, Gold, Copper, Red, Burgundy, etc.
- **History**: Virgin, previously dyed darker, or previously dyed lighter
- **Porosity**: Low, Normal, or High (via quiz)
- **Damage Level**: 0-10 scale
- **Hair Length & Thickness**: For product quantity calculations

### 2. Choose Your Goal
- **Target Level**: How light you want to go
- **Target Tone**: Ash, Gold, Copper, Red, Fashion colors, etc.
- **Bleach Settings**: Enable bleaching and choose number of lifts (1-3)

### 3. Get Realistic Results
The engine calculates:
- What color you'll actually achieve
- Underlying pigments that will show through
- Warmth level (brassiness)
- Safety warnings and difficulty rating
- Complete journey with intermediate steps

### 4. Plan Your Process
- Shopping list with shade codes to search for
- Step-by-step application instructions
- Timeline with cost and time estimates
- Maintenance schedule for long-term care

---

## 🧪 The Science Behind It

### Color Theory
- **LAB Color Space**: More perceptually accurate than RGB
- **Underlying Pigments**: Every hair level has natural pigments that show through when lightened
- **Tone Blending**: Realistic mixing of base color + exposed pigment + target dye

### Lift Mechanics
- **Virgin Hair**: Can lift 2-3 levels with permanent dye
- **Previously Dyed Hair**: Color doesn't lift color—needs bleach
- **Bleach Progression**: Each session lifts 1-2 levels, exposing warmer pigments

### Damage Science
- **Porosity Impact**: High porosity = faster processing, more fading
- **Chemical History**: Tracks incompatible processes
- **Breakage Risk**: Warns when damage level is too high for bleaching

---

## 🎨 Example Scenarios

### Scenario 1: Dark to Light
**Input**: Level 4 Burgundy → Level 10 Gold (Bleach enabled, 3 lifts)

**Journey**:
1. Your Hair Now: Deep burgundy
2. Bleach Session 1: Dark brown with red undertones
3. Bleach Session 2: Medium brown with orange undertones
4. Bleach Session 3: Light brown with yellow undertones
5. Your Goal: Platinum gold
6. Actual Result: Warm golden blonde (needs toner to remove warmth)

**Warnings**: High warmth detected, 3+ bleach sessions = high damage risk

---

### Scenario 2: Tone Correction
**Input**: Level 7 Orange (brassy) → Level 7 Ash (No bleach)

**Journey**:
1. Your Hair Now: Brassy orange-blonde
2. Your Goal: Cool ash blonde
3. Actual Result: Neutral-warm blonde (ash tone neutralizes some orange)

**Warnings**: Underlying orange pigment will still show through. Consider purple toner.

---

## 🚧 Roadmap

- [x] Core pigment simulation engine
- [x] Realistic color blending (LAB color space)
- [x] Bleach lift progression
- [x] Safety warning system
- [x] Process timeline & instructions
- [x] Shopping list with shade codes
- [x] Color longevity simulator
- [x] Realistic hair strand preview
- [ ] Export results as image
- [ ] Shareable URL with encoded state
- [ ] Skin tone compatibility checker (in progress)
- [ ] Multi-language support
- [ ] Mobile app version

---

## 🤝 Contributing

Contributions are welcome! This project is built to help people make informed hair color decisions.

### Areas for Improvement
- More realistic color formulas
- Additional hair types and textures
- Better damage prediction models
- Expanded product database
- Accessibility improvements

---

## 📝 License

MIT License - feel free to use this for your own projects!

---

## 💡 Why I Built This

As someone who's had their fair share of hair color disasters, I wanted a tool that shows realistic expectations—not the fantasy on the box. Dyecode is built on actual color theory and chemistry, not marketing promises.

**The goal**: Help people avoid expensive salon corrections and damaged hair by showing them what will ACTUALLY happen before they commit.

---

## 🙏 Acknowledgments

- Color theory based on professional cosmetology education
- Pigment science from hair chemistry research
- UI/UX inspired by modern design tools
- Built with love for everyone who's ever said "it'll be fine" before a DIY dye job

---

**Made with 💜 by someone who learned the hard way**

*Dyecode: Know before you dye.*