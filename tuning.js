/**
 * Tuning System for Equal Justice Synthesizer
 * 
 * The lowest active note always uses 12-tone equal temperament (12TET).
 * All notes above it tune to perfect harmonic ratios from the overtone series.
 */

const HARMONIC_RATIOS = {
    0: 1/1,
    1: 16/15,
    2: 9/8,
    3: 6/5,
    4: 5/4,
    5: 4/3,
    6: 45/32,
    7: 3/2,
    8: 8/5,
    9: 5/3,
    10: 16/9,
    11: 15/8,
    12: 2/1,
};

const TUNING_SYSTEMS = {
    'equal-justice': {
        name: 'Equal Justice',
        description: '12TET bass + Just intonation above',
        ratios: HARMONIC_RATIOS
    },
    'just-major': {
        name: 'Just Major',
        description: 'Pure major scale (9:8, 5:4, 3:2)',
        ratios: { 0: 1, 1: 16/15, 2: 9/8, 3: 5/4, 4: 3/2, 5: 5/3, 6: 15/8, 7: 2 }
    },
    'pythagorean': {
        name: 'Pythagorean',
        description: 'Pure fifths (3/2 ratio chain)',
        ratios: { 0: 1, 1: 256/243, 2: 9/8, 3: 32/27, 4: 81/64, 5: 4/3, 6: 729/512, 7: 3/2, 8: 128/81, 9: 9/8, 10: 16/9, 11: 15/8, 12: 2 }
    },
    'quarter-comma': {
        name: '1/4 Comma Meantone',
        description: 'Meantone temperament',
        ratios: { 0: 1, 1: 1.072, 2: 1.125, 3: 1.25, 4: 1.5, 5: 1.581, 6: 1.688, 7: 2 }
    },
    'equal-19': {
        name: '19-TET',
        description: '19-tone equal temperament',
        ratios: { 0: 1, 1: 1.037, 2: 1.076, 3: 1.117, 4: 1.159, 5: 1.203, 6: 1.249, 7: 1.296, 8: 1.345, 9: 1.396, 10: 1.448, 11: 1.503, 12: 1.560, 13: 1.618, 14: 1.678, 15: 1.741, 16: 1.806, 17: 1.873, 18: 2 }
    }
};

export class TuningSystem {
    constructor() {
        this.activeNotes = new Map();
        this.lowestNote = null;
        this.listeners = [];
        this.currentSystem = 'equal-justice';
        this.customRatios = null;
    }

    get12TETFrequency(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    getHarmonicRatio(fundamentalNote, targetNote) {
        const semitones = targetNote - fundamentalNote;
        const octaves = Math.floor(semitones / 12);
        const intervalInOctave = semitones % 12;
        
        const ratios = this.customRatios || TUNING_SYSTEMS[this.currentSystem]?.ratios || HARMONIC_RATIOS;
        const baseRatio = ratios[intervalInOctave] || 1;
        
        // Only use 12TET for pure equal temperament systems (not equal-justice)
        if (this.currentSystem === 'equal-19') {
            return Math.pow(2, semitones / 19);
        }
        
        return baseRatio * Math.pow(2, octaves);
    }

    setTuningSystem(systemName) {
        if (TUNING_SYSTEMS[systemName] || systemName === 'custom') {
            this.currentSystem = systemName;
            this.customRatios = null;
            this.recalculateAllNotes();
        }
    }

    setCustomRatios(ratios) {
        this.customRatios = ratios;
        this.currentSystem = 'custom';
        this.recalculateAllNotes();
    }

    getTuningSystems() {
        return TUNING_SYSTEMS;
    }

    /**
     * Add a note to the active notes
     */
    addNote(midiNote) {
        const wasLowest = this.lowestNote;
        const is12TET = this.activeNotes.size === 0 || midiNote < this.lowestNote;
        
        if (is12TET) {
            this.lowestNote = midiNote;
        }

        const frequency = this.calculateFrequency(midiNote);
        
        this.activeNotes.set(midiNote, {
            frequency,
            isLowest: is12TET
        });

        // If a new lowest note was set, recalculate all other notes
        if (is12TET && wasLowest !== null && wasLowest !== midiNote) {
            this.recalculateAllNotes();
        }

        this.notifyListeners();
        return frequency;
    }

    /**
     * Remove a note from active notes
     */
    removeNote(midiNote) {
        this.activeNotes.delete(midiNote);

        // If we removed the lowest note, find the new lowest and recalculate
        if (midiNote === this.lowestNote) {
            if (this.activeNotes.size > 0) {
                this.lowestNote = Math.min(...this.activeNotes.keys());
                this.recalculateAllNotes();
            } else {
                this.lowestNote = null;
            }
        }

        this.notifyListeners();
    }

    /**
     * Calculate the correct frequency for a given MIDI note
     * based on current tuning system state
     */
    calculateFrequency(midiNote) {
        // If this is the first/lowest note, use 12TET
        if (this.activeNotes.size === 0 || midiNote <= this.lowestNote) {
            return this.get12TETFrequency(midiNote);
        }

        // Otherwise, calculate as a harmonic ratio above the fundamental
        const fundamentalFreq = this.get12TETFrequency(this.lowestNote);
        const ratio = this.getHarmonicRatio(this.lowestNote, midiNote);
        
        return fundamentalFreq * ratio;
    }

    /**
     * Recalculate all active note frequencies
     * This happens when the fundamental (lowest note) changes
     */
    recalculateAllNotes() {
        const updates = new Map();
        
        for (const [midiNote, noteData] of this.activeNotes) {
            const newFrequency = this.calculateFrequency(midiNote);
            const isLowest = midiNote === this.lowestNote;
            
            updates.set(midiNote, {
                frequency: newFrequency,
                isLowest,
                oldFrequency: noteData.frequency
            });
        }

        // Update all notes
        for (const [midiNote, updateData] of updates) {
            this.activeNotes.set(midiNote, {
                frequency: updateData.frequency,
                isLowest: updateData.isLowest
            });
        }

        this.notifyListeners(updates);
        return updates;
    }

    /**
     * Get current tuning info for display
     */
    getTuningInfo() {
        if (this.lowestNote === null) {
            return {
                fundamental: null,
                fundamentalFreq: null,
                activeCount: 0,
                notes: []
            };
        }

        const notes = [];
        for (const [midiNote, data] of this.activeNotes) {
            const noteName = this.midiToNoteName(midiNote);
            const interval = midiNote - this.lowestNote;
            const ratio = this.getHarmonicRatio(this.lowestNote, midiNote);
            
            notes.push({
                midiNote,
                noteName,
                frequency: data.frequency,
                isLowest: data.isLowest,
                interval,
                ratio
            });
        }

        return {
            fundamental: this.midiToNoteName(this.lowestNote),
            fundamentalFreq: this.get12TETFrequency(this.lowestNote),
            activeCount: this.activeNotes.size,
            notes: notes.sort((a, b) => a.midiNote - b.midiNote)
        };
    }

    /**
     * Convert MIDI note number to note name
     */
    midiToNoteName(midi) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midi / 12) - 1;
        const noteName = noteNames[midi % 12];
        return `${noteName}${octave}`;
    }

    /**
     * Add a listener for tuning changes
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notify all listeners of tuning changes
     */
    notifyListeners(updates = null) {
        for (const callback of this.listeners) {
            callback(this.getTuningInfo(), updates);
        }
    }

    /**
     * Get the frequency for a specific active note
     */
    getNoteFrequency(midiNote) {
        const noteData = this.activeNotes.get(midiNote);
        return noteData ? noteData.frequency : null;
    }

    /**
     * Check if a note is currently active
     */
    isNoteActive(midiNote) {
        return this.activeNotes.has(midiNote);
    }
}
