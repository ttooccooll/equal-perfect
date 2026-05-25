# Equal Perfect Synthesizer

A web-based polyphonic synthesizer with a unique hybrid tuning system that combines 12TET for the bass with just intonation for upper harmonics. Features a bold brutalist dark UI with real-time visualization.

## Quick Start

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Concept

The lowest active note uses 12-tone equal temperament (12TET), while all notes above it tune to perfect harmonic ratios. When the fundamental changes, other notes smoothly glide to their new frequencies.

## Features

### Synthesis
- 4 waveforms: Sine, Sawtooth, Square, Triangle
- Polyphonic with ADSR envelope
- Low-pass filter with frequency & resonance
- Delay and reverb effects
- LFO for pitch modulation

### Tuning Systems
- **Equal Perfect** (default): 12TET bass + Just intonation above
- **Just Major**, **Pythagorean**, **1/4 Comma Meantone**, **19-TET**
- **Custom** ratios

### Additional
- Save/load presets (JSON)
- Record audio (WebM)
- MIDI support
- Real-time spectrum visualization

## Keyboard Controls

```
 W E   T Y U   O P
A S D F G H J K L ; ' ]
```

White keys: A S D F G H J K L ; ' ]
Black keys: W E T Y U O

## Files

- `index.html` - UI
- `style.css` - Brutalist dark theme styling
- `main.js` - Application logic
- `tuning.js` - Tuning system
- `audioEngine.js` - Web Audio synthesis
- `SPEC.md` - Technical specification

## Browser Support

Chrome, Firefox, Safari, Edge (Web Audio API required)