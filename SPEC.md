# Equal Perfect Synthesizer - Technical Specification

## Project Overview

A web-based polyphonic synthesizer with a unique hybrid tuning system that combines equal temperament (12TET) for the bass with just intonation for upper harmonics. The synthesizer features a bold brutalist UI and supports multiple tuning systems, effects, and presets.

## Core Features

### 1. Hybrid Tuning System (Equal Perfect)
- **Lowest active note**: Uses 12-tone equal temperament (12TET)
- **All notes above lowest**: Tune to perfect harmonic ratios from the overtone series
- **Dynamic retuning**: When the fundamental changes, all other notes glide to new frequencies

### 2. Alternative Tuning Systems
- **Equal Perfect** (default): 12TET bass + Just intonation above
- **Just Major**: Pure major scale (9:8, 5:4, 3:2)
- **Pythagorean**: Pure fifths (3/2 ratio chain)
- **1/4 Comma Meantone**: Meantone temperament
- **19-TET**: 19-tone equal temperament
- **Custom**: User-definable harmonic ratios

### 3. Synthesis Engine
- **Waveforms**: Sine, Sawtooth, Square, Triangle
- **Polyphony**: Multiple simultaneous notes
- **ADSR Envelope**: Attack and Release controls
- **Glide Time**: Configurable portamento between notes
- **Master Volume**: 0-100%

### 4. Filter Section
- **Type**: Low-pass
- **Frequency**: 100Hz - 10kHz
- **Resonance (Q)**: 0.1 - 20

### 5. Effects
- **Delay**: Variable mix (0-100%), feedback, time
- **Reverb**: Convolution-based, variable mix (0-100%)

### 6. LFO (Low Frequency Oscillator)
- **Rate**: 0.1Hz - 20Hz
- **Depth**: 0-100%
- **Target**: Pitch modulation

### 7. Additional Features
- **Preset System**: Save/load settings as JSON
- **Recording**: Capture audio as WebM
- **MIDI Support**: Play with external MIDI keyboard
- **Visualization**: Real-time spectrum analyzer

## Technical Architecture

### Files
```
index.html      - UI structure
style.css       - Styling (brutalist dark theme)
main.js         - Application entry point and UI logic
tuning.js       - Tuning system implementation
audioEngine.js  - Web Audio API synthesis engine
```

### Classes

**TuningSystem** (tuning.js)
- Manages active notes and calculates frequencies
- Supports multiple tuning systems
- Emits tuning change events for smooth gliding

**AudioEngine** (audioEngine.js)
- Creates and manages Web Audio oscillators
- Implements filter, delay, reverb effects
- Handles envelope (attack/release)
- Provides analyser data for visualization
- Supports audio recording

**EqualPerfectSynth** (main.js)
- Coordinates UI and audio
- Manages keyboard and MIDI input
- Updates display in real-time

## UI/UX Design

### Visual Style
- **Theme**: Dark brutalist with high contrast
- **Colors**:
  - Background: #0a0a0a (dark)
  - Panel: #141414
  - Primary accent: #ff3366 (pink)
  - Secondary accent: #00ffaa (green)
  - Tertiary accent: #ffff00 (yellow)
- **Effects**: Scanline overlay, glow effects, animations

### Layout
- **Desktop** (1100px+): Two-column grid (controls | status)
- **Mobile**: Single column, stacked
- **Sections**: Sound, Envelope, Filter, Effects (with section headers)
- **Controls**: Organized in bordered panels with labels

### Keyboard
- 3-octave visual keyboard (C3-E5)
- Mouse/touch input support
- Computer keyboard mapping (A-L for white keys, WUO for black keys)

## Usage

### Running Locally
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Keyboard Controls
```
 W E   T Y U   O P
A S D F G H J K L ; ' ]
```
White keys: A S D F G H J K L ; ' ]
Black keys: W E T Y U O

### Parameters
| Parameter | Range | Default |
|-----------|-------|---------|
| Waveform | sine/sawtooth/square/triangle | sawtooth |
| Tuning | Equal Perfect, Just Major, etc. | Equal Perfect |
| Volume | 0-100% | 30% |
| Glide Time | 0-1000ms | 100ms |
| Attack | 0-500ms | 10ms |
| Release | 0-2000ms | 200ms |
| Filter Freq | 100-10000Hz | 2000Hz |
| Filter Q | 0.1-20 | 1 |
| Delay Mix | 0-100% | 0% |
| Reverb Mix | 0-100% | 0% |
| LFO Rate | 0.1-20Hz | 5Hz |
| LFO Depth | 0-100% | 0% |

## Browser Compatibility

Works in modern browsers supporting:
- Web Audio API
- ES6 modules
- CSS Grid

Tested in Chrome, Firefox, Safari, and Edge.